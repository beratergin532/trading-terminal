// ---------------------------------------------------------------------------
// Static symbol directory for the command palette's client-side filtering.
// This is a placeholder — swap for a debounced call to a real
// GET /api/v1/symbols?q= search route once the backend exposes one, so the
// palette covers the full tradable universe rather than this fixed list.
// ---------------------------------------------------------------------------

export interface SymbolEntry {
  symbol: string;
  name: string;
  sector: string;
}

export const SYMBOL_DIRECTORY: SymbolEntry[] = [
  { symbol: "NVDA", name: "NVIDIA Corporation", sector: "Technology" },
  { symbol: "AAPL", name: "Apple Inc.", sector: "Technology" },
  { symbol: "MSFT", name: "Microsoft Corporation", sector: "Technology" },
  { symbol: "TSLA", name: "Tesla, Inc.", sector: "Consumer Cyclical" },
  { symbol: "AMZN", name: "Amazon.com, Inc.", sector: "Consumer Cyclical" },
  { symbol: "GOOGL", name: "Alphabet Inc.", sector: "Communication Services" },
  { symbol: "META", name: "Meta Platforms, Inc.", sector: "Communication Services" },
  { symbol: "AVGO", name: "Broadcom Inc.", sector: "Technology" },
];
