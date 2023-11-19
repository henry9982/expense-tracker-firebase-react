// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth ,GoogleAuthProvider} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBSZdX9b8uhh-vVIO-dU8xKVJmXmQsqzA0",
  authDomain: "expense-tracker-69ca5.firebaseapp.com",
  projectId: "expense-tracker-69ca5",
  storageBucket: "expense-tracker-69ca5.appspot.com",
  messagingSenderId: "663120015609",
  appId: "1:663120015609:web:3718da935f050f3bb5b228"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const provider = new GoogleAuthProvider()
export const db = getFirestore(app)