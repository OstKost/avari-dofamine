import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },
  async rewrites() {
    const backendUrl = process.env.INTERNAL_API_URL || (process.env.NODE_ENV === "production" ? "http://api:8080" : "http://localhost:8080");
    return [
      {
        source: "/api/healthz",
        destination: `${backendUrl}/healthz`,
      },
      {
        source: "/api/metrics",
        destination: `${backendUrl}/metrics`,
      },
      {
        source: "/api/catalog/:path*",
        destination: `${backendUrl}/catalog/:path*`,
      },
      {
        source: "/api/auth/:path*",
        destination: `${backendUrl}/auth/:path*`,
      },
      {
        source: "/api/pickup/:path*",
        destination: `${backendUrl}/pickup/:path*`,
      },
      {
        source: "/api/cart/:path*",
        destination: `${backendUrl}/cart/:path*`,
      },
      {
        source: "/api/orders/:path*",
        destination: `${backendUrl}/orders/:path*`,
      },
      {
        source: "/api/payments/:path*",
        destination: `${backendUrl}/payments/:path*`,
      },
      {
        source: "/api/:path*",
        destination: `${backendUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
