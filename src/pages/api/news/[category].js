import { db } from '@/firebaseConfig';
import {
  collection,
  onSnapshot,
  where,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
export default async function handler(req, res) {
  try {
    onSnapshot(
      query(
        collection(db, 'news'),
        where('category', '==', req.query.category),
        orderBy('date', 'desc'),
        limit(req.query.limit)
      ),
      (snapshot) => {
        if (snapshot.docs.length === 0)
          return res.status(404).json({ error: 'Not found' });
        res.status(200).json(
          snapshot.docs.map((doc) => ({
            ...doc.data(),
            date: doc.data().date.toDate().toDateString(),
          }))
        );
      }
    );
  } catch (error) {
    res.status(404).json({ error: 'Not found' });
  }
}
