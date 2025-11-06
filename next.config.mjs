import { withSentryConfig } from '@sentry/nextjs';

const isProduction = process.env.NODE_ENV === 'production';

const nextConfig = {
  experimental: {
    typedRoutes: true,
    instrumentationHook: true,
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
    ],
  },
};

export default withSentryConfig(nextConfig, {
  silent: true,
  telemetry: false,
  sourcemaps: {
    disable: !isProduction,
  },
  tunnelRoute: '/monitoring',
});
