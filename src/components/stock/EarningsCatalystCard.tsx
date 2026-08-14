"use client";

import * as React from "react";
import type { MarketData } from "@/types";
import { formatUSD } from "@/lib/format";

export function EarningsCatalystCard({ market }: { market: MarketData }) {
  if (!market) return null;

  const divInfo = market.dividend_info;
  const wallStreet = market.wall_street;
  const marketCap = market.fundamentals?.market_cap_billions;

  return (
    <div className="panel p-4 space-y-3">
      <div className="flex items-center justify-between border-b border-ink-line pb-2.5">
        <h3 className="font-sans text-sm font-semibold text-paper flex items-center gap-2">
          📅 Bilanço, Temettü &amp; Katalizör Radarı
        </h3>
        <span className="font-mono text-[10px] text-brass-bright bg-brass/10 border border-brass/30 px-2 py-0.5 rounded">
          CANLI VERİ
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
        {/* Temettü Tarihi & Verimi */}
        <div className="bg-ink-surface/60 p-3 rounded border border-ink-line/60">
          <span className="text-[10px] text-paper-faint block font-sans uppercase">
            Son Temettü / Hak Kullanım
          </span>
          <span className="font-bold text-paper text-sm block mt-0.5">
            {divInfo?.ex_date || "N/A"}
          </span>
          <span className="text-[11px] text-brass-bright block mt-1">
            Verim: {divInfo?.yield_pct ? `%${divInfo.yield_pct}` : "N/A"} (${divInfo?.rate_per_share || 0}/hisse)
          </span>
        </div>

        {/* Wall Street Konsensüs Hedefi */}
        <div className="bg-ink-surface/60 p-3 rounded border border-ink-line/60">
          <span className="text-[10px] text-paper-faint block font-sans uppercase">
            Analist Hedef Fiyat (Ort.)
          </span>
          <span className="font-bold text-paper text-sm block mt-0.5">
            {wallStreet?.target_mean ? formatUSD(wallStreet.target_mean) : "N/A"}
          </span>
          <span className="text-[11px] text-signal-long block mt-1">
            Yüksek: {wallStreet?.target_high ? formatUSD(wallStreet.target_high) : "N/A"}
          </span>
        </div>

        {/* Piyasa Değeri Ölçeği */}
        <div className="bg-ink-surface/60 p-3 rounded border border-ink-line/60">
          <span className="text-[10px] text-paper-faint block font-sans uppercase">
            Piyasa Kapitalizasyonu
          </span>
          <span className="font-bold text-paper text-sm block mt-0.5">
            {marketCap ? `$${marketCap}B` : "N/A"}
          </span>
          <span className="text-[11px] text-paper-muted block mt-1 uppercase">
            Ölçek: {marketCap && marketCap > 200 ? "Mega-Cap" : "Mid/Large-Cap"}
          </span>
        </div>
      </div>
    </div>
  );
}