// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

// biome-ignore lint/performance/noNamespaceImport: Sentry wizard setup
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://887b929c1cb8cd21ab9df5444e8631b0@o4509761870299136.ingest.de.sentry.io/4509761871478864',

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,

  integrations: [Sentry.consoleLoggingIntegration({ levels: ['error'] })],

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
  environment: process.env.SENTRY_ENV,
});
