// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBntknXaVCI2gaWNZyEyghPVMmearYOx4I",
  authDomain: "mediqure-cb4d1.firebaseapp.com",
  projectId: "mediqure-cb4d1",
  storageBucket: "mediqure-cb4d1.firebasestorage.app",
  messagingSenderId: "616132135528",
  appId: "1:616132135528:web:8ecb317ad92f86fea709dd",
  measurementId: "G-X02G6GLYLN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)