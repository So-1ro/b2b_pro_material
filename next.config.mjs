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
  experimental: {
    // 強制的に webpack ビルドを使用（Turbopack由来の 404 を防止）
    turbo: {
      enabled: false,
    },
  },
}

export default nextConfig
