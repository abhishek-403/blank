/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    CRYPTO_SECRET_KEY: process.env.CRYPTO_SECRET_KEY,
    MAX_WORD_LENGTH: process.env.MAX_WORD_LENGTH,
  },
};

export default nextConfig;
