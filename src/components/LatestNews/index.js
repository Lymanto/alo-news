import { useEffect, useState } from 'react';
import Card from '../Card';

function LatestNews() {
  const [dataCategory, setDataCategory] = useState([]);
  const [dataNews, setDataNews] = useState([]);
  const [active, setActive] = useState();
  useEffect(() => {
    fetch(`/api/category`)
      .then((res) => res.json())
      .then((dataCategory) => {
        setDataCategory(dataCategory);
        setActive(dataCategory[0].category);
      });
  }, []);

  useEffect(() => {
    if (!active) return;
    fetch(`/api/news/${active}??limit=10`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) return setDataNews([]);
        setDataNews(data);
      });
  }, [active]);
  return (
    <section className="w-full px-8 mb-8 flex flex-col">
      <h2 className="font-bold text-2xl text-black mb-6">Latest News</h2>
      <div className="flex gap-3 mb-6">
        {dataCategory.map((item) => (
          <button
            className={`${
              active == item.category ? 'btn-primary' : 'btn-secondary'
            }`}
            key={item.id}
            onClick={() => setActive(item.category)}
          >
            {item.category}
          </button>
        ))}
      </div>
      <div className="w-full flex overflow-x-auto">
        <div className="flex gap-6">
          {dataNews.length != 0 ? (
            dataNews.map((item, index) => (
              <Card
                type={'latest'}
                url={`/news${item.url}`}
                title={item.title}
                date={item.date}
                category={item.category}
                key={index}
                image={item.image}
              />
            ))
          ) : (
            <div>Tidak ada data</div>
          )}
        </div>
      </div>
    </section>
  );
}

export default LatestNews;
