import { trpcServer } from '@hono/trpc-server';
import { createContext } from './lib/context';
import { appRouter } from './routers/index';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

type Bindings = {
  CORS_ORIGIN?: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use(logger());

app.use(
  '/*',
  cors({
    origin: (_, c) => {
      const allowedOrigin = c.env?.CORS_ORIGIN || process.env.CORS_ORIGIN;
      return allowedOrigin;
    },
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Content-Type'],
    credentials: true,
  })
);

// app.get('/', (c) => {
//   return c.text('OK');
// });

// export default app;

import { Hono } from 'hono';

const app = new Hono();

app.get('/', (c) => {
  return c.text('Hello World from Cloudflare Workers!');
});

app.get('/test', (c) => {
  return c.json({ message: 'Test endpoint working' });
});

export default app;
