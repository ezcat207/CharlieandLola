import bundleAnalyzer from "@next/bundle-analyzer";
import createNextIntlPlugin from "next-intl/plugin";
import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone", // Restore standalone mode for successful deployment like Build1
  // Prevent the Next.js webpack build cache (600MB+) from being swept into
  // serverless function bundles during output file tracing — this was causing
  // every production deploy to fail with "Serverless Function exceeded 250MB".
  outputFileTracingExcludes: {
    "*": [
      ".next/cache/webpack/**",
      "node_modules/.cache/**",
    ],
  },
  reactStrictMode: false,
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
      },
    ],
  },
  async redirects() {
    return [];
  },
};

export default withBundleAnalyzer(withNextIntl(withMDX(nextConfig)));
