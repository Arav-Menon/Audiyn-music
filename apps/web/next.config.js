const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  skipTrailingSlashRedirect: true,
  output: 'standalone',
  // This prevents 404/_error pre-render issues
  experimental: {
    typedRoutes: false,
  },
  reactStrictMode: false,
};

export default nextConfig;
