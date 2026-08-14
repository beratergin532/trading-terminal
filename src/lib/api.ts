const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://borsa-motoru.onrender.com/api/v1";

// 1. Piyasa Tarayıcısı (Screener)
export async function getScreener(): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/screener`, {
      cache: "no-store",
      next: { revalidate: 0 },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("Canlı borsa tarayıcı hatası:", err);
    return null;
  }
}

// 2. Makro Piyasa Göstergeleri
export async function getMacroSnapshot(): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/macro`, {
      cache: "no-store",
      next: { revalidate: 0 },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("Canlı makro veri hatası:", err);
    return null;
  }
}

// 3. Flaş Şirket Haberleri
export async function getFlashNews(symbol?: string): Promise<any> {
  try {
    const url = symbol 
      ? `${API_BASE}/news?symbol=${symbol}` 
      : `${API_BASE}/news`;
      
    const res = await fetch(url, {
      cache: "no-store",
      next: { revalidate: 0 },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("Canlı haber akışı hatası:", err);
    return [];
  }
}

// 4. Hisse Detay & Gerçek AI Analizi
export async function getStockDetail(symbol: string): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/stock/${symbol.toUpperCase()}`, {
      cache: "no-store",
      next: { revalidate: 0 },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error(`${symbol} hisse detay hatası:`, err);
    return null;
  }
}