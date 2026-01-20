import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Critical for Excalidraw to work in App Router
  transpilePackages: ['@excalidraw/excalidraw', '@excalidraw/mermaid-to-excalidraw'],
};

export default nextConfig;
