/** @type {import('next').NextConfig} */
const nextConfig = {
   images: {
     remotePatterns: [
       {
         protocol: 'https',
         hostname: 't.me',
       },
       {
         protocol: 'https',
         hostname: 'cdn4.cdn-telegram.org',
       },
       {
         protocol: 'https',
         hostname: 'telegram.org',
       },
     ],
   },
   /* output: 'export' */
 };
 
 export default nextConfig;