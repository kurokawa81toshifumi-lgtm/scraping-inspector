/**
 * Logger configuration and factory
 * @module lib/logger
 */

import pino, { type Logger } from "pino";

/** Check if running in development mode */
const isDev = process.env.NODE_ENV !== "production";

/**
 * Base pino logger instance
 * - Development: Uses pino-pretty for formatted, colorized output
 * - Production: Outputs JSON for log aggregation systems
 */
const baseLogger = pino({
  level: process.env.LOG_LEVEL || "info",
  transport: isDev
    ? {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname",
        },
      }
    : undefined,
});

/**
 * Logger context options
 */
export interface LoggerContext {
  /** Command name for identification */
  command: string;
  /** Optional additional context */
  [key: string]: unknown;
}

/**
 * Create a logger with command context
 * Creates a child logger that automatically includes command metadata in all log entries.
 *
 * @param context - Logger context including command name
 * @returns A pino Logger instance with context bound
 */
export function createLogger(context: LoggerContext): Logger {
  return baseLogger.child(context);
}

/**
 * Get the base logger instance
 * Use this only when you need a logger without command context
 *
 * @returns The base pino logger
 */
export function getBaseLogger(): typeof baseLogger {
  return baseLogger;
}

/**
 * Default logger for backward compatibility
 * @deprecated Use createLogger() for new code to ensure proper command context
 */
export const logger = baseLogger;
export default logger;
