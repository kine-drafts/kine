import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. This prevents the "Unexpected token export" error from Excalidraw
  transpilePackages: ['@excalidraw/excalidraw', '@excalidraw/mermaid-to-excalidraw'],
};

export default nextConfig;
