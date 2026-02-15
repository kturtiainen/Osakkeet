import { useState } from 'react';
import { validateStock, sanitizeSymbol } from '../utils/validation';

interface AddStockFormProps {
  onAdd: (symbol: string, shares: number, purchasePrice: number) => void;
}

export function AddStockForm({ onAdd }: AddStockFormProps) {
  const [symbol, setSymbol] = useState('');
  const [shares, setShares] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const sanitizedSymbol = sanitizeSymbol(symbol);
    const sharesNum = parseFloat(shares);
    const priceNum = parseFloat(purchasePrice);

    const validation = validateStock(sanitizedSymbol, sharesNum, priceNum);

    if (!validation.valid) {
      setError(validation.error || 'Virheelliset tiedot');
      return;
    }

    onAdd(sanitizedSymbol, sharesNum, priceNum);
    
    // Clear form
    setSymbol('');
    setShares('');
    setPurchasePrice('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Symboli (esim. NOKIA.HE, AAPL)
        </label>
        <input
          type="text"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg
                     text-white focus:border-purple-500 focus:outline-none
                     transition-colors"
          placeholder="NOKIA.HE"
          maxLength={20}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Osakkeiden määrä
          </label>
          <input
            type="number"
            value={shares}
            onChange={(e) => setShares(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg
                       text-white focus:border-purple-500 focus:outline-none
                       transition-colors"
            placeholder="100"
            min="0"
            max="1000000000"
            step="any"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Hankintahinta (€)
          </label>
          <input
            type="number"
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg
                       text-white focus:border-purple-500 focus:outline-none
                       transition-colors"
            placeholder="4.50"
            min="0"
            max="1000000000"
            step="0.01"
          />
        </div>
      </div>

      {error && (
        <div className="px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        className="w-full px-6 py-3 bg-gradient-purple-pink text-white rounded-lg font-semibold
                   hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
      >
        + Lisää osake
      </button>
    </form>
  );
}
