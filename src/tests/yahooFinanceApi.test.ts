import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchQuotes } from '../services/yahooFinanceApi';

// Mock global fetch
globalThis.fetch = vi.fn() as unknown as typeof fetch;

describe('yahooFinanceApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchQuotes', () => {
    it('should throw error if API key is missing', async () => {
      await expect(fetchQuotes(['AAPL'], '')).rejects.toThrow('API-avain puuttuu');
    });

    it('should return empty object for empty symbols array', async () => {
      const result = await fetchQuotes([], 'test-api-key');
      expect(result).toEqual({});
    });

    it('should fetch quotes for single batch (≤10 symbols)', async () => {
      const mockResponse = {
        quoteResponse: {
          result: [
            { symbol: 'AAPL', regularMarketPrice: 150.00 },
            { symbol: 'GOOGL', regularMarketPrice: 2800.00 },
            { symbol: 'MSFT', regularMarketPrice: 300.00 }
          ],
          error: null
        }
      };

      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await fetchQuotes(['AAPL', 'GOOGL', 'MSFT'], 'test-api-key');
      
      expect(result).toEqual({
        AAPL: 150.00,
        GOOGL: 2800.00,
        MSFT: 300.00
      });
      expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    });

    it('should split symbols into multiple batches for >10 symbols', async () => {
      // Create 15 symbols
      const symbols = Array.from({ length: 15 }, (_, i) => `STOCK${i + 1}`);
      
      const mockResponse1 = {
        quoteResponse: {
          result: Array.from({ length: 10 }, (_, i) => ({
            symbol: `STOCK${i + 1}`,
            regularMarketPrice: 100 + i
          })),
          error: null
        }
      };

      const mockResponse2 = {
        quoteResponse: {
          result: Array.from({ length: 5 }, (_, i) => ({
            symbol: `STOCK${i + 11}`,
            regularMarketPrice: 110 + i
          })),
          error: null
        }
      };

      (globalThis.fetch as ReturnType<typeof vi.fn>)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse1
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse2
        });

      const result = await fetchQuotes(symbols, 'test-api-key');
      
      expect(Object.keys(result)).toHaveLength(15);
      expect(result.STOCK1).toBe(100);
      expect(result.STOCK11).toBe(110);
      expect(globalThis.fetch).toHaveBeenCalledTimes(2);
    });

    it('should handle partial batch failures gracefully', async () => {
      const symbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 
                       'FB', 'NVDA', 'NFLX', 'INTC', 'AMD',
                       'STOCK11', 'STOCK12'];

      const mockResponse1 = {
        quoteResponse: {
          result: [
            { symbol: 'AAPL', regularMarketPrice: 150.00 },
            { symbol: 'GOOGL', regularMarketPrice: 2800.00 },
            { symbol: 'MSFT', regularMarketPrice: 300.00 },
            { symbol: 'TSLA', regularMarketPrice: 700.00 },
            { symbol: 'AMZN', regularMarketPrice: 3300.00 },
            { symbol: 'FB', regularMarketPrice: 350.00 },
            { symbol: 'NVDA', regularMarketPrice: 500.00 },
            { symbol: 'NFLX', regularMarketPrice: 600.00 },
            { symbol: 'INTC', regularMarketPrice: 50.00 },
            { symbol: 'AMD', regularMarketPrice: 120.00 }
          ],
          error: null
        }
      };

      // First batch succeeds
      (globalThis.fetch as ReturnType<typeof vi.fn>)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse1
        })
        // Second batch fails
        .mockRejectedValueOnce(new Error('Network error'));

      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const result = await fetchQuotes(symbols, 'test-api-key');
      
      // Should return results from successful batch
      expect(Object.keys(result)).toHaveLength(10);
      expect(result.AAPL).toBe(150.00);
      expect(result.AMD).toBe(120.00);
      
      // Should log warning about partial failure
      expect(consoleWarnSpy).toHaveBeenCalled();
      
      consoleWarnSpy.mockRestore();
    });

    it('should throw error if all batches fail', async () => {
      const symbols = ['AAPL', 'GOOGL', 'MSFT'];

      (globalThis.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
        new Error('Network error')
      );

      await expect(fetchQuotes(symbols, 'test-api-key')).rejects.toThrow();
    });

    it('should deduplicate symbols before batching', async () => {
      const mockResponse = {
        quoteResponse: {
          result: [
            { symbol: 'AAPL', regularMarketPrice: 150.00 },
            { symbol: 'GOOGL', regularMarketPrice: 2800.00 }
          ],
          error: null
        }
      };

      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await fetchQuotes(['AAPL', 'GOOGL', 'AAPL', 'GOOGL'], 'test-api-key');
      
      expect(Object.keys(result)).toHaveLength(2);
      expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    });

    it('should handle 403 error (invalid API key)', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 403
      });

      await expect(fetchQuotes(['AAPL'], 'invalid-key')).rejects.toThrow('Virheellinen API-avain');
    });

    it('should handle 429 error (quota exceeded)', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 429
      });

      await expect(fetchQuotes(['AAPL'], 'test-api-key')).rejects.toThrow('API-kuukausikiintiö ylitetty');
    });

    it('should handle batches of exactly 10 symbols', async () => {
      const symbols = Array.from({ length: 10 }, (_, i) => `STOCK${i + 1}`);
      
      const mockResponse = {
        quoteResponse: {
          result: symbols.map((symbol, i) => ({
            symbol,
            regularMarketPrice: 100 + i
          })),
          error: null
        }
      };

      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await fetchQuotes(symbols, 'test-api-key');
      
      expect(Object.keys(result)).toHaveLength(10);
      expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    });

    it('should handle batches of exactly 20 symbols (2 batches)', async () => {
      const symbols = Array.from({ length: 20 }, (_, i) => `STOCK${i + 1}`);
      
      const mockResponse1 = {
        quoteResponse: {
          result: symbols.slice(0, 10).map((symbol, i) => ({
            symbol,
            regularMarketPrice: 100 + i
          })),
          error: null
        }
      };

      const mockResponse2 = {
        quoteResponse: {
          result: symbols.slice(10, 20).map((symbol, i) => ({
            symbol,
            regularMarketPrice: 110 + i
          })),
          error: null
        }
      };

      (globalThis.fetch as ReturnType<typeof vi.fn>)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse1
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse2
        });

      const result = await fetchQuotes(symbols, 'test-api-key');
      
      expect(Object.keys(result)).toHaveLength(20);
      expect(globalThis.fetch).toHaveBeenCalledTimes(2);
    });
  });
});
