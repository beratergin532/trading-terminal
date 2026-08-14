"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();

  const navItems = [
    { label: "Panel", href: "/" },
    { label: "Sanal Portföy", href: "/portfolio" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo borsAI */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center font-mono font-black text-amber-400 text-xl group-hover:scale-105 transition-transform shadow-inner">
              ⚡
            </div>
            <div className="font-mono tracking-wider">
              <span className="font-extrabold text-white text-xl">bors</span>
              <span className="text-amber-400 font-black text-xl">AI</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1 font-sans text-sm font-bold">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-xl transition-all ${
                    isActive
                      ? "bg-slate-800 text-amber-400 border border-slate-700 shadow-sm"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Canlı Arama Tetikleyici (Cmd + K) */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              const event = new KeyboardEvent("keydown", { key: "k", metaKey: true });
              window.dispatchEvent(event);
            }}
            className="flex items-center gap-3 bg-slate-950/80 border border-slate-700/80 hover:border-amber-500/50 px-3.5 py-2 rounded-xl text-slate-300 hover:text-white transition-all cursor-pointer shadow-inner"
          >
            <span className="text-sm">🔍</span>
            <span className="font-sans text-xs font-semibold hidden sm:inline">
              Hisse veya Şirket Ara...
            </span>
            <kbd className="font-mono text-[10px] font-bold bg-slate-800 text-amber-400 px-2 py-0.5 rounded border border-slate-700">
              Cmd + K
            </kbd>
          </button>
        </div>
      </div>
    </header>
  );
}