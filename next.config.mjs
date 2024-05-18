    /** @type {import('next').NextConfig} */
    const nextConfig = {
        images: {
            remotePatterns: [
                {
                    protocol: "https",
                    hostname: "tarumt-ecommerce-s3.s3.amazonaws.com"
                },
            ]
        },
    };
    
    export default nextConfig;
