import { trpcServer } from "@hono/trpc-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { createContext } from "./lib/context";
import { appRouter } from "./routers/index";

type Bindings = {
	CORS_ORIGIN?: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use(logger());

app.use(
	"/*",
	cors({
		origin: (_, c) => {
			const allowedOrigin = c.env?.CORS_ORIGIN || process.env.CORS_ORIGIN;
			return allowedOrigin;
		},
		allowMethods: ["GET", "POST", "OPTIONS"],
		allowHeaders: ["Content-Type"],
		credentials: true,
	}),
);

// app.get('/', (c) => {
//   return c.text('OK');
// });

// export default app;

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

const app = new Hono();

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

app.use(
	"/trpc/*",
	trpcServer({
		router: appRouter,
		createContext: (_opts, context) => {
			return createContext({ context });
		},
	}),
);

app.get("/", (c) => {
	return c.text("OK");
});

export default app;
