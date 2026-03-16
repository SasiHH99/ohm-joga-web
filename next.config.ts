import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "267a11ce2e.cbaul-cdnwnd.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "duyn491kcolsw.cloudfront.net",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
