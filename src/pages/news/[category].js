import Card from '@/components/Card';
import Footer from '@/components/Footer';
import Nav from '@/components/Nav';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { parseStringPromise } from 'xml2js';
import axios from 'axios';
import AntaraNews from '@/components/AntaraNews';

const Category = () => {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataCategory, setDataCategory] = useState(null);
  const [dataRSSAntara, setDataRSSAntara] = useState([]);
  const [urlAntara, setUrlAntara] = useState(null);
  useEffect(() => {
    if (router.isReady) {
      const { category } = router.query;
      fetch(`/api/category`)
        .then((res) => res.json())
        .then((dataCategory) => {
          setDataCategory(dataCategory);

          setUrlAntara(
            dataCategory.filter((item) => item.category == category)
          );
        });

      fetch(`/api/news/${category}?limit=9`)
        .then((res) => res.json())
        .then((data) => {
          setData(data);
          setLoading(false);
        });
    }
  }, [router]);

  useEffect(() => {
    if (urlAntara === null) return;
    if (urlAntara.length === 0) return;
    const url = urlAntara[0].antaraRSS;
    axios
      .get(url)
      .then((res) => parseStringPromise(res.data))
      .then((result) => {
        setDataRSSAntara(result.rss.channel[0].item);
      });
  }, [urlAntara]);

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
          {data.length > 0 &&
            data.slice(0, 3).map((item, index) => (
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
          {data.length > 0 &&
            data.slice(3, 6).map((item, index) => (
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
          {data.length > 0 &&
            data.slice(6, 9).map((item, index) => (
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
      <AntaraNews dataNews={dataRSSAntara} />
      <Footer />
    </>
  );
};

export default Category;
