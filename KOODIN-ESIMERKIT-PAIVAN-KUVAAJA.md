# 💻 KOODIESIMERKIT - Lisää päivän muutos

## 🎯 YKSINKERTAINEN TAPA (5 min)

Lisätään vain päivän muutos näkyviin. Minimaalinen muutos koodiin.

-----

## 1️⃣ PÄIVITÄ TYYPIT

### src/types/index.ts

```typescript
export interface Stock {
  symbol: string;
  shares: number;
  purchasePrice: number;
  currentPrice: number;
  
  // ✅ LISÄÄ NÄMÄ
  priceChange?: number;           // Päivän muutos euroissa/dollareissa
  priceChangePercent?: number;    // Päivän muutos prosenteissa
  currency?: string;              // Valuutta (USD, EUR, jne.)
}
```

**Miksi optional (?):**

- Vanhat tallennetut osakkeet eivät riko
- Jos API-kutsu epäonnistuu, sovellus toimii silti

-----

## 2️⃣ PÄIVITÄ API-PALVELU

### src/services/yahooFinanceApi.ts

**VANHA:**

```typescript
export async function fetchQuotes(
  symbols: string[],
  apiKey: string
): Promise<Record<string, number>> {
  // ...
  const priceMap: Record<string, number> = {};
  for (const quote of data.body) {
    if (quote.symbol && typeof quote.regularMarketPrice === 'number') {
      priceMap[quote.symbol] = quote.regularMarketPrice;
    }
  }
  return priceMap;
}
```

**UUSI:**

```typescript
// Uusi interface palautusarvon tyypille
export interface StockQuote {
  price: number;
  change?: number;
  changePercent?: number;
  currency?: string;
}

export async function fetchQuotes(
  symbols: string[],
  apiKey: string
): Promise<Record<string, StockQuote>> {  // ← Muutettu paluutyyppi
  // ... (sama koodi kunnes priceMap)
  
  const priceMap: Record<string, StockQuote> = {};
  for (const quote of data.body) {
    if (quote.symbol && typeof quote.regularMarketPrice === 'number') {
      priceMap[quote.symbol] = {
        price: quote.regularMarketPrice,
        change: quote.regularMarketChange,
        changePercent: quote.regularMarketChangePercent,
        currency: quote.currency
      };
    }
  }
  
  return priceMap;
}
```

-----

## 3️⃣ PÄIVITÄ usePrices HOOK

### src/hooks/usePrices.ts

**VANHA:**

```typescript
const prices = await fetchQuotes(Array.from(allSymbols), apiKey);
updatePrices(prices);  // prices on Record<string, number>
```

**UUSI:**

```typescript
const quotes = await fetchQuotes(Array.from(allSymbols), apiKey);

// Muunna StockQuote → prices-objektiksi
const prices: Record<string, number> = {};
const quoteDetails: Record<string, StockQuote> = {};

Object.entries(quotes).forEach(([symbol, quote]) => {
  prices[symbol] = quote.price;
  quoteDetails[symbol] = quote;
});

// Päivitä hinnat (vanha tapa)
updatePrices(prices);

// Päivitä lisätiedot (uusi tapa)
updateStockDetails(quoteDetails);  // ← UUSI store-funktio
```

-----

## 4️⃣ PÄIVITÄ STORE

### src/store/portfolioStore.ts

```typescript
export interface AppState {
  // ... vanhat kentät ...
  
  // ✅ LISÄÄ TÄMÄ
  stockDetails: Record<string, StockQuote>;  // Symbol → Quote details
  
  // ... vanhat funktiot ...
  
  // ✅ LISÄÄ TÄMÄ
  updateStockDetails: (details: Record<string, StockQuote>) => void;
}

export const usePortfolioStore = create<AppState>()(
  persist(
    (set, get) => ({
      // ... vanhat kentät ...
      stockDetails: {},  // ← UUSI
      
      // ... vanhat funktiot ...
      
      // ✅ LISÄÄ TÄMÄ
      updateStockDetails: (details: Record<string, StockQuote>) => {
        set({ stockDetails: details });
      },
      
      updatePrices: (prices: Record<string, number>) => {
        set((state) => {
          const details = state.stockDetails || {};
          
          return {
            portfolios: state.portfolios.map((portfolio) => ({
              ...portfolio,
              stocks: portfolio.stocks.map((stock) => ({
                ...stock,
                currentPrice: prices[stock.symbol] ?? stock.currentPrice,
                // ✅ Päivitä myös lisätiedot
                priceChange: details[stock.symbol]?.change,
                priceChangePercent: details[stock.symbol]?.changePercent,
                currency: details[stock.symbol]?.currency
              })),
            })),
          };
        });
      },
      
      // ... loput funktiot ...
    }),
    {
      name: 'osakesalkku-storage',
      storage,
    }
  )
);
```

-----

## 5️⃣ PÄIVITÄ STOCK CARD

### src/components/StockCard.tsx

**VANHA:**

```typescript
export function StockCard({ stock }: { stock: Stock }) {
  return (
    <div className="bg-gray-900 rounded-lg p-4">
      <div className="text-2xl font-bold text-white">
        {stock.symbol}
      </div>
      <div className="text-3xl font-bold text-white">
        {stock.currentPrice.toFixed(2)} €
      </div>
      {/* ... */}
    </div>
  );
}
```

**UUSI:**

```typescript
export function StockCard({ stock }: { stock: Stock }) {
  // Laske väri muutoksen perusteella
  const isPositive = (stock.priceChange ?? 0) >= 0;
  const changeColor = isPositive ? 'text-green-400' : 'text-red-400';
  const changeIcon = isPositive ? '▲' : '▼';
  
  return (
    <div className="bg-gray-900 rounded-lg p-4">
      {/* Symboli */}
      <div className="text-2xl font-bold text-white">
        {stock.symbol}
      </div>
      
      {/* Hinta ja muutos */}
      <div className="flex items-baseline gap-2">
        <div className="text-3xl font-bold text-white">
          {stock.currentPrice.toFixed(2)} {stock.currency || '€'}
        </div>
        
        {/* ✅ UUSI: Päivän muutos */}
        {stock.priceChange !== undefined && (
          <div className={`text-lg font-semibold ${changeColor}`}>
            {changeIcon} {Math.abs(stock.priceChange).toFixed(2)} 
            ({Math.abs(stock.priceChangePercent || 0).toFixed(2)}%)
          </div>
        )}
      </div>
      
      {/* ... loput samat ... */}
    </div>
  );
}
```

**Näyttää:**

```
┌─────────────────────────────────┐
│ NOKIA.HE                        │
│ 4.75 EUR  ▲ +0.12 (+2.60%)     │
│                                 │
│ 100 kpl @ 4.50 EUR              │
│ Arvo: 475.00 EUR                │
│ Tuotto: +25.00 EUR (+5.56%)    │
└─────────────────────────────────┘
```

-----

## 🎨 PAREMPI VISUAALINEN TOTEUTUS

Jos haluat hienomman ulkoasun:

```typescript
export function StockCard({ stock }: { stock: Stock }) {
  const isPositive = (stock.priceChange ?? 0) >= 0;
  
  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-5 border border-gray-700 hover:border-purple-500 transition-all">
      {/* Header: Symboli ja muutos */}
      <div className="flex items-center justify-between mb-3">
        <div className="text-2xl font-bold text-white">
          {stock.symbol}
        </div>
        
        {stock.priceChangePercent !== undefined && (
          <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
            isPositive 
              ? 'bg-green-500/20 text-green-400' 
              : 'bg-red-500/20 text-red-400'
          }`}>
            {isPositive ? '▲' : '▼'} {Math.abs(stock.priceChangePercent).toFixed(2)}%
          </div>
        )}
      </div>
      
      {/* Hinta */}
      <div className="mb-4">
        <div className="text-4xl font-bold text-white mb-1">
          {stock.currentPrice.toFixed(2)} {stock.currency || '€'}
        </div>
        
        {stock.priceChange !== undefined && (
          <div className={`text-sm font-medium ${
            isPositive ? 'text-green-400' : 'text-red-400'
          }`}>
            {isPositive ? '+' : ''}{stock.priceChange.toFixed(2)} {stock.currency || '€'} tänään
          </div>
        )}
      </div>
      
      {/* Omistus */}
      <div className="border-t border-gray-700 pt-3 space-y-1 text-sm">
        <div className="flex justify-between text-gray-400">
          <span>Omistus</span>
          <span className="text-white font-semibold">
            {stock.shares} kpl @ {stock.purchasePrice.toFixed(2)} {stock.currency || '€'}
          </span>
        </div>
        
        {/* Arvo */}
        <div className="flex justify-between text-gray-400">
          <span>Arvo</span>
          <span className="text-white font-semibold">
            {(stock.shares * stock.currentPrice).toFixed(2)} {stock.currency || '€'}
          </span>
        </div>
        
        {/* Tuotto */}
        <div className="flex justify-between">
          <span className="text-gray-400">Tuotto</span>
          <span className={`font-semibold ${
            (stock.currentPrice - stock.purchasePrice) >= 0 
              ? 'text-green-400' 
              : 'text-red-400'
          }`}>
            {((stock.currentPrice - stock.purchasePrice) * stock.shares).toFixed(2)} {stock.currency || '€'}
            {' '}
            ({(((stock.currentPrice - stock.purchasePrice) / stock.purchasePrice) * 100).toFixed(2)}%)
          </span>
        </div>
      </div>
    </div>
  );
}
```

**Näyttää:**

```
╔═════════════════════════════════════╗
║ NOKIA.HE            [▲ +2.60%]     ║
║                                     ║
║ 4.75 EUR                            ║
║ +0.12 EUR tänään                    ║
║                                     ║
║ ─────────────────────────────────── ║
║ Omistus    100 kpl @ 4.50 EUR       ║
║ Arvo       475.00 EUR               ║
║ Tuotto     +25.00 EUR (+5.56%)      ║
╚═════════════════════════════════════╝
```

-----

## 🧪 TESTAUS

### 1. Testaa että API palauttaa oikeat kentät

```typescript
// src/tests/yahooFinanceApi.test.ts
describe('fetchQuotes', () => {
  it('should return price details', async () => {
    const quotes = await fetchQuotes(['AAPL'], 'test-key');
    
    expect(quotes.AAPL).toBeDefined();
    expect(quotes.AAPL.price).toBeGreaterThan(0);
    expect(quotes.AAPL.change).toBeDefined();
    expect(quotes.AAPL.changePercent).toBeDefined();
    expect(quotes.AAPL.currency).toBe('USD');
  });
});
```

### 2. Testaa että store päivittyy oikein

```typescript
// src/tests/portfolioStore.test.ts
describe('updatePrices', () => {
  it('should update stock details', () => {
    const store = usePortfolioStore.getState();
    
    store.updateStockDetails({
      'AAPL': {
        price: 117.32,
        change: 4.5,
        changePercent: 3.99,
        currency: 'USD'
      }
    });
    
    const details = store.stockDetails['AAPL'];
    expect(details.change).toBe(4.5);
    expect(details.changePercent).toBe(3.99);
  });
});
```

-----

## 📋 TARKISTUSLISTA

Ennen kuin käynnistät sovelluksen:

- [ ] ✅ Päivitit `src/types/index.ts` (lisäsit kentät)
- [ ] ✅ Päivitit `src/services/yahooFinanceApi.ts` (StockQuote)
- [ ] ✅ Päivitit `src/hooks/usePrices.ts` (quoteDetails)
- [ ] ✅ Päivitit `src/store/portfolioStore.ts` (updateStockDetails)
- [ ] ✅ Päivitit `src/components/StockCard.tsx` (näytä muutos)
- [ ] ✅ Käännät koodin ilman virheitä: `npm run type-check`
- [ ] ✅ Testasit sovelluksen: `npm run dev`

-----

## 🚀 KÄYNNISTYS

```bash
# 1. Tarkista että TypeScript kääntyy
npm run type-check

# 2. Käynnistä dev-palvelin
npm run dev

# 3. Avaa selaimessa
http://localhost:5173

# 4. Testaa:
# - Avaa sovellus
# - Päivitä hinnat (refresh-nappi)
# - Näetkö päivän muutoksen?
```

-----

## 🐛 YLEISIMMÄT VIRHEET

### Virhe 1: “Property ‘priceChange’ does not exist”

**Ratkaisu:** Päivitä `src/types/index.ts`, lisää kentät optional:iksi

### Virhe 2: “Type ‘Record<string, number>’ is not assignable to…”

**Ratkaisu:** Muuta `fetchQuotes` paluutyyppi → `Record<string, StockQuote>`

### Virhe 3: “Cannot read property ‘change’ of undefined”

**Ratkaisu:** Käytä optional chaining: `stock.priceChange?.toFixed(2)`

### Virhe 4: Hinnat päivittyvät mutta muutos ei näy

**Ratkaisu:** Varmista että `updateStockDetails` kutsutaan usePrices-hookissa

-----

## 💡 LISÄOMINAISUUDET (Bonukset)

### Bonus 1: Animoitu muutos

```typescript
import { useEffect, useState } from 'react';

function AnimatedPriceChange({ change }: { change: number }) {
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 1000);
    return () => clearTimeout(timer);
  }, [change]);
  
  return (
    <div className={`transition-all duration-1000 ${
      isAnimating ? 'scale-110 font-bold' : 'scale-100'
    }`}>
      {change >= 0 ? '▲' : '▼'} {Math.abs(change).toFixed(2)}
    </div>
  );
}
```

### Bonus 2: Sparkline (pieni kuvaaja)

```typescript
// Tallenna hinnat 24h ajalta
interface PriceHistory {
  timestamp: number;
  price: number;
}

// Näytä pieni viivakuvaaja
function PriceSparkline({ history }: { history: PriceHistory[] }) {
  // Käytä SVG tai Canvas piirtämiseen
  // ...
}
```

-----

## 🎯 YHTEENVETO

**Mitä tehtiin:**

1. ✅ Lisättiin `priceChange`, `priceChangePercent`, `currency` Stock-interfaceen
1. ✅ Muutettiin API palautusarvo → `StockQuote` objekti
1. ✅ Lisättiin store-funktio `updateStockDetails`
1. ✅ Päivitettiin StockCard näyttämään päivän muutos
1. ✅ Lisättiin värikoodaus (vihreä = nousee, punainen = laskee)

**Hyödyt:**

- 👀 Näet heti onko osake noussut vai laskenut tänään
- 📊 Prosentti helpottaa vertailua eri osakkeiden välillä
- 🎨 Visuaalinen värikoodaus on intuitiivinen
- 💾 Minimaalinen muutos olemassa olevaan koodiin

**Seuraava askel:**
→ Kopioi koodi ja testaa!