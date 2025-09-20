import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDlbeO-lWkgVHAckFfNuFr6h8vjFZUMG70",
  authDomain: "login-and-sign-up-e39e4.firebaseapp.com",
  projectId: "login-and-sign-up-e39e4",
  storageBucket: "login-and-sign-up-e39e4.firebasestorage.app",
  messagingSenderId: "1025789251454",
  appId: "1:1025789251454:web:c1fc71cd021b02b37b6d2f",
  measurementId: "G-WDK25Z3R6E"
};


const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db };
