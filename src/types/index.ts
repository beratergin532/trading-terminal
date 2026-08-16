// ============================================================================
// Core domain types — derived 1:1 from the Python backend contracts:
//   ai_engine/schemas.py      -> StockAnalysisReport / TradeStrategy / InvestmentThesis
//   data_engine/fetcher.py    -> MarketDataFetcher.get_processed_data() return dict
//   risk_engine/portfolio.py  -> PositionSizeResult
//   services/paper_trading.py -> PaperTradingLogger trade_record dict
//   api/routes.py             -> FullAnalysisResponse
//
// NOTE: NewsEngine.get_company_news() was not in the files you shared, so
// NewsItem below is a best-effort shape inferred from FlashNewsCard's spec
// (sentiment badges, priority tag). Tighten this once news.py is available.
//
// DO NOT REGENERATE THIS FILE — it is the shared contract every component
// in this app is built against.
// ============================================================================

// ---- ai_engine/schemas.py ------------------------------------------------

export type TradeAction = "BUY" | "HOLD" | "SELL";

export interface InvestmentThesis {
  opportunities: string[]; // top 3 growth catalysts
  risks: string[]; // top 3 risks/threats
}

export interface TradeStrategy {
  action: TradeAction;
  confidence_score: number; // 0-100
  time_horizon: string; // e.g. "1-3 Hafta Swing"
  suggested_entry: number;
  stop_loss: number;
  take_profit: number;
  risk_reward_ratio: number;
}

export interface StockAnalysisReport {
  symbol: string;
  overall_score: number; // 0-100
  summary_reasoning: string;
  thesis: InvestmentThesis;
  strategy: TradeStrategy;
}

// ---- data_engine/fetcher.py :: get_processed_data() -----------------------

export type QuantLetterGrade = "A+" | "A" | "B" | "C" | "D";

export interface QuantGrades {
  valuation: QuantLetterGrade;
  growth: QuantLetterGrade;
  profitability: QuantLetterGrade;
  momentum: QuantLetterGrade;
}

export interface MidasAnalystSplit {
  total_count: number;
  buy_pct: number;
  hold_pct: number;
  sell_pct: number;
}

export interface DividendInfo {
  yield_pct: number;
  rate_per_share: number;
  ex_date: string; // pre-formatted, e.g. "12 Ağ 2026" or "Açıklanmadı"
}

export type WallStreetRecommendation =
  | "STRONG BUY"
  | "BUY"
  | "HOLD"
  | "UNDERPERFORM"
  | "SELL"
  | string; // backend title-cases recommendationKey, so keep this open

export interface WallStreetConsensus {
  recommendation: WallStreetRecommendation;
  target_mean: number;
  target_high: number;
  target_low: number;
}

export interface Ownership {
  held_insiders: number; // %
  held_institutions: number; // %
}

export interface FibonacciLevels {
  fib_236: number;
  fib_382: number;
  fib_500: number;
  fib_618: number;
}

export interface PivotLevels {
  pivot: number;
  support_1: number;
  resistance_1: number;
}

export interface Fundamentals {
  fundamental_score: number;
  pe_ratio: number;
  peg_ratio: number;
  market_cap_billions: number;
}

export interface TechnicalScenarios {
  bull_scenario: string;
  bear_scenario: string;
}

export interface Indicators {
  rsi_14: number;
  ema_20: number;
  sma_50: number;
  atr_14: number;
}

export interface MarketData {
  symbol: string;
  company_name: string;
  sector: string;
  industry: string;
  company_summary: string;
  quant_grades: QuantGrades;
  last_close: number;
  change_pct: number;
  fair_value: number;
  discount_pct: number;
  is_discounted: boolean;
  rvol: number;
  midas_analysts: MidasAnalystSplit;
  dividend_info: DividendInfo;
  wall_street: WallStreetConsensus;
  ownership: Ownership;
  fibonacci: FibonacciLevels;
  pivot_levels: PivotLevels;
  fundamentals: Fundamentals;
  technical_analysis: TechnicalScenarios;
  indicators: Indicators;
}

// ---- data_engine/fetcher.py :: get_macro_commodities() --------------------

export interface MacroAsset {
  name: string;
  price: number;
  change: number; // %
}

// ---- risk_engine/portfolio.py :: PositionSizeResult ------------------------

export type RiskProfile = "aggressive" | "balanced" | "conservative";

export interface PositionSizeResult {
  portfolio_value: number;
  risk_profile: string;
  max_position_dollars: number;
  suggested_shares: number;
  stop_loss_price: number;
  take_profit_price: number;
  risk_per_share: number;
  max_loss_dollars: number;
}

// ---- api/routes.py :: FullAnalysisResponse ---------------------------------

export type NewsSentiment = "POZİTİF" | "NEGATİF" | "NÖTR";

export interface NewsItem {
  title: string;
  source?: string;
  url?: string;
  published_at?: string;
  sentiment?: NewsSentiment;
  is_priority?: boolean;
  [key: string]: unknown; // widen until news.py's real shape is shared
}

export interface FullAnalysisResponse {
  market_data: MarketData;
  news: NewsItem[];
  ai_report: StockAnalysisReport | null;
  risk_management: PositionSizeResult;
}

// ---- services/paper_trading.py :: trade_record dict ------------------------

export type PaperTradeStatus = "OPEN" | "CLOSED_STOP_LOSS" | "CLOSED_TAKE_PROFIT";

export interface PaperTrade {
  id: number;
  timestamp: string;
  symbol: string;
  action: TradeAction | string;
  confidence_pct: number;
  entry_price: number;
  current_price: number;
  pnl_dollars: number;
  pnl_pct: number;
  stop_loss: number;
  take_profit: number;
  shares: number;
  total_cost: number;
  status: PaperTradeStatus;
  ai_reasoning: string;
}

// ---- misc / UI-level ---------------------------------------------------

export interface ScreenerRow extends MarketData {
  ai_score?: number;
}

// ---- macro snapshot (header ticker) ---------------------------------------
//
// NOTE: fetcher.py has `get_macro_commodities()` (Gold/Silver/Brent/EURUSD)
// but it — like the S&P 500 / NASDAQ / VIX figures the design brief calls
// for — isn't exposed through any route in routes.py yet. MacroTicker is
// built against a `/api/v1/macro` shape below; add that route server-side
// (indices can reuse get_macro_commodities' pattern with ^GSPC/^NDX/^VIX)
// before this ticker will show live data instead of its empty state.
export interface MacroSnapshot {
  indices: MacroAsset[]; // S&P 500, NASDAQ 100
  vix: number;
  commodities: MacroAsset[]; // Gold, Silver, Brent, EUR/USD
  regime_label?: "RISK-ON" | "RISK-OFF" | "NÖTR" | string; // AI macro read, optional until wired
  regime_summary?: string; // "Güne Başlarken" one-liner from the LLM engine
}
export interface FearAndGreedData {
  score: number;
  rating: string;
  previous_close: number;
  one_week_ago: number;
}

export interface PutCallRatio {
  total: number;
  equity: number;
  index: number;
  status: string;
}

export interface MarketBreadthStats {
  advances: number;
  declines: number;
  unchanged: number;
  advancing_volume: number;
  declining_volume: number;
  advance_decline_ratio: number;
}

export interface HighLowStats {
  new_highs: number;
  new_lows: number;
  net_highs: number;
}

export interface VixData {
  value: number;
  change_pct: number;
  regime: string;
}

export interface MarketBreadthResponse {
  timestamp: string;
  vix: VixData;
  fear_and_greed: FearAndGreedData;
  put_call: PutCallRatio;
  nyse_breadth: MarketBreadthStats;
  nasdaq_breadth: MarketBreadthStats;
  nyse_high_low: HighLowStats;
  nasdaq_high_low: HighLowStats;
}
export interface SectorCoordinate {
  name: string;
  symbol: string;
  rs_ratio: number;
  rs_momentum: number;
  quadrant: "Leading" | "Weakening" | "Lagging" | "Improving";
  daily_change: number;
  color: string;
}

export interface SectorRotationResponse {
  timestamp: string;
  benchmark: string;
  leading_sector: string;
  lagging_sector: string;
  sectors: SectorCoordinate[];
}