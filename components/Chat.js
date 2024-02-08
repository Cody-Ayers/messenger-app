import { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
} from "react-native";
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
import { Audio } from "expo-av";

import CustomActions from "./CustomActions";

const Chat = ({ route, navigation, db, isConnected, storage }) => {
  const [messages, setMessages] = useState([]);
  const { name, background, userID } = route.params;
  let soundObject = null;

  // setting messages to be displayed
  let unsubChat;
  useEffect(() => {
    navigation.setOptions({ title: name });

    if (isConnected === true) {
      // unregister current onSnapshot() listener to avoid registering multiple listeners when
      // useEffect code is re-executed.
      if (unsubChat) unsubChat();
      unsubChat = null;

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
        cachedMessages(newMessages);
        setMessages(newMessages);
      });
    } else loadCachedMessages();

    // Clean up cody
    return () => {
      if (unsubChat) unsubChat();
      if (soundObject) soundObject.unloadAsync();
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
    const cachedMessages = (await AsyncStorage.getItem("messages")) || [];
    setMessages(JSON.parse(cachedMessages));
  };

  // On send
  const onSend = (newMessages) => {
    addDoc(collection(db, "messages"), newMessages[0]);
  };

  // Render action button
  const renderCustomActions = (props) => {
    return <CustomActions userID={userID} storage={storage} {...props} />;
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
          onPress={async () => {
            const { sound } = await Audio.Sound.createAsync({
              uri: props.currentMessage.audio,
            });
            await sound.playAsync();
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
    <View style={[styles.container, { backgroundColor: background }]}>
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
      />
      {/*  */}
      {Platform.OS === "android" ? (
        <KeyboardAvoidingView behavior="height" />
      ) : null}
      {Platform.OS === "ios" ? (
        <KeyboardAvoidingView behavior="padding" />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Chat;
