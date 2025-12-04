// Firebase configuration for Nashtto Customer App
// Using compat imports for better React Native/Expo compatibility
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCLJ85pNNUlPNjQr2xOiRQTLS7lzZxfGvY",
    authDomain: "customerapp-6a548.firebaseapp.com",
    projectId: "customerapp-6a548",
    storageBucket: "customerapp-6a548.firebasestorage.app",
    messagingSenderId: "323844165106",
    appId: "1:323844165106:web:2d7dab93b49a9e9318ef6b",
    measurementId: "G-9MEZ2M17ZP"
};

// Initialize Firebase (only if not already initialized)
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();

export { auth, firebase };
export default firebase;
