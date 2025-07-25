import type { Context as HonoContext } from 'hono';

export type CreateContextOptions = {
  context: HonoContext;
};

// biome-ignore lint/correctness/noUnusedFunctionParameters: Will be added in the future
// biome-ignore lint/suspicious/useAwait: Will be added in the future
export async function createContext({ context }: CreateContextOptions) {
  // No auth configured
  return {
    session: null,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
