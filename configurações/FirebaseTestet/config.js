// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import firebase from "firebase/compat/app"
import "firebase/compat/auth";
import { collection, getDocs } from "firebase/firestore"
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyDn-gqy3mkFKxj6Hp-4u8YNhG4bTbgBKxU",
  authDomain: "smabancoteste-b9487.firebaseapp.com",
  projectId: "smabancoteste-b9487",
  storageBucket: "smabancoteste-b9487.firebasestorage.app",
  messagingSenderId: "288917385888",
  appId: "1:288917385888:web:5eeb9876882d093d80cfc5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//Iniciando o Firestore
const firebaseBD = getFirestore(app)

firebase.initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export { firebase, firebaseBD }
