"use client";

import * as React from "react";
import { IconZap } from "@/components/ui/Icons";

interface StockInsightBannerProps {
  report?: any;
  news?: any[];
}

export function StockInsightBanner({ report, news }: StockInsightBannerProps) {
  const latestNews = news && news.length > 0 ? news[0] : null;
  const reasoning = report?.summary_reasoning;

  if (!latestNews && !reasoning) return null;

  const title = latestNews?.title || reasoning;
  const publisher = latestNews?.publisher || latestNews?.source || "Canlı Piyasa Akışı";
  const link = latestNews?.link || latestNews?.url;

  return (
    <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3 font-sans text-xs">
      <div className="flex items-start gap-3">
        <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono font-bold whitespace-nowrap flex items-center gap-1.5">
          <IconZap className="w-3.5 h-3.5 text-amber-400" />
          {publisher}
        </span>
        <p className="text-slate-200 font-medium leading-relaxed">
          {title}
        </p>
      </div>

      {link && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-amber-400 hover:text-amber-300 font-bold whitespace-nowrap flex items-center gap-1 transition-colors cursor-pointer self-end md:self-center"
        >
          Habere git →
        </a>
      )}
    </div>
  );
}