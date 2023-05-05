import { useRouter } from 'next/router';
import { db } from '@/firebaseConfig';
import { collection, getDocs, where, query, limit } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import Nav from '@/components/Nav';
import Image from 'next/image';
import Footer from '@/components/Footer';
import Link from 'next/link';
export default function Detail({}) {
  const router = useRouter();

  const [data, setData] = useState({});
  const [dataNews, setDataNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataCategory, setDataCategory] = useState(null);
  // console.log(urlName);
  useEffect(() => {
    if (router.isReady) {
      const detail = router.query.detail || [];
      const urlName = detail.join('/');
      fetch(`/api/category`)
        .then((res) => res.json())
        .then((dataCategory) => {
          setDataCategory(dataCategory);
        });
      const getData = async () =>
        getDocs(
          query(
            collection(db, 'news'),
            where('url', '==', `/${urlName}`),
            limit(1)
          )
        ).then((snapshot) => {
          if (snapshot.docs.length === 0) return router.push('/404');
          setData(
            snapshot.docs.map((doc) => ({
              ...doc.data(),
              date: doc.data().date.toDate().toDateString(),
            }))
          );
          setLoading(false);
        });
      getData();
    }
  }, [router]);

  useEffect(() => {
    if (data.length === 0) return;
    if (data[0]?.category === undefined) return;
    fetch(`/api/news/${data[0]?.category}?limit=5`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) return setDataNews([]);
        setDataNews(data);
      });
  }, [data]);

  return loading ? (
    <div className="w-full h-screen flex justify-center items-center">
      <span className="h-screen w-full flex justify-center items-center">
        <span className="animate-spin relative flex h-10 w-10 rounded-sm bg-black opacity-75"></span>
      </span>
    </div>
  ) : (
    <>
      <Nav title={data[0].title} dataCategory={dataCategory} />
      <section className="w-full flex py-[50px] px-[136px] justify-center gap-[90px]">
        <div className="w-[680px]">
          <h1 className="font-bold text-[32px] text-black">{data[0].title}</h1>
          <div className="text-base font-light text-black flex items-center gap-2 mt-[8px]">
            <p className="capitalize">{data[0].category}</p>
            <span className="dot"></span>
            <p>{data[0].date}</p>
          </div>
          {data[0].image != null ? (
            <div
              className="mt-[24px] w-full h-[425px]"
              style={{ position: 'relative' }}
            >
              <Image
                src={data[0].image}
                fill
                style={{ objectFit: 'cover' }}
                alt="image"
              />
            </div>
          ) : null}
          <div
            className="mt-[24px] text-base font-light text-black flex flex-col gap-4"
            dangerouslySetInnerHTML={{ __html: data[0].content }}
          ></div>
        </div>
        <div className="w-[368px] border-l border-secondary pl-[40px]">
          <div className="w-full flex flex-col gap-4">
            <h1 className="font-bold text-lg text-black">Related Topic</h1>
            {dataNews.map((item, index) =>
              item.url === data[0].url ? null : (
                <Link
                  href={`/news${item.url}`}
                  className="w-full flex gap-2"
                  key={index}
                >
                  <div className="flex flex-col gap-1">
                    <p className="font-light text-[12px] capitalize">
                      {item.category}
                    </p>
                    <h1 className="font-bold text-base">{item.title}</h1>
                    <p className="font-light text-[12px]">{item.date}</p>
                  </div>
                  {item.image != null ? (
                    <div
                      className="w-[80px] h-[80px] shrink-0"
                      style={{ position: 'relative' }}
                    >
                      <Image
                        src={item.image}
                        fill
                        style={{ objectFit: 'cover' }}
                        alt="image"
                      />
                    </div>
                  ) : null}
                </Link>
              )
            )}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
