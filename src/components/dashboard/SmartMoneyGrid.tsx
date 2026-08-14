"use client";

import * as React from "react";
import Link from "next/link";
import type { ScreenerRow } from "@/types";
import { formatUSD, formatPct } from "@/lib/format";
import { IconDiamond, IconTarget, IconFlame } from "@/components/ui/Icons";

export function SmartMoneyGrid({ rows }: { rows: ScreenerRow[] | any }) {
  const [filter, setFilter] = React.useState<"all" | "whales" | "gems">("all");

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

  const getInstOwnership = (r: ScreenerRow): number | null => {
    return typeof r.ownership?.held_institutions === "number"
      ? r.ownership.held_institutions
      : null;
  };

  const getRvol = (r: ScreenerRow): number | null => {
    return typeof r.rvol === "number" ? r.rvol : null;
  };

  const institutionalWhales = safeRows.filter((r) => {
    const own = getInstOwnership(r);
    return own !== null && own >= 75;
  });

  const momentumGems = safeRows.filter((r) => {
    const cap = r.fundamentals?.market_cap_billions || 0;
    const rvol = getRvol(r);
    return cap < 500 && rvol !== null && rvol >= 1.5;
  });

  const displayedRows =
    filter === "whales"
      ? institutionalWhales
      : filter === "gems"
      ? momentumGems
      : safeRows.slice(0, 6);

  return (
    <div className="panel p-6 space-y-5 bg-slate-900/90 border border-slate-800 shadow-2xl rounded-2xl">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="font-sans text-xl font-bold text-white flex items-center gap-2.5">
            <IconDiamond className="text-amber-400 w-5 h-5" />
            Akıllı Para &amp; Erken Hacim Radarı
          </h2>
          <p className="font-sans text-xs text-slate-400 mt-1 font-medium">
            Fonların topladığı devler ve patlama öncesi hacim sıçraması gösteren cevherler
          </p>
        </div>

        <div className="flex items-center gap-2 font-sans text-xs">
          <button
            onClick={() => setFilter("all")}
            className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer font-bold ${
              filter === "all"
                ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20"
                : "bg-slate-800/80 text-slate-200 hover:text-white border border-slate-700"
            }`}
          >
            Tümü ({safeRows.length})
          </button>
          <button
            onClick={() => setFilter("whales")}
            className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer font-bold flex items-center gap-1.5 ${
              filter === "whales"
                ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20"
                : "bg-slate-800/80 text-slate-200 hover:text-white border border-slate-700"
            }`}
          >
            <IconTarget className="w-4 h-4 text-sky-400" />
            Dev Fonların Topladıkları ({institutionalWhales.length})
          </button>
          <button
            onClick={() => setFilter("gems")}
            className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer font-bold flex items-center gap-1.5 ${
              filter === "gems"
                ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20"
                : "bg-slate-800/80 text-slate-200 hover:text-white border border-slate-700"
            }`}
          >
            <IconFlame className="w-4 h-4 text-amber-400" />
            Yüksek Hacimli Cevherler ({momentumGems.length})
          </button>
        </div>
      </div>

      {displayedRows.length === 0 ? (
        <div className="py-12 text-center text-slate-400 font-sans text-base">
          Seçilen filtrelere uyan canlı borsa verisi bulunamadı.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedRows.map((row) => {
            const changeValue = row.change_pct ?? (row as any).change ?? 0;
            const lastCloseValue = row.last_close ?? 0;
            const isPositive = changeValue >= 0;

            const instOwnership = getInstOwnership(row);
            const rvol = getRvol(row);
            const isVolumeSpike = rvol !== null && rvol >= 1.5;

            return (
              <Link
                key={row.symbol}
                href={`/stock/${row.symbol}`}
                className="group panel p-5 hover:border-amber-500/60 transition-all bg-slate-950/60 hover:bg-slate-800/60 border border-slate-800 rounded-xl flex flex-col justify-between space-y-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-mono text-xl font-bold text-white group-hover:text-amber-400 transition-colors flex items-center gap-2">
                      <span>{row.symbol}</span>
                      {isVolumeSpike && (
                        <span className="text-[10px] font-sans font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded-full animate-pulse">
                          HACİM SIÇRAMASI
                        </span>
                      )}
                    </div>
                    <div className="font-sans text-xs text-slate-400 font-medium truncate max-w-[190px] mt-1">
                      {row.company_name}
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <div className="font-bold text-base text-white">{formatUSD(lastCloseValue)}</div>
                    <div
                      className={`text-xs font-bold mt-0.5 ${
                        isPositive ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      {formatPct(changeValue)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800/80 font-mono">
                  <div>
                    <span className="text-slate-400 block font-sans text-[10px] font-semibold uppercase">
                      Kurumsal Sahiplik
                    </span>
                    <span className="font-bold text-amber-400 text-sm">
                      {instOwnership !== null ? `%${instOwnership}` : "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-sans text-[10px] font-semibold uppercase">
                      Göreceli Hacim (RVOL)
                    </span>
                    <span className={`font-bold text-sm ${isVolumeSpike ? "text-emerald-400" : "text-slate-200"}`}>
                      {rvol !== null ? `${rvol}x` : "N/A"}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}