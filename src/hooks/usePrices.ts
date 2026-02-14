import { useState, useCallback } from 'react';
import { usePortfolioStore } from '../store/portfolioStore';
import { fetchQuotes } from '../services/yahooFinanceApi';
import { getHelsinkiDate } from '../utils/timezone';

export function usePrices() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const portfolios = usePortfolioStore((state) => state.portfolios);
  const apiKey = usePortfolioStore((state) => state.apiKey);
  const updatePrices = usePortfolioStore((state) => state.updatePrices);
  const setPriceCache = usePortfolioStore((state) => state.setPriceCache);
  const setLastRefreshDate = usePortfolioStore((state) => state.setLastRefreshDate);
  const priceCache = usePortfolioStore((state) => state.priceCache);

  const refreshPrices = useCallback(async (): Promise<boolean> => {
    if (!apiKey) {
      setError('API-avain puuttuu');
      return false;
    }

    // Collect all unique symbols from all portfolios
    const allSymbols = new Set<string>();
    portfolios.forEach((portfolio) => {
      portfolio.stocks.forEach((stock) => {
        allSymbols.add(stock.symbol);
      });
    });

    if (allSymbols.size === 0) {
      return true; // No stocks to fetch
    }

    setIsLoading(true);
    setError(null);

    try {
      const prices = await fetchQuotes(Array.from(allSymbols), apiKey);
      
      // Update store with new prices
      updatePrices(prices);
      
      // Update cache
      setPriceCache({
        data: prices,
        timestamp: Date.now(),
      });
      
      // Update last refresh date
      setLastRefreshDate(getHelsinkiDate());
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Tuntematon virhe';
      setError(errorMessage);
      
      // If we have cached prices, use those as fallback
      if (priceCache) {
        updatePrices(priceCache.data);
      }
      
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [apiKey, portfolios, updatePrices, setPriceCache, setLastRefreshDate, priceCache]);

  return {
    isLoading,
    error,
    refreshPrices,
  };
}
