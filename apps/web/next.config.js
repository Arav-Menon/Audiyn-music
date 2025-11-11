export default {
  // ... other config
  experimental: {
    skipTrailingSlashRedirect: true,
  },
  // Or disable static 404
  generateBuildId: async () => {
    return 'build-id'
  },
}