/** @type {import('next').NextConfig} */
const dev = process.env.NODE_ENV !== "production";
const rewriteUrl = dev ? "http://localhost:3001" : "https://learny-app.fly.dev";
const nextConfig = {
  experimental: {
    appDir: true,
  },
  async rewrites() {
    console.log("Rewrites function called");
    return [
      {
        source: "/api/:path*",
        destination: `${rewriteUrl}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
