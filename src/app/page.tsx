import { getScreener, getMacroSnapshot, getFlashNews } from "@/lib/api";
import { MarketRegimeBanner } from "@/components/dashboard/MarketRegimeBanner";
import { SectorHeatmap } from "@/components/dashboard/SectorHeatmap";
import { SmartMoneyGrid } from "@/components/dashboard/SmartMoneyGrid";
import { TopRatedTable } from "@/components/dashboard/TopRatedTable";
import { SectorMomentumWidget } from "@/components/dashboard/SectorMomentumWidget";
import { FlashNewsCard } from "@/components/stock/FlashNewsCard";
import { MarketMoversWidget } from "@/components/dashboard/MarketMoversWidget";

export const revalidate = 30;

export default async function DashboardPage() {
  const [screenerData, macroData, newsData] = await Promise.all([
    getScreener(),
    getMacroSnapshot(),
    getFlashNews(),
  ]);

  const screenerRows = Array.isArray(screenerData)
    ? screenerData
    : screenerData?.signals && Array.isArray(screenerData.signals)
    ? screenerData.signals
    : [];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Üst Makro Rejim Bannerı */}
      <MarketRegimeBanner macro={macroData} />

      {/* FINVEST TARZI GÜNÜN İVME KAZANANLARI BANNERI */}
      <MarketMoversWidget rows={screenerRows} />

      {/* Izgara (%70 / %30) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 xl:col-span-9 space-y-6">
          <SectorHeatmap rows={screenerRows} />
          <SmartMoneyGrid rows={screenerRows} />
          <TopRatedTable rows={screenerRows} />
        </div>

        <div className="lg:col-span-4 xl:col-span-3 space-y-6">
          <SectorMomentumWidget rows={screenerRows} />
          <FlashNewsCard news={newsData} />
        </div>
      </div>
    </div>
  );
}