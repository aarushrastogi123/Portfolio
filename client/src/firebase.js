// Firebase configuration
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDZ48Io5Y_FJKWItsCoRy4XuU53BonMHVI",
  authDomain: "portfolio-3f105.firebaseapp.com",
  projectId: "portfolio-3f105",
  storageBucket: "portfolio-3f105.firebasestorage.app",
  messagingSenderId: "779147610294",
  appId: "1:779147610294:web:018cf51b99cfdd4745fe17",
  measurementId: "G-XLG0ZE399Z"
};

// Prevent duplicate app initialization during hot reload
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db };
