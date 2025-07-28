/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '135.181.66.188',
        port: '8080',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '135.181.66.188',
        port: '8080',
        pathname: '/default-logo.png',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
        pathname: '/default-logo.png',
      },
      {
        protocol: 'http',
        hostname: '135.181.66.188',
        port: '8080',
        pathname: '/default-image.png', // ✅ ADD THIS LINE
      },
    ],
  },
};

module.exports = nextConfig;
