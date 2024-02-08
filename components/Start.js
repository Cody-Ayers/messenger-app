// import components needed to build app
import { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ImageBackground,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { getAuth, signInAnonymously } from "firebase/auth";

const Start = ({ navigation }) => {
  const auth = getAuth();

  const [name, setName] = useState("");
  const [background, setBackground] = useState("");
  const colors = ["#090C08", "#474056", "#8A95A5", "#B9C6AE"];

  // User sign-in
  const signInUser = () => {
    signInAnonymously(auth)
      .then((result) => {
        navigation.navigate("Chat", {
          name: name,
          background: background,
          userID: result.user.uid,
        });
        Alert.alert("Signed in Successfully");
      })
      .catch((error) => {
        Alert.alert("Unable to sign in, try again later.");
      });
  };

  return (
    // render background image
    <ImageBackground
      source={require("../imgs/Background Image.png")}
      style={styles.bgImage}
      resizeMode="cover"
    >
      <Text style={styles.title}>QuickChat</Text>
      {/* Input and color choosing box */}
      <View style={styles.container}>
        {/* Input username */}
        <TextInput
          accessible={true}
          accessibilityLabel="Input Username"
          accessibilityHint="Choose your username"
          accessibilityRole="text"
          style={styles.textInput}
          value={name}
          onChangeText={setName}
          placeholder="Enter Your Name"
        />
        <Text style={styles.chooseBgColor}>Choose Background Color</Text>
        {/* Choose Background Color buttons */}
        <View style={styles.colorSelect}>
          {colors.map((color, index) => (
            <TouchableOpacity
              accessible={true}
              accessibilityLabel="Color Buttons"
              accessibilityHint="Choose chat background color"
              accessibilityRole="button"
              style={[
                styles.colorButtons,
                { backgroundColor: color },
                background === color && styles.selected,
              ]}
              key={index}
              onPress={() => setBackground(color)}
            />
          ))}
        </View>
        {/* Start Chatting Button */}
        <TouchableOpacity
          accessible={true}
          accessibilityLabel="Start Chatting"
          accessibilityHint="Sends you to the chat page"
          accessibilityRole="button"
          style={styles.button}
          onPress={signInUser}
        >
          <Text style={styles.chatButton}>Start Chatting</Text>
        </TouchableOpacity>
        {Platform.OS === "android" ? (
          <KeyboardAvoidingView behavior="height" />
        ) : null}
        {Platform.OS === "ios" ? (
          <KeyboardAvoidingView behavior="padding" />
        ) : null}
      </View>
    </ImageBackground>
  );
};

// styles for the components
const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    backgroundColor: "#ffffff",
    width: "88%",
    height: "44%",
    alignItems: "center",
    marginBottom: 30,
    justifyContent: "space-evenly",
  },
  title: {
    fontSize: 45,
    fontWeight: "600",
    color: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    margin: 40,
  },
  textInput: {
    fontSize: 16,
    fontWeight: "300",
    color: "#757083",
    width: "88%",
    opacity: 50,
    padding: 15,
    borderWidth: 1,
    marginTop: "8%",
    marginBottom: 15,
    top: 5,
    borderColor: "#757083",
  },
  chooseBgColor: {
    flex: 1,
    fontSize: 16,
    fontWeight: "300",
    color: "#757083",
    marginTop: 20,
  },
  colorSelect: {
    flexDirection: "row",
    width: "80%",
    justifyContent: "space-between",
    top: 5,
    bottom: 5,
  },
  colorButtons: {
    width: 50,
    height: 50,
    borderRadius: 25,
    margin: 10,
  },
  selectedColor: {
    borderColor: "blue",
    borderWidth: "2",
  },
  button: {
    backgroundColor: "#757083",
    padding: 15,
    margin: 20,
    alignItems: "center",
    width: "88%",
  },
});

export default Start;
