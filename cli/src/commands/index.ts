/**
 * Command registry
 * Exports all available commands for registration
 * @module commands/index
 */

import type { Command } from "commander";
import { registerScrapeCheckCommand } from "./scrape-check.js";

/**
 * Register all commands with the Commander program
 */
export function registerCommands(program: Command): void {
  registerScrapeCheckCommand(program);
}

// Re-export individual commands for direct use
export { registerScrapeCheckCommand, scrapeCheckAction } from "./scrape-check.js";
