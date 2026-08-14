import type {
  FullAnalysisResponse,
  MacroSnapshot,
  MarketData,
  NewsItem,
  PaperTrade,
  ScreenerRow,
  StockAnalysisReport,
} from "@/types";

// ---------------------------------------------------------------------------
// Fixtures only. Shapes here are constrained by src/types/index.ts — do not
// invent fields. Used exclusively as a fallback when the backend is
// unreachable (see lib/api.ts).
// ---------------------------------------------------------------------------

const SYMBOLS: Record<string, { name: string; sector: string; industry: string; base: number }> = {
  NVDA: { name: "NVIDIA Corporation", sector: "Technology", industry: "Semiconductors", base: 187.42 },
  AAPL: { name: "Apple Inc.", sector: "Technology", industry: "Consumer Electronics", base: 231.05 },
  MSFT: { name: "Microsoft Corporation", sector: "Technology", industry: "Software—Infrastructure", base: 512.8 },
  TSLA: { name: "Tesla, Inc.", sector: "Consumer Cyclical", industry: "Auto Manufacturers", base: 318.6 },
  AMZN: { name: "Amazon.com, Inc.", sector: "Consumer Cyclical", industry: "Internet Retail", base: 228.14 },
  GOOGL: { name: "Alphabet Inc.", sector: "Communication Services", industry: "Internet Content & Information", base: 194.77 },
  META: { name: "Meta Platforms, Inc.", sector: "Communication Services", industry: "Internet Content & Information", base: 742.3 },
  AVGO: { name: "Broadcom Inc.", sector: "Technology", industry: "Semiconductors", base: 289.9 },
};

function seededRandom(seed: string) {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}

function buildMarketData(symbol: string): MarketData {
  const meta = SYMBOLS[symbol] ?? { name: `${symbol} Inc.`, sector: "Technology", industry: "Diversified", base: 100 };
  const rand = seededRandom(symbol);
  const changePct = (rand() - 0.42) * 5;
  const lastClose = meta.base;
  const fairValue = lastClose * (0.85 + rand() * 0.3);

  return {
    symbol,
    company_name: meta.name,
    sector: meta.sector,
    industry: meta.industry,
    company_summary: `${meta.name} operates in the ${meta.industry.toLowerCase()} space within ${meta.sector}, with the AI engine flagging it for its combination of trend momentum and relative valuation versus sector peers.`,
    quant_grades: {
      valuation: (["A+", "A", "B", "C", "D"] as const)[Math.floor(rand() * 5)],
      growth: (["A+", "A", "B", "C"] as const)[Math.floor(rand() * 4)],
      profitability: (["A+", "A", "B"] as const)[Math.floor(rand() * 3)],
      momentum: (["A", "B", "C", "D"] as const)[Math.floor(rand() * 4)],
    },
    last_close: lastClose,
    change_pct: changePct,
    fair_value: fairValue,
    discount_pct: ((fairValue - lastClose) / fairValue) * 100,
    is_discounted: fairValue > lastClose,
    rvol: 0.7 + rand() * 1.8,
    midas_analysts: {
      total_count: 24 + Math.floor(rand() * 20),
      buy_pct: 55 + rand() * 30,
      hold_pct: 10 + rand() * 20,
      sell_pct: 5 + rand() * 10,
    },
    dividend_info:
      rand() > 0.4
        ? { yield_pct: rand() * 2.2, rate_per_share: rand() * 4, ex_date: "12 Ağ 2026" }
        : { yield_pct: 0, rate_per_share: 0, ex_date: "Açıklanmadı" },
    wall_street: {
      recommendation: (["STRONG BUY", "BUY", "HOLD"] as const)[Math.floor(rand() * 3)],
      target_mean: lastClose * (1.05 + rand() * 0.25),
      target_high: lastClose * (1.3 + rand() * 0.3),
      target_low: lastClose * (0.8 + rand() * 0.15),
    },
    ownership: {
      held_insiders: rand() * 8,
      held_institutions: 55 + rand() * 35,
    },
    fibonacci: {
      fib_236: lastClose * 0.95,
      fib_382: lastClose * 0.91,
      fib_500: lastClose * 0.87,
      fib_618: lastClose * 0.83,
    },
    pivot_levels: {
      pivot: lastClose * 0.99,
      support_1: lastClose * 0.95,
      resistance_1: lastClose * 1.03,
    },
    fundamentals: {
      fundamental_score: 55 + rand() * 40,
      pe_ratio: 18 + rand() * 40,
      peg_ratio: 0.8 + rand() * 2.2,
      market_cap_billions: 200 + rand() * 2500,
    },
    technical_analysis: {
      bull_scenario: `A daily close back above the ${(lastClose * 1.02).toFixed(2)} pivot opens room toward the ${(lastClose * 1.08).toFixed(2)} resistance shelf, with RSI still short of overbought.`,
      bear_scenario: `Losing the ${(lastClose * 0.95).toFixed(2)} support puts the 61.8% retracement near ${(lastClose * 0.83).toFixed(2)} back in play, especially if relative volume stays elevated.`,
    },
    indicators: {
      rsi_14: 35 + rand() * 40,
      ema_20: lastClose * (0.98 + rand() * 0.03),
      sma_50: lastClose * (0.95 + rand() * 0.05),
      atr_14: lastClose * (0.015 + rand() * 0.02),
    },
  };
}

function buildAiReport(md: MarketData): StockAnalysisReport {
  const rand = seededRandom(md.symbol + "-ai");
  const action = md.change_pct > 1.5 ? "BUY" : md.change_pct < -1.5 ? "SELL" : "HOLD";
  const entry = md.last_close;
  const stop = action === "BUY" ? entry * 0.95 : entry * 1.05;
  const target = action === "BUY" ? entry * 1.12 : entry * 0.88;

  return {
    symbol: md.symbol,
    overall_score: Math.round(50 + rand() * 45),
    summary_reasoning: `${md.company_name} screens favorably on the engine's composite model: ${md.quant_grades.growth}-grade growth trajectory paired with a ${md.fundamentals.fundamental_score.toFixed(0)}/100 fundamental score. Price is trading ${md.is_discounted ? "below" : "above"} the model's fair-value estimate of $${md.fair_value.toFixed(2)}, and relative volume of ${md.rvol.toFixed(2)}x suggests the move has real participation behind it rather than thin-tape drift.`,
    thesis: {
      opportunities: [
        `${md.quant_grades.momentum}-grade momentum with RSI(14) at ${md.indicators.rsi_14.toFixed(0)}, leaving room before overbought`,
        `Wall Street consensus target of $${md.wall_street.target_mean.toFixed(2)} implies upside from current levels`,
        `Institutional ownership at ${md.ownership.held_institutions.toFixed(0)}% signals sustained sponsorship`,
      ],
      risks: [
        `PEG ratio of ${md.fundamentals.peg_ratio.toFixed(2)} leaves limited room for a growth deceleration surprise`,
        `ATR(14) of $${md.indicators.atr_14.toFixed(2)} implies wide daily swings relative to the stop distance`,
        `Sector rotation out of ${md.sector} would likely compress the multiple regardless of company-specific news`,
      ],
    },
    strategy: {
      action,
      confidence_score: Math.round(48 + rand() * 47),
      time_horizon: ["1-3 Hafta Swing", "3-6 Ay Pozisyon", "Gün İçi"][Math.floor(rand() * 3)],
      suggested_entry: entry,
      stop_loss: stop,
      take_profit: target,
      risk_reward_ratio: Math.abs((target - entry) / (entry - stop)),
    },
  };
}

function buildNews(symbol: string): NewsItem[] {
  const rand = seededRandom(symbol + "-news");
  const templates: Array<[string, NewsItem["sentiment"]]> = [
    [`${symbol} guidance revision moves estimates ahead of print`, "POZİTİF"],
    [`Analysts weigh in on ${symbol} following sector-wide multiple compression`, "NÖTR"],
    [`${symbol} supply-chain report flags near-term margin pressure`, "NEGATİF"],
    [`Institutional filings show accumulation in ${symbol} over the last quarter`, "POZİTİF"],
  ];
  return templates.map(([title, sentiment], i) => ({
    title,
    source: ["Reuters", "Bloomberg", "MarketWatch", "Yahoo Finance"][i % 4],
    url: "#",
    published_at: `${i + 1}h`,
    sentiment,
    is_priority: i === 0 && rand() > 0.4,
  }));
}

export function mockFullAnalysis(symbol: string): FullAnalysisResponse {
  const market_data = buildMarketData(symbol.toUpperCase());
  return {
    market_data,
    news: buildNews(symbol.toUpperCase()),
    ai_report: buildAiReport(market_data),
    risk_management: {
      portfolio_value: 100000,
      risk_profile: "balanced",
      max_position_dollars: 8000,
      suggested_shares: Math.max(1, Math.floor(8000 / market_data.last_close)),
      stop_loss_price: market_data.last_close * 0.95,
      take_profit_price: market_data.last_close * 1.12,
      risk_per_share: market_data.last_close * 0.05,
      max_loss_dollars: 400,
    },
  };
}

export function mockScreener(): ScreenerRow[] {
  return Object.keys(SYMBOLS).map((symbol) => {
    const md = buildMarketData(symbol);
    const report = buildAiReport(md);
    return { ...md, ai_score: report.overall_score };
  });
}

export function mockMacroSnapshot(): MacroSnapshot {
  return {
    indices: [
      { name: "S&P 500", price: 6428.15, change: 0.42 },
      { name: "NASDAQ 100", price: 22984.6, change: 0.68 },
    ],
    vix: 14.82,
    commodities: [
      { name: "Gold", price: 2438.5, change: 0.31 },
      { name: "Silver", price: 29.14, change: -0.18 },
      { name: "Brent", price: 81.62, change: -0.54 },
      { name: "EUR/USD", price: 1.0862, change: 0.09 },
    ],
    regime_label: "RISK-ON",
    regime_summary:
      "Futures point higher as yields ease; breadth is constructive with semis and mega-cap tech leading.",
  };
}

export function mockPaperTrades(): PaperTrade[] {
  const rows: PaperTrade[] = [];
  const symbols = Object.keys(SYMBOLS);
  symbols.forEach((symbol, i) => {
    const md = buildMarketData(symbol);
    const rand = seededRandom(symbol + "-trade");
    const entry = md.last_close * (0.9 + rand() * 0.15);
    const current = md.last_close;
    const shares = Math.max(1, Math.floor(1000 / entry));
    const pnlDollars = (current - entry) * shares;
    const status = i % 5 === 0 ? "CLOSED_TAKE_PROFIT" : i % 7 === 0 ? "CLOSED_STOP_LOSS" : "OPEN";
    rows.push({
      id: i + 1,
      timestamp: `2026-08-${String(10 - (i % 5)).padStart(2, "0")}T14:3${i}:00Z`,
      symbol,
      action: "BUY",
      confidence_pct: Math.round(55 + rand() * 40),
      entry_price: entry,
      current_price: current,
      pnl_dollars: pnlDollars,
      pnl_pct: ((current - entry) / entry) * 100,
      stop_loss: entry * 0.95,
      take_profit: entry * 1.12,
      shares,
      total_cost: entry * shares,
      status,
      ai_reasoning: `Entered on ${md.quant_grades.momentum}-grade momentum breakout with confluence at the 20 EMA; managed against a ${((entry * 0.05) / entry * 100).toFixed(1)}% stop.`,
    });
  });
  return rows;
}
