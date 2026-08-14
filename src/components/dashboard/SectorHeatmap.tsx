"use client";

import * as React from "react";
import Link from "next/link";
import type { ScreenerRow } from "@/types";
import { formatPct } from "@/lib/format";
import { IconMap } from "@/components/ui/Icons";

export function SectorHeatmap({ rows }: { rows: ScreenerRow[] | any }) {
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

  // EKRANIN TAMAMEN YOK OLMASINI ENGELLEYEN YÜKLENİYOR İSKELETİ
  if (!safeRows || safeRows.length === 0) {
    return (
      <div className="panel p-8 bg-slate-900/90 border border-slate-800 shadow-2xl rounded-2xl text-center space-y-3">
        <div className="font-mono text-xs text-amber-400 animate-pulse">
          ⚡ Canlı Borsa Sektör Verileri Taranıyor...
        </div>
      </div>
    );
  }

  const sectorGroups = safeRows.reduce((acc, row) => {
    const sec = normalizeSector(row.sector);
    if (!acc[sec]) acc[sec] = [];
    acc[sec].push(row);
    return acc;
  }, {} as Record<string, ScreenerRow[]>);

  const sectorNames = Object.keys(sectorGroups);

  return (
    <div className="panel p-6 space-y-4 bg-slate-900/95 border border-slate-800 shadow-2xl rounded-2xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h2 className="font-sans text-xl font-extrabold text-white flex items-center gap-2.5 tracking-tight">
            <IconMap className="text-amber-400 w-5 h-5" />
            Sektörel Piyasa Haritası (Treemap)
          </h2>
          <p className="font-sans text-xs text-slate-400 font-medium mt-0.5">
            Canlı borsa tarayıcısındaki şirketlerin sektörel ağırlık ve anlık getiri dağılımı
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-3 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold">
            CANLI GETİRİ (%)
          </span>
          <span className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 font-bold">
            {sectorNames.length} SEKTÖR
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[400px]">
        {sectorNames.map((sector) => {
          const items = sectorGroups[sector];
          const avgChange =
            items.reduce((sum, item) => sum + (item.change_pct ?? (item as any).change ?? 0), 0) / items.length;
          const isSectorPos = avgChange >= 0;

          return (
            <div
              key={sector}
              className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/90 flex flex-col space-y-3 shadow-inner"
            >
              <div className="flex justify-between items-center border-b border-slate-800/80 pb-2">
                <span className="font-sans text-xs font-bold text-slate-300 uppercase tracking-wider">
                  {sector}
                </span>
                <span
                  className={`font-mono text-[11px] font-extrabold px-2 py-0.5 rounded ${
                    isSectorPos
                      ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/30"
                      : "text-rose-400 bg-rose-500/10 border border-rose-500/30"
                  }`}
                >
                  {formatPct(avgChange)}
                </span>
              </div>

              <div className="flex-1 grid grid-cols-2 gap-2.5">
                {items.map((item) => {
                  const changePct = item.change_pct ?? (item as any).change ?? 0;
                  const isPos = changePct >= 0;

                  return (
                    <Link
                      key={item.symbol}
                      href={`/stock/${item.symbol}`}
                      className={`p-3.5 rounded-xl transition-all duration-200 transform hover:scale-[1.02] flex flex-col items-center justify-center text-center cursor-pointer border shadow-md relative overflow-hidden group ${
                        isPos
                          ? "bg-emerald-950/40 hover:bg-emerald-900/60 border-emerald-500/40 text-emerald-100"
                          : "bg-rose-950/40 hover:bg-rose-900/60 border-rose-500/40 text-rose-100"
                      }`}
                    >
                      <span className="font-mono text-lg font-black tracking-wider group-hover:text-amber-400 transition-colors">
                        {item.symbol}
                      </span>
                      <span className="font-mono text-xs font-bold mt-1">
                        {formatPct(changePct)}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}