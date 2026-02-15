import { useMemo } from 'react';
import { usePortfolioStore } from '../store/portfolioStore';
import { formatCurrency } from '../utils/format';
import { useDialog } from '../hooks/useDialog';
import { Dialog } from './Dialog';

interface StockListProps {
  onDelete: (symbol: string) => void;
}

export function StockList({ onDelete }: StockListProps) {
  const portfolios = usePortfolioStore((state) => state.portfolios);
  const activePortfolioId = usePortfolioStore((state) => state.activePortfolioId);
  const { dialog, showDialog, handleConfirm, handleCancel } = useDialog();

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
            <div className="font-semibold text-white">
              {stock.name || stock.symbol}
            </div>
            <div className="text-sm text-gray-400">
              {stock.name && <span className="text-gray-600">{stock.symbol} • </span>}
              {stock.shares} kpl @ {formatCurrency(stock.purchasePrice)}
            </div>
          </div>
          <button
            onClick={() => {
              void (async () => {
                const confirmed = await showDialog({
                  title: 'Vahvista poisto',
                  message: `Haluatko varmasti poistaa osakkeen ${stock.symbol}?`,
                  confirmText: 'Poista',
                  cancelText: 'Peruuta',
                  type: 'warning',
                });
                if (confirmed) {
                  onDelete(stock.symbol);
                }
              })();
            }}
            className="px-3 py-1 text-red-400 hover:text-red-300 hover:bg-red-500/10
                       rounded transition-colors"
            aria-label={`Poista ${stock.symbol}`}
          >
            🗑️ Poista
          </button>
        </div>
      ))}

      {/* Dialog Component */}
      <Dialog
        isOpen={dialog.isOpen}
        title={dialog.title}
        message={dialog.message}
        confirmText={dialog.confirmText}
        cancelText={dialog.cancelText}
        type={dialog.type}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
}
