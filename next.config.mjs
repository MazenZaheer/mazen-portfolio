/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  // Every page is prerendered, so the build is a plain folder of HTML (`out/`)
  // that any static host can serve. Published on Netlify.
  output: 'export',
  images: {
    // Static hosting has no image-resizing server. The photo URLs already
    // request sensible sizes (see `photo()` / `unsplash()` in src/content/site.ts).
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'fastly.picsum.photos' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
};

export default nextConfig;
