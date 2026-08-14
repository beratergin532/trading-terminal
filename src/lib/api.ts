const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export async function getScreener() {
  try {
    const res = await fetch(`${API_BASE_URL}/screener`, { next: { revalidate: 30 } });
    if (!res.ok) return { signals: [] };
    return await res.json();
  } catch (error) {
    return { signals: [] };
  }
}

export async function getMacroSnapshot() {
  try {
    const res = await fetch(`${API_BASE_URL}/macro`, { next: { revalidate: 30 } });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    return null;
  }
}

export async function getFlashNews(symbol?: string) {
  try {
    const url = symbol ? `${API_BASE_URL}/news?symbol=${symbol}` : `${API_BASE_URL}/news`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    return [];
  }
}

export async function getStockDetail(symbol: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/stock/${symbol}`, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    return null;
  }
}

export async function getSymbolHistory(symbol: string, range = "6mo") {
  try {
    const res = await fetch(`${API_BASE_URL}/history/${symbol}?range=${range}`, { cache: "no-store" });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    return [];
  }
}

export async function getPaperTrades() {
  try {
    const res = await fetch(`${API_BASE_URL}/portfolio`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : data?.trades || [];
  } catch (error) {
    return [];
  }
}

// CANLI HİSSE ARAMA FONKSİYONU
export async function searchSymbols(query: string) {
  if (!query || query.trim().length === 0) return [];
  const q = query.toUpperCase().trim();

  const knownDirectory = [
    { symbol: "NVDA", company_name: "NVIDIA Corporation", sector: "Teknoloji" },
    { symbol: "AAPL", company_name: "Apple Inc.", sector: "Teknoloji" },
    { symbol: "MSFT", company_name: "Microsoft Corporation", sector: "Teknoloji" },
    { symbol: "MU", company_name: "Micron Technology, Inc.", sector: "Teknoloji" },
    { symbol: "AMD", company_name: "Advanced Micro Devices, Inc.", sector: "Teknoloji" },
    { symbol: "TSLA", company_name: "Tesla, Inc.", sector: "Tüketim" },
    { symbol: "PLTR", company_name: "Palantir Technologies Inc.", sector: "Teknoloji" },
    { symbol: "AMZN", company_name: "Amazon.com, Inc.", sector: "Tüketim" },
    { symbol: "GOOGL", company_name: "Alphabet Inc.", sector: "İletişim" },
    { symbol: "META", company_name: "Meta Platforms, Inc.", sector: "İletişim" },
    { symbol: "LLY", company_name: "Eli Lilly and Company", sector: "Sağlık" },
    { symbol: "AVGO", company_name: "Broadcom Inc.", sector: "Teknoloji" },
  ];

  return knownDirectory.filter(
    (item) => item.symbol.includes(q) || item.company_name.toUpperCase().includes(q)
  );
}