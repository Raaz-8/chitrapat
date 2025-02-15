import { initializeApp } from "firebase/app";
import {getFirestore,collection} from 'firebase/firestore'
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyC2ixjcUslwMDWjpJi8hG3YGK3Rp17na4o",
  authDomain: "chitrapat-8cc0f.firebaseapp.com",
  projectId: "chitrapat-8cc0f",
  storageBucket: "chitrapat-8cc0f.appspot.com",
  messagingSenderId: "704246932507",
  appId: "1:704246932507:web:a0e515ee500ec4192084be"
};

const app = initializeApp(firebaseConfig);
export const db=getFirestore(app);
export const auth = getAuth(app);
export const moviesRef=collection(db,'movies');
export const reviewsRef=collection(db,'reviews');
export const usersRef=collection(db,'user_data');
export const reviewDataRef=collection(db,'review_data');
export const googleProvider = new GoogleAuthProvider(); // Google Auth Provider


// export const auth=auth();
export default app;
