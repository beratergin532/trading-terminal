// src/lib/api.ts

import { MarketBreadthResponse, SectorRotationResponse } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

// ==========================================
// MAKRO & PİYASA TİP TANIMLARI
// ==========================================
export interface MacroCommodity {
  name: string;
  price: number;
  change: number;
}

export interface MacroIndex {
  name: string;
  price: number;
  change: number;
}

export interface MacroSnapshot {
  regime_label?: string;
  market_regime?: string;
  sentiment_score?: number;
  summary?: string;
  regime_summary?: string;
  vix?: number;
  vix_change?: number;
  sp500_change?: number;
  nasdaq_change?: number;
  indices?: MacroIndex[];
  commodities?: MacroCommodity[];
}

// ==========================================
// API FONKSİYONLARI
// ==========================================

// 1. SCREENER (24 Hisse Verisi)
export async function getScreener(watchList?: string): Promise<any[]> {
  try {
    const url = watchList 
      ? `${API_BASE}/screener?watch_list=${encodeURIComponent(watchList)}` 
      : `${API_BASE}/screener`;
    const res = await fetch(url, { next: { revalidate: 45 } });
    if (!res.ok) return [];
    const data = await res.json();
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.signals)) return data.signals;
    return [];
  } catch (error) {
    console.error("Screener fetch hatası:", error);
    return [];
  }
}

// 2. MAKRO PİYASA
export async function getMacroSnapshot(): Promise<MacroSnapshot | null> {
  try {
    const res = await fetch(`${API_BASE}/macro`, { next: { revalidate: 30 } });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Macro fetch hatası:", error);
    return null;
  }
}

// 3. PİYASA GENİŞLİĞİ VE DUYARLILIK
export async function getMarketBreadth(): Promise<MarketBreadthResponse | null> {
  try {
    const res = await fetch(`${API_BASE}/market-breadth`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Market breadth fetch hatası:", error);
    return null;
  }
}

// 4. SEKTÖREL ROTASYON KADRANI (RRG)
export async function getSectorRotation(): Promise<SectorRotationResponse | null> {
  try {
    const res = await fetch(`${API_BASE}/sector-rotation`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Sector rotation fetch hatası:", error);
    return null;
  }
}

// 5. HABER AKIŞI
export async function getFlashNews(symbol?: string, limit: number = 10): Promise<any[]> {
  try {
    const url = symbol 
      ? `${API_BASE}/news?symbol=${symbol}&limit=${limit}` 
      : `${API_BASE}/news?limit=${limit}`;
    const res = await fetch(url, { next: { revalidate: 120 } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data?.news) ? data.news : Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Flash news fetch hatası:", error);
    return [];
  }
}

// 6. TEKİL HİSSE DETAYI
export async function getStockDetail(
  symbol: string, 
  portfolioValue: number = 50000.0, 
  riskProfile: string = "balanced"
): Promise<any | null> {
  try {
    const res = await fetch(
      `${API_BASE}/stock/${symbol}?portfolio_value=${portfolioValue}&risk_profile=${riskProfile}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error(`Stock details (${symbol}) fetch hatası:`, error);
    return null;
  }
}
export const getStockDetails = getStockDetail;

// 7. GEÇMİŞ GRAFİK VERİSİ
export async function getSymbolHistory(symbol: string, range: string = "6mo"): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE}/history/${symbol}?range=${range}`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error(`Stock history (${symbol}) fetch hatası:`, error);
    return [];
  }
}
export const getStockHistory = getSymbolHistory;

// 8. GLOBAL ARAMA PALETİ
export async function searchSymbols(query: string): Promise<any[]> {
  if (!query || query.trim().length === 0) return [];
  try {
    const screener = await getScreener();
    const q = query.toUpperCase().trim();
    return screener.filter((s: any) => 
      (s.symbol && s.symbol.toUpperCase().includes(q)) || 
      (s.company_name && s.company_name.toUpperCase().includes(q))
    );
  } catch {
    return [];
  }
}

// 9. SANAL PORTFÖY
export async function getPaperTrades(): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE}/portfolio`, { cache: "no-store" });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Paper trades fetch hatası:", error);
    return [];
  }
}
export const getPortfolioSummary = getPaperTrades;