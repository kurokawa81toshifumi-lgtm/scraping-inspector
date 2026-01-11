/**
 * Common types for CLI commands
 * @module lib/types
 */

/**
 * Standard command result type
 * Used for consistent command execution results
 */
export interface CommandResult {
  /** Whether the command completed successfully */
  success: boolean;
  /** Human-readable result message */
  message: string;
  /** Optional data returned by the command */
  data?: unknown;
}

/**
 * Command context passed to command handlers
 * Contains information about the current execution
 */
export interface CommandContext {
  /** Name of the command being executed */
  commandName: string;
  /** Whether verbose output is enabled */
  verbose: boolean;
  /** Whether quiet mode is enabled */
  quiet: boolean;
}

/**
 * Command handler function signature
 */
export type CommandHandler<T = void> = (
  options: T,
  context: CommandContext
) => Promise<CommandResult>;
