/**
 * Test helpers
 * @module test/helpers
 */

import { vi } from "vitest";

/**
 * Create a mock for console output
 * Captures console.log, console.error, etc.
 */
export function createConsoleMock() {
  const logs: string[] = [];
  const errors: string[] = [];
  const warns: string[] = [];

  const mockLog = vi.spyOn(console, "log").mockImplementation((...args) => {
    logs.push(args.map(String).join(" "));
  });

  const mockError = vi.spyOn(console, "error").mockImplementation((...args) => {
    errors.push(args.map(String).join(" "));
  });

  const mockWarn = vi.spyOn(console, "warn").mockImplementation((...args) => {
    warns.push(args.map(String).join(" "));
  });

  return {
    logs,
    errors,
    warns,
    restore() {
      mockLog.mockRestore();
      mockError.mockRestore();
      mockWarn.mockRestore();
    },
  };
}

/**
 * Strip ANSI color codes from string
 */
export function stripAnsi(str: string): string {
  // eslint-disable-next-line no-control-regex
  return str.replace(/\x1b\[[0-9;]*m/g, "");
}

/**
 * Wait for a specified time
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
