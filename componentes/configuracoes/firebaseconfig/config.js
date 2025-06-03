// Import the functions you need from the SDKs you need
import { initializeApp  } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import firebase from "firebase/compat/app"
import "firebase/compat/auth";
import {collection, getDocs} from "firebase/firestore"
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAhk9dtkJh6c2dLp24Q5nrO6bLdKaYZuBU",
  authDomain: "smabdteste.firebaseapp.com",
  projectId: "smabdteste",
  storageBucket: "smabdteste.firebasestorage.app",
  messagingSenderId: "375397560478",
  appId: "1:375397560478:web:979b667d38e8131af78b8f",
  measurementId: "G-LFTCM11WZ3"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

//Iniciando o Firestore
const firebaseBD = getFirestore(app)

firebase.initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export {firebase, firebaseBD}