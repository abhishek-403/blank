/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    CRYPTO_SECRET_KEY: process.env.CRYPTO_SECRET_KEY,
    MAX_WORD_LENGTH: process.env.MAX_WORD_LENGTH,
    SERVER_BASE_URL: process.env.SERVER_BASE_URL,
    SERVER_WS_URL: process.env.SERVER_WS_URL,
  },
};

export default nextConfig;
