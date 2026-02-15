import { useState, useMemo, useCallback } from 'react';
import { usePortfolioStore } from './store/portfolioStore';
import { usePrices } from './hooks/usePrices';
import { useDailyRefresh } from './hooks/useDailyRefresh';
import { useStatus } from './hooks/useStatus';
import { useDialog } from './hooks/useDialog';
import { Header } from './components/Header';
import { PortfolioTabs } from './components/PortfolioTabs';
import { StockGrid } from './components/StockGrid';
import { EmptyState } from './components/EmptyState';
import { FloatingButtons } from './components/FloatingButtons';
import { SettingsModal } from './components/SettingsModal';
import { StatusBar } from './components/StatusBar';
import { Dialog } from './components/Dialog';

function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const portfolios = usePortfolioStore((state) => state.portfolios);
  const activePortfolioId = usePortfolioStore((state) => state.activePortfolioId);
  // Use minimal selectors to reduce re-renders
  const hasApiKey = usePortfolioStore((state) => !!state.apiKey);
  const lastUpdateTimestamp = usePortfolioStore((state) => state.priceCache?.timestamp);

  const { isLoading, refreshPrices } = usePrices();
  const { messages, showSuccess, showError, showWarning, removeMessage } = useStatus();
  const { dialog, showDialog, handleConfirm, handleCancel } = useDialog();

  // Memoize the auto-refresh callback to prevent infinite re-renders
  const handleAutoRefresh = useCallback(() => {
    showSuccess('Hinnat päivitetty automaattisesti');
  }, [showSuccess]);

  // Automatic daily refresh
  useDailyRefresh(handleAutoRefresh);

  const activePortfolio = useMemo(
    () => portfolios.find((p) => p.id === activePortfolioId),
    [portfolios, activePortfolioId]
  );

  const hasStocks = useMemo(
    () => activePortfolio && activePortfolio.stocks.length > 0,
    [activePortfolio]
  );

  const handleRefresh = async () => {
    if (!hasApiKey) {
      showWarning('Aseta API-avain ensin asetuksista');
      setIsSettingsOpen(true);
      return;
    }

    const confirmed = await showDialog({
      title: 'Vahvista päivitys',
      message: 'Haluatko varmasti päivittää hinnat manuaalisesti?\n\n' +
        'Huomio: Ilmainen API-taso on rajoitettu 100 pyyntöön/kuukausi.\n' +
        'Automaattinen päivitys tapahtuu kerran päivässä klo 14:00 (ma-pe).',
      confirmText: 'Kyllä, päivitä',
      cancelText: 'Peruuta',
      type: 'warning',
    });

    if (!confirmed) return;

    const success = await refreshPrices();
    if (success) {
      showSuccess('Hinnat päivitetty onnistuneesti!');
    } else {
      showError('Hintojen päivitys epäonnistui. Tarkista API-avain ja verkkoyhteys.');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <StatusBar messages={messages} onDismiss={removeMessage} />
      
      <Header
        isApiConnected={hasApiKey}
        lastUpdateTimestamp={lastUpdateTimestamp}
      />

      <PortfolioTabs />

      {hasStocks ? (
        <StockGrid />
      ) : (
        <EmptyState onOpenSettings={() => setIsSettingsOpen(true)} />
      )}

      <FloatingButtons
        onRefresh={() => {
          void handleRefresh();
        }}
        onSettings={() => setIsSettingsOpen(true)}
        isRefreshing={isLoading}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

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

export default App;
