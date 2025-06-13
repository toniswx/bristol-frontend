import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: [
      "images.unsplash.com",
      "img.olx.com.br",
      "picsum.photos",
      "fastly.picsum.photos",
    ],
  },
};

export default nextConfig;
