import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['@excalidraw/excalidraw', '@excalidraw/mermaid-to-excalidraw'],
  
  // Remove this - let TypeScript errors surface during development
  // typescript: {
  //   ignoreBuildErrors: true,
  // },
};

export default nextConfig;
