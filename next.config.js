/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Allow cross-origin requests from local network for mobile testing
  experimental: {
    allowedDevOrigins: ['192.168.0.60:3000'],
  },
};

module.exports = nextConfig;
