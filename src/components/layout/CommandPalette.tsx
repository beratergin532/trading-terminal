"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { searchSymbols } from "@/lib/api";

export function CommandPalette() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  // Klavye Kısayolu (Cmd + K veya Ctrl + K)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Canlı Arama Sorgusu
  React.useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      const res = await searchSymbols(query);
      setResults(res);
      setLoading(false);
    }, 150);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (symbol: string) => {
    setIsOpen(false);
    setQuery("");
    router.push(`/stock/${symbol.toUpperCase()}`);
  };

  if (!isOpen) return null;

  const cleanQuery = query.trim().toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* DIŞARI TIKLAYINCA KAPANAN MİDAS / BLOOMBERG TARZI BACKDROP */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center px-4 border-b border-slate-800">
          <span className="text-slate-400 text-lg mr-3">🔍</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Hisse sembolü veya şirket adı yazın... (Örn: NVDA, TSLA, COST)"
            className="w-full py-4 bg-transparent text-white placeholder-slate-500 font-sans text-sm focus:outline-none"
            autoFocus
          />
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors text-xs font-mono font-bold"
            title="Kapat (ESC)"
          >
            ✕
          </button>
        </div>

        {/* Sonuç Listesi */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {loading && (
            <div className="p-4 text-center text-xs font-mono text-amber-400">
              Canlı ABD borsalarında aranıyor...
            </div>
          )}

          {!loading &&
            results.map((item) => (
              <button
                key={item.symbol}
                onClick={() => handleSelect(item.symbol)}
                className="w-full text-left p-3 rounded-xl hover:bg-slate-800/80 transition-colors flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <div className="font-mono text-sm font-bold text-white group-hover:text-amber-400">
                    {item.symbol}
                  </div>
                  <div className="font-sans text-xs text-slate-400 truncate max-w-xs">
                    {item.company_name}
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {item.sector}
                </span>
              </button>
            ))}

          {/* HERHANGİ BİR ABD HİSSESİNE DOĞRUDAN ERİŞİM BUTONU */}
          {!loading && cleanQuery.length > 0 && (
            <button
              onClick={() => handleSelect(cleanQuery)}
              className="w-full text-left p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 transition-all flex items-center justify-between group cursor-pointer mt-1"
            >
              <div className="font-mono text-xs font-bold text-amber-400">
                🚀 '{cleanQuery}' Hisse Analizine Doğrudan Git →
              </div>
              <span className="text-[10px] font-mono text-slate-400">CANLI GRAFİK & AI</span>
            </button>
          )}
        </div>

        <div className="p-3 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>Kapatmak için dışarıya veya ✕ butonuna tıklayın</span>
          <span>ESC</span>
        </div>
      </div>
    </div>
  );
}