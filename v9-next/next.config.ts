import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: { globalNotFound: true },
  // verzia buildu v adrese skriptov z public/js (Safari inak drží staré súbory v cache, server neposiela Cache-Control)
  env: { PG_V: String(Date.now()) },
};

export default nextConfig;
