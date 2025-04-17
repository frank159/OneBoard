import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    domains: ['lh3.googleusercontent.com'], // Domínio de onde as imagens do Google são servidas
  },

};

export default nextConfig;
