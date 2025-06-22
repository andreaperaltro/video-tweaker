/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static exports for better performance
  output: 'export',
  // Disable server components since we're doing client-side processing
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true
  }
}

export default nextConfig 