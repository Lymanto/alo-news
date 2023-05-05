import Image from 'next/image';
import Link from 'next/link';

function AntaraNews({ dataNews }) {
  return (
    <section className="w-full px-8 mb-8 flex flex-col">
      <h2 className="font-bold text-2xl text-black mb-6">Antara News</h2>

      <div className="w-full flex overflow-x-auto">
        <div className="flex gap-6">
          {dataNews.length != 0 ? (
            dataNews.map((item, index) => (
              <a
                href={item.link}
                target="_blank"
                rel="noreferrer noopener"
                className="card-latest"
                key={index}
              >
                {item.enclosure[0].$.url !== null ? (
                  <div
                    className="w-full h-[186px]"
                    style={{ position: 'relative' }}
                  >
                    <Image
                      src={item.enclosure[0].$.url}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 640px"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                ) : null}
                <div className="flex flex-col gap-1">
                  <h2 className="font-bold text-lg text-black">{item.title}</h2>
                  <p className="font-light text-sm">{item.pubDate}</p>
                </div>
              </a>
            ))
          ) : (
            <div>Tidak ada data</div>
          )}
        </div>
      </div>
    </section>
  );
}

export default AntaraNews;
