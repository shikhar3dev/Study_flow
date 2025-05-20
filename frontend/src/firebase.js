// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCL0J8Xwrrr90msvlAPXIGAEHZ7eR4kstY",
  authDomain: "study-flow-84007.firebaseapp.com",
  projectId: "study-flow-84007",
  storageBucket: "study-flow-84007.firebasestorage.app",
  messagingSenderId: "503884989431",
  appId: "1:503884989431:web:0dc7a0bf70df4814a824f2",
  measurementId: "G-DE1G8CV0JR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// You can remove getAnalytics if you don't need it
// import { getAnalytics } from "firebase/analytics";
// const analytics = getAnalytics(app);

export { auth, provider, signInWithPopup }; 