// src/app/stock/[symbol]/page.tsx

import { getStockDetail, getFlashNews } from "@/lib/api";
import { PriceHeader } from "@/components/stock/PriceHeader";
import { ChartView } from "@/components/stock/ChartView";
import { StockInsightBanner } from "@/components/stock/StockInsightBanner";
import { AISummaryCard } from "@/components/stock/AISummaryCard";
import { AnalystConsensusBar } from "@/components/stock/AnalystConsensusBar";
import { PeerComparisonTable } from "@/components/stock/PeerComparisonTable";
import { FlashNewsCard } from "@/components/stock/FlashNewsCard";
import { QuantGradesGrid } from "@/components/stock/QuantGradesGrid";
import { MarketContextSidebar } from "@/components/stock/MarketContextSidebar";
import { RevenueFlowCard } from "@/components/stock/RevenueFlowCard";

export const revalidate = 0;

export default async function StockDetailPage({ params }: { params: { symbol: string } }) {
  const symbol = params.symbol.toUpperCase();

  const [stockResponse, newsData] = await Promise.all([
    getStockDetail(symbol),
    getFlashNews(symbol, 10),
  ]);

  if (!stockResponse || !stockResponse.market_data) {
    return (
      <div className="p-12 text-center font-mono text-rose-400 bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl mx-auto my-12">
        ⚠️ '{symbol}' kodlu hisse için canlı piyasa verisine şu an ulaşılamadı.
      </div>
    );
  }

  const { market_data, ai_report, risk_management } = stockResponse;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto p-2 lg:p-4">
      {/* 1. Üst Başlık (Günlük Aralık + Piyasa Öncesi + PDF + Canlı Ritim) */}
      <PriceHeader market={market_data} />

      {/* 2. Ana Akış Izgarası (%75 Sol / %25 Sağ Panel) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 xl:col-span-9 space-y-6">
          {/* Canlı Grafik */}
          <ChartView symbol={symbol} />

          {/* Midas Tarzı Canlı Haber/Katalizör Notu */}
          <StockInsightBanner report={ai_report} news={newsData} />

          {/* Yapay Zeka Boğa / Ayı Analizi */}
          <AISummaryCard report={ai_report} market={market_data} />

          {/* Analist Tahminleri (Al/Tut/Sat Barları) */}
          <AnalystConsensusBar 
            consensus={market_data.analyst_consensus} 
            currentPrice={market_data.last_close} 
          />

          {/* Gelir Akış Şeması */}
          <RevenueFlowCard market={market_data} />

          {/* Kantitatif Faktör Karnesi */}
          {market_data.quant_grades && (
            <QuantGradesGrid grades={market_data.quant_grades} />
          )}

          {/* Sektörel Rakipler Tablosu */}
          <PeerComparisonTable 
            currentSymbol={symbol} 
            sector={market_data.sector} 
            peers={market_data.peers || []} 
          />
        </div>

        {/* Sağ Panel */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-6">
          <MarketContextSidebar 
            market={market_data} 
            report={ai_report} 
            risk={risk_management} 
          />
          <FlashNewsCard news={newsData} />
        </div>
      </div>
    </div>
  );
}