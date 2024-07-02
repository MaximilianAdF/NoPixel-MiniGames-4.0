/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'github.com',
        port: '',
        pathname: '/MaximilianAdF/NoPixel-MiniGames-4.0/assets/**',
      },
    ],
  },

};

export default nextConfig;
