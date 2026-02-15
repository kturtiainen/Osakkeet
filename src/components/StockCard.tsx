import { useMemo } from 'react';
import type { Stock } from '../types';
import { formatCurrency, formatNumber, formatPercentage } from '../utils/format';

interface StockCardProps {
  stock: Stock;
}

export function StockCard({ stock }: StockCardProps) {
  const stats = useMemo(() => {
    const totalValue = stock.currentPrice * stock.shares;
    const totalCost = stock.purchasePrice * stock.shares;
    const profit = totalValue - totalCost;
    const profitPercentage = (profit / totalCost) * 100;
    const priceChange = ((stock.currentPrice - stock.purchasePrice) / stock.purchasePrice) * 100;

    return {
      totalValue,
      totalCost,
      profit,
      profitPercentage,
      priceChange,
    };
  }, [stock]);

  const changeData = formatPercentage(stats.priceChange);
  const profitData = formatPercentage(stats.profitPercentage);

  return (
    <div className="relative overflow-hidden bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-800 hover:border-gray-700 transition-all duration-300 group">
      {/* Gradient left border */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-pink-500" />
      
      <div className="p-5 pl-6">
        {/* Header with symbol and change badge */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold bg-gradient-purple-pink bg-clip-text text-transparent">
              {stock.name || stock.symbol}
            </h3>
            {stock.name && (
              <p className="text-xs text-gray-500 mt-1">{stock.symbol}</p>
            )}
          </div>
          <span
            className={`
              px-3 py-1 rounded-full text-sm font-semibold
              ${
                stats.priceChange >= 0
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }
            `}
          >
            {changeData.text}
          </span>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-gray-500 mb-1">Nykyinen hinta</div>
            <div className="text-lg font-semibold text-white">
              {formatCurrency(stock.currentPrice)}
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-500 mb-1">Osakkeita</div>
            <div className="text-lg font-semibold text-white">
              {formatNumber(stock.shares)}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">Hankintahinta</div>
            <div className="text-lg font-semibold text-white">
              {formatCurrency(stock.purchasePrice)}
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-500 mb-1">Arvo yhteensä</div>
            <div className="text-lg font-semibold text-white">
              {formatCurrency(stats.totalValue)}
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-500 mb-1">Tuotto</div>
            <div className={`text-lg font-semibold ${profitData.colorClass}`}>
              {formatCurrency(stats.profit)}
            </div>
            <div className={`text-xs ${profitData.colorClass}`}>
              {profitData.text}
            </div>
          </div>
        </div>

        {/* Hover effect - subtle glow */}
        <div className="absolute inset-0 bg-gradient-purple-pink opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none" />
      </div>
    </div>
  );
}
