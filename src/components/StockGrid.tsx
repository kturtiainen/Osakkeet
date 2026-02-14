import { useMemo } from 'react';
import { usePortfolioStore } from '../store/portfolioStore';
import { StockCard } from './StockCard';

export function StockGrid() {
  const portfolios = usePortfolioStore((state) => state.portfolios);
  const activePortfolioId = usePortfolioStore((state) => state.activePortfolioId);

  const activePortfolio = useMemo(
    () => portfolios.find((p) => p.id === activePortfolioId),
    [portfolios, activePortfolioId]
  );

  if (!activePortfolio || activePortfolio.stocks.length === 0) {
    return null;
  }

  return (
    <div className="px-4 py-6">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
        {activePortfolio.stocks.map((stock) => (
          <StockCard key={stock.symbol} stock={stock} />
        ))}
      </div>
    </div>
  );
}
