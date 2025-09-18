/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // 使用 next/image 渲染图片时使用了 hostname 导致报错
    // https://nextjs.org/docs/messages/next-image-unconfigured-host
    remotePatterns: [new URL('https://placehold.co/600x400?text=CI%2FCD')],
  }
};

export default nextConfig;
