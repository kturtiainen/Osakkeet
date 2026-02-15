import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { get, set, del } from 'idb-keyval';
import type { AppState, Portfolio, Stock, PriceCache } from '../types';
import { encrypt } from '../utils/crypto';

// Custom IndexedDB storage for Zustand persist
const storage = createJSONStorage<AppState>(() => ({
  getItem: async (name: string): Promise<string | null> => {
    const value = await get(name);
    return value ? JSON.stringify(value) : null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await set(name, JSON.parse(value));
  },
  removeItem: async (name: string): Promise<void> => {
    await del(name);
  },
}));

// Generate unique ID using crypto.randomUUID() with fallback
function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

// Create default portfolio
function createDefaultPortfolio(): Portfolio {
  return {
    id: generateId(),
    name: 'Salkku 1',
    stocks: [],
    createdAt: new Date().toISOString(),
  };
}

export const usePortfolioStore = create<AppState>()(
  persist(
    (set, get) => ({
      portfolios: [createDefaultPortfolio()],
      activePortfolioId: '',
      apiKey: '',
      lastRefreshDate: null,
      priceCache: null,

      // Portfolio actions
      addPortfolio: (name: string) => {
        const newPortfolio: Portfolio = {
          id: generateId(),
          name,
          stocks: [],
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          portfolios: [...state.portfolios, newPortfolio],
        }));
      },

      removePortfolio: (id: string) => {
        const state = get();
        // Prevent deleting the last portfolio
        if (state.portfolios.length <= 1) {
          return;
        }
        
        const newPortfolios = state.portfolios.filter((p) => p.id !== id);
        const newActiveId = state.activePortfolioId === id 
          ? newPortfolios[0].id 
          : state.activePortfolioId;
        
        set({
          portfolios: newPortfolios,
          activePortfolioId: newActiveId,
        });
      },

      renamePortfolio: (id: string, name: string) => {
        set((state) => ({
          portfolios: state.portfolios.map((p) =>
            p.id === id ? { ...p, name } : p
          ),
        }));
      },

      setActivePortfolio: (id: string) => {
        set({ activePortfolioId: id });
      },

      // Stock actions (for active portfolio)
      addStock: (stock: Omit<Stock, 'currentPrice'>) => {
        const state = get();
        const activePortfolio = state.portfolios.find(
          (p) => p.id === state.activePortfolioId
        );
        
        if (!activePortfolio) return;
        
        // Check if stock already exists
        const existingStock = activePortfolio.stocks.find(
          (s) => s.symbol === stock.symbol
        );
        
        if (existingStock) {
          return; // Don't add duplicate stocks
        }
        
        const newStock: Stock = {
          ...stock,
          currentPrice: stock.purchasePrice, // Initialize with purchase price
        };
        
        set((state) => ({
          portfolios: state.portfolios.map((p) =>
            p.id === state.activePortfolioId
              ? { ...p, stocks: [...p.stocks, newStock] }
              : p
          ),
        }));
      },

      updateStock: (symbol: string, updates: Partial<Stock>) => {
        set((state) => ({
          portfolios: state.portfolios.map((p) =>
            p.id === state.activePortfolioId
              ? {
                  ...p,
                  stocks: p.stocks.map((s) =>
                    s.symbol === symbol ? { ...s, ...updates } : s
                  ),
                }
              : p
          ),
        }));
      },

      removeStock: (symbol: string) => {
        set((state) => ({
          portfolios: state.portfolios.map((p) =>
            p.id === state.activePortfolioId
              ? {
                  ...p,
                  stocks: p.stocks.filter((s) => s.symbol !== symbol),
                }
              : p
          ),
        }));
      },

      // API & prices
      setApiKey: (key: string) => {
        const encrypted = encrypt(key);
        set({ apiKey: encrypted });
      },

      updatePrices: (prices: Record<string, number>) => {
        set((state) => ({
          portfolios: state.portfolios.map((portfolio) => ({
            ...portfolio,
            stocks: portfolio.stocks.map((stock) => ({
              ...stock,
              currentPrice: prices[stock.symbol] ?? stock.currentPrice,
            })),
          })),
        }));
      },

      setLastRefreshDate: (date: string) => {
        set({ lastRefreshDate: date });
      },

      setPriceCache: (cache: PriceCache) => {
        set({ priceCache: cache });
      },
    }),
    {
      name: 'osakesalkku-storage',
      storage,
      onRehydrateStorage: () => (state) => {
        // Set active portfolio to first one if not set
        if (state && (!state.activePortfolioId || state.portfolios.length === 0)) {
          if (state.portfolios.length === 0) {
            state.portfolios = [createDefaultPortfolio()];
          }
          state.activePortfolioId = state.portfolios[0].id;
        }
      },
    }
  )
);
