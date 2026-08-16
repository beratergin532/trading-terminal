// src/components/dashboard/SectorRotationRadar.tsx
"use client";

import React, { useState } from "react";
import { SectorRotationResponse, SectorCoordinate } from "@/types";

interface Props {
  data: SectorRotationResponse | null;
}

export function SectorRotationRadar({ data }: Props) {
  const [activeSector, setActiveSector] = useState<SectorCoordinate | null>(null);

  if (!data) return null;

  // Noktaları 15% - 85% güvenli alanında ölçekle (Kenara yapışmayı ve taşmayı engeller)
  const getPosition = (ratio: number, mom: number) => {
    const minVal = 95.0;
    const maxVal = 105.0;
    const rawX = ((ratio - minVal) / (maxVal - minVal)) * 100;
    const rawY = 100 - ((mom - minVal) / (maxVal - minVal)) * 100;

    const x = Math.max(15, Math.min(85, rawX));
    const y = Math.max(15, Math.min(85, rawY));
    return { x, y };
  };

  const getQuadrantBadge = (quadrant: string) => {
    switch (quadrant) {
      case "Leading":
        return { label: "LİDER", bg: "bg-emerald-950/60 text-emerald-400 border-emerald-800/60" };
      case "Improving":
        return { label: "TOPARLANAN", bg: "bg-cyan-950/60 text-cyan-400 border-cyan-800/60" };
      case "Weakening":
        return { label: "ZAYIFLAYAN", bg: "bg-amber-950/60 text-amber-400 border-amber-800/60" };
      default:
        return { label: "GERİDE", bg: "bg-rose-950/60 text-rose-400 border-rose-800/60" };
    }
  };

  return (
    <div className="panel border border-slate-800/80 rounded-xl p-4 bg-slate-950/90 backdrop-blur-md shadow-2xl space-y-4">
      {/* Başlık */}
      <div className="flex items-center justify-between border-b border-slate-800/60 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
          <h3 className="text-xs font-bold tracking-wider uppercase text-slate-200">
            Sektörel Rotasyon (RRG)
          </h3>
        </div>
        <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
          vs S&P 500
        </span>
      </div>

      {/* 4 Bölgeli Dinamik Koordinat Alanı */}
      <div className="relative w-full aspect-square max-h-[240px] bg-slate-950/80 border border-slate-800/90 rounded-lg overflow-hidden p-2">
        {/* Merkez Eksen Çizgileri */}
        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-slate-800 border-r border-dashed border-slate-700/50" />
        <div className="absolute left-0 right-0 top-1/2 h-px bg-slate-800 border-b border-dashed border-slate-700/50" />

        {/* Bölge İsimleri */}
        <span className="absolute top-2 left-2 text-[9px] font-mono font-bold text-cyan-400/40 uppercase pointer-events-none">
          ↖ Toparlanan
        </span>
        <span className="absolute top-2 right-2 text-[9px] font-mono font-bold text-emerald-400/50 uppercase pointer-events-none">
          ↗ Lider
        </span>
        <span className="absolute bottom-2 left-2 text-[9px] font-mono font-bold text-rose-400/40 uppercase pointer-events-none">
          ↙ Geride
        </span>
        <span className="absolute bottom-2 right-2 text-[9px] font-mono font-bold text-amber-400/40 uppercase pointer-events-none">
          ↘ Zayıflayan
        </span>

        {/* Sektör Noktaları */}
        {data.sectors.map((sec) => {
          const pos = getPosition(sec.rs_ratio, sec.rs_momentum);
          const isRight = pos.x > 50;

          return (
            <div
              key={sec.symbol}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              onMouseEnter={() => setActiveSector(sec)}
              onMouseLeave={() => setActiveSector(null)}
            >
              {/* Parlayan Merkez Düğme */}
              <div 
                className="w-3.5 h-3.5 rounded-full border-2 border-slate-950 shadow-md transition-transform hover:scale-125 flex items-center justify-center"
                style={{ backgroundColor: sec.color }}
              />

              {/* Dinamik Yönlenen Etiket (Taşmayı Engeller) */}
              <span 
                className={`absolute top-1/2 -translate-y-1/2 text-[9px] font-mono font-bold whitespace-nowrap bg-slate-900/95 px-1.5 py-0.5 rounded border border-slate-800 text-slate-200 pointer-events-none ${
                  isRight ? "right-4" : "left-4"
                }`}
              >
                {sec.name}
              </span>
            </div>
          );
        })}

        {/* Hover Bilgi Kartı */}
        {activeSector && (
          <div className="absolute z-20 bottom-2 left-1/2 -translate-x-1/2 bg-slate-900/95 text-slate-200 px-3 py-1.5 rounded border border-slate-700 shadow-xl text-[10px] font-mono pointer-events-none flex items-center gap-2">
            <span className="font-bold text-white">{activeSector.name} ({activeSector.symbol})</span>
            <span className={activeSector.daily_change >= 0 ? "text-emerald-400" : "text-rose-400"}>
              {activeSector.daily_change >= 0 ? `+${activeSector.daily_change}%` : `${activeSector.daily_change}%`}
            </span>
          </div>
        )}
      </div>

      {/* Sektör Listesi ve Kadran Durumları */}
      <div className="space-y-1.5 border-t border-slate-800/60 pt-3">
        {data.sectors.map((sec) => {
          const badge = getQuadrantBadge(sec.quadrant);
          return (
            <div 
              key={sec.symbol}
              className="flex items-center justify-between text-[11px] font-mono bg-slate-900/50 hover:bg-slate-900 px-2.5 py-1 rounded border border-slate-800/60 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: sec.color }} />
                <span className="text-slate-300 font-medium">{sec.name}</span>
                <span className="text-[9px] text-slate-500">({sec.symbol})</span>
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${badge.bg}`}>
                  {badge.label}
                </span>
                <span className={`font-semibold min-w-[42px] text-right ${
                  sec.daily_change >= 0 ? "text-emerald-400" : "text-rose-400"
                }`}>
                  {sec.daily_change >= 0 ? `+${sec.daily_change}%` : `${sec.daily_change}%`}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}