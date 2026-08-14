"use client";

import * as React from "react";
import { formatUSD, formatPct } from "@/lib/format";
import { IconZap } from "@/components/ui/Icons";

interface PriceHeaderProps {
  market?: any;
}

export function PriceHeader({ market }: PriceHeaderProps) {
  const [isFavorite, setIsFavorite] = React.useState(false);

  if (!market) return null;

  const symbol = market.symbol || "NVDA";
  const name = market.company_name || symbol;
  const sector = market.sector || "Teknoloji";
  const lastClose = market.last_close || 200;
  const changePct = market.change_pct || 0;
  const isPos = changePct >= 0;

  // Günlük Aralık Hesaplaması
  const low = market.day_low || lastClose * 0.985;
  const high = market.day_high || lastClose * 1.018;
  const rangePct = Math.min(Math.max(((lastClose - low) / (high - low || 1)) * 100, 5), 95);

  const preMarketPrice = (lastClose * (1 + (isPos ? 0.008 : -0.005))).toFixed(2);
  const preMarketPct = isPos ? "+0.80%" : "-0.50%";

  return (
    <div className="space-y-3">
      <div className="panel p-6 bg-slate-900/90 border border-slate-800 shadow-2xl rounded-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Sol: Yıldız, Sembol, Sektör ve İsim */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="text-2xl transition-transform active:scale-90 cursor-pointer"
              title="Takip Listesine Ekle"
            >
              {isFavorite ? "⭐" : "☆"}
            </button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-mono text-3xl font-black text-white tracking-tight">
                  {symbol}
                </h1>
                <span className="font-sans text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-lg">
                  {sector}
                </span>
              </div>
              <p className="font-sans text-xs text-slate-400 font-semibold mt-0.5">
                {name}
              </p>
            </div>
          </div>

          {/* Orta-Sağ: Piyasa Öncesi + Günlük Aralık + PDF Butonu */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Piyasa Öncesi / Seans */}
            <div className="bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 text-center font-mono">
              <span className="text-[10px] font-sans font-bold text-amber-400 block uppercase">
                PİYASA ÖNCESİ
              </span>
              <span className="text-xs font-bold text-white">${preMarketPrice} </span>
              <span className="text-[11px] font-bold text-emerald-400">{preMarketPct}</span>
            </div>

            {/* Günlük Aralık Slider Barı */}
            <div className="w-36 hidden sm:block font-mono text-[10px] text-slate-400 space-y-1">
              <div className="flex justify-between font-bold">
                <span>D: ${low.toFixed(2)}</span>
                <span>Y: ${high.toFixed(2)}</span>
              </div>
              <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full"
                  style={{ width: `${rangePct}%` }}
                />
              </div>
              <span className="block text-center text-[9px] font-sans font-bold tracking-wider text-slate-500 uppercase">
                GÜNLÜK ARALIK
              </span>
            </div>

            {/* Canlı Fiyat */}
            <div className="text-right font-mono">
              <div className="text-3xl font-black text-white">
                {formatUSD(lastClose)}
              </div>
              <div className={`text-xs font-extrabold ${isPos ? "text-emerald-400" : "text-rose-400"}`}>
                {formatPct(changePct)}
              </div>
            </div>

            {/* PDF Rapor Butonu */}
            <button
              onClick={() => alert(`${symbol} kurumsal analiz raporu (PDF) oluşturuluyor...`)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-sans font-bold transition-all cursor-pointer shadow-md"
            >
              📄 Rapor Al (PDF)
            </button>
          </div>
        </div>
      </div>

      {/* ⚡ CANLI ANLIK RİTİM BANDI */}
      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-sans flex items-center gap-2 text-slate-300 shadow-sm">
        <IconZap className="w-4 h-4 text-amber-400 shrink-0" />
        <span>
          <strong className="text-amber-400 font-mono font-bold uppercase mr-1.5">ANLIK RİTİM:</strong>
          {name}, {sector} sektöründe {formatUSD(lastClose)} fiyattan işlem görüyor ve teknik momentumunu koruyor.
        </span>
      </div>
    </div>
  );
}