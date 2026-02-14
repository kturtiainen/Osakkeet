import { useState, useMemo } from 'react';
import { usePortfolioStore } from './store/portfolioStore';
import { usePrices } from './hooks/usePrices';
import { useDailyRefresh } from './hooks/useDailyRefresh';
import { useStatus } from './hooks/useStatus';
import { Header } from './components/Header';
import { PortfolioTabs } from './components/PortfolioTabs';
import { StockGrid } from './components/StockGrid';
import { EmptyState } from './components/EmptyState';
import { FloatingButtons } from './components/FloatingButtons';
import { SettingsModal } from './components/SettingsModal';
import { StatusBar } from './components/StatusBar';

function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const portfolios = usePortfolioStore((state) => state.portfolios);
  const activePortfolioId = usePortfolioStore((state) => state.activePortfolioId);
  const apiKey = usePortfolioStore((state) => state.apiKey);
  const priceCache = usePortfolioStore((state) => state.priceCache);

  const { isLoading, refreshPrices } = usePrices();
  const { messages, showSuccess, showError, showWarning, removeMessage } = useStatus();

  // Automatic daily refresh
  useDailyRefresh(() => {
    showSuccess('Hinnat päivitetty automaattisesti');
  });

  const activePortfolio = useMemo(
    () => portfolios.find((p) => p.id === activePortfolioId),
    [portfolios, activePortfolioId]
  );

  const hasStocks = useMemo(
    () => activePortfolio && activePortfolio.stocks.length > 0,
    [activePortfolio]
  );

  const handleRefresh = async () => {
    if (!apiKey) {
      showWarning('Aseta API-avain ensin asetuksista');
      setIsSettingsOpen(true);
      return;
    }

    const confirmed = confirm(
      'Haluatko varmasti päivittää hinnat manuaalisesti?\n\n' +
      'Huomio: Ilmainen API-taso on rajoitettu 100 pyyntöön/kuukausi.\n' +
      'Automaattinen päivitys tapahtuu kerran päivässä klo 14:00 (ma-pe).'
    );

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
        isApiConnected={!!apiKey}
        lastUpdateTimestamp={priceCache?.timestamp}
      />

      <PortfolioTabs />

      {hasStocks ? (
        <StockGrid />
      ) : (
        <EmptyState onOpenSettings={() => setIsSettingsOpen(true)} />
      )}

      <FloatingButtons
        onRefresh={handleRefresh}
        onSettings={() => setIsSettingsOpen(true)}
        isRefreshing={isLoading}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}

export default App;
