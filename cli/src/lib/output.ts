/**
 * CLI output helpers with color support
 * @module lib/output
 */

import pc from "picocolors";

/**
 * Output helper for consistent CLI output formatting
 */
export const output = {
  /**
   * Print a success message
   */
  success(message: string): void {
    console.log(pc.green(`✔ ${message}`));
  },

  /**
   * Print an error message
   */
  error(message: string): void {
    console.error(pc.red(`✖ ${message}`));
  },

  /**
   * Print a warning message
   */
  warn(message: string): void {
    console.warn(pc.yellow(`⚠ ${message}`));
  },

  /**
   * Print an info message
   */
  info(message: string): void {
    console.log(pc.blue(`ℹ ${message}`));
  },

  /**
   * Print a dim/secondary message
   */
  dim(message: string): void {
    console.log(pc.dim(message));
  },

  /**
   * Print a bold message
   */
  bold(message: string): void {
    console.log(pc.bold(message));
  },

  /**
   * Print a plain message
   */
  log(message: string): void {
    console.log(message);
  },

  /**
   * Print a newline
   */
  newline(): void {
    console.log();
  },

  /**
   * Print a horizontal divider
   */
  divider(char = "─", length = 40): void {
    console.log(pc.dim(char.repeat(length)));
  },

  /**
   * Print a key-value pair
   */
  keyValue(key: string, value: string): void {
    console.log(`${pc.bold(key)}: ${value}`);
  },

  /**
   * Print a list item
   */
  listItem(item: string, indent = 2): void {
    console.log(`${" ".repeat(indent)}• ${item}`);
  },

  /**
   * Print a table header
   */
  tableHeader(...columns: string[]): void {
    console.log(pc.bold(columns.join("\t")));
  },

  /**
   * Print a table row
   */
  tableRow(...columns: string[]): void {
    console.log(columns.join("\t"));
  },
};

export default output;
