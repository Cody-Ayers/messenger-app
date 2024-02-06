
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import Firebase and Firestore
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

import { LogBox } from 'react-native';
LogBox.ignoreLogs(["AsyncStorage has been extracted from"]);

// import screens that we want to navigate to
import Start from './components/Start';
import Chat from './components/Chat';

const Stack = createNativeStackNavigator();

// Apps main Chat component that renders the chat UI
const App = () => {
    const firebaseConfig = {
        apiKey: "AIzaSyCylyi0WLkEsg90CI4x2skfbDMh-LQ8AsE",
        authDomain: "quickchatapp-662b7.firebaseapp.com",
        projectId: "quickchatapp-662b7",
        storageBucket: "quickchatapp-662b7.appspot.com",
        messagingSenderId: "753359550929",
        appId: "1:753359550929:web:5adc161e8c837f656188f0",
        measurementId: "G-7K5X3J1C1N"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);

    // Initialize Cloud Firestore
    const db = getFirestore(app);

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Start">
                <Stack.Screen name="Start" component={Start} />
                <Stack.Screen name="Chat">
                    {props => <Chat db={db} {...props} />}
                </Stack.Screen>
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;
