/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    async rewrites() {
        return [
            {
                source: "/api/rpc-alt",
                destination: `https://rpc.helius.xyz/?api-key=${process.env.HELIUS_API_KEY}`,
            },
            {
                source: "/go",
                destination: "/",
            },
        ];
    },
    transpilePackages: ["jotai-devtools"],
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "dev.updg8.com",
                port: "",
                pathname: "/imgdata/**",
            },
            {
                protocol: "https",
                hostname: "updg8.com",
                port: "",
                pathname: "/imgdata/**",
            },
        ],
    },
    eslint: {
        dirs: ["app", "components", "hooks", "lib"],
    },
};

export default nextConfig;
