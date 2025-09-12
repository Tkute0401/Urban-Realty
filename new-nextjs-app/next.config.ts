import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true,
    optimizePackageImports: [
      '@mui/material',
      '@mui/icons-material',
    ],
  },
}

export default nextConfig

