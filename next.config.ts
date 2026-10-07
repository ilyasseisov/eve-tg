import type { NextConfig } from "next";
import { withEve } from "eve/next";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ["pino", "pino-pretty"],
  reactCompiler: true,
  // cacheComponents: true,
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
};

export default withEve(nextConfig);
