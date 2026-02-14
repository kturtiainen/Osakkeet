import { useMemo } from 'react';
import { usePortfolioStore } from '../store/portfolioStore';
import { formatCurrency } from '../utils/format';

interface StockListProps {
  onDelete: (symbol: string) => void;
}

export function StockList({ onDelete }: StockListProps) {
  const portfolios = usePortfolioStore((state) => state.portfolios);
  const activePortfolioId = usePortfolioStore((state) => state.activePortfolioId);

  const activePortfolio = useMemo(
    () => portfolios.find((p) => p.id === activePortfolioId),
    [portfolios, activePortfolioId]
  );

  if (!activePortfolio || activePortfolio.stocks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Ei osakkeita tässä salkussa
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {activePortfolio.stocks.map((stock) => (
        <div
          key={stock.symbol}
          className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg
                     border border-gray-700/50 hover:border-gray-600 transition-colors"
        >
          <div className="flex-1">
            <div className="font-semibold text-white">{stock.symbol}</div>
            <div className="text-sm text-gray-400">
              {stock.shares} kpl @ {formatCurrency(stock.purchasePrice)}
            </div>
          </div>
          <button
            onClick={() => {
              if (confirm(`Haluatko varmasti poistaa osakkeen ${stock.symbol}?`)) {
                onDelete(stock.symbol);
              }
            }}
            className="px-3 py-1 text-red-400 hover:text-red-300 hover:bg-red-500/10
                       rounded transition-colors"
            aria-label={`Poista ${stock.symbol}`}
          >
            🗑️ Poista
          </button>
        </div>
      ))}
    </div>
  );
}
