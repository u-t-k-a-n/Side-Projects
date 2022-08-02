import { initializeApp } from "firebase/app";
import { getFirestore, collection, serverTimestamp } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, 
    onAuthStateChanged, sendPasswordResetEmail, updateEmail, updatePassword } from 'firebase/auth'


const app = initializeApp({
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID
});

export const firestore = getFirestore(app);
export const database = {
   folders : collection(firestore,"folders"),
   files : collection(firestore,"files"),
   getCurrentTimestamp : serverTimestamp,
   formatDoc : (doc) => {
         return {
              id : doc.id,
              ...doc.data()
         }
    }
}

export const auth = getAuth(app)
export const methods = {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    sendPasswordResetEmail,
    updateEmail,
    updatePassword
}
export default app;