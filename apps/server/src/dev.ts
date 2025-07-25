import 'dotenv/config';
import { serve } from '@hono/node-server';
import app from './index';

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    // biome-ignore lint/suspicious/noConsole: server is yet to be fleshed out
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
