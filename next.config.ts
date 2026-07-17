import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // The panel accepts an image URL from any host, so the pattern has to be
    // open. Next still proxies every fetch through its optimiser and refuses
    // private-IP targets, and only an authenticated admin can set these URLs.
    // SVG stays blocked (the default) — an admin-pasted SVG would otherwise be
    // a script-execution vector.
    remotePatterns: [
      { protocol: "https", hostname: "**.public.blob.vercel-storage.com" },
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
