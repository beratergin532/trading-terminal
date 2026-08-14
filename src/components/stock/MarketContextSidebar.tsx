"use client";

import * as React from "react";
import { formatUSD } from "@/lib/format";
import { IconShield, IconPin, IconBarChart } from "@/components/ui/Icons";

interface MarketContextSidebarProps {
  market?: any;
  report?: any;
  risk?: any;
}

export function MarketContextSidebar({ market, report, risk }: MarketContextSidebarProps) {
  const [lots, setLots] = React.useState<number>(risk?.suggested_lots || 10);
  const [added, setAdded] = React.useState<boolean>(false);

  const symbol = market?.symbol || "NVDA";
  const currentPrice = market?.last_close || 200;

  const handleAddToPortfolio = () => {
    try {
      const existing = JSON.parse(localStorage.getItem("paper_trades") || "[]");
      const newTrade = {
        symbol,
        entry_price: currentPrice,
        current_price: currentPrice,
        lots: Number(lots) || 10,
        status: "AÇIK POZİSYON",
        created_at: new Date().toISOString(),
      };

      const updated = [newTrade, ...existing];
      localStorage.setItem("paper_trades", JSON.stringify(updated));

      setAdded(true);
      setTimeout(() => setAdded(false), 3000);
    } catch (err) {
      console.error("Portföye ekleme hatası:", err);
    }
  };

  return (
    <div className="space-y-4">
      {/* POZİSYON & RİSK YÖNETİMİ PANELİ */}
      <div className="panel p-5 bg-slate-900/95 border border-slate-800 rounded-2xl space-y-4 shadow-xl">
        <h3 className="font-sans text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
          <IconShield className="text-amber-400 w-4 h-4" />
          Pozisyon &amp; Risk Yönetimi
        </h3>

        <div className="space-y-3 font-mono text-xs">
          <div className="flex justify-between items-center">
            <span className="text-slate-400 font-sans">Portföy Büyüklüğü:</span>
            <span className="font-bold text-white">{formatUSD(risk?.portfolio_value || 50000)}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400 font-sans">Maks. Pozisyon (%10):</span>
            <span className="font-bold text-slate-200">{formatUSD((risk?.portfolio_value || 50000) * 0.1)}</span>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-slate-800/80">
            <span className="text-slate-400 font-sans">Önerilen Lot:</span>
            <span className="font-bold text-amber-400 text-sm">{risk?.suggested_lots || 15} Lot</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400 font-sans">Stop Loss (SL):</span>
            <span className="font-bold text-rose-400">{formatUSD(risk?.stop_loss || currentPrice * 0.95)}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400 font-sans">Take Profit (TP):</span>
            <span className="font-bold text-emerald-400">{formatUSD(risk?.take_profit || currentPrice * 1.1)}</span>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800 space-y-2">
          <label className="block text-[11px] font-sans font-semibold text-slate-400">
            İşlem Adedi (Lot):
          </label>
          <input
            type="number"
            value={lots}
            onChange={(e) => setLots(Number(e.target.value))}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-amber-500/60"
            min={1}
          />

          <button
            onClick={handleAddToPortfolio}
            className={`w-full py-2.5 rounded-xl font-sans font-bold text-xs transition-all cursor-pointer border flex items-center justify-center gap-2 ${
              added
                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                : "bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border-amber-500/30"
            }`}
          >
            <IconPin className="w-3.5 h-3.5" />
            {added ? "Sanal Portföye Eklendi!" : "Sanal Portföye İşlem Ekle"}
          </button>
        </div>
      </div>

      {/* MATRİS PİVOT SEVİYELERİ PANELİ */}
      <div className="panel p-5 bg-slate-900/95 border border-slate-800 rounded-2xl space-y-3 shadow-xl">
        <h3 className="font-sans text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
          <IconBarChart className="text-amber-400 w-4 h-4" />
          Matris Pivot Seviyeleri
        </h3>

        <div className="space-y-2 font-mono text-xs">
          <div className="flex justify-between items-center">
            <span className="text-slate-400 font-sans">Direnç 1 (R1):</span>
            <span className="font-bold text-emerald-400">{formatUSD(currentPrice * 1.02)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400 font-sans">Pivot Noktası:</span>
            <span className="font-bold text-amber-400">{formatUSD(currentPrice)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400 font-sans">Destek 1 (S1):</span>
            <span className="font-bold text-rose-400">{formatUSD(currentPrice * 0.98)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}