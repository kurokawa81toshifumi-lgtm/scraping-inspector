/**
 * Configuration loader with Zod validation
 * Loads and validates environment variables from .env file
 * @module lib/config
 */

import { z } from "zod";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { LOG_LEVELS, NODE_ENVS } from "./constants.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Zod schema for application configuration
 * Validates environment variables with sensible defaults
 */
const configSchema = z.object({
  /** Current Node environment */
  nodeEnv: z.enum(NODE_ENVS).default("development"),
  /** Logging level for pino */
  logLevel: z.enum(LOG_LEVELS).default("info"),
  /** Application name */
  appName: z.string().min(1).default("mycli"),
});

/**
 * Inferred configuration type from Zod schema
 */
export type Config = z.infer<typeof configSchema>;

/** Cached configuration instance */
let cachedConfig: Config | null = null;

/** Whether dotenv has been loaded */
let dotenvLoaded = false;

/**
 * Load environment variables from .env file
 * Safe to call multiple times (only loads once)
 */
function loadDotenv(): void {
  if (dotenvLoaded) return;
  dotenv.config({ path: resolve(__dirname, "../../.env") });
  dotenvLoaded = true;
}

/**
 * Initialize and validate configuration
 * Call this explicitly at application startup for better control
 *
 * @throws {z.ZodError} If configuration validation fails
 * @returns Validated configuration object
 */
export function initConfig(): Config {
  loadDotenv();

  const rawConfig = {
    nodeEnv: process.env.NODE_ENV,
    logLevel: process.env.LOG_LEVEL,
    appName: process.env.APP_NAME,
  };

  cachedConfig = configSchema.parse(rawConfig);
  return cachedConfig;
}

/**
 * Get the current configuration
 * Initializes configuration if not already done
 *
 * @returns Validated configuration object
 */
export function getConfig(): Config {
  if (!cachedConfig) {
    return initConfig();
  }
  return cachedConfig;
}

/**
 * Reset configuration (useful for testing)
 * Forces re-initialization on next getConfig() call
 */
export function resetConfig(): void {
  cachedConfig = null;
}

// Auto-initialize for backward compatibility
loadDotenv();

export default { getConfig, initConfig, resetConfig };
