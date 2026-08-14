"use client";

import * as React from "react";
import type { ScreenerRow } from "@/types";
import { formatPct } from "@/lib/format";
import { IconZap } from "@/components/ui/Icons";

export function SectorMomentumWidget({ rows }: { rows: ScreenerRow[] | any }) {
  const safeRows: ScreenerRow[] = React.useMemo(() => {
    const rawList: any[] = Array.isArray(rows)
      ? rows
      : rows?.signals && Array.isArray(rows.signals)
      ? rows.signals
      : rows && typeof rows === "object"
      ? Object.values(rows)
      : [];

    return rawList.filter(
      (r): r is ScreenerRow => r && typeof r === "object" && !!r.symbol
    );
  }, [rows]);

  const normalizeSector = (sec?: string) => {
    if (!sec) return "Teknoloji";
    const s = sec.toUpperCase();
    if (s.includes("TECH") || s.includes("SOFTWARE") || s.includes("SEMICONDUCTOR")) return "Teknoloji";
    if (s.includes("CONSUMER") || s.includes("CYCLICAL") || s.includes("RETAIL")) return "Tüketim & Perakende";
    if (s.includes("COMMUNICATION") || s.includes("MEDIA")) return "İletişim & Medya";
    if (s.includes("HEALTH") || s.includes("PHARMA")) return "Sağlık";
    if (s.includes("FINANC") || s.includes("BANK")) return "Finans & Bankacılık";
    return sec;
  };

  const sectorPerformance = React.useMemo(() => {
    if (!safeRows || safeRows.length === 0) return [];

    const groups = safeRows.reduce((acc, row) => {
      const sec = normalizeSector(row.sector);
      if (!acc[sec]) acc[sec] = [];
      acc[sec].push(row.change_pct ?? (row as any).change ?? 0);
      return acc;
    }, {} as Record<string, number[]>);

    return Object.entries(groups)
      .map(([sector, changes]) => {
        const avg = changes.reduce((a, b) => a + b, 0) / changes.length;
        return { sector, avg };
      })
      .sort((a, b) => b.avg - a.avg);
  }, [safeRows]);

  if (!safeRows || safeRows.length === 0) {
    return (
      <div className="panel p-5 bg-slate-900/90 border border-slate-800 rounded-2xl text-center text-xs text-slate-500 font-mono">
        Sektör momentum verileri taranıyor...
      </div>
    );
  }

  // Çakışmayı Önleyen Dilimleme (Aynı sektör iki yerde çıkmaz)
  const topSectors = sectorPerformance.slice(0, 2);
  const bottomSectors = sectorPerformance
    .slice(-2)
    .filter((b) => !topSectors.some((t) => t.sector === b.sector));

  return (
    <div className="panel p-5 bg-slate-900/90 border border-slate-800 shadow-2xl rounded-2xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="font-sans text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <IconZap className="text-amber-400 w-4 h-4" />
          Sektörel Momentum Endeksi
        </h3>
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          Aşırı Güçlü
        </span>
      </div>

      <div className="flex items-center justify-center py-2">
        <div className="relative w-24 h-24 rounded-full border-4 border-slate-800 flex flex-col items-center justify-center bg-slate-950/80 shadow-inner">
          <span className="font-mono text-2xl font-black text-white">92</span>
          <span className="font-sans text-[9px] font-bold text-slate-400 tracking-wider">MOMENTUM</span>
        </div>
      </div>

      {/* ÖNE ÇIKAN SEKTÖRLER (++ çift artı silindi) */}
      <div className="space-y-2 font-sans text-xs pt-1 border-t border-slate-800/80">
        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
          ● ÖNE ÇIKAN SEKTÖRLER
        </span>
        {topSectors.map((item) => (
          <div key={item.sector} className="flex justify-between items-center text-slate-200">
            <span className="font-medium">{item.sector}</span>
            <span className="font-mono font-bold text-emerald-400">
              {formatPct(item.avg)}
            </span>
          </div>
        ))}
      </div>

      {/* GERİDE KALAN SEKTÖRLER */}
      {bottomSectors.length > 0 && (
        <div className="space-y-2 font-sans text-xs pt-2 border-t border-slate-800/80">
          <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">
            ● GERİDE KALAN SEKTÖRLER
          </span>
          {bottomSectors.map((item) => (
            <div key={item.sector} className="flex justify-between items-center text-slate-200">
              <span className="font-medium">{item.sector}</span>
              <span
                className={`font-mono font-bold ${
                  item.avg >= 0 ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {formatPct(item.avg)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}