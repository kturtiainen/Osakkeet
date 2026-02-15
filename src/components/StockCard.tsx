import { useMemo } from 'react';
import type { Stock } from '../types';
import { formatNumber, formatPercentage, formatCurrencyWithSymbol } from '../utils/format';

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

  const profitData = formatPercentage(stats.profitPercentage);
  
  // Daily change data
  const hasDailyChange = stock.priceChange !== undefined && stock.priceChangePercent !== undefined;
  const isDailyPositive = (stock.priceChange ?? 0) >= 0;
  // Note: daily change uses lighter text colors (green/red-400) than overall profit (green/red-500 via formatPercentage)
  // to visually distinguish intraday movement from total performance.
  const dailyChangeColor = isDailyPositive ? 'text-green-400' : 'text-red-400';
  const dailyChangeBgColor = isDailyPositive ? 'bg-green-500/20 border-green-500/30' : 'bg-red-500/20 border-red-500/30';
  const dailyChangeIcon = isDailyPositive ? '▲' : '▼';
  const currency = stock.currency || 'EUR';

  return (
    <div className="relative overflow-hidden bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-800 hover:border-gray-700 transition-all duration-300 group">
      {/* Gradient left border */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-pink-500" />
      
      <div className="p-5 pl-6">
        {/* Header with symbol and daily change badge */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold bg-gradient-purple-pink bg-clip-text text-transparent truncate">
              {stock.name || stock.symbol}
            </h3>
            {stock.name && (
              <p className="text-xs text-gray-500 mt-0.5">{stock.symbol}</p>
            )}
          </div>
          
          {/* Daily change badge */}
          {hasDailyChange && (
            <span
              className={`
                flex-shrink-0 ml-3 px-3 py-1 rounded-full text-sm font-semibold border
                ${dailyChangeBgColor} ${dailyChangeColor}
              `}
            >
              {dailyChangeIcon} {Math.abs(stock.priceChangePercent ?? 0).toFixed(2)}%
            </span>
          )}
        </div>

        {/* Price and daily change */}
        <div className="mb-4">
          <div className="text-3xl font-bold text-white mb-1">
            {formatCurrencyWithSymbol(stock.currentPrice ?? 0, currency)}
          </div>
          
          {/* Daily change in currency */}
          {hasDailyChange && (
            <div className={`text-sm font-medium ${dailyChangeColor}`}>
              {isDailyPositive ? '+' : ''}{formatCurrencyWithSymbol(stock.priceChange ?? 0, currency)} tänään
            </div>
          )}
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-gray-500 mb-1">Osakkeita</div>
            <div className="text-lg font-semibold text-white">
              {formatNumber(stock.shares)}
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-500 mb-1">Hankintahinta</div>
            <div className="text-lg font-semibold text-white">
              {formatCurrencyWithSymbol(stock.purchasePrice, currency)}
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-500 mb-1">Arvo yhteensä</div>
            <div className="text-lg font-semibold text-white">
              {formatCurrencyWithSymbol(stats.totalValue, currency)}
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-500 mb-1">Tuotto</div>
            <div className={`text-lg font-semibold ${profitData.colorClass}`}>
              {stats.profit >= 0 ? '+' : ''}{formatCurrencyWithSymbol(stats.profit, currency)}
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
