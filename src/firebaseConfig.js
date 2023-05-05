import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
const firebaseConfig = {
  apiKey: 'AIzaSyDqn0oxEFcmOzksSkYi4rzUNLtDv92NIxw',
  authDomain: 'alo-news.firebaseapp.com',
  projectId: 'alo-news',
  storageBucket: 'alo-news.appspot.com',
  messagingSenderId: '722444380707',
  appId: '1:722444380707:web:17da4fda6cd19e388d5f96',
  measurementId: 'G-Y92FNKPX13',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
