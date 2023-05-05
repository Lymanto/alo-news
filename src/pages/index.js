import Card from '@/components/Card';
import Footer from '@/components/Footer';
import LatestNews from '@/components/LatestNews';
import Nav from '@/components/Nav';
import GenerateRss from '@/lib/generateRss';
import { useEffect, useState } from 'react';
import { db } from '@/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
export default function Home({ dataCategory }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/news?limit=9`)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, []);

  return loading ? (
    <div className="w-full h-screen flex justify-center items-center">
      <span className="h-screen w-full flex justify-center items-center">
        <span className="animate-spin relative flex h-10 w-10 rounded-sm bg-black opacity-75"></span>
      </span>
    </div>
  ) : (
    <>
      <Nav title={'AloNews'} dataCategory={dataCategory} />
      <section className="w-full p-8 flex gap-8">
        <div className="flex flex-col gap-6">
          {data.slice(0, 3).map((item, index) => (
            <>
              <Card
                url={`/news${item.url}`}
                key={index}
                image={item.image}
                title={item.title}
                date={item.date}
                category={item.category}
              />
              <div className="divider"></div>
            </>
          ))}
        </div>
        <div className="flex flex-col gap-6">
          {data.slice(3, 6).map((item, index) => (
            <>
              <Card
                url={`/news${item.url}`}
                key={index}
                image={item.image}
                title={item.title}
                date={item.date}
                category={item.category}
              />
              <div className="divider"></div>
            </>
          ))}
        </div>
        <div className="flex flex-col gap-6">
          {data.slice(6, 9).map((item, index) => (
            <>
              <Card
                url={`/news${item.url}`}
                key={index}
                image={item.image}
                title={item.title}
                date={item.date}
                category={item.category}
              />
              <div className="divider"></div>
            </>
          ))}
        </div>
      </section>
      <LatestNews />
      <Footer />
    </>
  );
}
export async function getStaticProps() {
  const docRef = doc(db, 'category', '5ncO9J0fujN0nQWTXv65');
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    console.log('No such document!');
    return {
      notFound: true,
    };
  }
  const dataCategory = docSnap.data().category;

  dataCategory.map(async (item) => {
    await GenerateRss({ category: item.category });
  });
  return {
    props: {
      dataCategory: dataCategory,
    },
    revalidate: 10,
  };
  // ........
}
