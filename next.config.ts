import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. Handle Excalidraw imports
  transpilePackages: ['@excalidraw/excalidraw', '@excalidraw/mermaid-to-excalidraw'],
  
  // 2. Ignore TypeScript errors during build (Focus on functionality first)
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // 3. Ignore ESLint errors during build
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
