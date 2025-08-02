/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Development and raw IP-based images (can keep for dev/testing)
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
        pathname: '/default-image.png',
      },

      // ✅ Add the production backend domain over HTTPS
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
