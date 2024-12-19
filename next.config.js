/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbotrace: {
      contextDirectory: __dirname,
    },
  },
  headers: async () => ([
    {
      source: '/api/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'no-store',
        },
      ],
    },
  ]),
  output: 'standalone',
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true 
  },
  // Configure build cache
  distDir: '.next',
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },
};

module.exports = nextConfig;
