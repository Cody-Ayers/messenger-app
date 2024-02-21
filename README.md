# Messenger-APP

<br>

<img src="/imgs/welcome-screen.png">
<img src="/imgs/sign-in-success.png">
<img src="/imgs/chat-screen.png">
<img src="/imgs/shared-location.png">

## App Description

<br>

This is a chat app for use on mobile devices created using React Native

## Dependencies and Libraries needed

<br>

- React Native
- Expo and Expo Go(mobile)
- XCode
- Android Studio / Emulator
- Google Firebase

<br>

```
npm install --save @react-navigation/native @react-navigation/native-stack
npm install react-native-gifted-chat --save
npm install firebase --save
expo install react-native-screens react-native-safe-area-context
expo install @react-native-async-storage/async-storage
expo install @react-native-community/netinfo
expo install expo-image-picker
expo install expo-media-library
expo install expo-location
expo install react-native-maps
expo install expo-av
```

## Run QuickChat on your device

<br>

### Node.js

Install the latest version of node by running `nvm install lts` in your project file in your terminal

<br>

### Expo

Install Expo globally In your project terminal also run `npm install -g expo-cli`

You then need to install Expo Go on your personal device so you can test your app as changes are made.

You can find links to those here:
[iOS](https://apps.apple.com/us/app/expo-go/id982107779)
[Android](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en_US&gl=US&pli=1)

Don't forget to sign-up for an [Expo Account](expo.dev)

<br>

### Google Firebase

Google Firebase is what this app uses to store the data(messages, images and other files) from the chat app. The instructions below will walk you though how to set up your own Google Firbase.

1. In your web browser go to: [Google Firebase](https://firebase.google.com/). If you aren't already signed in with a google account (check the upper right hand corner), sign in there.
2. Click on the **_Create a Project_** choose the name you want for your project and click **_Continue_**
3. Wait until your project is created and click **_Continue_**
4. On the left panel click on **_Build_** then click **_Firestore Database_** from the dropdown, click **_Create Database_**
5. Be sure that **_Start in production mode_** is selected and click **_Enable_**
6. Click on the **_Rules_** tab and change the code from: `allow read, write: if false;` to: `allow read, write, if true;`, (This allows you to add messages sent in chat to your storage) be sure to click the **_Publish_** button after.
7. Again on the left panel, click on **_Build_**, **_Storage_** when you see the **_Get Started_** button click and continue.
8. Be sure **_Start in production mode_** is selected and click **\__Next_**
9. Again go to the **_Rules_** tab and change the code as follows: `allow read, write: if false;` to `allow read, write, if true;`, (This allows you to add images sent in chat to your storage) and be sure to click the **\__Publish_** button when done.
10. Finally, on the left panel click **_Project Overview_** click on the web icon **</BR>** symbol. Click **_Register app_**
11. You then need to copy these pieces of code that is provided:

- `const firebaseConfig = { all of the code in here! };`
- `const firebaseConfig = { replace everything in here! };`

<br>

### Necessary Libraries

<br>

Run the following commands in the project terminal to ensure you have all the correct libraries for the app to function:

```
npm install --save @react-navigation/native @react-navigation/native-stack
npm install react-native-gifted-chat --save
npm install firebase --save
expo install react-native-screens react-native-safe-area-context
expo install @react-native-async-storage/async-storage
expo install @react-native-community/netinfo
expo install expo-image-picker
expo install expo-media-library
expo install expo-location
expo install react-native-maps
```
