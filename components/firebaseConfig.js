// https://console.firebase.google.com
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: `${process.env.EXPO_PUBLIC_FIREBASE_API_KEY}`,
  authDomain: `${process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN}`,
  databaseURL: `${process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL}`,
  projectId: `${process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID}`,
  storageBucket: `${process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET}`,
  messagingSenderId: `${process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID}`,
  appId: `${process.env.EXPO_PUBLIC_FIREBASE_APP_ID}`
};

// Initialize Firebase and export
export const app = initializeApp(firebaseConfig);