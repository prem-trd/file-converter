// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD3bMl5fmOvP_UsHCoo3M6f6p4Mn9wIN0c",
  authDomain: "project1-3d56e.firebaseapp.com",
  projectId: "project1-3d56e",
  storageBucket: "project1-3d56e.appspot.com",
  messagingSenderId: "835408379399",
  appId: "1:835408379399:web:807b7974c877c79c8c74a2",
  measurementId: "G-ZWX7BNNXEC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
