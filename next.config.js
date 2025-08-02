/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.keystonemc.com.np',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'api.keystonemc.com.np',
        pathname: '/default-logo.png',
      },
      {
        protocol: 'https',
        hostname: 'api.keystonemc.com.np',
        pathname: '/default-image.png',
      },
    ],
  },
};

module.exports = nextConfig;
