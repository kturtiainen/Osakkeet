/**
 * Lightweight logger for better debugging and error tracking
 * Can be extended to integrate with Sentry or similar monitoring services
 */

export const logger = {
  error: (message: string, context?: unknown) => {
    console.error(`[ERROR] ${message}`, context);
    // TODO: Add integration with Sentry or similar monitoring service
  },
  
  warn: (message: string, context?: unknown) => {
    console.warn(`[WARN] ${message}`, context);
  },
  
  info: (message: string, context?: unknown) => {
    console.info(`[INFO] ${message}`, context);
  },
};
