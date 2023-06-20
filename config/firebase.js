//import 'firebase/compat/app';
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import "firebase/compat/auth";
import "firebase/compat/firestore";

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyDBrUb23T5cmQCa8Nb1kFhv4DXmM0CnQIo",
  authDomain: "bm-transfers.firebaseapp.com",
  databaseURL: "https://bm-transfers-default-rtdb.firebaseio.com",
  projectId: "bm-transfers",
  storageBucket: "bm-transfers.appspot.com",
  messagingSenderId: "902317764286",
  appId: "1:902317764286:web:8e7b8fef3869c8af10f8ef",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
