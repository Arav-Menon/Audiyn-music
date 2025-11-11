/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    // remove this invalid key
    skipTrailingSlashRedirect: true,
  },
};

export default nextConfig;
