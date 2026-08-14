# Midas Engine — Trading Terminal Frontend

Next.js 14 (App Router) frontend for the Autonomous Trading Engine. Built against
the shared contract in `src/types/index.ts` — that file is treated as source of
truth and was not regenerated.

## Stack

- Next.js 14 / App Router, React Server Components for all data fetching
- Tailwind CSS with a custom "Ledger & Ticker" token system (`tailwind.config.ts`)
- shadcn-style primitives in `src/components/ui`
- `lightweight-charts` for the candlestick/line price chart
- `cmdk` + Radix Dialog for the ⌘K command palette

## Getting started

```bash
npm install
cp .env.example .env.local   # point at your FastAPI backend, or leave unset
npm run dev
```

With `NEXT_PUBLIC_API_BASE_URL` unset (or the backend unreachable), every
route in `src/lib/api.ts` transparently falls back to the fixtures in
`src/lib/mock-data.ts`, so the full app — dashboard, stock detail, portfolio —
is walkable with zero backend running.

## Wiring the real backend

Each function in `src/lib/api.ts` documents the exact FastAPI route it expects:

| Function              | Route                                  | Backend source                          |
|------------------------|-----------------------------------------|------------------------------------------|
| `getFullAnalysis`      | `GET /api/v1/analysis/{symbol}`         | `api/routes.py :: FullAnalysisResponse`  |
| `getScreener`          | `GET /api/v1/screener`                  | not yet in `routes.py` — needs adding    |
| `getPaperTrades`       | `GET /api/v1/paper-trades`              | `services/paper_trading.py`              |
| `getPositionSize`      | `GET /api/v1/risk/{symbol}?profile=`    | `risk_engine/portfolio.py`               |
| `getMacroSnapshot`     | `GET /api/v1/macro`                     | not yet in `routes.py` — see note below  |

Two gaps to close server-side before every mock fallback can be removed:

1. **`/api/v1/macro`** — `data_engine/fetcher.py` has `get_macro_commodities()`
   (Gold/Silver/Brent/EURUSD) but nothing exposes S&P 500 / NASDAQ 100 / VIX
   yet. Reuse the same fetch pattern with `^GSPC` / `^NDX` / `^VIX`.
2. **Historical OHLC for the chart** — `get_processed_data()` only returns the
   *latest* indicator values (`ema_20`, `sma_50`, ...), not a price series. The
   chart component (`components/stock/ChartView.tsx`) currently derives a
   seeded synthetic candle series from `last_close` and `atr_14` purely so the
   chart is visually complete; swap `buildSyntheticSeries` for a real
   `GET /api/v1/history/{symbol}?range=` fetch once that route exists.
3. **`/api/v1/screener`** and symbol search (command palette) are similarly
   not yet in `routes.py` — the dashboard and ⌘K palette use static fixtures
   (`mock-data.ts`, `lib/symbol-directory.ts`) until those ship.

## Structure

```
src/
  app/
    layout.tsx               root shell, font wiring, <Header/>
    page.tsx                 Executive Dashboard
    stock/[symbol]/page.tsx  Deep Stock Analysis
    portfolio/page.tsx       Paper Trading portfolio
  components/
    layout/                  Header, MacroTicker, CommandPalette (⌘K)
    dashboard/                MarketRegimeBanner, SmartMoneyGrid, TopRatedTable
    stock/                    PriceHeader, AnalystConsensusBar, AISummaryCard,
                               QuantGradesGrid, ChartView, FlashNewsCard,
                               MarketContextSidebar
    portfolio/                PaperTradingTable
    ui/                       shadcn-style primitives (button, card, table, ...)
  lib/
    api.ts                   server-side data access layer (backend + fallback)
    mock-data.ts              fixtures used as fallback
    format.ts                 currency/percent/polarity formatting helpers
    symbol-directory.ts       static symbol list for the command palette
  types/index.ts               shared contract (unmodified)
```

## Design system

Dark "ledger & ticker" terminal aesthetic — ink background, brass-gold signal
accent, three type roles: monospace for all market data (tabular-nums
everywhere), a grotesk (Inter) for interface chrome, and a serif
(Source Serif 4) reserved for AI-authored prose (thesis reasoning, summaries)
so machine-generated analysis reads distinctly from raw numbers. Tokens live
in `tailwind.config.ts`; the signature "signal spine" (a 2px brass rule
marking a flagged/bullish row) recurs across the dashboard grid, the top
news item, and PnL rows with an open profitable position.
