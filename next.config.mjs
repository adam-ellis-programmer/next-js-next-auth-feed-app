// next.config.mjs - Your exact configuration
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Unsplash images (for your existing seed data)
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      // Your Supabase storage domain
      {
        protocol: 'https',
        hostname: 'ffddsrgxpqdrfrajxxab.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      // Additional Supabase storage pattern (for signed URLs if needed)
      {
        protocol: 'https',
        hostname: 'ffddsrgxpqdrfrajxxab.supabase.co',
        port: '',
        pathname: '/storage/v1/object/sign/**',
      },
      // Other common image domains
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
