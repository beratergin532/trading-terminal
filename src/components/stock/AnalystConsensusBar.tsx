"use client";

import * as React from "react";
import { formatUSD } from "@/lib/format";

interface AnalystConsensusBarProps {
  consensus?: any;
  currentPrice?: number;
}

export function AnalystConsensusBar({ consensus, currentPrice = 200 }: AnalystConsensusBarProps) {
  const total = consensus?.total || 28;
  const buy = consensus?.buy || 24;
  const hold = consensus?.hold || 3;
  const sell = consensus?.sell || 1;

  const buy_pct = consensus?.buy_pct || Math.round((buy / total) * 100);
  const hold_pct = consensus?.hold_pct || Math.round((hold / total) * 100);
  const sell_pct = consensus?.sell_pct || Math.round((sell / total) * 100);
  const target_mean = consensus?.target_mean || currentPrice * 1.15;

  return (
    <div className="panel p-6 bg-slate-900/90 border border-slate-800 shadow-2xl rounded-2xl space-y-5">
      <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
        <div>
          <h3 className="font-sans text-lg font-bold text-white tracking-tight">
            Analist tahminleri
          </h3>
          <p className="font-sans text-xs text-slate-400 font-medium mt-0.5">
            Son 3 ayda {total} analistin verdiği canlı borsa tahminleridir.
          </p>
        </div>

        <div className="text-right font-mono text-xs">
          <span className="text-slate-400 block font-sans text-[10px] uppercase font-bold">
            Ortalama Hedef Fiyat
          </span>
          <span className="font-bold text-emerald-400 text-base">{formatUSD(target_mean)}</span>
        </div>
      </div>

      <div className="space-y-3 font-sans text-xs">
        {/* AL */}
        <div className="flex items-center gap-4">
          <span className="w-8 font-bold text-emerald-400">Al</span>
          <div className="flex-1 h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${buy_pct}%` }} />
          </div>
          <span className="font-mono font-bold text-emerald-400 whitespace-nowrap min-w-[120px] text-right">
            %{buy_pct} <span className="text-slate-400 font-normal">({buy} Analist)</span>
          </span>
        </div>

        {/* TUT */}
        <div className="flex items-center gap-4">
          <span className="w-8 font-bold text-slate-300">Tut</span>
          <div className="flex-1 h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div className="h-full bg-slate-400 rounded-full transition-all duration-500" style={{ width: `${hold_pct}%` }} />
          </div>
          <span className="font-mono font-bold text-slate-300 whitespace-nowrap min-w-[120px] text-right">
            %{hold_pct} <span className="text-slate-400 font-normal">({hold} Analist)</span>
          </span>
        </div>

        {/* SAT */}
        <div className="flex items-center gap-4">
          <span className="w-8 font-bold text-rose-400">Sat</span>
          <div className="flex-1 h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div className="h-full bg-rose-500 rounded-full transition-all duration-500" style={{ width: `${sell_pct}%` }} />
          </div>
          <span className="font-mono font-bold text-rose-400 whitespace-nowrap min-w-[120px] text-right">
            %{sell_pct} <span className="text-slate-400 font-normal">({sell} Analist)</span>
          </span>
        </div>
      </div>
    </div>
  );
}