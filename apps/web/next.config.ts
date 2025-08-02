// next.config.ts
import type { NextConfig } from 'next';
import { withPayload } from '@payloadcms/next/withPayload';
import { withSentryConfig } from '@sentry/nextjs';

/**
 * Base Next.js settings
 */
const baseConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    // Payload currently requires the legacy compiler while React Compiler is in preview
    reactCompiler: false,
  },
};

/**
 *  Apply Payload first so its Webpack aliases and Node polyfills are present.
 */
const payloadWrapped = withPayload(baseConfig);

/**
 *    Apply Sentry last so its plugin sees the final, fully-mutated config.
 *    ─────────────────────────────────────────────────────────────────────
 *    All the explanatory comments you provided are preserved below.
 */
export default withSentryConfig(payloadWrapped, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: 'jackdev',
  project: `portfolio-${process.env.SENTRY_ENV}`,

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware,
  // otherwise reporting of client-side errors will fail.
  tunnelRoute: '/monitoring',

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true,
});
