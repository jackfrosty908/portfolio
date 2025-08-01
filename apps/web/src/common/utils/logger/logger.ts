/** biome-ignore-all lint/suspicious/noConsole: This is the one place where we use console.log */
import { logger as sentryLogger } from '@sentry/nextjs';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface Logger {
  debug: (message: string, ...args: unknown[]) => void;
  info: (message: string, ...args: unknown[]) => void;
  warn: (message: string, ...args: unknown[]) => void;
  error: (message: string, ...args: unknown[]) => void;
}

const createLogger = (): Logger => {
  return {
    debug: (message: string, ...args: unknown[]): void => {
      const attributes = args.length > 0 ? { data: args } : undefined;
      sentryLogger.debug(message, attributes);
    },
    info: (message: string, ...args: unknown[]): void => {
      const attributes = args.length > 0 ? { data: args } : undefined;
      sentryLogger.info(message, attributes);
    },
    warn: (message: string, ...args: unknown[]): void => {
      const attributes = args.length > 0 ? { data: args } : undefined;
      sentryLogger.warn(message, attributes);
    },

    error: (message: string, ...args: unknown[]): void => {
      const attributes = args.length > 0 ? { data: args } : undefined;
      sentryLogger.error(message, attributes);
    },
  };
};

const logger = createLogger();

export type { Logger, LogLevel };
export default logger;
