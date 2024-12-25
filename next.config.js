/** @type {import('next').NextConfig} */
const nextConfig = {
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
    ignoreDuringBuilds: false,
  },
  images: { 
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
    ],
  },
  // Configure build cache
  distDir: '.next',
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },
  // Runtime configuration
  experimental: {
    serverComponentsExternalPackages: ['@node-rs/argon2', '@node-rs/bcrypt'],
  },
  // Suppress specific runtime warnings and handle Node.js APIs
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        setImmediate: false,
        'node:buffer': false,
        'node:stream': false,
        'node:util': false,
        'node:events': false,
        'node:url': false,
        'node:http': false,
        'node:path': false,
        'node:crypto': false,
      };
    }

    // Add rule for handling SVG files
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    });

    return config;
  },
  // Add public directory configuration
  publicRuntimeConfig: {
    staticFolder: '/public',
  },
}

module.exports = nextConfig;
