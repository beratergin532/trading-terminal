"use client";

import * as React from "react";
import { getMacroSnapshot } from "@/lib/api";
import { formatUSD, formatPct } from "@/lib/format";

export function MacroTicker() {
  const [macro, setMacro] = React.useState<any>(null);

  React.useEffect(() => {
    getMacroSnapshot().then((data) => {
      if (data) setMacro(data);
    });
    const interval = setInterval(() => {
      getMacroSnapshot().then((data) => {
        if (data) setMacro(data);
      });
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const items = React.useMemo(() => {
    if (!macro) {
      return [
        { name: "S&P 500", price: 7810.02, change: 0.79 },
        { name: "NASDAQ 100", price: 26845.8, change: 0.97 },
        { name: "VIX", price: 14.78, change: 0.0 },
        { name: "Ons Altın ($)", price: 4432.2, change: 0.53 },
        { name: "Ons Gümüş ($)", price: 64.97, change: -0.89 },
        { name: "Brent Petrol ($)", price: 86.64, change: -2.63 },
        { name: "EUR / USD", price: 1.15, change: -0.38 },
      ];
    }

    const list: any[] = [];
    if (macro.indices) {
      macro.indices.forEach((idx: any) => {
        list.push({ name: idx.name, price: idx.price, change: idx.change });
      });
    }
    if (macro.commodities) {
      macro.commodities.forEach((c: any) => {
        list.push({ name: c.name, price: c.price, change: c.change });
      });
    }
    return list;
  }, [macro]);

  // Kesintisiz sonsuz akış için listeyi 2 kez çoğaltıyoruz
  const marqueeItems = [...items, ...items];
  const regime = macro?.regime_label || "RISK-ON";

  return (
    <div className="w-full bg-slate-950/95 border-b border-slate-800/90 text-xs font-mono py-2 px-4 flex items-center overflow-hidden select-none z-50 backdrop-blur-md">
      {/* Sol: Sabit Piyasa Rejimi Rozeti */}
      <div className="flex items-center gap-2 pr-4 border-r border-slate-800 shrink-0 z-10 bg-slate-950/95">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider ${
            regime === "RISK-ON"
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
              : "bg-rose-500/10 text-rose-400 border border-rose-500/30"
          }`}
        >
          {regime}
        </span>
      </div>

      {/* Sağ: Otomatik Kayan Sonsuz Marquee Bandı */}
      <div className="overflow-hidden flex-1 relative">
        <div className="animate-marquee gap-10 pl-6 cursor-pointer">
          {marqueeItems.map((item, idx) => {
            const isPos = (item.change || 0) >= 0;
            const isVix = item.name.includes("VIX");

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
                    {formatPct(item.change)}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}