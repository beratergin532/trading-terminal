"use client";

import * as React from "react";
import { createChart, ColorType, IChartApi, ISeriesApi } from "lightweight-charts";
import { getSymbolHistory } from "@/lib/api";
import type { MarketData } from "@/types";

interface ChartViewProps {
  market?: MarketData;
  symbol?: string;
}

interface CandleData {
  time: string | number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export function ChartView({ market, symbol: propSymbol }: ChartViewProps) {
  const symbol = market?.symbol || propSymbol || "NVDA";
  const chartContainerRef = React.useRef<HTMLDivElement>(null);
  const chartRef = React.useRef<IChartApi | null>(null);

  const [period, setPeriod] = React.useState<string>("6mo");
  const [chartType, setChartType] = React.useState<"candle" | "line">("candle");
  const [loading, setLoading] = React.useState<boolean>(true);
  const [periodReturn, setPeriodReturn] = React.useState<number | null>(null);

  // İNDİKATÖR DURUMLARI
  const [showEMA20, setShowEMA20] = React.useState<boolean>(true);
  const [showEMA50, setShowEMA50] = React.useState<boolean>(true);
  const [showSMA200, setShowSMA200] = React.useState<boolean>(false);
  const [showBollinger, setShowBollinger] = React.useState<boolean>(false);
  const [showVWAP, setShowVWAP] = React.useState<boolean>(period === "1d");
  const [showVolume, setShowVolume] = React.useState<boolean>(true);

  React.useEffect(() => {
    if (!chartContainerRef.current) return;

    chartContainerRef.current.innerHTML = "";

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "#090d16" },
        textColor: "#94a3b8",
      },
      grid: {
        vertLines: { color: "#1e293b" },
        horzLines: { color: "#1e293b" },
      },
      timeScale: {
        timeVisible: period === "1d",
        secondsVisible: false,
      },
      width: chartContainerRef.current.clientWidth || 700,
      height: 420,
    });

    chartRef.current = chart;
    setLoading(true);

    getSymbolHistory(symbol, period)
      .then((data: CandleData[]) => {
        if (data && Array.isArray(data) && data.length > 0) {
          data.sort((a, b) => (a.time > b.time ? 1 : -1));

          const firstClose = data[0].close;
          const lastClose = data[data.length - 1].close;
          const pctChange = ((lastClose - firstClose) / firstClose) * 100;
          setPeriodReturn(pctChange);

          // 1. CANLI HACİM BARLARI (scaleMargins hatası düzeltildi)
          if (showVolume) {
            const volumeSeries = chart.addHistogramSeries({
              priceScaleId: "volume_scale",
            });
            chart.priceScale("volume_scale").applyOptions({
              scaleMargins: { top: 0.8, bottom: 0 },
            });
            volumeSeries.setData(
              data.map((d) => ({
                time: d.time as any,
                value: d.volume || 0,
                color: d.close >= d.open ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)",
              }))
            );
          }

          // 2. ANA FİYAT SERİSİ
          let mainSeries: ISeriesApi<any>;
          if (chartType === "candle") {
            mainSeries = chart.addCandlestickSeries({
              upColor: "#10b981",
              downColor: "#ef4444",
              borderVisible: false,
              wickUpColor: "#10b981",
              wickDownColor: "#ef4444",
            });
            mainSeries.setData(
              data.map((d) => ({
                time: d.time as any,
                open: d.open,
                high: d.high,
                low: d.low,
                close: d.close,
              }))
            );
          } else {
            mainSeries = chart.addLineSeries({ color: "#38bdf8", lineWidth: 2 });
            mainSeries.setData(data.map((d) => ({ time: d.time as any, value: d.close })));
          }

          // 3. EMA 20 (lineWidth: 1 olarak Düzeltildi)
          if (showEMA20 && data.length >= 20) {
            const ema20Series = chart.addLineSeries({ color: "#f59e0b", lineWidth: 1 });
            const k = 2 / (20 + 1);
            let ema = data[0].close;
            ema20Series.setData(
              data.map((d, idx) => {
                if (idx === 0) return { time: d.time as any, value: ema };
                ema = d.close * k + ema * (1 - k);
                return { time: d.time as any, value: Number(ema.toFixed(2)) };
              })
            );
          }

          // 4. EMA 50 (lineWidth: 1 olarak Düzeltildi)
          if (showEMA50 && data.length >= 50) {
            const ema50Series = chart.addLineSeries({ color: "#06b6d4", lineWidth: 1 });
            const k = 2 / (50 + 1);
            let ema = data[0].close;
            ema50Series.setData(
              data.map((d, idx) => {
                if (idx === 0) return { time: d.time as any, value: ema };
                ema = d.close * k + ema * (1 - k);
                return { time: d.time as any, value: Number(ema.toFixed(2)) };
              })
            );
          }

          // 5. SMA 200
          if (showSMA200 && data.length >= 200) {
            const sma200Series = chart.addLineSeries({ color: "#a855f7", lineWidth: 2 });
            sma200Series.setData(
              data.map((d, idx) => {
                if (idx < 199) return { time: d.time as any, value: d.close };
                const slice = data.slice(idx - 199, idx + 1);
                const avg = slice.reduce((sum, item) => sum + item.close, 0) / 200;
                return { time: d.time as any, value: Number(avg.toFixed(2)) };
              })
            );
          }

          // 6. VWAP
          if (showVWAP && period === "1d") {
            const vwapSeries = chart.addLineSeries({ color: "#eab308", lineWidth: 2 });
            let cumVol = 0;
            let cumTPV = 0;
            vwapSeries.setData(
              data.map((d) => {
                const typicalPrice = (d.high + d.low + d.close) / 3;
                const vol = d.volume || 1;
                cumVol += vol;
                cumTPV += typicalPrice * vol;
                const vwap = cumVol > 0 ? cumTPV / cumVol : d.close;
                return { time: d.time as any, value: Number(vwap.toFixed(2)) };
              })
            );
          }

          // 7. BOLLINGER BANTLARI
          if (showBollinger && data.length >= 20) {
            const upperBand = chart.addLineSeries({ color: "rgba(148, 163, 184, 0.4)", lineWidth: 1 });
            const lowerBand = chart.addLineSeries({ color: "rgba(148, 163, 184, 0.4)", lineWidth: 1 });

            const upperData = [];
            const lowerData = [];

            for (let i = 0; i < data.length; i++) {
              if (i < 19) {
                upperData.push({ time: data[i].time as any, value: data[i].close });
                lowerData.push({ time: data[i].time as any, value: data[i].close });
                continue;
              }
              const slice = data.slice(i - 19, i + 1);
              const mean = slice.reduce((sum, item) => sum + item.close, 0) / 20;
              const variance = slice.reduce((sum, item) => sum + Math.pow(item.close - mean, 2), 0) / 20;
              const stdDev = Math.sqrt(variance);

              upperData.push({ time: data[i].time as any, value: Number((mean + stdDev * 2).toFixed(2)) });
              lowerData.push({ time: data[i].time as any, value: Number((mean - stdDev * 2).toFixed(2)) });
            }

            upperBand.setData(upperData);
            lowerBand.setData(lowerData);
          }

          chart.timeScale().fitContent();
        }
      })
      .catch((err: any) => console.error("Grafik yükleme hatası:", err))
      .finally(() => setLoading(false));

    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [symbol, period, chartType, showEMA20, showEMA50, showSMA200, showBollinger, showVWAP, showVolume]);

  return (
    <div className="panel p-5 bg-slate-900/90 border border-slate-800 shadow-2xl rounded-2xl space-y-4">
      {/* ÜST PERİYOT VE TÜR KONTROLLERİ */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2 font-mono text-xs">
          {["1d", "1mo", "3mo", "6mo", "1y", "5y"].map((p) => (
            <button
              key={p}
              onClick={() => {
                setPeriod(p);
                if (p === "1d") setShowVWAP(true);
              }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                period === p
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                  : "bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700"
              }`}
            >
              {p.toUpperCase()}
            </button>
          ))}

          {periodReturn !== null && (
            <span
              className={`ml-2 px-2.5 py-1 rounded-lg font-bold ${
                periodReturn >= 0
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                  : "bg-rose-500/15 text-rose-400 border border-rose-500/30"
              }`}
            >
              Dönem: {periodReturn >= 0 ? "+" : ""}
              {periodReturn.toFixed(2)}%
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={() => setChartType("candle")}
            className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer ${
              chartType === "candle"
                ? "bg-slate-800 text-amber-400 border border-amber-500/40"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Mum
          </button>
          <button
            onClick={() => setChartType("line")}
            className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer ${
              chartType === "line"
                ? "bg-slate-800 text-amber-400 border border-amber-500/40"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Çizgi
          </button>
        </div>
      </div>

      {/* PROFESYONEL İNDİKATÖR SEÇİM PANELİ */}
      <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-xs">
        <span className="text-[10px] text-slate-400 uppercase font-sans font-bold">PRO GÖSTERGELER:</span>
        <button
          onClick={() => setShowEMA20(!showEMA20)}
          className={`px-2.5 py-1 rounded-lg border text-[11px] transition-all cursor-pointer font-bold ${
            showEMA20 ? "border-amber-500 text-amber-400 bg-amber-500/10" : "border-slate-800 text-slate-500"
          }`}
        >
          EMA 20
        </button>
        <button
          onClick={() => setShowEMA50(!showEMA50)}
          className={`px-2.5 py-1 rounded-lg border text-[11px] transition-all cursor-pointer font-bold ${
            showEMA50 ? "border-cyan-400 text-cyan-400 bg-cyan-500/10" : "border-slate-800 text-slate-500"
          }`}
        >
          EMA 50
        </button>
        <button
          onClick={() => setShowSMA200(!showSMA200)}
          className={`px-2.5 py-1 rounded-lg border text-[11px] transition-all cursor-pointer font-bold ${
            showSMA200 ? "border-purple-400 text-purple-400 bg-purple-500/10" : "border-slate-800 text-slate-500"
          }`}
        >
          SMA 200
        </button>
        {period === "1d" && (
          <button
            onClick={() => setShowVWAP(!showVWAP)}
            className={`px-2.5 py-1 rounded-lg border text-[11px] transition-all cursor-pointer font-bold ${
              showVWAP ? "border-yellow-400 text-yellow-400 bg-yellow-500/10" : "border-slate-800 text-slate-500"
            }`}
          >
            VWAP (Hacim Ağırlıklı)
          </button>
        )}
        <button
          onClick={() => setShowBollinger(!showBollinger)}
          className={`px-2.5 py-1 rounded-lg border text-[11px] transition-all cursor-pointer font-bold ${
            showBollinger ? "border-slate-300 text-slate-200 bg-slate-800" : "border-slate-800 text-slate-500"
          }`}
        >
          Bollinger Bantları
        </button>
        <button
          onClick={() => setShowVolume(!showVolume)}
          className={`px-2.5 py-1 rounded-lg border text-[11px] transition-all cursor-pointer font-bold ${
            showVolume ? "border-emerald-500 text-emerald-400 bg-emerald-500/10" : "border-slate-800 text-slate-500"
          }`}
        >
          İşlem Hacmi
        </button>
      </div>

      {/* GRAFİK CANVAS ALANI */}
      <div className="relative min-h-[420px] w-full pt-2">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-950/80 text-xs font-mono text-amber-400 animate-pulse rounded-xl">
            ⚡ Canlı Borsa Mum Verileri Yükleniyor...
          </div>
        )}
        <div ref={chartContainerRef} className="h-[420px] w-full overflow-hidden" />
      </div>
    </div>
  );
}