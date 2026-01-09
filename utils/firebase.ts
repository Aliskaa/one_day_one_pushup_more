// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD7YZ12FP9VPVifGpqx15kSJBEyap8Wfdo",
  authDomain: "pushup2026-580f8.firebaseapp.com",
  projectId: "pushup2026-580f8",
  storageBucket: "pushup2026-580f8.firebasestorage.app",
  messagingSenderId: "116649172260",
  appId: "1:116649172260:web:c66c1df9feb766628fe7b1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialisation de Firestore
export const db = getFirestore(app);