import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  setDoc,
  deleteDoc
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyB0FVqJphdQG6JK_9JYHlFbWZ5_QoGP5z8",
  authDomain: "chatgpt-replica-41cc7.firebaseapp.com",
  projectId: "chatgpt-replica-41cc7",
  storageBucket: "chatgpt-replica-41cc7.appspot.com",
  messagingSenderId: "580770783372",
  appId: "1:580770783372:web:07761f8d1132edaa1c5ba9",
  measurementId: "G-FYSPWDVBQQ",
};

const app = initializeApp(firebaseConfig);

const firebaseAuth = getAuth(app);
const db = getFirestore(app);
export {
  firebaseAuth,
  db,
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  setDoc,
  deleteDoc
};
