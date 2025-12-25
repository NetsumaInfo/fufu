import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // Output configuration for Docker deployment
    output: 'standalone',

    // Optimisation des images
    images: {
        formats: ['image/avif', 'image/webp'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920],
        imageSizes: [16, 32, 48, 64, 96, 128, 256],
        remotePatterns: [
            {
                protocol: "https",
                hostname: "i.ytimg.com",
            },
            {
                protocol: "https",
                hostname: "img.youtube.com",
            },
        ],
    },

    // Compression et optimisation
    compress: true,
    poweredByHeader: false,
};

export default nextConfig;
