/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com'],
  },
  async rewrites() {
    const backend = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';
    return [
      {
        source: '/api/:path*',
        destination: `${backend}/:path*`,
      },
    ];
  },
};

export default nextConfig;
