import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDIqKg97T9sA7WjfAUwHvrAOqydqKhhVsU",
  authDomain: "medimatch-1874d.firebaseapp.com",
  projectId: "medimatch-1874d",
  storageBucket: "medimatch-1874d.appspot.com",
  messagingSenderId: "689699298874",
  appId: "1:689699298874:web:8f20d8666cb508f6ce5f03",
  measurementId: "G-8LH5W6Z2S2"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Initialize Google Authentication Provider
const googleProvider = new GoogleAuthProvider();

// Initialize Firestore for database operations
const db = getFirestore(app);

// Initialize Firebase Storage for file uploads
const storage = getStorage(app);

// Export Firebase modules for use in other parts of the app
export {
  app,
  auth,
  googleProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  db,
  storage
};
