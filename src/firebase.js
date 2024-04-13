// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "instagram-using-nextjs.firebaseapp.com",
  projectId: "instagram-using-nextjs",
  storageBucket: "instagram-using-nextjs.appspot.com",
  messagingSenderId: "703340033458",
  appId: "1:703340033458:web:922741e092b8b2859f20ab",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

/* 
RULES 

rules_version = '2';

// Craft rules based on data in your Firestore database
// allow write: if firestore.get(
//    /databases/(default)/documents/users/$(request.auth.uid)).data.isAdmin;
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read;
      allow write: if
      request.resource.size < 2 * 1024 * 1024 &&
      request.resource.contentType.matches('image/.*')
    }
  }
} */
