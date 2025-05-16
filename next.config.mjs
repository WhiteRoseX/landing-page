/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  eslint: {
    // Disable ESLint during production builds for deployment
    ignoreDuringBuilds: true,
  },
};

export default nextConfig; 