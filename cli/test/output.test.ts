/**
 * Output helper tests
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { output } from "../src/lib/output.js";
import { createConsoleMock, stripAnsi } from "./helpers/index.js";

describe("output helper", () => {
  let consoleMock: ReturnType<typeof createConsoleMock>;

  beforeEach(() => {
    consoleMock = createConsoleMock();
  });

  afterEach(() => {
    consoleMock.restore();
  });

  describe("success", () => {
    it("should output success message with checkmark", () => {
      output.success("Operation completed");

      const text = stripAnsi(consoleMock.logs[0]);
      expect(text).toContain("Operation completed");
    });
  });

  describe("error", () => {
    it("should output error message", () => {
      output.error("Something went wrong");

      const text = stripAnsi(consoleMock.errors[0]);
      expect(text).toContain("Something went wrong");
    });
  });

  describe("warn", () => {
    it("should output warning message", () => {
      output.warn("Be careful");

      const text = stripAnsi(consoleMock.warns[0]);
      expect(text).toContain("Be careful");
    });
  });

  describe("info", () => {
    it("should output info message", () => {
      output.info("FYI");

      const text = stripAnsi(consoleMock.logs[0]);
      expect(text).toContain("FYI");
    });
  });

  describe("keyValue", () => {
    it("should output key-value pair", () => {
      output.keyValue("Name", "John");

      const text = stripAnsi(consoleMock.logs[0]);
      expect(text).toContain("Name");
      expect(text).toContain("John");
    });
  });

  describe("listItem", () => {
    it("should output list item with bullet", () => {
      output.listItem("First item");

      const text = consoleMock.logs[0];
      expect(text).toContain("First item");
    });
  });
});
