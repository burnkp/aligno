/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    runtime: 'nodejs',
    turbotrace: {
      contextDirectory: __dirname,
    },
  },
  // Specify which paths should use Edge Runtime
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'x-edge-runtime',
            value: '1',
          },
        ],
      },
    ];
  },
  // Disable telemetry
  telemetry: {
    enabled: false,
  },
  // Add build cache configuration
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
};

module.exports = nextConfig;
