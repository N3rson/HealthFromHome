// Import Firebase core
import { initializeApp } from "firebase/app";
// Import the functions needed for auth persistence
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC7yxrb6f3cexjqohVfK_B8ZI1yJiCGtSc",
  authDomain: "assessment-573e1.firebaseapp.com",
  projectId: "assessment-573e1",
  storageBucket: "assessment-573e1.appspot.com",
  messagingSenderId: "79376605190",
  appId: "1:79376605190:web:a668133aea5c4c2bb8e387",
  measurementId: "G-004BLBP8N2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export { app, auth };