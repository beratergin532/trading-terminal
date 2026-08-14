"use client";

import * as React from "react";

interface FlashNewsCardProps {
  news?: any;
}

export function FlashNewsCard({ news }: FlashNewsCardProps) {
  // KURŞUN GEÇİRMEZ HABER DİZİSİ DÖNÜŞTÜRÜCÜSÜ:
  const safeNews = React.useMemo(() => {
    const rawList = Array.isArray(news)
      ? news
      : news?.news && Array.isArray(news.news)
      ? news.news
      : news && typeof news === "object"
      ? Object.values(news)
      : [];

    return rawList.filter(
      (item: any) => item && typeof item === "object" && (!!item.title || !!item.headline)
    );
  }, [news]);

  if (!safeNews || safeNews.length === 0) return null;

  return (
    <div className="panel p-6 bg-slate-900/90 border border-slate-700/80 shadow-2xl space-y-4 rounded-2xl">
      <div className="flex items-center justify-between border-b border-slate-700/80 pb-3.5">
        <div>
          <h3 className="font-sans text-lg font-bold text-white flex items-center gap-2 tracking-tight">
            ⚡ Flash Şirket Haberleri &amp; Duygu Analizi
          </h3>
          <p className="font-sans text-xs text-slate-300 font-medium mt-0.5">
            US Finans basınından anlık akış ve NLP duygu etiketleri
          </p>
        </div>
        <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-lg">
          CANLI AKIŞ
        </span>
      </div>

      <div className="space-y-3">
        {safeNews.map((item: any, idx: number) => {
          const sentiment = item.sentiment || "NÖTR";
          const isPos = sentiment === "POZİTİF" || sentiment === "BULLISH";
          const isNeg = sentiment === "NEGATİF" || sentiment === "BEARISH";

          const publisher = item.publisher || item.source || "Piyasa Haberi";
          const title = item.title || item.headline || "Canlı Gelişme";
          const link = item.link || item.url || "#";

          return (
            <a
              key={idx}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="group block p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800/60 transition-all cursor-pointer space-y-2"
            >
              <div className="flex items-start justify-between gap-4">
                <h4 className="font-sans text-sm font-semibold text-slate-100 group-hover:text-blue-300 transition-colors leading-snug">
                  {title}
                </h4>
                <span
                  className={`font-sans text-xs font-bold px-2.5 py-1 rounded-lg border whitespace-nowrap shadow-sm ${
                    isPos
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                      : isNeg
                      ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                      : "bg-slate-800 text-slate-300 border-slate-700"
                  }`}
                >
                  {sentiment}
                </span>
              </div>

              <div className="flex items-center justify-between font-mono text-xs text-slate-400 pt-1">
                <span>{publisher}</span>
                <span className="group-hover:translate-x-1 transition-transform text-blue-400 font-sans font-bold">
                  Habere Git →
                </span>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}