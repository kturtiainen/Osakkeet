# ⚡ PIKA-OHJE: Mitä näyttää API-vastauksesta?

## 🎯 NOPEA VASTAUS

### Näytä NÄMÄ (suositus):

```typescript
{
  regularMarketPrice: 117.32,           // ⭐⭐⭐⭐⭐ Hinta
  regularMarketChange: 4.5,             // ⭐⭐⭐⭐⭐ Päivän muutos €
  regularMarketChangePercent: 3.99,     // ⭐⭐⭐⭐⭐ Päivän muutos %
  currency: "USD"                        // ⭐⭐⭐⭐⭐ Valuutta
}
```

### Näyttää tältä:

```
AAPL
117.32 USD  ▲ +4.50 (+3.99%)
```

**Miksi nämä?**

- **80% hyödystä, 20% työstä**
- Näet heti onko hyvä vai huono päivä
- Helppo vertailla eri osakkeita
- Ei liikaa infoa

-----

## 📚 TIEDOSTOT (4 kpl)

### 1. YAHOO-FINANCE-API-ANALYYSI.md ⭐ Lue ensin!

- Kaikki API:n kentät analysoitu
- Tärkeysluokittelu (⭐⭐⭐⭐⭐ → ⭐)
- Esimerkit miten näyttää
- Suositukset 3 tasolle

### 2. VISUAALINEN-VERTAILU.md

- 3 eri tasoa visuaalisesti
- Taso 1: Minimalistinen (nykyinen)
- Taso 2: Perustaso (suositus)
- Taso 3: Täysi (maksimi)
- Vertailutaulukko

### 3. KOODIESIMERKIT-PAIVAN-MUUTOS.md

- Konkreettinen koodi
- Askel-askeleelta ohjeet
- Kopioi ja liitä
- Testausohjeet

### 4. PIKA-OHJE.md (tämä)

- Nopea tiivistelmä
- Suora suositus
- Mitä lukea seuraavaksi

-----

## 🚀 MITÄ TEHDÄ SEURAAVAKSI?

### Jos haluat yksinkertaisen ratkaisun (5 min):

1. Lue **KOODIESIMERKIT-PAIVAN-MUUTOS.md**
1. Kopioi koodi
1. Testaa
1. Valmis! ✅

### Jos haluat ymmärtää vaihtoehdot (15 min):

1. Lue **YAHOO-FINANCE-API-ANALYYSI.md** (täydellinen analyysi)
1. Lue **VISUAALINEN-VERTAILU.md** (näe eri vaihtoehdot)
1. Valitse mikä sopii sinulle
1. Lue **KOODIESIMERKIT-PAIVAN-MUUTOS.md**
1. Toteuta!

-----

## 💡 SUOSITUKSENI

**TASO 2: Perustaso**

Näytä:

- Hinta ✅
- Päivän muutos € ✅
- Päivän muutos % ✅
- Valuutta ✅

Älä näytä (vielä):

- P/E-luku ❌ (liian tekninen)
- 52vk high/low ❌ (ei mahdu)
- Volyymi ❌ (ei oleellinen)
- Markkina-arvo ❌ (ei tarvii joka kortin)

**Miksi?**

- Riittää 90% käyttöön
- Nopea toteuttaa
- Ei ylikuormita käyttäjää
- Näyttää ammatilliselta

-----

## 📊 API-VASTAUKSESTA SUORAAN KOODIIN

### API palauttaa:

```json
{
  "regularMarketPrice": 117.32,
  "regularMarketChange": 4.5,
  "regularMarketChangePercent": 3.99,
  "currency": "USD"
}
```

### Tallennat:

```typescript
interface Stock {
  currentPrice: number;
  priceChange?: number;
  priceChangePercent?: number;
  currency?: string;
}
```

### Näytät:

```tsx
<div>
  {stock.currentPrice.toFixed(2)} {stock.currency}
  {stock.priceChange && (
    <span className={stock.priceChange >= 0 ? 'text-green' : 'text-red'}>
      {stock.priceChange >= 0 ? '▲' : '▼'} 
      {Math.abs(stock.priceChange).toFixed(2)} 
      ({Math.abs(stock.priceChangePercent).toFixed(2)}%)
    </span>
  )}
</div>
```

-----

## ✅ TARKISTUSLISTA

Ennen kuin aloitat:

- [ ] Olet lukenut **YAHOO-FINANCE-API-ANALYYSI.md**
- [ ] Ymmärrät miksi TASO 2 on paras
- [ ] Tiedät mitä kenttiä tarvitset API:sta
- [ ] Olet valmis koodaamaan

Kun toteutat:

- [ ] Päivitä `types/index.ts` (lisää kentät)
- [ ] Päivitä `services/yahooFinanceApi.ts` (palauta lisää dataa)
- [ ] Päivitä `store/portfolioStore.ts` (tallenna lisädata)
- [ ] Päivitä `components/StockCard.tsx` (näytä lisädata)
- [ ] Testaa että toimii!

-----

## 🎨 TULOKSET

### ENNEN:

```
NOKIA.HE
4.75 EUR
```

😐 Okei, mutta onko se hyvä vai huono?

### JÄLKEEN:

```
NOKIA.HE
4.75 EUR  ▲ +0.12 (+2.60%)
```

😊 Mahtavaa! Osake nousee tänään!

-----

## 📖 LUKUJÄRJESTYS

### Pikainen (5 min):

1. PIKA-OHJE.md (tämä) ✓
1. KOODIESIMERKIT-PAIVAN-MUUTOS.md
1. Kopioi & liitä koodi
1. Valmis!

### Perusteellinen (30 min):

1. PIKA-OHJE.md (tämä) ✓
1. YAHOO-FINANCE-API-ANALYYSI.md
1. VISUAALINEN-VERTAILU.md
1. KOODIESIMERKIT-PAIVAN-MUUTOS.md
1. Toteuta oma ratkaisu
1. Testaa & hio

-----

## 🎯 YHTEENVETO

**Kysymys:** Mitä näyttää Yahoo Finance API:n vastauksesta?

**Vastaus:**

```
✅ regularMarketPrice
✅ regularMarketChange
✅ regularMarketChangePercent
✅ currency
```

**Miksi:** 80/20 sääntö - 80% hyödystä, 20% työstä

**Miten:** Lue **KOODIESIMERKIT-PAIVAN-MUUTOS.md**

**Lopputulos:**

```
AAPL
117.32 USD  ▲ +4.50 (+3.99%)
```

**Seuraava askel:** Aloita lukeminen! 📚

-----

Onnea projektiin! 🚀