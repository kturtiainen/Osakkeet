import { useState, useMemo } from 'react';
import { usePortfolioStore } from '../store/portfolioStore';
import { AddStockForm } from './AddStockForm';
import { StockList } from './StockList';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const apiKey = usePortfolioStore((state) => state.apiKey);
  const setApiKey = usePortfolioStore((state) => state.setApiKey);
  const addStock = usePortfolioStore((state) => state.addStock);
  const removeStock = usePortfolioStore((state) => state.removeStock);
  const portfolios = usePortfolioStore((state) => state.portfolios);
  const activePortfolioId = usePortfolioStore((state) => state.activePortfolioId);

  const [apiKeyInput, setApiKeyInput] = useState(apiKey);
  const [activeTab, setActiveTab] = useState<'api' | 'stocks' | 'export'>('api');

  const activePortfolio = useMemo(
    () => portfolios.find((p) => p.id === activePortfolioId),
    [portfolios, activePortfolioId]
  );

  if (!isOpen) return null;

  const handleSaveApiKey = () => {
    setApiKey(apiKeyInput.trim());
    alert('API-avain tallennettu!');
  };

  const handleExportApiKey = () => {
    const data = { apiKey };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'osakesalkku-api-key.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportApiKey = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          if (data.apiKey) {
            setApiKeyInput(data.apiKey);
            setApiKey(data.apiKey);
            alert('API-avain tuotu onnistuneesti!');
          }
        } catch {
          alert('Virhe tiedoston lukemisessa');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleExportPortfolio = () => {
    if (!activePortfolio) return;

    const data = {
      portfolio: activePortfolio,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `salkku-${activePortfolio.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportPortfolio = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          if (data.portfolio?.stocks) {
            // Import stocks from the portfolio
            data.portfolio.stocks.forEach((stock: { symbol: string; shares: number; purchasePrice: number }) => {
              addStock({
                symbol: stock.symbol,
                shares: stock.shares,
                purchasePrice: stock.purchasePrice,
              });
            });
            alert('Salkku tuotu onnistuneesti!');
          }
        } catch {
          alert('Virhe tiedoston lukemisessa');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleAddStock = (symbol: string, shares: number, purchasePrice: number) => {
    addStock({ symbol, shares, purchasePrice });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-xl border border-gray-800 max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-2xl font-bold text-white">Asetukset</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl transition-colors"
            aria-label="Sulje"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-800">
          <button
            onClick={() => setActiveTab('api')}
            className={`flex-1 px-6 py-3 font-medium transition-colors ${
              activeTab === 'api'
                ? 'bg-gradient-purple-pink text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            🔑 API-avain
          </button>
          <button
            onClick={() => setActiveTab('stocks')}
            className={`flex-1 px-6 py-3 font-medium transition-colors ${
              activeTab === 'stocks'
                ? 'bg-gradient-purple-pink text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            📊 Osakkeet
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`flex-1 px-6 py-3 font-medium transition-colors ${
              activeTab === 'export'
                ? 'bg-gradient-purple-pink text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            💾 Vie/Tuo
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'api' && (
            <div className="space-y-4">
              <p className="text-gray-400 text-sm">
                Hanki ilmainen API-avain:{' '}
                <a
                  href="https://rapidapi.com/sparior/api/yahoo-finance15"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 underline"
                >
                  RapidAPI Yahoo Finance
                </a>
              </p>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  RapidAPI-avain
                </label>
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg
                             text-white focus:border-purple-500 focus:outline-none
                             transition-colors"
                  placeholder="Syötä API-avain"
                />
              </div>

              <button
                onClick={handleSaveApiKey}
                className="w-full px-6 py-3 bg-gradient-purple-pink text-white rounded-lg font-semibold
                           hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
              >
                💾 Tallenna API-avain
              </button>

              <div className="flex gap-2">
                <button
                  onClick={handleExportApiKey}
                  className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg
                             transition-colors"
                >
                  📤 Vie JSON
                </button>
                <button
                  onClick={handleImportApiKey}
                  className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg
                             transition-colors"
                >
                  📥 Tuo JSON
                </button>
              </div>

              <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <p className="text-yellow-400 text-sm">
                  ⚠️ <strong>Huomio:</strong> Ilmainen taso on rajoitettu 100 pyyntöön/kuukausi.
                  Sovellus päivittää hinnat automaattisesti kerran päivässä klo 14:00 (ma-pe).
                </p>
              </div>
            </div>
          )}

          {activeTab === 'stocks' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Lisää uusi osake</h3>
                <AddStockForm onAdd={handleAddStock} />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-4">
                  Nykyiset osakkeet ({activePortfolio?.name})
                </h3>
                <StockList onDelete={removeStock} />
              </div>
            </div>
          )}

          {activeTab === 'export' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Salkun varmuuskopiointi</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Vie salkku JSON-tiedostona varmuuskopioksi tai siirrä se toiselle laitteelle.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={handleExportPortfolio}
                    className="px-6 py-3 bg-gradient-purple-pink text-white rounded-lg font-semibold
                               hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
                  >
                    💾 Vie salkku
                  </button>
                  <button
                    onClick={handleImportPortfolio}
                    className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-semibold
                               transition-colors"
                  >
                    📂 Tuo salkku
                  </button>
                </div>
              </div>

              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-blue-400 text-sm">
                  💡 <strong>Vinkki:</strong> Vie salkku säännöllisesti varmuuskopioksi.
                  iOS voi tyhjentää sovelluksen tiedot jos laitteen tila loppuu.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
