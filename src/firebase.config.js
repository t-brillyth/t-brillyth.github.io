import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCDRQLnR_kzTw7xXDtFxq9_s1JJDhAvYP8",
  authDomain: "project-alfresi.firebaseapp.com",
  projectId: "project-alfresi",
  storageBucket: "project-alfresi.appspot.com",
  messagingSenderId: "61616058357",
  appId: "1:61616058357:web:11d461286acb22aa81fabc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;