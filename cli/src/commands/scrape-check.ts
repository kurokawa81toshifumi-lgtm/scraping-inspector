/**
 * Scrape check command
 * Quick check if a URL can be scraped with Playwright
 * @module commands/scrape-check
 */

import { Command } from "commander";
import { chromium } from "playwright";
import { readFileSync } from "fs";
import { output } from "../lib/output.js";
import { createLogger } from "../lib/logger.js";
import type { CommandResult } from "../lib/types.js";

const logger = createLogger({ command: "scrape-check" });

const DEFAULT_URL = "https://apify.com/theo/ap-news-scraper";

/**
 * Top 10 selectors for title extraction
 */
const TOP_SELECTORS = [
  "[title]",
  "h1",
  "h2",
  "h3",
  "article h1",
  ".entry-title",
  ".post-title",
  "[class*='title']",
  "[class*='headline']",
  "[class*='card'] a",
];

/**
 * Scrape check command options
 */
export interface ScrapeCheckOptions {
  url?: string;
  timeout?: number;
  waitUntil?: 'load' | 'domcontentloaded' | 'networkidle';
  raw?: boolean;
  cookies?: string;
  wait?: number;
  trends?: boolean;
  top?: number;
}

/**
 * Execute the scrape check command
 */
export async function scrapeCheckAction(
  options: ScrapeCheckOptions
): Promise<CommandResult> {
  const targetUrl = options.url || DEFAULT_URL;
  const timeout = options.timeout || 30000;

  logger.info({ url: targetUrl, timeout }, "Starting scrape check");
  output.info(`Scraping: ${targetUrl}`);

  const DEFAULT_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      userAgent: DEFAULT_USER_AGENT,
      viewport: { width: 1920, height: 1080 },
    });

    // Load cookies if provided
    if (options.cookies) {
      const cookieData = JSON.parse(readFileSync(options.cookies, "utf-8"));
      const playwrightCookies = cookieData.map((c: Record<string, unknown>) => ({
        name: c.name as string,
        value: c.value as string,
        domain: c.domain as string,
        path: c.path as string,
        expires: c.expirationDate as number | undefined,
        httpOnly: c.httpOnly as boolean,
        secure: c.secure as boolean,
        sameSite: c.sameSite === "no_restriction" ? "None" : c.sameSite === "lax" ? "Lax" : "Strict",
      }));
      await context.addCookies(playwrightCookies);
      output.info(`Loaded ${playwrightCookies.length} cookies`);
    }

    const page = await context.newPage();

    const waitUntil = options.waitUntil || "domcontentloaded";
    await page.goto(targetUrl, { timeout, waitUntil });

    // Wait additional time if specified
    if (options.wait) {
      await page.waitForTimeout(options.wait);
    }

    // Raw mode: output HTML and exit
    if (options.raw) {
      const html = await page.content();
      await browser.close();
      console.log(html);
      return {
        success: true,
        message: `Raw HTML output for ${targetUrl}`,
      };
    }

    // Trends mode: parse X.com trends
    if (options.trends) {
      const trends = await page.$$eval(
        'div[data-testid="trend"]',
        (els) => els.map((el) => {
          const spans = el.querySelectorAll('span.css-1jxf684');
          const texts = Array.from(spans).map(s => s.textContent?.trim()).filter(Boolean);
          // Pattern: [category, trendName, postCount] or [trendName, postCount]
          if (texts.length >= 2) {
            const category = texts.find(t => t?.includes('トレンド') || t?.includes('Trending'));
            const postCount = texts.find(t => t?.includes('件のポスト') || t?.includes('posts'));
            const trendName = texts.find(t => t && t !== category && t !== postCount);
            return { category, trendName, postCount };
          }
          return null;
        }).filter(Boolean)
      );

      await browser.close();

      if (trends.length > 0) {
        output.success(`Found ${trends.length} trends:`);
        trends.forEach((t, i) => {
          const trend = t as { category?: string; trendName?: string; postCount?: string };
          output.info(`  ${i + 1}. ${trend.trendName || 'Unknown'}`);
          if (trend.category) output.dim(`     Category: ${trend.category}`);
          if (trend.postCount) output.dim(`     Posts: ${trend.postCount}`);
        });
        console.log(JSON.stringify(trends, null, 2));
      } else {
        output.warn("No trends found");
      }

      return {
        success: true,
        message: `Parsed ${trends.length} trends from ${targetUrl}`,
      };
    }

    // Get title
    const title = await page.title();
    output.info(`Title: ${title || "(empty)"}`);

    // Get meta description
    const metaDesc = await page
      .$eval('meta[name="description"]', (el) => el.getAttribute("content"))
      .catch(() => null);
    if (metaDesc) {
      output.info(`Meta Description: ${metaDesc.substring(0, 100)}...`);
    }

    // Count hits for each selector
    const results: { selector: string; count: number }[] = [];

    for (const selector of TOP_SELECTORS) {
      const count = await page
        .$$eval(selector, (els) => els.length)
        .catch(() => 0);
      results.push({ selector, count });
    }

    // Sort by hit count
    results.sort((a, b) => b.count - a.count);

    // Display top N selector hits
    const topCount = options.top || 3;
    output.info(`Selector hits (top ${topCount}):`);
    results.slice(0, topCount).forEach(({ selector, count }) => {
      output.dim(`  ${selector}: ${count}`);
    });

    // Get title candidates from top selectors (max 5 each)
    const topSelectors = results.slice(0, topCount).filter((r) => r.count > 0);
    for (const match of topSelectors) {
      const titles = await page.$$eval(match.selector, (els) =>
        els.slice(0, 5).map((el) => {
          // For [title] selector, get the title attribute value
          if (el.hasAttribute("title")) {
            return el.getAttribute("title")?.trim() || "";
          }
          return el.textContent?.trim() || "";
        })
      );
      const validTitles = titles.filter(Boolean);
      if (validTitles.length > 0) {
        output.success(`Title candidates (${match.selector}):`);
        validTitles.forEach((text, i) => {
          output.info(`  ${i + 1}. ${text.substring(0, 100)}`);
        });
      }
    }

    // Get any links count
    const linkCount = await page.$$eval("a", (els) => els.length);
    output.info(`Total links: ${linkCount}`);

    await browser.close();

    output.success("Scrape check completed successfully");
    logger.info("Scrape check completed");

    return {
      success: true,
      message: `Successfully scraped ${targetUrl}`,
    };
  } catch (error) {
    if (browser) await browser.close();

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    output.error(`Scrape failed: ${errorMessage}`);
    logger.error({ error }, "Scrape check failed");

    return {
      success: false,
      message: errorMessage,
    };
  }
}

/**
 * Register the scrape-check command with Commander
 */
export function registerScrapeCheckCommand(program: Command): void {
  program
    .command("scrape-check")
    .description("Check if a URL can be scraped with Playwright")
    .option(
      "-u, --url <url>",
      "URL to scrape",
      DEFAULT_URL
    )
    .option("-t, --timeout <ms>", "Timeout in milliseconds", "30000")
    .option("--wait-until <condition>", "Wait condition: load, domcontentloaded, networkidle", "domcontentloaded")
    .option("-r, --raw", "Output raw HTML response")
    .option("-c, --cookies <file>", "JSON file with cookies to use")
    .option("-w, --wait <ms>", "Additional wait time after page load", "0")
    .option("--trends", "Parse X.com trends")
    .option("--top <count>", "Number of selector hits to display", "3")
    .action(async (options: { url: string; timeout: string; waitUntil: string; raw?: boolean; cookies?: string; wait: string; trends?: boolean; top: string }) => {
      await scrapeCheckAction({
        url: options.url,
        timeout: parseInt(options.timeout, 10),
        waitUntil: options.waitUntil as 'load' | 'domcontentloaded' | 'networkidle',
        raw: options.raw,
        cookies: options.cookies,
        wait: parseInt(options.wait, 10),
        trends: options.trends,
        top: parseInt(options.top, 10),
      });
    });
}

export default registerScrapeCheckCommand;
