// ---------------------------------------------------------------------------
// Formatting helpers — every number the terminal displays flows through one
// of these so precision, locale, and polarity coloring stay consistent.
// ---------------------------------------------------------------------------

export function formatUSD(value?: number | null, opts: { decimals?: number } = {}) {
  const num = typeof value === "number" && !isNaN(value) ? value : 0;
  const { decimals = 2 } = opts;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

export function formatCompactUSD(value?: number | null) {
  const num = typeof value === "number" && !isNaN(value) ? value : 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(num);
}

export function formatPct(
  value?: number | null,
  opts: { showSign?: boolean; decimals?: number } = {}
) {
  // KURŞUN GEÇİRMEZ ZIRH: Eğer değer undefined veya null gelirse çökmek yerine 0 kabul eder
  const num = typeof value === "number" && !isNaN(value) ? value : 0;
  const { showSign = true, decimals = 2 } = opts;
  const sign = showSign && num > 0 ? "+" : "";
  return `${sign}${num.toFixed(decimals)}%`;
}

export function formatNumber(value?: number | null, decimals = 2) {
  const num = typeof value === "number" && !isNaN(value) ? value : 0;
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

export function formatShares(value?: number | null) {
  const num = typeof value === "number" && !isNaN(value) ? value : 0;
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(num);
}

/** Tailwind text color class for a signed numeric value. */
export function polarityColor(value?: number | null) {
  const num = value ?? 0;
  if (num > 0) return "text-signal-long";
  if (num < 0) return "text-signal-short";
  return "text-paper-muted";
}

export function polarityGlyph(value?: number | null) {
  const num = value ?? 0;
  if (num > 0) return "▲";
  if (num < 0) return "▼";
  return "—";
}

export function actionColor(action?: string | null) {
  switch (action) {
    case "BUY":
      return "text-signal-long border-signal-long/40 bg-signal-longMuted";
    case "SELL":
      return "text-signal-short border-signal-short/40 bg-signal-shortMuted";
    default:
      return "text-signal-hold border-signal-hold/40 bg-signal-hold/10";
  }
}

export function gradeColor(grade?: string | null) {
  if (!grade) return "text-signal-hold";
  if (grade.startsWith("A")) return "text-signal-long";
  if (grade === "B") return "text-brass-bright";
  if (grade === "C") return "text-signal-hold";
  return "text-signal-short";
}