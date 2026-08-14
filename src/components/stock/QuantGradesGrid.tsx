"use client";

import * as React from "react";
import { IconBarChart } from "@/components/ui/Icons";

interface QuantGradesGridProps {
  grades?: {
    valuation?: string;
    growth?: string;
    profitability?: string;
    momentum?: string;
  };
}

export function QuantGradesGrid({ grades }: QuantGradesGridProps) {
  if (!grades) return null;

  const items = [
    { label: "DEĞERLEME", grade: grades.valuation || "C" },
    { label: "BÜYÜME", grade: grades.growth || "A" },
    { label: "KÂRLILIK", grade: grades.profitability || "A+" },
    { label: "MOMENTUM", grade: grades.momentum || "B" },
  ];

  const getGradeColor = (g: string) => {
    if (g.startsWith("A")) return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
    if (g.startsWith("B")) return "text-amber-400 bg-amber-500/10 border-amber-500/30";
    if (g.startsWith("C")) return "text-amber-300 bg-amber-500/10 border-amber-500/30";
    return "text-rose-400 bg-rose-500/10 border-rose-500/30";
  };

  return (
    <div className="panel p-6 bg-slate-900/90 border border-slate-800 shadow-2xl rounded-2xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h3 className="font-sans text-lg font-bold text-white flex items-center gap-2.5 tracking-tight">
            <IconBarChart className="text-amber-400 w-5 h-5" />
            Kantitatif Faktör Notları (Quant Grades)
          </h3>
          <p className="font-sans text-xs text-slate-400 font-medium mt-0.5">
            Algoritmik değerleme, büyüme, kârlılık ve momentum faktör değerlendirmesi
          </p>
        </div>
        <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-lg">
          4 BİLEŞENLİ SKOR
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-1">
        {items.map((item) => (
          <div
            key={item.label}
            className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-col items-center justify-center space-y-2 text-center"
          >
            <span className="font-sans text-[11px] font-bold text-slate-400 tracking-wider uppercase">
              {item.label}
            </span>
            <span
              className={`font-mono text-2xl font-extrabold px-4 py-1 rounded-xl border ${getGradeColor(
                item.grade
              )}`}
            >
              {item.grade}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}