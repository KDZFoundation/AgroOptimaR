import type { NextConfig } from "next";

const isCapacitorBuild = process.env.CAPACITOR_BUILD === 'true'

const nextConfig: NextConfig = {
  // Capacitor wymaga static export; web deployment używa pełnego serwera
  ...(isCapacitorBuild && {
    output: 'export',
    images: { unoptimized: true },
    trailingSlash: true,
    // Ignoruj pre-existing TS errors podczas mobile build
    typescript: { ignoreBuildErrors: true },
    eslint: { ignoreDuringBuilds: true },
  }),
  serverExternalPackages: ['pdf-parse'],
};

export default nextConfig;
