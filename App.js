import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Import netInfo
import { useNetInfo } from "@react-native-community/netinfo";
import { useEffect } from "react";

// Import Firebase and Firestore
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  disableNetwork,
  enableNetwork,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

import { LogBox, Alert } from "react-native";
LogBox.ignoreLogs(["AsyncStorage has been extracted from"]);

// import screens that we want to navigate to
import Start from "./components/Start";
import Chat from "./components/Chat";

const Stack = createNativeStackNavigator();

// Cloud Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCylyi0WLkEsg90CI4x2skfbDMh-LQ8AsE",
  authDomain: "quickchatapp-662b7.firebaseapp.com",
  projectId: "quickchatapp-662b7",
  storageBucket: "quickchatapp-662b7.appspot.com",
  messagingSenderId: "753359550929",
  appId: "1:753359550929:web:5adc161e8c837f656188f0",
  measurementId: "G-7K5X3J1C1N",
};

// Initialize Firebase, Cloud Firestore and storage once, outside the component
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
// Keep the anonymous sign-in between app launches (getAuth() in Start reuses this)
initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// Apps main Chat component that renders the chat UI
const App = () => {
  // check connection status
  const connectionStatus = useNetInfo();

  // Network Status
  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert("Connection Lost!");
      disableNetwork(db);
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db);
    }
  }, [connectionStatus.isConnected]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Start">
          <Stack.Screen name="Start" component={Start} />
          <Stack.Screen name="Chat">
            {(props) => (
              <Chat
                isConnected={connectionStatus.isConnected}
                db={db}
                storage={storage}
                {...props}
              />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;
