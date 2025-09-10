/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: isProd
      ? [
          // ✅ Production Strapi domain
          {
            protocol: "https",
            hostname: "api.keystonemc.com.np",
            pathname: "/uploads/**",
          },
          {
            protocol: "https",
            hostname: "api.keystonemc.com.np",
            pathname: "/default-logo.png",
          },
          {
            protocol: "https",
            hostname: "api.keystonemc.com.np",
            pathname: "/default-image.png",
          },
        ]
      : [
          // ✅ Localhost dev
          {
            protocol: "http",
            hostname: "localhost",
            port: "1337",
            pathname: "/uploads/**",
          },
          // ✅ VPS IP dev/test
          {
            protocol: "http",
            hostname: "135.181.66.188",
            port: "8080",
            pathname: "/uploads/**",
          },
          // ✅ Still allow prod domain in dev (in case you test against it)
          {
            protocol: "https",
            hostname: "api.keystonemc.com.np",
            pathname: "/uploads/**",
          },
        ],
  },
};

module.exports = nextConfig;
