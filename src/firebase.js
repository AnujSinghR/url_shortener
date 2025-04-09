import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyDNbSCZSdayV7WggnWhPgTo_rgpOQARllQ",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "url-shortner-8465f.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "url-shortner-8465f",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "url-shortner-8465f.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "792443660508",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:792443660508:web:2a612a546735891492ac19"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);