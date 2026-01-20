import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // This prevents the "ESM" error that often breaks Excalidraw in Next.js
  transpilePackages: ['@excalidraw/excalidraw', '@excalidraw/mermaid-to-excalidraw'],
};

export default nextConfig;
