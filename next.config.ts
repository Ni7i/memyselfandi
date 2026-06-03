import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "lastfm.freetls.fastly.net" },
      { protocol: "https", hostname: "*.lastfm.freetls.fastly.net" },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https://images.unsplash.com https://i.ytimg.com https://*.basemaps.cartocdn.com https://*.cartocdn.com https://lastfm.freetls.fastly.net https://*.lastfm.freetls.fastly.net",
              "frame-src https://www.youtube.com https://youtube.com",
              "connect-src 'self' https://*.basemaps.cartocdn.com https://api.github.com https://ws.audioscrobbler.com",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
