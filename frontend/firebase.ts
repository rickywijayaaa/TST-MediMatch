import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";



const firebaseConfig = {
    apiKey: "AIzaSyDIqKg97T9sA7WjfAUwHvrAOqydqKhhVsU",
    authDomain: "medimatch-1874d.firebaseapp.com",
    projectId: "medimatch-1874d",
    storageBucket: "medimatch-1874d.firebasestorage.app",
    messagingSenderId: "689699298874",
    appId: "1:689699298874:web:8f20d8666cb508f6ce5f03",
    measurementId: "G-8LH5W6Z2S2"
  };
  
  // Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Firebase Authentication and Google provider
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, signInWithPopup };
