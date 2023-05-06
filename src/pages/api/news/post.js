import { db } from '@/firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { IncomingForm } from 'formidable';
import { promises as fs } from 'fs';
import { tmpdir } from 'os';
// var mv = require('mv');

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const data = await new Promise((resolve, reject) => {
    const form = new IncomingForm();

    form.parse(req, async (err, fields, files) => {
      if (err) return reject(err);

      if (!fields.title) return reject('No title');
      if (!fields.category) return reject('No category');
      if (!fields.url) return reject('No url');
      if (!fields.content) return reject('No content');

      if (files.file) {
        var oldPath = files.file.filepath;
        var imageName =
          new Date().getTime() + '-' + files.file.originalFilename;
        var uploadPath = '/uploads/';
        var newPath = `public${uploadPath}${imageName}`;
        const image = await fs.readFile(oldPath, {
          encoding: 'utf8',
        });
        await fs.writeFileSync(newPath, image);
        // mv(oldPath, newPath, function (err) {});
      }
      const docRef = await addDoc(collection(db, 'news'), {
        title: fields.title,
        category: fields.category,
        url: `/${fields.category}/${fields.url}`,
        content: fields.content,
        image: files.file ? `${uploadPath}${imageName}` : null,
        date: serverTimestamp(),
      });
      res
        .status(200)
        .json({ message: `Document written with ID: , ${docRef.id}` });
    });
  });
}
