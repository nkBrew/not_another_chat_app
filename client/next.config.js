/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals = [...config.externals, 'bufferutil', 'utf-8-validate'];

    return config;
  },
  experimental: {
    appDir: true,
  },
};

module.exports = nextConfig;
