/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    CRYPTO_SECRET_KEY: process.env.CRYPTO_SECRET_KEY,
  },
};

export default nextConfig;
