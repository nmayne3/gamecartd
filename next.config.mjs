import { hostname } from 'os';

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {  
                protocol: 'https',
                hostname: "images.igdb.com",
                port: '',
                pathname: '/igdb/image/upload/**'
            },
            {  
                protocol: 'https',
                hostname: "cdn.discordapp.com",
                port: '',
                pathname: '/avatars/**'
            },        
        ],
    },
};

export default nextConfig;
