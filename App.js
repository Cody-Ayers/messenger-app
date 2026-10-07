import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Import netInfo
import { useNetInfo } from "@react-native-community/netinfo";
import { useEffect } from "react";

// Import Firebase and Firestore
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  disableNetwork,
  enableNetwork,
} from "firebase/firestore";
import {
  initializeAuth,
  getAuth,
  getReactNativePersistence,
} from "firebase/auth";
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

// Initialize Firebase and Cloud Firestore once, outside the component
// (getApps() guards against setting up twice when the code reloads in development)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
// Keep the anonymous sign-in between app launches (getAuth() in Start reuses this)
try {
  initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
} catch (error) {
  // Auth was already set up on a previous reload
  getAuth(app);
}

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
