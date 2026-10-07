import { TouchableOpacity, Text, View, StyleSheet, Alert } from "react-native";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  useAudioRecorder,
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
} from "expo-audio";

import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";

const CustomActions = ({
  wrapperStyle,
  iconTextStyle,
  onSend,
  storage,
  userID,
}) => {
  const actionSheet = useActionSheet();
  // The recorder is released automatically when the component unmounts
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

  const onActionPress = () => {
    const options = [
      "Choose From Library",
      "Take Picture",
      "Send Location",
      "Record Audio",
      "Cancel",
    ];
    const cancelButtonIndex = options.length - 1;
    actionSheet.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            pickImage();
            return;
          case 1:
            takePhoto();
            return;
          case 2:
            getLocation();
            return;
          case 3:
            startRecording();
            return;
          default:
        }
      }
    );
  };

  // Upload a local file to Firebase Storage and return its download URL
  const uploadFile = async (fileURI) => {
    const newUploadRef = ref(storage, generateReference(fileURI));
    const response = await fetch(fileURI);
    const blob = await response.blob();
    const snapshot = await uploadBytes(newUploadRef, blob);
    return getDownloadURL(snapshot.ref);
  };

  // Upload and Send Image
  const uploadAndSendImage = async (imageURI) => {
    try {
      const imageURL = await uploadFile(imageURI);
      onSend({ image: imageURL });
    } catch (error) {
      Alert.alert("Couldn't send the image. Please try again.");
    }
  };

  // Pick an image from library
  const pickImage = async () => {
    let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissions?.granted) {
      let result = await ImagePicker.launchImageLibraryAsync();
      if (!result.canceled) await uploadAndSendImage(result.assets[0].uri);
    } else Alert.alert("Permissions haven't been granted.");
  };

  // Taking a Photo
  const takePhoto = async () => {
    let permissions = await ImagePicker.requestCameraPermissionsAsync();
    if (permissions?.granted) {
      let result = await ImagePicker.launchCameraAsync();
      if (!result.canceled) await uploadAndSendImage(result.assets[0].uri);
    } else Alert.alert("Permissions haven't been granted.");
  };

  // send location
  const getLocation = async () => {
    let permissions = await Location.requestForegroundPermissionsAsync();
    if (permissions?.granted) {
      const location = await Location.getCurrentPositionAsync({});
      if (location) {
        onSend({
          location: {
            longitude: location.coords.longitude,
            latitude: location.coords.latitude,
          },
        });
      } else Alert.alert("Error occurred while fetching location ");
    } else Alert.alert("Permissions haven't been granted.");
  };

  // Record Audio
  const sendRecordedSound = async () => {
    const recordingURI = await stopRecording();
    try {
      const soundURL = await uploadFile(recordingURI);
      onSend({ audio: soundURL });
    } catch (error) {
      Alert.alert("Couldn't send the recording. Please try again.");
    }
  };

  const startRecording = async () => {
    try {
      const permissions = await requestRecordingPermissionsAsync();
      if (!permissions?.granted) {
        Alert.alert("Permissions haven't been granted.");
        return;
      }
      // iOS needs recording enabled on the audio session (and plays in silent mode)
      await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
      await recorder.prepareToRecordAsync();
      recorder.record();
      Alert.alert(
        "You are recording...",
        undefined,
        [
          {
            text: "Cancel",
            onPress: () => {
              stopRecording();
            },
          },
          {
            text: "Stop and Send",
            onPress: () => {
              sendRecordedSound();
            },
          },
        ],
        { cancelable: false }
      );
    } catch (err) {
      Alert.alert("Failed to record!");
    }
  };

  // Stops the recorder and returns the local file uri of the recording
  const stopRecording = async () => {
    await recorder.stop();
    await setAudioModeAsync({ allowsRecording: false, playsInSilentMode: false });
    return recorder.uri;
  };

  // Reference Generator
  const generateReference = (uri) => {
    const timeStamp = new Date().getTime();
    const imageName = uri.split("/")[uri.split("/").length - 1];
    return `${userID}-${timeStamp}-${imageName}`;
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onActionPress}>
      <View style={[styles.wrapper, wrapperStyle]}>
        <Text style={[styles.iconText, iconTextStyle]}>+</Text>
      </View>
    </TouchableOpacity>
  );
};

// StyleSheets for component
const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: "#b2b2b2",
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: "#b2b2b2",
    fontWeight: "bold",
    fontSize: 10,
    backgroundColor: "transparent",
    textAlign: "center",
  },
});

export default CustomActions;
