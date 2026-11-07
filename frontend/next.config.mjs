/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pubchem.ncbi.nlm.nih.gov",
      },
    ],
  },
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "three",
      "cytoscape",
      "framer-motion",
    ],
  },
  webpack: (config, { dev }) => {
    if (dev) {
      // Disable PackFileCacheStrategy filesystem serialization which exhausts memory
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;
