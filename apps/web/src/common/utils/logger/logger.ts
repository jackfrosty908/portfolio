/** biome-ignore-all lint/suspicious/noConsole: console logger will be replaced later */
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface Logger {
  debug: (message: string, ...args: unknown[]) => void;
  info: (message: string, ...args: unknown[]) => void;
  warn: (message: string, ...args: unknown[]) => void;
  error: (message: string, ...args: unknown[]) => void;
  log: (message: string, ...args: unknown[]) => void;
}

const createLogger = (): Logger => ({
  debug: (message: string, ...args: unknown[]): void => {
    console.debug(message, ...args);
  },
  info: (message: string, ...args: unknown[]): void => {
    console.info(message, ...args);
  },
  warn: (message: string, ...args: unknown[]): void => {
    console.warn(message, ...args);
  },
  error: (message: string, ...args: unknown[]): void => {
    console.error(message, ...args);
  },
  log: (message: string, ...args: unknown[]): void => {
    console.log(message, ...args);
  },
});

const logger = createLogger();

export { logger, type Logger, type LogLevel };
