import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDzfc0yDKvQEVX7TqxmTnBcVQ49KltFfDk",
  authDomain: "aim-ops-1.firebaseapp.com",
  projectId: "aim-ops-1",
  storageBucket: "aim-ops-1.firebasestorage.app",
  messagingSenderId: "541175806489",
  appId: "1:541175806489:web:5f51846a2d3bb2bcbf8888",
  measurementId: "G-ZF238JKCP5"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
