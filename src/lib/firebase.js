import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCYDQ1xi9Zno76E_PIT8KyFW7xVp2Waga8",
  authDomain: "verity-ground.firebaseapp.com",
  projectId: "verity-ground",
  storageBucket: "verity-ground.firebasestorage.app",
  messagingSenderId: "469101304918",
  appId: "1:469101304918:web:ad2b6b10c03576d96daff7",
  measurementId: "G-G6ER6J91N5"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
