import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase web app configuration for Verity Ground
const firebaseConfig = {
  projectId: "verity-ground",
  appId: "1:469101304918:web:ad2b6b10c03576d96daff7",
  storageBucket: "verity-ground.firebasestorage.app",
  apiKey: "AIzaSyCYDQ1xi9Zno76E_PIT8KyFW7xVp2Waga8",
  authDomain: "verity-ground.firebaseapp.com",
  messagingSenderId: "469101304918",
  measurementId: "G-G6ER6J91N5",
  projectNumber: "469101304918"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore instance
export const db = getFirestore(app);
export default app;
