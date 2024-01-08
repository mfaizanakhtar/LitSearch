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
      webpack: (config) => {
        config.externals = [...config.externals, { canvas: "canvas" }];  
        return config;
      },
}

module.exports = nextConfig
