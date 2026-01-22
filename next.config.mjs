// Ensure fonts are bundled during build to avoid remote fetch failures in CI/Vercel.
if (!process.env.NEXT_FONT_MANUAL_DOWNLOAD) {
  process.env.NEXT_FONT_MANUAL_DOWNLOAD = "1"
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
