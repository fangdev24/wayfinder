import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Empty turbopack config to use Turbopack (Next.js 16 default)
  turbopack: {},

  // Prevent crawling and AI scraping
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow, noarchive, nosnippet, noimageindex',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
