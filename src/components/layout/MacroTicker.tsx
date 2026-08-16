// src/components/layout/MacroTicker.tsx
"use client";

import * as React from "react";
import { getMacroSnapshot, type MacroSnapshot } from "@/lib/api";
import { formatUSD, formatPct } from "@/lib/format";

export function MacroTicker() {
  const [macro, setMacro] = React.useState<MacroSnapshot | null>(null);
  const [loading, setLoading] = React.useState(true);

  const fetchLiveMacro = React.useCallback(() => {
    getMacroSnapshot().then((data) => {
      if (
        data &&
        (((data.indices?.length ?? 0) > 0) || ((data.commodities?.length ?? 0) > 0))
      ) {
        setMacro(data);
        setLoading(false);
      }
    });
  }, []);

  React.useEffect(() => {
    fetchLiveMacro();
    const interval = setInterval(fetchLiveMacro, 15000);
    return () => clearInterval(interval);
  }, [fetchLiveMacro]);

  const items = React.useMemo(() => {
    if (!macro) return [];

    const list: Array<{ name: string; price: number; change?: number }> = [];
    if (Array.isArray(macro.indices)) {
      macro.indices.forEach((idx) => {
        list.push({ name: idx.name, price: idx.price, change: idx.change });
      });
    }
    if (Array.isArray(macro.commodities)) {
      macro.commodities.forEach((c: any) => {
        list.push({ name: c.name, price: c.price, change: c.change_pct ?? c.change });
      });
    }
    return list;
  }, [macro]);

  const regime = macro?.regime_label || "CANLI PİYASA";
  const marqueeItems = items.length > 0 ? [...items, ...items] : [];

  return (
    <div className="w-full bg-slate-950/95 border-b border-slate-800/90 text-xs font-mono py-2 px-4 flex items-center overflow-hidden select-none z-50 backdrop-blur-md min-h-[37px]">
      {/* Sol: Piyasa Rejimi Rozeti */}
      <div className="flex items-center gap-2 pr-4 border-r border-slate-800 shrink-0 z-10 bg-slate-950/95">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          {regime}
        </span>
      </div>

      {/* Sağ: Kayan Canlı Veri Bandı */}
      <div className="overflow-hidden flex-1 relative pl-6">
        {loading && items.length === 0 ? (
          <div className="flex items-center gap-3 text-slate-500 text-[11px] font-sans">
            <span className="animate-spin inline-block w-3 h-3 border-2 border-amber-400 border-t-transparent rounded-full" />
            <span>Küresel canlı borsa ve emtia verileri taranıyor...</span>
          </div>
        ) : (
          <div className="animate-marquee gap-10 cursor-pointer">
            {marqueeItems.map((item, idx) => {
              const changeVal = item.change ?? 0;
              const isPos = changeVal >= 0;
              const isVix = item.name.toUpperCase().includes("VIX");

              return (
                <div key={idx} className="flex items-center gap-2 shrink-0">
                  <span className="text-slate-400 font-sans font-semibold text-[11px]">
                    {item.name}:
                  </span>
                  <span className="font-bold text-white">
                    {item.name.includes("EUR") ? `$${item.price}` : formatUSD(item.price)}
                  </span>
                  {!isVix && (
                    <span
                      className={`text-[11px] font-bold ${
                        isPos ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      {formatPct(changeVal)}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}