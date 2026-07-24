      /** @type {import('next').NextConfig} */
      const nextConfig = {
    
      reactStrictMode: true,
      
      env: {
      MONGODB_URI: "mongodb://localhost:27017/"
      },
      
      };

module.exports = nextConfig;