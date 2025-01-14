import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase config from Firebase console
const firebaseConfig = {
  apiKey: "AIzaSyBizxcNUgN77c4-hkcc2shucVMdwY17DbA",
  authDomain: "spotify-notes-c8d40.firebaseapp.com",
  projectId: "spotify-notes-c8d40",
  storageBucket: "spotify-notes-c8d40.appspot.com",
  messagingSenderId: "922043768303",
  appId: "1:922043768303:web:8faeb6f1d57dc1ab452a1a"
};

const app = initializeApp(firebaseConfig);

// Initialize Auth and Firestore
const auth = getAuth(app);
const db = getFirestore(app);

// Export the necessary services
export { auth, db };
