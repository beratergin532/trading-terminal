import type { MacroSnapshot } from "@/types";
import { formatNumber, formatPct, polarityColor, polarityGlyph } from "@/lib/format";
import { cn } from "@/lib/utils";

export function MarketRegimeBanner({ macro }: { macro: MacroSnapshot | null }) {
  // 1. Veri null ise veya indices bir DİZİ (Array) değilse sayfayı çökertme, güvenle bekle
  if (!macro || !macro.indices || !Array.isArray(macro.indices)) {
    return null;
  }

  // 2. Regime Label kontrolleri (Türkçe/İngilizce ve null-safe esneklik)
  const regime = macro.regime_label || "";
  const isRiskOn = regime === "RISK-ON" || regime.includes("BOĞA") || regime.includes("Bullish");
  const isRiskOff = regime === "RISK-OFF" || regime.includes("TEDBİRLİ") || regime.includes("Cautious");

  return (
    <div className="panel overflow-hidden bg-ink-surface/60 border border-ink-line p-5">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl space-y-1.5">
          <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-brass-bright">
            <span>⚡ GÜNE BAŞLARKEN</span>
            <span className="text-paper/40">·</span>
            <span className="text-paper/80">
              {new Date().toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
            </span>
          </div>
          <p className="font-sans text-xl font-medium leading-relaxed text-paper">
            {macro.regime_summary ?? "Piyasa özeti hazırlanıyor..."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
          {macro.regime_label && (
            <div
              className={cn(
                "flex items-center gap-2.5 rounded-md border px-3.5 py-2",
                isRiskOn && "border-signal-long/50 bg-signal-long/10 text-signal-long",
                isRiskOff && "border-signal-short/50 bg-signal-short/10 text-signal-short",
                !isRiskOn && !isRiskOff && "border-ink-line bg-ink-raised text-paper"
              )}
            >
              <span
                className={cn(
                  "h-2.5 w-2.5 rounded-full animate-pulse",
                  isRiskOn && "bg-signal-long",
                  isRiskOff && "bg-signal-short",
                  !isRiskOn && !isRiskOff && "bg-signal-hold"
                )}
              />
              <span className="font-mono text-xs font-bold uppercase tracking-wider">
                {macro.regime_label}
              </span>
            </div>
          )}

          {(macro.indices || []).map((idx) => (
            <div key={idx.name} className="text-right font-mono">
              <div className="font-sans text-xs font-semibold text-paper/70 uppercase">{idx.name}</div>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-lg font-bold text-paper">{formatNumber(idx.price, 2)}</span>
                <span className={cn("text-xs font-bold", polarityColor(idx.change))}>
                  {polarityGlyph(idx.change)} {formatPct(idx.change)}
                </span>
              </div>
            </div>
          ))}

          <div className="text-right font-mono border-l border-ink-line/60 pl-6">
            <div className="font-sans text-xs font-semibold text-paper/70 uppercase">VIX (KORKU)</div>
            <div className="text-lg font-bold text-paper mt-0.5">{formatNumber(macro.vix || 0, 2)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}