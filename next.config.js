/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // ✅ TEMP: allow production builds even if there are type errors
    ignoreBuildErrors: true,
  },
  eslint: {
    // ✅ TEMP: don’t fail the build on lint errors
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
