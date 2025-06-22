/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable server components since we're doing client-side processing
  reactStrictMode: true,
  // Configure image optimization
  images: {
    unoptimized: true,
    domains: ['vercel.app']
  },
  // Ensure proper transpilation
  transpilePackages: [],
  // Enable static page generation
  output: 'export'
}

export default nextConfig 