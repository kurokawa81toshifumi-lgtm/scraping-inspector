.PHONY: install build dev start clean test test-watch scrape-check scrape scrape-raw scrape-trends help

# Default target
help:
	@echo "Available targets:"
	@echo "  install         - Install dependencies"
	@echo "  build           - Build TypeScript to JavaScript"
	@echo "  dev             - Run CLI in development mode"
	@echo "  start           - Run built JavaScript"
	@echo "  scrape-check    - Run scrape-check command (default: top 3)"
	@echo "  scrape URL=...  - Run scrape-check with custom URL"
	@echo "  scrape-raw      - Output raw HTML"
	@echo "  scrape-trends   - Parse X.com trends (requires COOKIES)"
	@echo "  test            - Run tests"
	@echo "  test-watch      - Run tests in watch mode"
	@echo "  clean           - Remove build artifacts"
	@echo ""
	@echo "Usage examples:"
	@echo "  make scrape-check                    # Default (3 hits)"
	@echo "  make scrape-check TOP=5              # Show 5 hits"
	@echo "  make scrape-check TOP=10             # Show all 10 hits"
	@echo "  make scrape URL=https://example.com  # Custom URL"
	@echo "  make scrape-raw URL=https://example.com  # Raw HTML output"
	@echo "  make scrape-trends COOKIES=cookies.json  # Parse X.com trends"

# Install dependencies
install:
	npm install

# Build TypeScript
build:
	npm run build

# Development mode
dev:
	npm run dev

# Run production build
start:
	npm start

# Run scrape-check command
# Usage: make scrape-check URL=https://example.com TOP=5
TOP ?= 3
URL ?= https://apify.com/theo/ap-news-scraper
scrape-check:
	npm run dev -- scrape-check --url "$(URL)" --top $(TOP)

# Run scrape-check with custom URL
# Usage: make scrape URL=https://example.com TOP=5
URL ?= https://apify.com/theo/ap-news-scraper
scrape:
	npm run dev -- scrape-check --url "$(URL)" --top $(TOP)

# Run scrape-check with raw HTML output
# Usage: make scrape-raw URL=https://example.com
scrape-raw:
	npm run dev -- scrape-check --url "$(URL)" --raw

# Run scrape-check to parse X.com trends
# Usage: make scrape-trends COOKIES=cookies.json
COOKIES ?= x-cookies.json
scrape-trends:
	npm run dev -- scrape-check --url "https://x.com" --cookies "$(COOKIES)" --trends

# Run tests
test:
	npm test

# Run tests in watch mode
test-watch:
	npm run test:watch

# Clean build artifacts
clean:
	rm -rf dist
	rm -rf node_modules
