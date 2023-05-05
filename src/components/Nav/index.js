import Head from 'next/head';
import Image from 'next/image';
import Logo from '@/images/logo.svg';
import Link from 'next/link';

export default function Nav({ title, dataCategory }) {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <nav className=" w-full p-5 bg-black">
        <div>
          <Link href="/">
            <Image src={Logo} alt="logo" />
          </Link>
        </div>
      </nav>
      <section className="w-full flex border border-b-1 border-secondary">
        {dataCategory?.map((item, index) => (
          <Link
            href={`/news/${item.category}`}
            className="btn-link capitalize"
            key={index}
          >
            {item.category}
          </Link>
        ))}
      </section>
    </>
  );
}
