"use client";

import * as React from "react";
import Link from "next/link";
import { formatUSD, formatPct } from "@/lib/format";

export function PaperTradingTable({ trades }: { trades?: any[] }) {
  const [activeTrades, setActiveTrades] = React.useState<any[]>(trades || []);

  React.useEffect(() => {
    if (trades) setActiveTrades(trades);
  }, [trades]);

  // POZİSYON KAPATMA / SATMA İŞLEMİ
  const handleClosePosition = (symbol: string) => {
    setActiveTrades((prev) =>
      prev.map((t) =>
        t.symbol === symbol ? { ...t, status: "KAPATILDI", is_closed: true } : t
      )
    );
  };

  if (!activeTrades || activeTrades.length === 0) {
    return (
      <div className="panel p-12 text-center bg-slate-900/90 border border-slate-800 rounded-2xl space-y-3">
        <div className="text-3xl">📌</div>
        <h3 className="text-lg font-bold text-white font-sans">Sanal Portföyünüzde İşlem Bulunmuyor</h3>
        <p className="text-xs text-slate-400 font-sans max-w-md mx-auto">
          Hisse detay sayfalarındaki sağ panellerden "Sanal Portföye İşlem Ekle" butonunu kullanarak pozisyon açabilirsiniz.
        </p>
      </div>
    );
  }

  return (
    <div className="panel p-6 bg-slate-900/90 border border-slate-800 shadow-2xl rounded-2xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="font-sans text-xl font-bold text-white flex items-center gap-2">
            💼 Aktif &amp; Geçmiş Sanal Portföy İşlemleri
          </h2>
          <p className="font-sans text-xs text-slate-400 mt-0.5">
            Canlı borsa fiyatlarıyla anlık kâr/zarar ve otomatik Stop-Loss takibi
          </p>
        </div>
        <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-lg">
          {activeTrades.length} POZİSYON
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 uppercase font-sans text-[11px]">
              <th className="py-3 px-3">Sembol</th>
              <th className="py-3 px-3 text-right">Giriş Fiyatı</th>
              <th className="py-3 px-3 text-right">Canlı Fiyat</th>
              <th className="py-3 px-3 text-right">Lot</th>
              <th className="py-3 px-3 text-right">Toplam Maliyet</th>
              <th className="py-3 px-3 text-right">Kâr / Zarar ($)</th>
              <th className="py-3 px-3 text-right">Kâr / Zarar (%)</th>
              <th className="py-3 px-3 text-center">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-200">
            {activeTrades.map((trade, idx) => {
              const entry = trade.entry_price || trade.price || 200;
              const current = trade.current_price || trade.last_close || entry;
              const lots = trade.lots || trade.amount || 10;
              const cost = entry * lots;
              const pnlUSD = (current - entry) * lots;
              const pnlPct = ((current - entry) / entry) * 100;
              const isPos = pnlUSD >= 0;
              const isClosed = trade.status === "KAPATILDI" || trade.is_closed;

              return (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-3 font-bold text-white">
                    <Link href={`/stock/${trade.symbol}`} className="hover:text-amber-400 transition-colors">
                      {trade.symbol}
                    </Link>
                  </td>
                  <td className="py-3.5 px-3 text-right">{formatUSD(entry)}</td>
                  <td className="py-3.5 px-3 text-right font-bold text-white">{formatUSD(current)}</td>
                  <td className="py-3.5 px-3 text-right text-slate-300">{lots} Lot</td>
                  <td className="py-3.5 px-3 text-right text-slate-300">{formatUSD(cost)}</td>
                  <td className={`py-3.5 px-3 text-right font-bold ${isPos ? "text-emerald-400" : "text-rose-400"}`}>
                    {isPos ? "+" : ""}{formatUSD(pnlUSD)}
                  </td>
                  <td className={`py-3.5 px-3 text-right font-bold ${isPos ? "text-emerald-400" : "text-rose-400"}`}>
                    {formatPct(pnlPct)}
                  </td>
                  <td className="py-3.5 px-3 text-center font-sans">
                    {isClosed ? (
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
                        POZİSYON KAPATILDI
                      </span>
                    ) : (
                      <button
                        onClick={() => handleClosePosition(trade.symbol)}
                        className="px-3 py-1 rounded-lg text-xs font-bold bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 border border-rose-500/40 transition-all cursor-pointer"
                      >
                        Pozisyonu Kapat (Sat)
                      </button>
                    )}
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