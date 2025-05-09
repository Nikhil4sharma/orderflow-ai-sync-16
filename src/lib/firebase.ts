// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDdQ0Yj5l2rY8l6kI6KKOtfZ7TywmHxVRk",
  authDomain: "orderflow-ai-7d21a.firebaseapp.com",
  projectId: "orderflow-ai-7d21a",
  storageBucket: "orderflow-ai-7d21a.firebasestorage.app",
  messagingSenderId: "448089792367",
  appId: "1:448089792367:web:88bfef85237e5b64d2929a",
  measurementId: "G-2KJM201KHJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;