/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
          {
            source: '/login',
            destination: '/api/auth/signin',
          },
          // ... any other rewrites you might have
        ];
      },
}

module.exports = nextConfig
