/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental:{appDir:true, fontLoaders: [
      { loader: '@next/font/google', options: { subsets: ['latin'] } },
    ],},
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'studlancer-public-files.s3.ap-southeast-2.amazonaws.com',
        port: '',
        pathname: '/studlancer-public-files/images/**',
      },
    ],
  },
  
   
}

module.exports = nextConfig
