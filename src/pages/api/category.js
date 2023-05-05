// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { db } from '@/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
export default async function handler(req, res) {
  try {
    const docRef = doc(db, 'category', '5ncO9J0fujN0nQWTXv65');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      res.status(200).json(docSnap.data().category);
    } else {
      res.status(500).json({ message: 'Document does not exist' });
    }
  } catch (error) {
    res.status(500).json(error);
  }
}
