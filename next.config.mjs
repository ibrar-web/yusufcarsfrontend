/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  // Enable experimental features if needed
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
