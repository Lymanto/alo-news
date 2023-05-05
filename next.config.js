/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.antaranews.com',
        port: '',
        pathname: '/cache/**',
      },
    ],
  },
};

module.exports = nextConfig;
