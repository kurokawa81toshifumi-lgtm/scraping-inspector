/**
 * Application constants
 * @module lib/constants
 */

/**
 * Exit codes for CLI
 */
export const EXIT_CODES = {
  SUCCESS: 0,
  FAILURE: 1,
  CONFIGURATION_ERROR: 2,
  INVALID_ARGUMENT: 3,
} as const;

/**
 * Log levels supported by pino
 */
export const LOG_LEVELS = [
  "trace",
  "debug",
  "info",
  "warn",
  "error",
  "fatal",
] as const;

export type LogLevel = (typeof LOG_LEVELS)[number];

/**
 * Node environment values
 */
export const NODE_ENVS = ["development", "production", "test"] as const;

export type NodeEnv = (typeof NODE_ENVS)[number];

/**
 * Title selector candidates for scraping
 * Based on patterns from private-manager-contents-next/batch
 */
export const TITLE_SELECTORS = {
  // Basic heading selectors
  headings: ["h1", "h2", "h3", "h4"],

  // Article / News title selectors
  article: [
    "article h1",
    "article h2",
    "article .title",
    "article .headline",
    "[class*='article'] h1",
    "[class*='article'] h2",
    "[class*='Article'] h1",
    "[class*='headline']",
    "[class*='Headline']",
    ".entry-title",
    ".post-title",
    ".story-title",
    "[class*='story'] h1",
    "[class*='story-body'] h1",
    "[data-testid='article-body'] h1",
    "[data-testid*='card'] a",
  ],

  // News site specific selectors
  news: [
    "a[href*='/news/']",
    "a[href*='/news/articles/']",
    "a[href*='/article/']",
    "[class*='PagePromo'] a",
    "[class*='story'] a",
    ".fxs_headline_tiny",
    ".fxs_entryHeadline a",
    "[class*='headline'] a",
  ],

  // Blog / Content selectors
  blog: [
    ".blog-title",
    ".entry-title",
    ".post-title",
    "[class*='post'] h1",
    "[class*='post'] h2",
    "[class*='entry'] h1",
    "[class*='entry'] h2",
    "a[href*='/li/']", // Togetter style
    ".ranking-list a",
    ".list-item a",
    "h1 > a[href*='archives']",
  ],

  // YouTube selectors
  youtube: [
    "#video-title",
    "a#video-title-link",
    "ytd-rich-item-renderer #video-title",
    "a[href*='watch'] #video-title",
  ],

  // Twitter/X selectors
  twitter: [
    "[data-testid='tweetText']",
    "article[data-testid='tweet'] [data-testid='tweetText']",
    "a[href*='/status/']",
  ],

  // E-commerce / Product selectors
  product: [
    ".product-title",
    ".item-title",
    "[class*='product'] h1",
    "[class*='product'] h2",
    "h2.a-size-medium span", // Amazon
    "div[data-component-type='s-search-result'] h2 span",
    ".grid h3",
    ".grid.grid-cols-3 h3",
    "[class*='hover:text-primary']",
  ],

  // Comic / Manga selectors
  comic: [
    "a[href*='/magazine/'] span",
    ".post-list-image + span",
    "[class*='text-gray-100']",
    "h3[class*='hover:text-primary']",
  ],

  // Generic content selectors
  generic: [
    ".title",
    ".heading",
    ".header",
    "[class*='title']",
    "[class*='Title']",
    "[class*='heading']",
    "[class*='Heading']",
    "span.title",
    "div.title",
    "a.title",
    "strong a", // Burrn style
    ".box_body h1",
    ".tweet_box h1",
  ],

  // Data attribute selectors
  dataAttributes: [
    "[data-title]",
    "[data-headline]",
    "[data-testid*='title']",
    "[data-testid*='headline']",
    "[data-component-type*='title']",
  ],

  // Link-based title extraction
  links: [
    "a[href] h1",
    "a[href] h2",
    "a[href] h3",
    "a[href] span",
    "a[href] .title",
    "article a",
    "[class*='card'] a",
    "[class*='Card'] a",
    "li a",
    "ul li a",
  ],
} as const;

/**
 * Flat array of all title selectors
 */
export const ALL_TITLE_SELECTORS = [
  ...TITLE_SELECTORS.headings,
  ...TITLE_SELECTORS.article,
  ...TITLE_SELECTORS.news,
  ...TITLE_SELECTORS.blog,
  ...TITLE_SELECTORS.youtube,
  ...TITLE_SELECTORS.twitter,
  ...TITLE_SELECTORS.product,
  ...TITLE_SELECTORS.comic,
  ...TITLE_SELECTORS.generic,
  ...TITLE_SELECTORS.dataAttributes,
  ...TITLE_SELECTORS.links,
] as const;
