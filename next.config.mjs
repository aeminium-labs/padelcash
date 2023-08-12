/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    experimental: {
        appDir: true,
    },
    async rewrites() {
        return [
            {
                source: "/api/rpc",
                destination: `https://rpc.helius.xyz/?api-key=${process.env.HELIUS_API_KEY}`,
            },
        ];
    },

    transpilePackages: ["jotai-devtools"],
};

export default nextConfig;
