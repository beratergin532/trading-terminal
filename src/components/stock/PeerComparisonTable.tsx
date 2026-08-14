"use client";

import * as React from "react";
import Link from "next/link";
import { formatUSD, formatPct } from "@/lib/format";

interface PeerComparisonTableProps {
  peers?: any[];
  currentSymbol?: string;
  sector?: string;
}

export function PeerComparisonTable({
  peers,
  currentSymbol,
  sector,
}: PeerComparisonTableProps) {
  // KURŞUN GEÇİRMEZ VERİ ZIRHI: Rakipler dizisi ne şekilde gelirse gelsin güvenle diziye dönüştürür
  const safePeers: any[] = React.useMemo(() => {
    const list = Array.isArray(peers)
      ? peers
      : peers && typeof peers === "object"
      ? Object.values(peers)
      : [];
    return list.filter((p: any) => p && typeof p === "object" && !!p.symbol);
  }, [peers]);

  if (!safePeers || safePeers.length === 0) return null;

  return (
    <div className="panel p-6 bg-slate-900/90 border border-slate-800 shadow-2xl rounded-2xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h3 className="font-sans text-lg font-bold text-white flex items-center gap-2 tracking-tight">
            ⚔️ Sektörel Rakip Karşılaştırması
          </h3>
          <p className="font-sans text-xs text-slate-400 font-medium mt-0.5">
            {sector ? `${sector} sektöründeki` : "Sektöründeki"} en yakın rakiplerin anlık finansal performansı
          </p>
        </div>
        {currentSymbol && (
          <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-lg">
            {currentSymbol} RAKİPLERİ
          </span>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 uppercase font-sans text-[11px]">
              <th className="py-2.5 px-3">Hisse</th>
              <th className="py-2.5 px-3 text-right">Fiyat</th>
              <th className="py-2.5 px-3 text-right">Değişim</th>
              <th className="py-2.5 px-3 text-right">P/E (F/K)</th>
              <th className="py-2.5 px-3 text-right">Piyasa Değeri</th>
              <th className="py-2.5 px-3 text-center">Quant Notu</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-200">
            {safePeers.map((peer: any) => {
              const changeVal = peer.change ?? peer.change_pct ?? 0;
              const isPos = changeVal >= 0;

              return (
                <tr key={peer.symbol} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 font-bold text-white">
                    <Link href={`/stock/${peer.symbol}`} className="hover:text-amber-400 transition-colors">
                      {peer.symbol}
                    </Link>
                  </td>
                  <td className="py-3 px-3 text-right font-bold">
                    {formatUSD(peer.price || peer.last_close || 0)}
                  </td>
                  <td className={`py-3 px-3 text-right font-bold ${isPos ? "text-emerald-400" : "text-rose-400"}`}>
                    {formatPct(changeVal)}
                  </td>
                  <td className="py-3 px-3 text-right text-slate-300">
                    {peer.pe_ratio ? `${peer.pe_ratio}x` : "N/A"}
                  </td>
                  <td className="py-3 px-3 text-right text-slate-300">
                    {peer.market_cap_billions ? `$${peer.market_cap_billions}B` : "N/A"}
                  </td>
                  <td className="py-3 px-3 text-center font-sans font-bold">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      {peer.quant_grade || "QUANT A"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}