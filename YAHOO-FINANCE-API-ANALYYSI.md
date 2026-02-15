# 📊 Yahoo Finance API - Mitä näyttää osakkeesta?

## 🎯 NOPEA VASTAUS

### Minimalistinen (nykyinen):

✅ **regularMarketPrice** - Riittää peruskäyttöön

### Suositeltu perustaso:

✅ **regularMarketPrice** - Nykyinen hinta  
✅ **regularMarketChange** - Päivän muutos (€/$)  
✅ **regularMarketChangePercent** - Päivän muutos (%)  
✅ **currency** - Valuutta

### Täysi paketti sijoittajalle:

- **regularMarketDayHigh/Low** - Päivän vaihteluväli
- **fiftyTwoWeekHigh/Low** - 52 viikon vaihteluväli
- **marketCap** - Markkina-arvo
- **trailingPE** - P/E-luku
- **trailingAnnualDividendYield** - Osinkotuotto %

-----

## 📋 TÄYDELLINEN ANALYYSI

### ⭐⭐⭐⭐⭐ KRIITTISET (Must-have)

```json
{
  "regularMarketPrice": 117.32,           // TÄRKEIN! Nykyinen hinta
  "regularMarketChange": 4.5,             // Päivän muutos dollareissa
  "regularMarketChangePercent": 3.99,     // Päivän muutos prosenteissa
  "currency": "USD"                        // Valuutta
}
```

**Miksi nämä?**

- `regularMarketPrice` = Perushinta, jonka KAIKKI haluavat nähdä
- `regularMarketChange` = Montako euroa/dollaria noussu/laskenu tänään
- `regularMarketChangePercent` = Parempi vertailla eri osakkeita (3% vs 5€)
- `currency` = Tarvitaan jotta tiedetään USD vs EUR vs SEK

**Miltä näyttää:**

```
AAPL
117.32 USD   ▲ +4.50 (+3.99%)
```

-----

### ⭐⭐⭐⭐ TÄRKEÄT (Should-have)

```json
{
  "regularMarketDayHigh": 119.14,         // Päivän ylin hinta
  "regularMarketDayLow": 115.26,          // Päivän alin hinta
  "regularMarketVolume": 168404235,       // Kaupankäyntivolyymi
  "regularMarketPreviousClose": 112.82,   // Eilisen päätöskurssi
  "regularMarketOpen": 117.26             // Avaushinta
}
```

**Miksi nämä?**

- **DayHigh/Low** = Näet kuinka paljon osake heiluu päivän aikana
- **Volume** = Paljonko kauppaa, korkea volyymi = likviditeetti
- **PreviousClose** = Vertailupiste päivän muutokselle
- **Open** = Millä hinnalla kaupankäynti alkoi

**Miltä näyttää:**

```
AAPL
117.32 USD   ▲ +4.50 (+3.99%)
Päivän: 115.26 - 119.14
Volyymi: 168.4M
```

-----

### ⭐⭐⭐ HYÖDYLLISET (Nice-to-have)

```json
{
  "fiftyTwoWeekHigh": 137.98,             // 52 viikon ylin
  "fiftyTwoWeekLow": 53.15,               // 52 viikon alin
  "fiftyTwoWeekRange": "53.15 - 137.98",  // 52vk vaihteluväli
  "marketCap": 2006465249280,             // Markkina-arvo
  "marketState": "POST"                    // Markkinan tila (OPEN/CLOSED/POST)
}
```

**Miksi nämä?**

- **52-week High/Low** = Historiallinen konteksti, onko lähellä huippua vai pohjaa?
- **MarketCap** = Yrityksen koko (2T$ = jättiläinen)
- **MarketState** = Onko pörssi auki vai kiinni

**Miltä näyttää:**

```
AAPL
117.32 USD   ▲ +4.50 (+3.99%)
52vk: 53.15 - 137.98
Markkina-arvo: 2.01T USD
```

-----

### ⭐⭐ SIJOITTAJADATA (Advanced)

```json
{
  "trailingPE": 35.59,                    // P/E-luku (hinta/tulos)
  "forwardPE": 30.39,                     // Ennustettu P/E
  "priceToBook": 27.81,                   // P/B-luku (hinta/kirja-arvo)
  "bookValue": 4.218,                     // Kirjanpitoarvo per osake
  "epsTrailingTwelveMonths": 3.296,       // Tulos per osake (12kk)
  "epsForward": 3.86,                     // Ennustettu EPS
  "trailingAnnualDividendRate": 0.782,    // Vuotuinen osinko
  "trailingAnnualDividendYield": 0.0069,  // Osinkotuotto (0.69%)
  "dividendDate": 1597276800              // Osingonmaksupäivä
}
```

**Miksi nämä?**

- **P/E-luku** = Arvostus, matala (<15) = halpa, korkea (>30) = kallis
- **P/B-luku** = Toinen arvostuskertoin
- **EPS** = Tulos per osake, kasvaako?
- **Dividend Yield** = Osinkosijoittajalle tärkeä!

**Miltä näyttää:**

```
AAPL
117.32 USD   ▲ +4.50 (+3.99%)
P/E: 35.59 | P/B: 27.81
Osinko: 0.69%
```

-----

### ⭐ ERIKOISDATA (Optional)

```json
{
  "fiftyDayAverage": 112.82,              // 50 päivän liukuva keskiarvo
  "twoHundredDayAverage": 85.99,          // 200 päivän liukuva keskiarvo
  "postMarketPrice": 117.07,              // After hours -hinta
  "postMarketChange": -0.25,              // After hours -muutos
  "postMarketChangePercent": -0.21        // After hours -muutos %
}
```

**Miksi nämä?**

- **50/200-day Average** = Tekninen analyysi, trendit
- **Post-market** = Tärkeä jos pörssi kiinni mutta kauppaa käy

**Miltä näyttää:**

```
AAPL (After hours)
117.07 USD   ▼ -0.25 (-0.21%)
50pv: 112.82 | 200pv: 85.99
```

-----

## 🎨 VISUAALISET ESIMERKIT

### MINIMALISTI (nykyinen sovellus)

```
┌─────────────────────────┐
│ AAPL                    │
│ 117.32 USD              │
│                         │
│ 50 kpl                  │
│ Arvo: 5,866.00 USD      │
└─────────────────────────┘
```

**Hyvä:** Yksinkertainen, selkeä  
**Huono:** Ei näe muuttuuko hinta

-----

### PERUSTASO (suositus)

```
┌─────────────────────────────────┐
│ AAPL                            │
│ 117.32 USD  ▲ +4.50 (+3.99%)   │
│                                 │
│ 50 kpl @ 150.00 USD             │
│ Arvo: 5,866.00 USD              │
│ Tuotto: -1,617.00 USD (-21.6%) │
└─────────────────────────────────┘
```

**Hyvä:** Näet päivän muutoksen + tuoton  
**Huono:** Ei syvempää kontekstia

-----

### TÄYSI (maksimi info)

```
┌────────────────────────────────────────┐
│ AAPL - Apple Inc.                      │
│ 117.32 USD  ▲ +4.50 (+3.99%)          │
│ Päivän: 115.26 - 119.14                │
│ 52vk: 53.15 - 137.98                   │
│                                        │
│ 50 kpl @ 150.00 USD                    │
│ Arvo: 5,866.00 USD                     │
│ Tuotto: -1,617.00 USD (-21.6%)        │
│                                        │
│ P/E: 35.59 | Osinko: 0.69%            │
│ Markkina-arvo: 2.01T USD               │
└────────────────────────────────────────┘
```

**Hyvä:** Kaikki info yhdellä vilkaisulla  
**Huono:** Runsas, ei mahdu pienelle ruudulle

-----

## 📱 SUOSITUKSET iPAD-SOVELLUKSELLE

### Taso 1: Kortit-näkymä (pieni kortti)

**Näytä:**

```typescript
{
  symbol: "AAPL",
  regularMarketPrice: 117.32,
  regularMarketChange: 4.5,
  regularMarketChangePercent: 3.99,
  currency: "USD"
}
```

**Koodi:**

```typescript
interface StockCardData {
  symbol: string;
  currentPrice: number;
  priceChange: number;         // ← UUSI
  priceChangePercent: number;  // ← UUSI
  currency: string;            // ← UUSI
  shares: number;
  purchasePrice: number;
}
```

**Näyttää:**

```
NOKIA.HE
4.75 EUR  ▲ +0.12 (+2.60%)
100 kpl @ 4.50 EUR
Tuotto: +25.00 EUR (+5.56%)
```

-----

### Taso 2: Laajennettava kortti (tap avaa)

**Näytä aluksi:** Taso 1  
**Näytä kun avataan:**

```typescript
{
  // Taso 1 +
  regularMarketDayHigh: 119.14,
  regularMarketDayLow: 115.26,
  fiftyTwoWeekHigh: 137.98,
  fiftyTwoWeekLow: 53.15,
  marketCap: 2006465249280,
  trailingPE: 35.59,
  trailingAnnualDividendYield: 0.0069
}
```

**Näyttää:**

```
AAPL - Apple Inc.
117.32 USD  ▲ +4.50 (+3.99%)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Päivän vaihteluväli
115.26 ━━━━●━━━━━ 119.14
       117.32 (nyt)

52 viikon vaihteluväli
53.15 ━━━━━━━━━━━━━━━●━ 137.98
                  117.32

P/E: 35.59
Osinko: 0.69%
Markkina-arvo: 2.01T USD
```

-----

### Taso 3: Yksityiskohtainen näkymä (oma sivu)

**Tap osaketta → Avautuu täysi näkymä:**

```
┌─────────────────────────────────┐
│ ← AAPL - Apple Inc.             │
├─────────────────────────────────┤
│                                 │
│    117.32 USD                   │
│    ▲ +4.50 (+3.99%)            │
│                                 │
│ [Päivän hintakuvaaja tähän]     │
│                                 │
├─────────────────────────────────┤
│ Omistus                         │
│ 50 kpl @ 150.00 USD             │
│ Arvo: 5,866.00 USD              │
│ Tuotto: -1,617 USD (-21.6%)    │
│                                 │
├─────────────────────────────────┤
│ Päivän tiedot                   │
│ Avaus:     117.26 USD           │
│ Ylin:      119.14 USD           │
│ Alin:      115.26 USD           │
│ Volyymi:   168.4M               │
│                                 │
├─────────────────────────────────┤
│ 52 viikon tiedot                │
│ Ylin:      137.98 USD           │
│ Alin:      53.15 USD            │
│                                 │
├─────────────────────────────────┤
│ Tunnusluvut                     │
│ P/E-luku:        35.59          │
│ P/B-luku:        27.81          │
│ Osinkotuotto:    0.69%          │
│ Markkina-arvo:   2.01T USD      │
│                                 │
└─────────────────────────────────┘
```

-----

## 💡 SUOSITUS SINUN SOVELLUKSELLE

### Vaihe 1: MINIMAALINEN PARANNUS (5 min)

Lisää vain päivän muutos:

**Tallenna vastauksesta:**

```typescript
interface Stock {
  symbol: string;
  shares: number;
  purchasePrice: number;
  currentPrice: number;
  priceChange?: number;           // ← LISÄÄ
  priceChangePercent?: number;    // ← LISÄÄ
}
```

**Päivitä API-kutsu:**

```typescript
// yahooFinanceApi.ts
const priceMap: Record<string, { 
  price: number; 
  change: number; 
  changePercent: number 
}> = {};

for (const quote of data.body) {
  if (quote.symbol && quote.regularMarketPrice) {
    priceMap[quote.symbol] = {
      price: quote.regularMarketPrice,
      change: quote.regularMarketChange || 0,
      changePercent: quote.regularMarketChangePercent || 0
    };
  }
}
```

**Näytä kortissa:**

```tsx
<div className="text-white text-2xl font-bold">
  {stock.currentPrice.toFixed(2)} €
</div>
{stock.priceChange && (
  <div className={stock.priceChange >= 0 ? "text-green-400" : "text-red-400"}>
    {stock.priceChange >= 0 ? "▲" : "▼"} 
    {Math.abs(stock.priceChange).toFixed(2)} 
    ({Math.abs(stock.priceChangePercent).toFixed(2)}%)
  </div>
)}
```

-----

### Vaihe 2: TÄYSI PARANNUS (30 min)

Lisää laajennettavat kortit:

**Tallenna lisää dataa:**

```typescript
interface StockDetails {
  // Perustiedot
  symbol: string;
  shortName: string;
  currency: string;
  
  // Hinnat
  currentPrice: number;
  priceChange: number;
  priceChangePercent: number;
  previousClose: number;
  open: number;
  
  // Päivän vaihteluväli
  dayHigh: number;
  dayLow: number;
  
  // 52 viikon vaihteluväli
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  
  // Volyymi
  volume: number;
  
  // Tunnusluvut (optional)
  marketCap?: number;
  trailingPE?: number;
  dividendYield?: number;
}
```

**Luo ExpandableStockCard:**

```tsx
function ExpandableStockCard({ stock }: { stock: StockDetails }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div onClick={() => setIsExpanded(!isExpanded)}>
      {/* Perusnäkymä */}
      <StockBasicView stock={stock} />
      
      {/* Laajennettu näkymä */}
      {isExpanded && (
        <StockDetailedView stock={stock} />
      )}
    </div>
  );
}
```

-----

## 🎯 LOPULLINEN SUOSITUS

### ⭐ PARAS KOMPROMISSI:

**NÄYTÄ AINA (kortissa):**

1. `regularMarketPrice` - Hinta
1. `regularMarketChange` - Päivän muutos €
1. `regularMarketChangePercent` - Päivän muutos %

**NÄYTÄ KUN AVATAAN (tap → laajenee):**
4. `regularMarketDayHigh` / `regularMarketDayLow` - Päivän vaihteluväli
5. `fiftyTwoWeekHigh` / `fiftyTwoWeekLow` - 52vk vaihteluväli
6. `regularMarketVolume` - Volyymi
7. `marketCap` - Markkina-arvo (jos > 0)
8. `trailingPE` - P/E (jos > 0)
9. `trailingAnnualDividendYield` - Osinko% (jos > 0)

**ÄLÄ NÄYTÄ:**

- `bookValue`, `epsTrailingTwelveMonths`, `forwardPE` - Liian teknistä
- `fiftyDayAverage`, `twoHundredDayAverage` - Tarvii kuvaajan
- `postMarketPrice` - Harvoin tarvitaan, sekoittaa

-----

## 📊 YHTEENVETO TÄRKEIMMISTÄ

```typescript
// MINIMAL (nyt käytössä)
const minimalData = {
  regularMarketPrice: number
};

// RECOMMENDED (suositus)
const recommendedData = {
  regularMarketPrice: number,
  regularMarketChange: number,
  regularMarketChangePercent: number,
  currency: string
};

// FULL (täysi paketti)
const fullData = {
  // Basic
  regularMarketPrice: number,
  regularMarketChange: number,
  regularMarketChangePercent: number,
  currency: string,
  shortName: string,
  
  // Day
  regularMarketDayHigh: number,
  regularMarketDayLow: number,
  regularMarketVolume: number,
  
  // Year
  fiftyTwoWeekHigh: number,
  fiftyTwoWeekLow: number,
  
  // Fundamentals
  marketCap: number,
  trailingPE: number,
  trailingAnnualDividendYield: number
};
```

-----

**Suositus:** Aloita **recommendedData**:lla (hinta + päivän muutos). Se on 80/20: 20% koodia, 80% hyödystä! 🎯