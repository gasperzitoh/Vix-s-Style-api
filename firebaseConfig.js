
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAlFTu65KB1pSjqWZhu3P4Uu7dPdyifQBc",
  authDomain: "vix-style-84f17.firebaseapp.com",
  projectId: "vix-style-84f17",
  storageBucket: "vix-style-84f17.appspot.com",
  messagingSenderId: "656108467878",
  appId: "1:656108467878:web:9e2fa41c73fdbf3178e667",
  measurementId: "G-KBEGNNT87S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
