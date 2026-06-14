import type { NextConfig } from "next";

/**
 * Static export for GitHub Pages.
 *
 * Local dev/build serve from "/". When building for Pages (GH_PAGES=true),
 * the site lives at https://<user>.github.io/<repo>/, so we prefix every
 * asset path with `/<repo>`.
 */
const repo = "lumio";
const isPages = process.env.GH_PAGES === "true";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isPages ? `/${repo}` : undefined,
  assetPrefix: isPages ? `/${repo}/` : undefined,
  trailingSlash: true,
  images: { unoptimized: true },
  devIndicators: false,
};

export default nextConfig;
