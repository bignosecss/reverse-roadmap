/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // 使用 next/image 渲染图片时使用了 hostname 导致报错
    // https://nextjs.org/docs/messages/next-image-unconfigured-host
    remotePatterns: [new URL('https://placehold.co/600x400?text=%E5%AE%B9%E5%99%A8%E5%8C%96%E6%8A%80%E6%9C%AF'), new URL('https://placehold.co/600x400?text=Jenkins')],
  }
};

export default nextConfig;
