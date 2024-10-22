/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
    domains: ['cdn.sanity.io'], // Add your Sanity image domain
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
