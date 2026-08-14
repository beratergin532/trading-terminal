"use client";

import * as React from "react";
import Link from "next/link";
import type { ScreenerRow } from "@/types";
import { formatPct } from "@/lib/format";
import { IconTrendingUp, IconFlame } from "@/components/ui/Icons";

export function MarketMoversWidget({ rows }: { rows: ScreenerRow[] | any }) {
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

  if (!safeRows || safeRows.length === 0) return null;

  const topGainers = [...safeRows]
    .sort((a, b) => (b.change_pct || 0) - (a.change_pct || 0))
    .slice(0, 3);

  const volumeLeaders = [...safeRows]
    .sort((a, b) => (b.rvol || 0) - (a.rvol || 0))
    .slice(0, 3);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* 1. Günün İvme Kazananları */}
      <div className="panel p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <span className="font-sans text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <IconTrendingUp className="w-4 h-4 text-emerald-400" />
            Günün İvme Kazananları
          </span>
          <span className="text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">
            EN YÜKSEK GETİRİ
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {topGainers.map((item) => (
            <Link
              key={item.symbol}
              href={`/stock/${item.symbol}`}
              className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-emerald-500/40 transition-all text-center group cursor-pointer"
            >
              <div className="font-mono text-xs font-bold text-white group-hover:text-emerald-400">
                {item.symbol}
              </div>
              <div className="font-mono text-xs font-extrabold text-emerald-400 mt-1">
                {formatPct(item.change_pct || 0)}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 2. Hacim Sıçraması Yapanlar */}
      <div className="panel p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <span className="font-sans text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <IconFlame className="w-4 h-4 text-amber-400" />
            Hacim Sıra Dışı Artanlar
          </span>
          <span className="text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/30">
            KURUMSAL İLGİ
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {volumeLeaders.map((item) => (
            <Link
              key={item.symbol}
              href={`/stock/${item.symbol}`}
              className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-amber-500/40 transition-all text-center group cursor-pointer"
            >
              <div className="font-mono text-xs font-bold text-white group-hover:text-amber-400">
                {item.symbol}
              </div>
              <div className="font-mono text-xs font-extrabold text-amber-400 mt-1">
                {item.rvol ? `${item.rvol}x Hacim` : "Yüksek"}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}