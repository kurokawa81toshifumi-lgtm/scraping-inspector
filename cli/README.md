# Scraping Checker CLI

Playwright を使用した Web スクレイピング検証ツール。URL を指定してスクレイピング可能性をチェックし、タイトルやコンテンツの抽出テストを行います。

## 機能

- Playwright によるヘッドレスブラウザでのページ取得
- ページタイトル・メタ情報の抽出
- Top 10 セレクターによるヒット数表示
- タイトル候補の抽出・表示
- リンク数の集計
- クッキー読み込みによる認証済みセッション対応
- 生 HTML 出力モード
- X.com トレンドパース機能

## セットアップ

```bash
# 依存関係のインストール
make install
# または
npm install

# Playwright ブラウザのインストール（初回のみ）
npx playwright install chromium
```

## 使い方

### 基本的な使用方法

```bash
# デフォルト URL でチェック
make scrape-check

# カスタム URL でチェック
make scrape URL=https://news.yahoo.co.jp

# セレクターヒット数を指定
make scrape-check TOP=5

# 生 HTML を出力
make scrape-raw URL=https://example.com

# X.com トレンドをパース
make scrape-trends COOKIES=cookies.json

# npm 経由で実行
npm run dev -- scrape-check --url "https://example.com"
```

### オプション

| オプション | 短縮形 | 説明 | デフォルト |
|------------|--------|------|-----------|
| `--url` | `-u` | チェック対象の URL | https://apify.com/theo/ap-news-scraper |
| `--timeout` | `-t` | タイムアウト（ミリ秒） | 30000 |
| `--wait-until` | - | 待機条件 (load, domcontentloaded, networkidle) | domcontentloaded |
| `--wait` | `-w` | ページ読み込み後の追加待機時間（ミリ秒） | 0 |
| `--top` | - | 表示するセレクターヒット数 | 3 |
| `--raw` | `-r` | 生 HTML を出力して終了 | - |
| `--cookies` | `-c` | 使用するクッキーの JSON ファイル | - |
| `--trends` | - | X.com トレンドをパース | - |

### 実行例

```bash
# タイムアウトを60秒に設定
npm run dev -- scrape-check --url "https://example.com" --timeout 60000

# セレクターヒットを5件表示
npm run dev -- scrape-check --top 5

# 生 HTML を出力
npm run dev -- scrape-check --url "https://example.com" --raw

# クッキーを使用（X.com など認証が必要なサイト向け）
npm run dev -- scrape-check --url "https://x.com" --cookies cookies.json

# X.com トレンドをパース
npm run dev -- scrape-check --url "https://x.com" --cookies cookies.json --trends

# ネットワークがアイドルになるまで待機 + 追加2秒待機
npm run dev -- scrape-check --url "https://example.com" --wait-until networkidle --wait 2000

# ヘルプを表示
npm run dev -- scrape-check --help
```

### 出力例

```
ℹ Scraping: https://example.com
ℹ Title: Example Domain
ℹ Meta Description: This is an example...
ℹ Selector hits (top 3):
    [title]: 15
    h1: 3
    [class*='title']: 8
✔ Title candidates ([title]):
ℹ   1. Main Title
ℹ   2. Secondary Title
ℹ Total links: 42
✔ Scrape check completed successfully
```

## タイトルセレクター

`src/lib/constants.ts` に様々なサイト向けのタイトル抽出用セレクターを定義しています。

### カテゴリ一覧

| カテゴリ | 用途 | 例 |
|----------|------|-----|
| `headings` | 基本的な見出し | `h1`, `h2`, `h3` |
| `article` | 記事タイトル | `article h1`, `.entry-title` |
| `news` | ニュースサイト | `a[href*='/news/']`, `.fxs_headline_tiny` |
| `blog` | ブログ/コンテンツ | `.post-title`, `a[href*='/li/']` |
| `youtube` | YouTube | `#video-title`, `ytd-rich-item-renderer` |
| `twitter` | Twitter/X | `[data-testid='tweetText']` |
| `product` | EC/商品 | `.product-title`, `h2.a-size-medium span` |
| `comic` | コミック/マンガ | `a[href*='/magazine/'] span` |
| `generic` | 汎用 | `.title`, `[class*='title']` |
| `dataAttributes` | data 属性 | `[data-title]`, `[data-testid*='title']` |
| `links` | リンク内タイトル | `a[href] h1`, `[class*='card'] a` |

### 使用方法

```typescript
import { TITLE_SELECTORS, ALL_TITLE_SELECTORS } from "./lib/constants.js";

// カテゴリ別に使用
for (const selector of TITLE_SELECTORS.article) {
  const elements = await page.$$(selector);
  // ...
}

// 全セレクターを一括で試行
for (const selector of ALL_TITLE_SELECTORS) {
  const elements = await page.$$(selector);
  // ...
}
```

## ディレクトリ構成

```
cli/
├── src/
│   ├── commands/
│   │   ├── index.ts             # コマンド登録
│   │   └── scrape-check.ts      # スクレイプチェックコマンド
│   ├── lib/
│   │   ├── constants.ts         # タイトルセレクター定義
│   │   ├── config.ts            # 環境変数設定
│   │   ├── logger.ts            # ロガー
│   │   ├── output.ts            # CLI出力ヘルパー
│   │   └── types.ts             # 型定義
│   └── index.ts                 # エントリポイント
├── test/                        # テストファイル
├── package.json
├── tsconfig.json
└── Makefile
```

## 開発

```bash
# 開発モード
make dev

# ビルド
make build

# テスト
make test

# クリーンアップ
make clean
```

## 環境変数

| 変数名 | 説明 | デフォルト |
|--------|------|-----------|
| `NODE_ENV` | 実行環境 | development |
| `LOG_LEVEL` | ログレベル (trace/debug/info/warn/error/fatal) | info |

```bash
# デバッグログを有効にして実行
LOG_LEVEL=debug npm run dev -- scrape-check
```

## グローバルインストール

```bash
# ビルド
npm run build

# グローバルリンク
npm link

# 使用
scraping-checker scrape-check
scraping-checker scrape-check --url "https://example.com"

# リンク解除
npm unlink -g scraping-checker
```

## 依存関係

| パッケージ | 用途 |
|------------|------|
| playwright | ブラウザ自動化・スクレイピング |
| commander | CLI 引数解析 |
| pino | 構造化ログ |
| picocolors | 色付き出力 |
| zod | バリデーション |
| dotenv | 環境変数読み込み |
