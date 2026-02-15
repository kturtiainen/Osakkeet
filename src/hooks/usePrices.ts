import { useState, useCallback, useRef } from 'react';
import { usePortfolioStore } from '../store/portfolioStore';
import { fetchQuotes } from '../services/yahooFinanceApi';
import { getHelsinkiDate } from '../utils/timezone';
import { decrypt } from '../utils/crypto';
import type { PriceCache } from '../types';

/**
 * Check if price cache is still valid (less than 24 hours old)
 */
const isCacheValid = (cache: PriceCache | null): boolean => {
  if (!cache) return false;
  const age = Date.now() - cache.timestamp;
  return age < 24 * 60 * 60 * 1000; // 24 hours
};

export function usePrices() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const isRefreshingRef = useRef(false);

  const updatePrices = usePortfolioStore((state) => state.updatePrices);
  const updateStockNames = usePortfolioStore((state) => state.updateStockNames);
  const updateStockChanges = usePortfolioStore((state) => state.updateStockChanges);
  const updateStockChangePercents = usePortfolioStore((state) => state.updateStockChangePercents);
  const updateStockCurrencies = usePortfolioStore((state) => state.updateStockCurrencies);
  const setPriceCache = usePortfolioStore((state) => state.setPriceCache);
  const setLastRefreshDate = usePortfolioStore((state) => state.setLastRefreshDate);

  const refreshPrices = useCallback(async (): Promise<boolean> => {
    if (isRefreshingRef.current) return false;
    isRefreshingRef.current = true;

    const { apiKey, portfolios, priceCache } = usePortfolioStore.getState();

    // Decrypt the API key before using it
    const decryptedKey = decrypt(apiKey);
    if (!decryptedKey) {
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
      const result = await fetchQuotes(Array.from(allSymbols), decryptedKey);
      
      // Update prices and names
      updatePrices(result.prices);
      updateStockNames(result.names);
      
      // Update daily change data
      updateStockChanges(result.changes);
      updateStockChangePercents(result.changePercents);
      updateStockCurrencies(result.currencies);
      
      // Update cache with all new fields
      setPriceCache({ 
        data: result.prices, 
        names: result.names,
        changes: result.changes,
        changePercents: result.changePercents,
        currencies: result.currencies,
        timestamp: Date.now() 
      });
      
      setLastRefreshDate(getHelsinkiDate());
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Tuntematon virhe';
      setError(errorMessage);
      // Use cached prices if valid, otherwise keep current prices
      if (priceCache && isCacheValid(priceCache)) {
        updatePrices(priceCache.data);
        if (priceCache.names) {
          updateStockNames(priceCache.names);
        }
        if (priceCache.changes) {
          updateStockChanges(priceCache.changes);
        }
        if (priceCache.changePercents) {
          updateStockChangePercents(priceCache.changePercents);
        }
        if (priceCache.currencies) {
          updateStockCurrencies(priceCache.currencies);
        }
      }
      return false;
    } finally {
      setIsLoading(false);
      isRefreshingRef.current = false;
    }
  }, [updatePrices, updateStockNames, updateStockChanges, updateStockChangePercents, updateStockCurrencies, setPriceCache, setLastRefreshDate]);

  return {
    isLoading,
    error,
    refreshPrices,
  };
}
