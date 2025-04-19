/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        pathname: '**',
      },
    ],
    // Configuración adicional para optimización de imágenes
    formats: ['image/avif', 'image/webp'],
  },
}

module.exports = nextConfig