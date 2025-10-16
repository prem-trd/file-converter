import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  projectId: "project1-3d56e",
  appId: "1:835408379399:web:807b7974c877c79c8c74a2",
  storageBucket: "project1-3d56e.firebasestorage.app",
  apiKey: "AIzaSyD3bMl5fmOvP_UsHCoo3M6f6p4Mn9wIN0c",
  authDomain: "project1-3d56e.firebaseapp.com",
  messagingSenderId: "835408379399"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
