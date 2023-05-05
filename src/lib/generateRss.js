import fs from 'fs';
import { Feed } from 'feed';
import { collection, getDocs, limit, query, where } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import RSS from 'rss';

export default async function GenerateRss({ category }) {
  const getData = async () =>
    await getDocs(
      query(
        collection(db, 'news'),
        where('category', '==', `${category}`),
        limit(20)
      )
    ).then((snapshot) => {
      if (snapshot.docs.length === 0) return { error: 'Not found' };
      return snapshot.docs.map((doc) => ({
        ...doc.data(),
        date: doc.data().date.toDate().toDateString(),
      }));
    });
  const data = await getData();
  if (data.error) return { props: {} };
  const siteURL = process.env.VERCEL_URL;
  const date = new Date();
  const feed = new RSS({
    title: 'AloNews',
    description:
      'AloNews delivers up-to-the-minute news and information on the latest top stories, weather, entertainment, politics and more.',
    id: siteURL,
    link: `${siteURL}/news/${category}`,

    copyright: `All rights reserved ${date.getFullYear()}, AloNews`,
  });

  data.forEach((post) => {
    const url = `${siteURL}/news${post.url}`;
    feed.item({
      title: post.title,
      guid: url,
      url: url,
      description: post.content,
      date: new Date(post.date),
      enclosure: {
        url: `${siteURL}${post.image}`,
      },
    });
  });

  fs.mkdirSync('./public/rss', { recursive: true });
  fs.writeFileSync(`./public/rss/${category}.xml`, feed.xml({ indent: true }));
  return { props: {} };
  //   fs.writeFileSync(`./public/rss/${category}.json`, feed.json1());
}
