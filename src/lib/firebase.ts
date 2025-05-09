
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDC3S5wFRHRCQLajwNh0_2splXUnEuF3ns",
  authDomain: "orderflow-printing.firebaseapp.com",
  projectId: "orderflow-printing",
  storageBucket: "orderflow-printing.firebasestorage.app",
  messagingSenderId: "1068388384656",
  appId: "1:1068388384656:web:0226f5859741be162d3d15",
  measurementId: "G-CV27WCCEEX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage };
