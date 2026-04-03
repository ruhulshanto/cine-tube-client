import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
    ],
  },
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
    return [
      // Auth endpoints
      {
        source: "/api/auth/:path*",
        destination: `${backendUrl}/api/auth/:path*`,
      },
      // All other API endpoints
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
      // Bookings endpoints (for backward compatibility)
      {
        source: "/bookings/:path*",
        destination: `${backendUrl}/api/bookings/:path*`,
      },
      // Reviews endpoints (for backward compatibility)
      {
        source: "/reviews/:path*",
        destination: `${backendUrl}/api/reviews/:path*`,
      },
      // Categories endpoints (for backward compatibility)
      {
        source: "/categories/:path*",
        destination: `${backendUrl}/api/categories/:path*`,
      },
    ];
  },
};

export default nextConfig;