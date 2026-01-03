import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  projectId: "fileconverter-9509d",
  appId: "1:805297617844:web:fc91147f662e9ac6f0d0e1",
  storageBucket: "fileconverter-9509d.firebasestorage.app",
  apiKey: "AIzaSyD9wq-2k1qVUvkx5nqNDH0Qe_8m7ZGbDpo",
  authDomain: "fileconverter-9509d.firebaseapp.com",
  messagingSenderId: "805297617844",
  measurementId: "G-HFVF5PC539"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
