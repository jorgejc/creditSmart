import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDjQ9-05qoX4b3p_4fAO65bWbYJ3zvu9g4",
  authDomain: "creditsmart-iud-d86fc.firebaseapp.com",
  projectId: "creditsmart-iud-d86fc",
  storageBucket: "creditsmart-iud-d86fc.firebasestorage.app",
  messagingSenderId: "378476999914",
  appId: "1:378476999914:web:8cbaf80c83b1b26ae71393"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app)