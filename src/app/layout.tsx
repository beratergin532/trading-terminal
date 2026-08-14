import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { MacroTicker } from "@/components/layout/MacroTicker";
import { CommandPalette } from "@/components/layout/CommandPalette";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "borsAI | Kurumsal Borsa & AI Analiz Terminali",
  description: "Anlık ABD Borsa Verileri, AI Otonom Analiz ve Risk Yönetimi Terminali",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={`${inter.variable} ${jetbrainsMono.variable} dark`}>
      <body className="bg-slate-950 text-slate-100 font-sans antialiased min-h-screen flex flex-col selection:bg-amber-500/30 selection:text-amber-300">
        <CommandPalette />
        
        {/* 🌟 EN ÜSTTE KESİNTİSİZ CANLI MAKRO BANDI */}
        <MacroTicker />

        <div className="flex flex-1 relative">
          <Sidebar />

          <div className="flex-1 flex flex-col min-w-0">
            <Header />
            <main className="flex-1 p-4 lg:p-6 max-w-[1700px] w-full mx-auto space-y-6">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}