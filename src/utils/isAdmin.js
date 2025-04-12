// utils/isAdmin.js
import { db } from '../firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';

export const checkIfAdmin = async (email) => {
  const snapshot = await getDocs(collection(db, 'admins'));
  return snapshot.docs.some(doc => doc.data().email === email);
};
