import { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { SafeAreaView } from "react-native-safe-area-context";
import { Bubble, GiftedChat, InputToolbar } from "react-native-gifted-chat";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MapView from "react-native-maps";
import { createAudioPlayer } from "expo-audio";

import CustomActions from "./CustomActions";

// Photos and audio from before the move to Cloudinary were stored in Firebase
// Storage, which no longer serves them; drop those files so the chat doesn't
// show blank bubbles, and hide messages that have nothing else left to show
const isLegacyFirebaseFile = (url) =>
  typeof url === "string" && url.includes("firebasestorage.googleapis.com");

const withoutLegacyFiles = (messages) =>
  messages
    .map((message) => {
      const cleaned = { ...message };
      if (isLegacyFirebaseFile(cleaned.image)) delete cleaned.image;
      if (isLegacyFirebaseFile(cleaned.audio)) delete cleaned.audio;
      return cleaned;
    })
    .filter(
      (message) =>
        message.text || message.image || message.audio || message.location
    );

const Chat = ({ route, navigation, db, isConnected }) => {
  const [messages, setMessages] = useState([]);
  const { name, background, userID } = route.params;
  const soundObject = useRef(null);
  // Tells the chat's keyboard handling how tall the navigation header is
  const headerHeight = useHeaderHeight();

  // setting messages to be displayed
  useEffect(() => {
    navigation.setOptions({ title: name });

    let unsubChat = null;
    if (isConnected === true) {
      const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
      unsubChat = onSnapshot(q, (documentSnapshot) => {
        let newMessages = [];
        documentSnapshot.forEach((doc) => {
          newMessages.push({
            id: doc.id,
            ...doc.data(),
            createdAt: new Date(doc.data().createdAt.toMillis()),
          });
        });
        const visibleMessages = withoutLegacyFiles(newMessages);
        cachedMessages(visibleMessages);
        setMessages(visibleMessages);
      });
    } else loadCachedMessages();

    // Clean up the listener and any sound that is still loaded
    return () => {
      if (unsubChat) unsubChat();
      if (soundObject.current) soundObject.current.remove();
    };
  }, [isConnected]);

  // Cached Messages
  const cachedMessages = async (messagesToCache) => {
    try {
      await AsyncStorage.setItem("messages", JSON.stringify(messagesToCache));
    } catch (error) {
      console.log(error.message);
    }
  };

  // Load cached messages
  const loadCachedMessages = async () => {
    try {
      const cachedMessages = (await AsyncStorage.getItem("messages")) || "[]";
      setMessages(withoutLegacyFiles(JSON.parse(cachedMessages)));
    } catch (error) {
      console.log(error.message);
      setMessages([]);
    }
  };

  // On send
  const onSend = (newMessages) => {
    addDoc(collection(db, "messages"), newMessages[0]);
  };

  // Send an image, location or audio message from the action button
  const sendCustomMessage = (content) => {
    onSend([
      {
        _id: `${userID}-${Date.now()}`,
        text: "",
        createdAt: new Date(),
        user: { _id: userID, name: name },
        ...content,
      },
    ]);
  };

  // Render action button
  const renderCustomActions = (props) => {
    return (
      <CustomActions
        {...props}
        onSend={sendCustomMessage}
      />
    );
  };

  // Render MapView
  const renderCustomView = (props) => {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  };

  // Render Audio Bubble
  const renderAudioBubble = (props) => {
    return (
      <View {...props}>
        <TouchableOpacity
          style={{ backgroundColor: "#FF0", borderRadius: 10, margin: 5 }}
          onPress={() => {
            // release the previous sound before playing a new one
            if (soundObject.current) soundObject.current.remove();
            const player = createAudioPlayer({ uri: props.currentMessage.audio });
            soundObject.current = player;
            player.play();
          }}
        >
          <Text style={{ textAlign: "center", color: "black", padding: 5 }}>
            Play Sound
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Changing the color of the chat bubbles
  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#000",
          },
          left: {
            backgroundColor: "#FFF",
          },
        }}
      />
    );
  };

  // Input Toolbar
  const renderInputToolbar = (props) => {
    if (isConnected) return <InputToolbar {...props} />;
    else return null;
  };

  return (
    // Bottom safe area keeps the message input above the iPhone home indicator
    <SafeAreaView
      edges={["bottom"]}
      style={[styles.container, { backgroundColor: background }]}
    >
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        onSend={(messages) => onSend(messages)}
        renderActions={renderCustomActions}
        renderCustomView={renderCustomView}
        renderMessageAudio={renderAudioBubble}
        user={{
          _id: userID,
          name: name,
        }}
        keyboardAvoidingViewProps={{ keyboardVerticalOffset: headerHeight }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Chat;
