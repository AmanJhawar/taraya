import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAbNuJYBPTS3sqO8WyraAbrinzowQlX9oI",
  authDomain: "taraya-cea31.firebaseapp.com",
  projectId: "taraya-cea31",
  storageBucket: "taraya-cea31.firebasestorage.app",
  messagingSenderId: "116361129530",
  appId: "1:116361129530:web:b6a0554060558b754f4f03",
  measurementId: "G-9T01BWYGM3"
};

// Initialize Firebase securely (avoiding double initialization in dev)
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
