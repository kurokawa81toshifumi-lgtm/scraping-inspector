#!/usr/bin/env node
/**
 * CLI Application Entry Point
 *
 * Main entry point for the CLI application.
 * Uses Commander.js for command parsing and routing.
 *
 * Usage:
 *   npm start -- hello
 *   npm start -- greet --name "World"
 *   # or
 *   node dist/index.js hello
 *
 * @module index
 */

import { Command } from "commander";
import "./lib/config.js";
import { getBaseLogger } from "./lib/logger.js";
import { registerCommands } from "./commands/index.js";
import { EXIT_CODES } from "./lib/constants.js";
import { output } from "./lib/output.js";

const logger = getBaseLogger();

/**
 * Create and configure the CLI program
 */
function createProgram(): Command {
  const program = new Command();

  program
    .name("scraping-checker")
    .description("Web scraping checker CLI with Playwright")
    .version("1.0.0")
    .option("-q, --quiet", "Suppress output")
    .option("--debug", "Enable debug logging");

  // Register all commands
  registerCommands(program);

  // Global error handling
  program.exitOverride((err) => {
    if (err.code === "commander.helpDisplayed") {
      process.exit(EXIT_CODES.SUCCESS);
    }
    if (err.code === "commander.version") {
      process.exit(EXIT_CODES.SUCCESS);
    }
    throw err;
  });

  return program;
}

/**
 * Main execution
 */
async function main(): Promise<void> {
  const program = createProgram();

  try {
    await program.parseAsync(process.argv);

    // If no command was provided, show help
    if (process.argv.length <= 2) {
      program.help();
    }
  } catch (error) {
    if (error instanceof Error) {
      logger.error({ error: error.message }, "CLI error");
      output.error(error.message);
    } else {
      logger.error({ error }, "Unknown error");
      output.error("An unknown error occurred");
    }
    process.exit(EXIT_CODES.FAILURE);
  }
}

// Execute
main().catch((error) => {
  logger.fatal({ error }, "Unexpected fatal error");
  process.exit(EXIT_CODES.FAILURE);
});
