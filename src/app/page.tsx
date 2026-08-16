// src/app/page.tsx

import { 
  getScreener, 
  getMacroSnapshot, 
  getFlashNews, 
  getMarketBreadth, 
  getSectorRotation 
} from "@/lib/api";
import { MarketRegimeBanner } from "@/components/dashboard/MarketRegimeBanner";
import { SectorHeatmap } from "@/components/dashboard/SectorHeatmap";
import { SmartMoneyGrid } from "@/components/dashboard/SmartMoneyGrid";
import { TopRatedTable } from "@/components/dashboard/TopRatedTable";
import { SectorRotationRadar } from "@/components/dashboard/SectorRotationRadar";
import { FlashNewsCard } from "@/components/stock/FlashNewsCard";
import { MarketMoversWidget } from "@/components/dashboard/MarketMoversWidget";
import { MarketBreadthWidget } from "@/components/dashboard/MarketBreadthWidget";

export const revalidate = 30;

export default async function DashboardPage() {
  const [screenerData, macroData, newsData, breadthData, rotationData] = await Promise.all([
    getScreener(),
    getMacroSnapshot(),
    getFlashNews(),
    getMarketBreadth(),
    getSectorRotation(),
  ]);

  const rawScreener: any = screenerData;
  const screenerRows = Array.isArray(rawScreener)
    ? rawScreener
    : Array.isArray(rawScreener?.signals)
    ? rawScreener.signals
    : [];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* 1. Üst Makro Rejim Bannerı */}
      <MarketRegimeBanner macro={macroData as any} />

      {/* 2. Günün İvme Kazananları Bannerı */}
      <MarketMoversWidget rows={screenerRows} />

      {/* 3. Canlı Piyasa Genişliği & Duyarlılık Nabzı */}
      <MarketBreadthWidget data={breadthData} />

      {/* 4. Ana Izgara (%75 Sol / %25 Sağ Panel) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 xl:col-span-9 space-y-6">
          <SectorHeatmap rows={screenerRows} />
          <SmartMoneyGrid rows={screenerRows} />
          <TopRatedTable rows={screenerRows} />
        </div>

        {/* Sağ Panel: RRG Sektörel Rotasyon Radarı + Flash Haberler */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-6">
          <SectorRotationRadar data={rotationData} />
          <FlashNewsCard news={newsData} />
        </div>
      </div>
    </div>
  );
}