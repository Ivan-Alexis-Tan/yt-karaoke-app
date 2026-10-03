import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        port: "",
      },

      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
      },

      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
      },
    ]
  }
};

export default nextConfig;
