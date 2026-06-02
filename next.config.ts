import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["next-auth", "openid-client"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kagswwdgivkxozicerng.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
