/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
        dirs: ['app', 'components'],
    },
    experimental: {
        optimizeCss: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: process.env.NEXT_PUBLIC_CONVEX_URL?.replace('https://', ''),
            },
            {
                protocol: 'https',
                hostname: 'api.dicebear.com',
            },
            {
                protocol: 'https',
                hostname: '*.convex.cloud',
            },
        ]
    }
};

export default nextConfig;
