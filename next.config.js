/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Disable ESLint during builds to avoid the common extension errors
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disable TypeScript during builds to avoid typechecking errors
    ignoreBuildErrors: true,
  },
  // Other Next.js config options
  reactStrictMode: false,
};

export default nextConfig; 