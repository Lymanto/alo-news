import Image from 'next/image';
import Link from 'next/link';
const Card = ({ image, title, category, date, url, type }) => {
  if (type == 'latest')
    return (
      <Link href={url} className="card-latest">
        {image !== null ? (
          <div className="w-full h-[186px]" style={{ position: 'relative' }}>
            <Image
              src={image}
              alt={title}
              fill
              sizes="(max-width: 640px) 100vw, 640px"
              style={{ objectFit: 'cover' }}
            />
          </div>
        ) : null}
        <div className="flex flex-col gap-1">
          <p className="font-light text-sm capitalize">{category}</p>
          <h2 className="font-bold text-lg text-black">{title}</h2>
          <p className="font-light text-sm">{date}</p>
        </div>
      </Link>
    );

  return (
    <Link href={url} className="card">
      {image !== null ? (
        <div className="w-full h-[270px]" style={{ position: 'relative' }}>
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, 640px"
            style={{ objectFit: 'cover' }}
          />
        </div>
      ) : null}
      <p className="font-light text-sm capitalize">{category}</p>
      <h2 className="font-bold text-2xl text-black">{title}</h2>
      <p className="font-light text-sm">{date}</p>
    </Link>
  );
};

export default Card;
