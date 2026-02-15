export interface Stock {
  symbol: string;
  name?: string;
  shares: number;
  purchasePrice: number;
  currentPrice: number;
  
  // Daily change information (optional for backward compatibility)
  priceChange?: number;           // Daily change in EUR/USD
  priceChangePercent?: number;    // Daily change as percentage
  currency?: string;              // Currency (USD, EUR, SEK, etc.)
}

export interface Portfolio {
  id: string;
  name: string;
  stocks: Stock[];
  createdAt: string;
}

export interface PriceCache {
  data: Record<string, number>;
  names?: Record<string, string>;
  changes?: Record<string, number>;           // Daily price changes
  changePercents?: Record<string, number>;    // Daily percentage changes
  currencies?: Record<string, string>;        // Currencies
  timestamp: number;
}

export interface AppState {
  portfolios: Portfolio[];
  activePortfolioId: string;
  apiKey: string;
  lastRefreshDate: string | null;
  priceCache: PriceCache | null;
  
  // Portfolio actions
  addPortfolio: (name: string) => void;
  removePortfolio: (id: string) => void;
  renamePortfolio: (id: string, name: string) => void;
  setActivePortfolio: (id: string) => void;
  
  // Stock actions  
  addStock: (stock: Omit<Stock, 'currentPrice'>) => void;
  updateStock: (symbol: string, updates: Partial<Stock>) => void;
  removeStock: (symbol: string) => void;
  
  // API & prices
  setApiKey: (key: string) => void;
  updatePrices: (prices: Record<string, number>) => void;
  updateStockNames: (names: Record<string, string>) => void;
  updateStockChanges: (changes: Record<string, number>) => void;
  updateStockChangePercents: (changePercents: Record<string, number>) => void;
  updateStockCurrencies: (currencies: Record<string, string>) => void;
  setLastRefreshDate: (date: string) => void;
  setPriceCache: (cache: PriceCache) => void;
}

export interface StatusMessage {
  type: 'success' | 'error' | 'warning';
  message: string;
  id: number;
}
