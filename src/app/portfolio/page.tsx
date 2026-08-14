import { PaperTradingTable } from "@/components/portfolio/PaperTradingTable";
import { getPaperTrades } from "@/lib/api";

export const revalidate = 10;

export default async function PortfolioPage() {
  const trades = await getPaperTrades();

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-6">
      <div>
        <h1 className="font-sans text-lg font-semibold text-paper">Portföy</h1>
        <p className="font-sans text-sm text-paper-muted">
          Otonom motorun kağıt üzerinde yürüttüğü işlemlerin canlı kâr/zarar takibi.
        </p>
      </div>
      <PaperTradingTable trades={trades} />
    </div>
  );
}
