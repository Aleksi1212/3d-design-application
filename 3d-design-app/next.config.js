/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode: true,
  experimental: {
    appDir: true
  },
  images: {
    domains: ['firebasestorage.googleapis.com']
  }
}

module.exports = nextConfig
