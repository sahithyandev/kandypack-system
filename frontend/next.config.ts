import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	output: "standalone", // Enable for Docker builds
	images: {
		remotePatterns: [
			{
				hostname: "images.unsplash.com",
				protocol: "https",
				port: "",
				pathname: "/**",
			},
		],
	},
};

export default nextConfig;
