import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Logo from '@/images/logo.svg';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { db } from '@/firebaseConfig';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { collection, getDocs, where, query, limit } from 'firebase/firestore';
const QuillNoSSRWrapper = dynamic(import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
});

const modules = {
  toolbar: [
    [{ header: '1' }, { header: '2' }, { font: [] }],
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [
      { list: 'ordered' },
      { list: 'bullet' },
      { indent: '-1' },
      { indent: '+1' },
    ],
    ['link'],
    ['clean'],
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
};
/*
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */
const formats = [
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
];
const Admin = () => {
  const [title, setTitle] = useState(null);
  const [category, setCategory] = useState(null);
  const [url, setUrl] = useState(null);
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [errUrl, setErrUrl] = useState(false);
  const [content, setContent] = useState(null);

  const [dataCategory, setDataCategory] = useState([]);

  const refUrl = useRef();
  useEffect(() => {
    fetch(`/api/category`)
      .then((res) => res.json())
      .then((dataCategory) => {
        setDataCategory(dataCategory);
      });
  }, []);

  const uploadToClient = (event) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];

      setImage(i);
      setPreviewImage(URL.createObjectURL(i));
    }
  };

  const resetErrUrl = () => {
    setErrUrl(false);
    refUrl.current.classList.remove('border-red');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title == null || category == null || url == null || content == null) {
      toast.error('Field tidak boleh kosong', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
      return;
    }

    getDocs(
      query(
        collection(db, 'news'),
        where('url', '==', `/${category}/${url}`),
        limit(1)
      )
    ).then((snapshot) => {
      if (snapshot.docs.length > 0) {
        setErrUrl(true);
        refUrl.current.classList.add('border-red');
        return;
      } else {
        const body = new FormData();
        body.append('file', image);
        body.append('title', title);
        body.append('category', category);
        body.append('url', url);
        body.append('content', content);
        const urlPost = `${process.env.VERCEL_URL}/api/news/post`;
        fetch(urlPost, {
          method: 'POST',
          body,
        }).then(async (result) => {
          // 👇 modify the state to show the result
          setTitle(null);
          setCategory(null);
          setUrl(null);
          setContent(null);
          setImage(null);
          setPreviewImage(null);

          toast.success('Berhasil upload', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored',
          });
          return;
        });
      }
    });
  };

  return (
    <>
      <Head>
        <title>Admin</title>
      </Head>
      <nav className=" w-full p-5 bg-black">
        <div>
          <Image src={Logo} alt="logo" />
        </div>
      </nav>
      <section className="w-full flex flex-row p-5">
        <h1 className="font-bold text-2xl">Tambah Berita</h1>
      </section>
      <main>
        <section className="w-full flex flex-row p-5 gap-6">
          <div className="w-1/2 flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="title">Judul</label>
              <input
                type="text"
                name="title"
                id="title"
                className="border-2 border-black p-2"
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="category">Kategori</label>
              <select
                className="border-2 border-black p-2 capitalize"
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Pilih Kategori</option>
                {dataCategory.map((item, index) => (
                  <option value={item.category} key={index}>
                    {item.category}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="image">Gambar</label>
              <input
                type="file"
                name="image"
                id="image"
                className="border-2 border-black p-2"
                onChange={uploadToClient}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="url">URL</label>
              <input
                ref={refUrl}
                type="text"
                name="url"
                id="url"
                className="border-2 border-black p-2"
                onChange={(e) => setUrl(e.target.value)}
                onFocus={resetErrUrl}
              />
              {errUrl && <p className="text-red">URL sudah digunakan</p>}
            </div>
            <div className="flex flex-row gap-2">
              <button className="btn-primary" onClick={(e) => handleSubmit(e)}>
                Simpan
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="content">Konten</label>
            <QuillNoSSRWrapper
              modules={modules}
              formats={formats}
              theme="snow"
              placeholder="Tulis konten disini"
              onChange={(e) => setContent(e)}
            />
          </div>
        </section>
      </main>
      <ToastContainer />
    </>
  );
};

export default Admin;
