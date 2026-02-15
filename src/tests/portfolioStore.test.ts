import { describe, it, expect, beforeEach, vi } from 'vitest';
import { usePortfolioStore } from '../store/portfolioStore';

// Mock IndexedDB storage
vi.mock('idb-keyval', () => ({
  get: vi.fn(() => Promise.resolve(null)),
  set: vi.fn(() => Promise.resolve()),
  del: vi.fn(() => Promise.resolve()),
}));

// Mock crypto utilities
vi.mock('../utils/crypto', () => ({
  encrypt: vi.fn((value: string) => value),
}));

describe('portfolioStore', () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    // Clear all portfolios and create a fresh default one
    usePortfolioStore.setState({
      portfolios: [{
        id: 'test-portfolio-1',
        name: 'Test Portfolio',
        stocks: [],
        createdAt: new Date().toISOString(),
      }],
      activePortfolioId: 'test-portfolio-1',
      apiKey: '',
      lastRefreshDate: null,
      priceCache: null,
    });
  });

  describe('addStock', () => {
    it('should add a new stock to the active portfolio', () => {
      const { addStock } = usePortfolioStore.getState();
      
      addStock({
        symbol: 'NOKIA.HE',
        shares: 100,
        purchasePrice: 4.50,
      });

      const { portfolios, activePortfolioId } = usePortfolioStore.getState();
      const activePortfolio = portfolios.find(p => p.id === activePortfolioId);
      
      expect(activePortfolio?.stocks).toHaveLength(1);
      expect(activePortfolio?.stocks[0]).toMatchObject({
        symbol: 'NOKIA.HE',
        shares: 100,
        purchasePrice: 4.50,
        currentPrice: 4.50, // Should initialize with purchase price
      });
    });

    it('should update an existing stock instead of adding a duplicate', () => {
      const { addStock } = usePortfolioStore.getState();
      
      // Add stock first time
      addStock({
        symbol: 'NOKIA.HE',
        shares: 100,
        purchasePrice: 4.50,
      });

      // Try to add same stock again with different values
      addStock({
        symbol: 'NOKIA.HE',
        shares: 200,
        purchasePrice: 5.00,
      });

      const { portfolios, activePortfolioId } = usePortfolioStore.getState();
      const activePortfolio = portfolios.find(p => p.id === activePortfolioId);
      
      // Should still have only one stock
      expect(activePortfolio?.stocks).toHaveLength(1);
      
      // Stock should have updated values
      expect(activePortfolio?.stocks[0]).toMatchObject({
        symbol: 'NOKIA.HE',
        shares: 200,
        purchasePrice: 5.00,
      });
    });

    it('should preserve currentPrice when updating an existing stock', () => {
      const { addStock, updateStock } = usePortfolioStore.getState();
      
      // Add stock
      addStock({
        symbol: 'NOKIA.HE',
        shares: 100,
        purchasePrice: 4.50,
      });

      // Simulate a price update (e.g., from API)
      updateStock('NOKIA.HE', { currentPrice: 5.25 });

      // Re-import/update the stock with new purchase data
      addStock({
        symbol: 'NOKIA.HE',
        shares: 150,
        purchasePrice: 4.75,
      });

      const { portfolios, activePortfolioId } = usePortfolioStore.getState();
      const activePortfolio = portfolios.find(p => p.id === activePortfolioId);
      const stock = activePortfolio?.stocks[0];
      
      expect(stock?.shares).toBe(150);
      expect(stock?.purchasePrice).toBe(4.75);
      // Current price should be preserved from previous update
      expect(stock?.currentPrice).toBe(5.25);
    });

    it('should handle multiple different stocks', () => {
      const { addStock } = usePortfolioStore.getState();
      
      addStock({ symbol: 'NOKIA.HE', shares: 100, purchasePrice: 4.50 });
      addStock({ symbol: 'FORTUM.HE', shares: 209, purchasePrice: 19.15 });
      addStock({ symbol: 'AKTIA.HE', shares: 323, purchasePrice: 12.40 });

      const { portfolios, activePortfolioId } = usePortfolioStore.getState();
      const activePortfolio = portfolios.find(p => p.id === activePortfolioId);
      
      expect(activePortfolio?.stocks).toHaveLength(3);
      expect(activePortfolio?.stocks.map(s => s.symbol)).toEqual([
        'NOKIA.HE',
        'FORTUM.HE',
        'AKTIA.HE',
      ]);
    });

    it('should simulate portfolio import scenario', () => {
      const { addStock } = usePortfolioStore.getState();
      
      // Initial portfolio with some stocks
      addStock({ symbol: 'NOKIA.HE', shares: 100, purchasePrice: 4.50 });
      addStock({ symbol: 'FORTUM.HE', shares: 200, purchasePrice: 19.00 });

      // Simulate importing a portfolio JSON with updated and new stocks
      const importedStocks = [
        { symbol: 'AKTIA.HE', shares: 323, purchasePrice: 12.40 },  // New stock
        { symbol: 'FORTUM.HE', shares: 209, purchasePrice: 19.15 }, // Updated stock
        { symbol: 'NOKIA.HE', shares: 100, purchasePrice: 4.50 },   // Same stock
      ];

      importedStocks.forEach(stock => addStock(stock));

      const { portfolios, activePortfolioId } = usePortfolioStore.getState();
      const activePortfolio = portfolios.find(p => p.id === activePortfolioId);
      
      expect(activePortfolio?.stocks).toHaveLength(3);
      
      // Verify updated stock
      const fortum = activePortfolio?.stocks.find(s => s.symbol === 'FORTUM.HE');
      expect(fortum).toMatchObject({
        symbol: 'FORTUM.HE',
        shares: 209,
        purchasePrice: 19.15,
      });

      // Verify new stock was added
      const aktia = activePortfolio?.stocks.find(s => s.symbol === 'AKTIA.HE');
      expect(aktia).toBeDefined();
      expect(aktia?.shares).toBe(323);
    });
  });

  describe('updateStock', () => {
    it('should update specific fields of an existing stock', () => {
      const { addStock, updateStock } = usePortfolioStore.getState();
      
      addStock({ symbol: 'NOKIA.HE', shares: 100, purchasePrice: 4.50 });
      updateStock('NOKIA.HE', { currentPrice: 5.00 });

      const { portfolios, activePortfolioId } = usePortfolioStore.getState();
      const activePortfolio = portfolios.find(p => p.id === activePortfolioId);
      const stock = activePortfolio?.stocks[0];
      
      expect(stock?.currentPrice).toBe(5.00);
      expect(stock?.shares).toBe(100); // Other fields unchanged
      expect(stock?.purchasePrice).toBe(4.50);
    });
  });

  describe('removeStock', () => {
    it('should remove a stock from the active portfolio', () => {
      const { addStock, removeStock } = usePortfolioStore.getState();
      
      addStock({ symbol: 'NOKIA.HE', shares: 100, purchasePrice: 4.50 });
      addStock({ symbol: 'FORTUM.HE', shares: 200, purchasePrice: 19.00 });

      removeStock('NOKIA.HE');

      const { portfolios, activePortfolioId } = usePortfolioStore.getState();
      const activePortfolio = portfolios.find(p => p.id === activePortfolioId);
      
      expect(activePortfolio?.stocks).toHaveLength(1);
      expect(activePortfolio?.stocks[0].symbol).toBe('FORTUM.HE');
    });
  });
});
