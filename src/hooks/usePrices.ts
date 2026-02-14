import { useState, useCallback, useRef } from 'react';
import { usePortfolioStore } from '../store/portfolioStore';
import { fetchQuotes } from '../services/yahooFinanceApi';
import { getHelsinkiDate } from '../utils/timezone';

export function usePrices() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const isRefreshingRef = useRef(false);

  const updatePrices = usePortfolioStore((state) => state.updatePrices);
  const setPriceCache = usePortfolioStore((state) => state.setPriceCache);
  const setLastRefreshDate = usePortfolioStore((state) => state.setLastRefreshDate);

  const refreshPrices = useCallback(async (): Promise<boolean> => {
    if (isRefreshingRef.current) return false;
    isRefreshingRef.current = true;

    const { apiKey, portfolios, priceCache } = usePortfolioStore.getState();

    if (!apiKey) {
      setError('API-avain puuttuu');
      isRefreshingRef.current = false;
      return false;
    }

    const allSymbols = new Set<string>();
    portfolios.forEach((portfolio) => {
      portfolio.stocks.forEach((stock) => {
        allSymbols.add(stock.symbol);
      });
    });

    if (allSymbols.size === 0) {
      isRefreshingRef.current = false;
      return true;
    }

    setIsLoading(true);
    setError(null);

    try {
      const prices = await fetchQuotes(Array.from(allSymbols), apiKey);
      updatePrices(prices);
      setPriceCache({ data: prices, timestamp: Date.now() });
      setLastRefreshDate(getHelsinkiDate());
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Tuntematon virhe';
      setError(errorMessage);
      if (priceCache) {
        updatePrices(priceCache.data);
      }
      return false;
    } finally {
      setIsLoading(false);
      isRefreshingRef.current = false;
    }
  }, [updatePrices, setPriceCache, setLastRefreshDate]);

  return {
    isLoading,
    error,
    refreshPrices,
  };
}
