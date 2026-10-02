import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  basePath: isGithubPages ? "/cursorbench-reloaded" : "",
  assetPrefix: isGithubPages ? "/cursorbench-reloaded/" : undefined,
  trailingSlash: true,
};

export default nextConfig;
