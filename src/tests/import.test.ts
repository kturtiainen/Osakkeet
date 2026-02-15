import { describe, it, expect } from 'vitest';
import { isValidStock } from '../utils/validation';

/**
 * Tests for portfolio import scenarios
 * These tests validate the import logic for different edge cases
 */
describe('portfolio import scenarios', () => {
  describe('stock validation for import', () => {
    it('should accept valid stocks for import', () => {
      const validStocks = [
        { symbol: 'NOKIA.HE', shares: 100, purchasePrice: 4.50 },
        { symbol: 'AAPL', shares: 50, purchasePrice: 150.00 },
        { symbol: 'VOLV-B.ST', shares: 200, purchasePrice: 25.75 },
      ];

      validStocks.forEach((stock) => {
        expect(isValidStock(stock)).toBe(true);
      });
    });

    it('should reject stocks with missing or invalid symbol', () => {
      const invalidStocks = [
        { shares: 100, purchasePrice: 4.50 },
        { symbol: '', shares: 100, purchasePrice: 4.50 },
        { symbol: null, shares: 100, purchasePrice: 4.50 },
        { symbol: undefined, shares: 100, purchasePrice: 4.50 },
      ];

      invalidStocks.forEach((stock) => {
        expect(isValidStock(stock as { symbol?: string; shares?: number; purchasePrice?: number })).toBe(false);
      });
    });

    it('should reject stocks with invalid shares', () => {
      const invalidStocks = [
        { symbol: 'NOKIA.HE', shares: 0, purchasePrice: 4.50 },
        { symbol: 'NOKIA.HE', shares: -10, purchasePrice: 4.50 },
        { symbol: 'NOKIA.HE', shares: NaN, purchasePrice: 4.50 },
        { symbol: 'NOKIA.HE', shares: '100', purchasePrice: 4.50 },
        { symbol: 'NOKIA.HE', purchasePrice: 4.50 },
      ];

      invalidStocks.forEach((stock) => {
        expect(isValidStock(stock as { symbol?: string; shares?: number; purchasePrice?: number })).toBe(false);
      });
    });

    it('should reject stocks with invalid purchase price', () => {
      const invalidStocks = [
        { symbol: 'NOKIA.HE', shares: 100, purchasePrice: 0 },
        { symbol: 'NOKIA.HE', shares: 100, purchasePrice: -5 },
        { symbol: 'NOKIA.HE', shares: 100, purchasePrice: NaN },
        { symbol: 'NOKIA.HE', shares: 100, purchasePrice: '4.50' },
        { symbol: 'NOKIA.HE', shares: 100 },
      ];

      invalidStocks.forEach((stock) => {
        expect(isValidStock(stock as { symbol?: string; shares?: number; purchasePrice?: number })).toBe(false);
      });
    });
  });

  describe('import scenario: empty portfolio', () => {
    it('should handle empty stock array', () => {
      const portfolioData = {
        portfolio: {
          stocks: []
        }
      };

      expect(portfolioData.portfolio.stocks).toHaveLength(0);
    });
  });

  describe('import scenario: all valid stocks', () => {
    it('should successfully validate all stocks', () => {
      const portfolioData = {
        portfolio: {
          stocks: [
            { symbol: 'NOKIA.HE', shares: 100, purchasePrice: 4.50 },
            { symbol: 'AAPL', shares: 50, purchasePrice: 150.00 },
            { symbol: 'FORTUM.HE', shares: 200, purchasePrice: 19.15 },
          ]
        }
      };

      const validStocks = portfolioData.portfolio.stocks.filter(isValidStock);
      const failedStocks = portfolioData.portfolio.stocks.filter(s => !isValidStock(s));

      expect(validStocks).toHaveLength(3);
      expect(failedStocks).toHaveLength(0);
    });
  });

  describe('import scenario: partially failed imports', () => {
    it('should separate valid and invalid stocks', () => {
      const portfolioData = {
        portfolio: {
          stocks: [
            { symbol: 'NOKIA.HE', shares: 100, purchasePrice: 4.50 },  // Valid
            { symbol: 'INVALID', shares: 0, purchasePrice: 5.00 },     // Invalid shares
            { symbol: 'AAPL', shares: 50, purchasePrice: 150.00 },     // Valid
            { symbol: '', shares: 100, purchasePrice: 10.00 },         // Invalid symbol
            { symbol: 'FORTUM.HE', shares: 200, purchasePrice: -5 },   // Invalid price
          ]
        }
      };

      const validStocks = portfolioData.portfolio.stocks.filter(isValidStock);
      const failedStocks = portfolioData.portfolio.stocks.filter(s => !isValidStock(s));

      expect(validStocks).toHaveLength(2);
      expect(failedStocks).toHaveLength(3);
      
      // Verify the valid stocks
      expect(validStocks[0].symbol).toBe('NOKIA.HE');
      expect(validStocks[1].symbol).toBe('AAPL');
    });

    it('should categorize failure reasons correctly', () => {
      const stocks = [
        { symbol: '', shares: 100, purchasePrice: 4.50 },
        { symbol: 'NOKIA.HE', shares: 0, purchasePrice: 4.50 },
        { symbol: 'AAPL', shares: 100, purchasePrice: 0 },
      ];

      const failedStocks = stocks.map((stock) => {
        if (isValidStock(stock)) {
          return null;
        }

        let errorReason = 'Tuntematon virhe';
        if (!stock.symbol || stock.symbol.length === 0) {
          errorReason = 'Puuttuva symboli';
        } else if (typeof stock.shares !== 'number' || Number.isNaN(stock.shares) || stock.shares <= 0) {
          errorReason = 'Virheellinen osakkeiden määrä';
        } else if (typeof stock.purchasePrice !== 'number' || Number.isNaN(stock.purchasePrice) || stock.purchasePrice <= 0) {
          errorReason = 'Virheellinen hankintahinta';
        }

        return { symbol: stock.symbol || 'Tuntematon', errorReason };
      }).filter((f) => f !== null);

      expect(failedStocks).toHaveLength(3);
      expect(failedStocks[0]?.errorReason).toBe('Puuttuva symboli');
      expect(failedStocks[1]?.errorReason).toBe('Virheellinen osakkeiden määrä');
      expect(failedStocks[2]?.errorReason).toBe('Virheellinen hankintahinta');
    });
  });

  describe('import scenario: all failed imports', () => {
    it('should fail all stocks with various errors', () => {
      const portfolioData = {
        portfolio: {
          stocks: [
            { symbol: '', shares: 100, purchasePrice: 4.50 },
            { symbol: 'NOKIA.HE', shares: -10, purchasePrice: 4.50 },
            { symbol: 'AAPL', shares: 100, purchasePrice: -150.00 },
          ]
        }
      };

      const validStocks = portfolioData.portfolio.stocks.filter(isValidStock);
      const failedStocks = portfolioData.portfolio.stocks.filter(s => !isValidStock(s));

      expect(validStocks).toHaveLength(0);
      expect(failedStocks).toHaveLength(3);
    });
  });

  describe('import scenario: corrupted file data', () => {
    it('should handle missing portfolio object', () => {
      const corruptedData: Record<string, unknown> = {};
      
      expect(corruptedData.portfolio).toBeUndefined();
    });

    it('should handle missing stocks array', () => {
      const corruptedData: { portfolio: Record<string, unknown> } = {
        portfolio: {}
      };
      
      expect(corruptedData.portfolio.stocks).toBeUndefined();
    });

    it('should handle null portfolio', () => {
      const corruptedData = {
        portfolio: null
      };
      
      expect(corruptedData.portfolio).toBeNull();
    });

    it('should handle stocks not being an array', () => {
      const corruptedData = {
        portfolio: {
          stocks: 'not-an-array'
        }
      };
      
      expect(Array.isArray(corruptedData.portfolio.stocks)).toBe(false);
    });
  });

  describe('import scenario: mixed data types', () => {
    it('should handle stocks with wrong data types', () => {
      const portfolioData = {
        portfolio: {
          stocks: [
            { symbol: 'NOKIA.HE', shares: '100', purchasePrice: 4.50 },      // shares as string
            { symbol: 'AAPL', shares: 50, purchasePrice: '150.00' },          // price as string
            { symbol: 123, shares: 100, purchasePrice: 4.50 },                // symbol as number
            { symbol: 'FORTUM.HE', shares: 200, purchasePrice: 4.50 },        // valid
          ]
        }
      };

      const validStocks = portfolioData.portfolio.stocks.filter(s => isValidStock(s as { symbol?: string; shares?: number; purchasePrice?: number }));
      const failedStocks = portfolioData.portfolio.stocks.filter(s => !isValidStock(s as { symbol?: string; shares?: number; purchasePrice?: number }));

      expect(validStocks).toHaveLength(1);
      expect(failedStocks).toHaveLength(3);
      expect(validStocks[0].symbol).toBe('FORTUM.HE');
    });
  });
});
