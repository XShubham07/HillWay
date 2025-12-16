/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Fix chunk loading issues
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
      };
    }
    return config;
  },
  // Disable font optimization warnings
  optimizeFonts: true,
}

module.exports = nextConfig
