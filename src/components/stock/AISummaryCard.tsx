"use client";

import * as React from "react";
import { IconBrain, IconTrendingUp, IconTrendingDown } from "@/components/ui/Icons";

interface AISummaryCardProps {
  report?: any;
  market?: any;
}

export function AISummaryCard({ report, market }: AISummaryCardProps) {
  const symbol = market?.symbol || "NVDA";
  const score = report?.strategy?.confidence_score || 85;
  const action = report?.strategy?.action || "BUY";
  
  const reasoning =
    report?.summary_reasoning ||
    `${symbol} şirketi, sektöründeki güçlü pazar dinamikleri, sağlam kârlılık oranları ve kurumsal alım ilgisi ile pozitif bir yatırım tezi sunmaktadır.`;

  const bulls = report?.bull_case || [
    "Yükselen sektörel talep ve teknoloji benimsenme ivmesi",
    "Güçlü operasyonel kâr marjı ve serbest nakit akışı",
    "Pazar liderliği ve yüksek kurumsal fon sahipliği",
  ];

  const bears = report?.bear_case || [
    "Makroekonomik faiz dalgalanmaları ve değerleme hassasiyeti",
    "Sektör içi rekabet artışı ve kısa vadeli kâr realizasyonları",
    "Küresel tedarik zinciri yoğunlaşma riskleri",
  ];

  return (
    <div className="panel p-6 bg-slate-900/90 border border-slate-800 shadow-2xl rounded-2xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h3 className="font-sans text-lg font-bold text-white flex items-center gap-2.5 tracking-tight">
            <IconBrain className="text-amber-400 w-5 h-5" />
            Yapay Zeka &amp; Kurumsal Analist Sentezi
          </h3>
          <p className="font-sans text-xs text-slate-400 font-medium mt-0.5">
            Algoritmik modelleme ve kurumsal veri sentezi
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-3 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30 font-bold">
            SKOR: %{score}
          </span>
          <span
            className={`px-3 py-1 rounded-lg font-bold border ${
              action === "BUY"
                ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                : action === "SELL"
                ? "bg-rose-500/15 text-rose-400 border-rose-500/30"
                : "bg-slate-800 text-slate-300 border-slate-700"
            }`}
          >
            {action === "BUY" ? "AL (BUY)" : action === "SELL" ? "SAT (SELL)" : "TUT (HOLD)"}
          </span>
        </div>
      </div>

      <p className="font-sans text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
        {reasoning}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
          <div className="font-sans text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
            <IconTrendingUp className="w-4 h-4 text-emerald-400" />
            Yükseliş Katalizörleri (Boğa Tezi)
          </div>
          <ul className="space-y-2 font-sans text-xs text-slate-300">
            {bulls.map((item: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-3">
          <div className="font-sans text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
            <IconTrendingDown className="w-4 h-4 text-rose-400" />
            Riskler &amp; Baskılar (Ayı Tezi)
          </div>
          <ul className="space-y-2 font-sans text-xs text-slate-300">
            {bears.map((item: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">⚠</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}