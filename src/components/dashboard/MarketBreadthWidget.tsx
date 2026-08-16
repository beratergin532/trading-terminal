import React from "react";
import { MarketBreadthResponse } from "@/types";

interface Props {
  data: MarketBreadthResponse | null;
}

export function MarketBreadthWidget({ data }: Props) {
  if (!data) return null;

  const { fear_and_greed, put_call, vix, nyse_breadth, nasdaq_breadth, nyse_high_low, nasdaq_high_low } = data;

  const getFgColor = (score: number) => {
    if (score >= 75) return "text-emerald-400 border-emerald-500/30 bg-emerald-950/20";
    if (score >= 55) return "text-green-400 border-green-500/30 bg-green-950/20";
    if (score >= 45) return "text-amber-400 border-amber-500/30 bg-amber-950/20";
    if (score >= 25) return "text-orange-400 border-orange-500/30 bg-orange-950/20";
    return "text-rose-400 border-rose-500/30 bg-rose-950/20";
  };

  const nyseTotal = nyse_breadth.advances + nyse_breadth.declines || 1;
  const nyseAdvPct = Math.round((nyse_breadth.advances / nyseTotal) * 100);

  const nasdaqTotal = nasdaq_breadth.advances + nasdaq_breadth.declines || 1;
  const nasdaqAdvPct = Math.round((nasdaq_breadth.advances / nasdaqTotal) * 100);

  return (
    <div className="panel border border-slate-800/80 rounded-xl p-5 bg-slate-950/90 backdrop-blur-md shadow-2xl space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/60 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <h2 className="text-sm font-semibold tracking-wide uppercase text-slate-200">
            Piyasa Genişliği & Duyarlılık Nabzı (Market Breadth)
          </h2>
        </div>
        <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
          {data.timestamp}
        </span>
      </div>

      {/* 3 Sütunlu Duyarlılık Paneli */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* CNN Fear & Greed */}
        <div className={`p-4 rounded-lg border ${getFgColor(fear_and_greed.score)} flex flex-col justify-between`}>
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-medium tracking-wider text-slate-300">Fear & Greed</span>
            <span className="text-xs px-2 py-0.5 rounded font-mono font-bold uppercase bg-black/40">
              {fear_and_greed.rating}
            </span>
          </div>
          <div className="my-3 text-center">
            <span className="text-4xl font-extrabold font-mono tracking-tight">{fear_and_greed.score}</span>
            <span className="text-xs text-slate-400 font-mono"> / 100</span>
          </div>
          <div className="flex justify-between text-[11px] font-mono text-slate-400 border-t border-white/10 pt-2">
            <span>Dün: {fear_and_greed.previous_close}</span>
            <span>1 Hf Önce: {fear_and_greed.one_week_ago}</span>
          </div>
        </div>

        {/* CBOE Put / Call Ratio */}
        <div className="p-4 rounded-lg border border-slate-800 bg-slate-900/60 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-medium tracking-wider text-slate-400">Put / Call Oranı</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-200">
              CBOE Canlı
            </span>
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-mono text-slate-100">{put_call.total}</span>
              <span className="text-xs font-medium text-slate-400">Total P/C</span>
            </div>
            <p className="text-[11px] text-amber-400 mt-1 font-medium">{put_call.status}</p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400 border-t border-slate-800/80 pt-2">
            <div>Hisse (Eq): <span className="text-slate-200">{put_call.equity}</span></div>
            <div>Endeks (Idx): <span className="text-slate-200">{put_call.index}</span></div>
          </div>
        </div>

        {/* VIX Volatilite */}
        <div className="p-4 rounded-lg border border-slate-800 bg-slate-900/60 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-medium tracking-wider text-slate-400">VIX Volatilite</span>
            <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
              vix.change_pct >= 0 ? "bg-rose-950/40 text-rose-400" : "bg-emerald-950/40 text-emerald-400"
            }`}>
              {vix.change_pct >= 0 ? `+${vix.change_pct}%` : `${vix.change_pct}%`}
            </span>
          </div>
          <div className="my-2">
            <div className="text-3xl font-bold font-mono text-slate-100">{vix.value}</div>
            <p className="text-[11px] text-slate-400 mt-1">{vix.regime}</p>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className={`h-full ${vix.value > 25 ? 'bg-rose-500' : vix.value > 18 ? 'bg-amber-500' : 'bg-emerald-500'}`}
              style={{ width: `${Math.min(100, (vix.value / 40) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Advance / Decline ve Zirve/Dip Genişlik Göstergeleri */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 border-t border-slate-800/60 pt-4">
        {/* NYSE Breadth */}
        <div className="space-y-2 bg-slate-900/40 p-3.5 rounded-lg border border-slate-800/60">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="font-semibold text-slate-300">NYSE Piyasa Katılımı</span>
            <span className="text-slate-400">A/D Oranı: <strong className="text-slate-200">{nyse_breadth.advance_decline_ratio}</strong></span>
          </div>
          
          <div className="w-full h-2.5 bg-rose-500/80 rounded-full flex overflow-hidden">
            <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${nyseAdvPct}%` }} />
          </div>

          <div className="flex justify-between text-[11px] font-mono text-slate-400 pt-1">
            <span className="text-emerald-400 font-semibold">▲ {nyse_breadth.advances.toLocaleString()} Yükselen (%{nyseAdvPct})</span>
            <span className="text-slate-400">• {nyse_breadth.unchanged} Sabit</span>
            <span className="text-rose-400 font-semibold">▼ {nyse_breadth.declines.toLocaleString()} Düşen (%{100 - nyseAdvPct})</span>
          </div>

          <div className="flex justify-between text-[10px] font-mono text-slate-400 border-t border-slate-800/60 pt-2 mt-2">
            <span>52W Zirve: <strong className="text-emerald-400">+{nyse_high_low.new_highs}</strong></span>
            <span>52W Dip: <strong className="text-rose-400">-{nyse_high_low.new_lows}</strong></span>
            <span>Net Zirve: <strong className={nyse_high_low.net_highs >= 0 ? "text-emerald-400" : "text-rose-400"}>{nyse_high_low.net_highs}</strong></span>
          </div>
        </div>

        {/* NASDAQ Breadth */}
        <div className="space-y-2 bg-slate-900/40 p-3.5 rounded-lg border border-slate-800/60">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="font-semibold text-slate-300">NASDAQ Piyasa Katılımı</span>
            <span className="text-slate-400">A/D Oranı: <strong className="text-slate-200">{nasdaq_breadth.advance_decline_ratio}</strong></span>
          </div>
          
          <div className="w-full h-2.5 bg-rose-500/80 rounded-full flex overflow-hidden">
            <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${nasdaqAdvPct}%` }} />
          </div>

          <div className="flex justify-between text-[11px] font-mono text-slate-400 pt-1">
            <span className="text-emerald-400 font-semibold">▲ {nasdaq_breadth.advances.toLocaleString()} Yükselen (%{nasdaqAdvPct})</span>
            <span className="text-slate-400">• {nasdaq_breadth.unchanged} Sabit</span>
            <span className="text-rose-400 font-semibold">▼ {nasdaq_breadth.declines.toLocaleString()} Düşen (%{100 - nasdaqAdvPct})</span>
          </div>

          <div className="flex justify-between text-[10px] font-mono text-slate-400 border-t border-slate-800/60 pt-2 mt-2">
            <span>52W Zirve: <strong className="text-emerald-400">+{nasdaq_high_low.new_highs}</strong></span>
            <span>52W Dip: <strong className="text-rose-400">-{nasdaq_high_low.new_lows}</strong></span>
            <span>Net Zirve: <strong className={nasdaq_high_low.net_highs >= 0 ? "text-emerald-400" : "text-rose-400"}>{nasdaq_high_low.net_highs}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}