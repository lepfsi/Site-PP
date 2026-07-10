import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/articles/[slug]": ["./content/articles/**/*"],
  },
};

export default nextConfig;
