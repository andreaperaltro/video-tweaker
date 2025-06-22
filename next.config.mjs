/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static exports for better performance
  output: 'standalone',
  // Disable server components since we're doing client-side processing
  reactStrictMode: true,
  // Configure image optimization
  images: {
    unoptimized: true
  },
  experimental: {
    optimizeFonts: true
  }
}

export default nextConfig 