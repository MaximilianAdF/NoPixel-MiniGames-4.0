import { withSentryConfig } from '@sentry/nextjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'github.com',
        port: '',
        pathname: '/MaximilianAdF/NoPixel-MiniGames-4.0/assets/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.discordapp.com',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000, // 1 year cache for images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Enable SWC minification (faster)
  swcMinify: true,
  webpack: (config, { webpack }) => {
    // Error monitoring only: tree-shake Sentry's performance/tracing code out
    // of the client bundle (Cloudflare RUM already covers real-user perf).
    config.plugins.push(new webpack.DefinePlugin({ __SENTRY_TRACING__: false }));
    return config;
  },
  // Experimental optimizations
  experimental: {
    optimizePackageImports: ['lucide-react', '@fortawesome/react-fontawesome', '@fortawesome/free-solid-svg-icons'],
    // Required on Next 14 so instrumentation.ts (Sentry server/edge init) runs.
    instrumentationHook: true,
  },
  // Collapse legacy / mistyped URLs onto the canonical routes so they stop
  // showing up as duplicate / not-found entries in Search Console.
  async redirects() {
    return [
      { source: '/puzzle/:slug', destination: '/puzzles/:slug', permanent: true },
      { source: '/NoPixel-MiniGames-4.0/:path*', destination: '/', permanent: true },
    ];
  },
  // Headers for better caching
  async headers() {
    return [
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*.svg',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

// Sentry: error monitoring only. Source-map upload is skipped until a
// SENTRY_AUTH_TOKEN is set (stack traces stay minified; errors still captured).
export default withSentryConfig(nextConfig, {
  org: 'maximilian-e3',
  project: 'javascript-nextjs',
  silent: true,
  widenClientFileUpload: true,
  disableLogger: true,
  // Only generate + upload source maps when an auth token is present; otherwise
  // skip them entirely so no source maps are ever served to users.
  sourcemaps: { disable: !process.env.SENTRY_AUTH_TOKEN },
});
