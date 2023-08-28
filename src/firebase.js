// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";


import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDdr0KFzms3WAkHGF35rCW_jVZSHtAg45E",
  authDomain: "projx-9a119.firebaseapp.com",
  projectId: "projx-9a119",
  storageBucket: "projx-9a119.appspot.com",
  messagingSenderId: "590175522306",
  appId: "1:590175522306:web:7c66a6e026cff1af35611b",
  measurementId: "G-CQMQ73MZ0Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();
export const storage = getStorage(app);










