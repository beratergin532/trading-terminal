"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconTerminalLogo,
  IconLayoutGrid,
  IconWallet,
  IconSearch,
} from "@/components/ui/Icons";

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/",
      label: "Canlı Piyasa Terminali",
      icon: IconLayoutGrid,
    },
    {
      href: "/portfolio",
      label: "Sanal Portföy & PnL Takibi",
      icon: IconWallet,
    },
  ];

  // Arama Modalı Tetikleyici Event
  const triggerSearch = () => {
    const event = new KeyboardEvent("keydown", {
      key: "k",
      metaKey: true,
      ctrlKey: true,
      bubbles: true,
    });
    window.dispatchEvent(event);
  };

  return (
    <aside className="w-16 bg-slate-950/95 border-r border-slate-800/80 flex flex-col justify-between items-center py-4 z-40 sticky top-0 h-screen select-none backdrop-blur-md">
      {/* ÜST KISIM: LOGO VE NAVİGASYON */}
      <div className="flex flex-col items-center gap-6 w-full">
        {/* KEHRİBAR AMBİENT GLOW TERMİNAL LOGOSU */}
        <Link
          href="/"
          className="relative group p-2.5 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 hover:border-amber-400 transition-all duration-300 shadow-lg shadow-amber-500/10"
        >
          <IconTerminalLogo className="text-amber-400 w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
          <div className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg bg-slate-900 text-white font-sans text-xs font-bold whitespace-nowrap border border-slate-800 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 shadow-xl z-50">
            borsAI Terminal
          </div>
        </Link>

        <div className="w-8 h-[1px] bg-slate-800/80 my-0.5" />

        {/* NAVİGASYON LİNKLERİ */}
        <nav className="flex flex-col items-center gap-3 w-full px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative group p-3 rounded-xl transition-all duration-200 flex items-center justify-center w-11 h-11 ${
                  isActive
                    ? "bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-md shadow-amber-500/10"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent"
                }`}
              >
                <Icon className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />

                {/* Aktiflik Çizgisi */}
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 bg-amber-400 rounded-r-full shadow-sm shadow-amber-400" />
                )}

                {/* Hover Tooltip */}
                <div className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg bg-slate-900 text-slate-200 font-sans text-xs font-semibold whitespace-nowrap border border-slate-800 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 shadow-xl z-50">
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* ALT KISIM: CANLI HİSSE ARAMA (CMD + K) BUTONU */}
      <div className="flex flex-col items-center gap-3 w-full px-2">
        <div className="w-8 h-[1px] bg-slate-800/80 my-0.5" />

        <button
          onClick={triggerSearch}
          className="relative group p-3 rounded-xl transition-all duration-200 flex items-center justify-center w-11 h-11 bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-amber-400 border border-slate-800 hover:border-amber-500/40 cursor-pointer shadow-inner"
        >
          <IconSearch className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />

          {/* Hover Tooltip */}
          <div className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg bg-slate-900 text-amber-400 font-mono text-xs font-bold whitespace-nowrap border border-slate-800 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 shadow-xl z-50 flex items-center gap-2">
            <span>Hisse Ara</span>
            <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] border border-slate-700">
              ⌘K
            </span>
          </div>
        </button>
      </div>
    </aside>
  );
}