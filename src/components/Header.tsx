import { useMemo } from 'react';
import { usePortfolioStore } from '../store/portfolioStore';
import { formatCurrency, formatChange, formatPercentage, formatTimestamp } from '../utils/format';

interface HeaderProps {
  isApiConnected: boolean;
  lastUpdateTimestamp?: number;
}

export function Header({ isApiConnected, lastUpdateTimestamp }: HeaderProps) {
  const portfolios = usePortfolioStore((state) => state.portfolios);
  const activePortfolioId = usePortfolioStore((state) => state.activePortfolioId);

  const activePortfolio = useMemo(
    () => portfolios.find((p) => p.id === activePortfolioId),
    [portfolios, activePortfolioId]
  );

  const stats = useMemo(() => {
    if (!activePortfolio) {
      return { totalValue: 0, totalCost: 0, profit: 0, profitPercentage: 0 };
    }

    let totalValue = 0;
    let totalCost = 0;

    activePortfolio.stocks.forEach((stock) => {
      const value = stock.currentPrice * stock.shares;
      const cost = stock.purchasePrice * stock.shares;
      totalValue += value;
      totalCost += cost;
    });

    const profit = totalValue - totalCost;
    const profitPercentage = totalCost > 0 ? (profit / totalCost) * 100 : 0;

    return { totalValue, totalCost, profit, profitPercentage };
  }, [activePortfolio]);

  const profitData = formatChange(stats.profit);
  const profitPercentageData = formatPercentage(stats.profitPercentage);

  return (
    <header className="bg-gradient-to-b from-gray-900 to-black border-b border-gray-800 px-4 py-6 safe-area-top">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold bg-gradient-purple-pink bg-clip-text text-transparent">
            Osakesalkku
          </h1>
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${
                isApiConnected ? 'bg-green-500 shadow-green-500/50' : 'bg-red-500 shadow-red-500/50'
              } shadow-lg`}
              title={isApiConnected ? 'API yhdistetty' : 'API ei yhdistetty'}
            />
            {lastUpdateTimestamp && (
              <span className="text-xs text-gray-400">
                {formatTimestamp(lastUpdateTimestamp)}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
            <div className="text-gray-400 text-sm mb-1">Salkun arvo</div>
            <div className="text-2xl font-bold text-white">
              {formatCurrency(stats.totalValue)}
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
            <div className="text-gray-400 text-sm mb-1">Tuotto €</div>
            <div className={`text-2xl font-bold ${profitData.colorClass}`}>
              {profitData.text}
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
            <div className="text-gray-400 text-sm mb-1">Tuotto %</div>
            <div className={`text-2xl font-bold ${profitPercentageData.colorClass}`}>
              {profitPercentageData.text}
            </div>
          </div>
        </div>

        <div className="mt-3 text-xs text-gray-500 text-center">
          Automaattinen päivitys ma-pe klo 14:00
        </div>
      </div>
    </header>
  );
}
