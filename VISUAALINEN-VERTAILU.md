# 🎨 VISUAALINEN VERTAILU - Mitä näyttää?

## 📱 KOLME TASOA VERTAILUSSA

Tässä on kolme eri toteutusta saman osakkeen näyttämiseen. Valitse kumpi sopii sovellukseesi parhaiten!

-----

## TASO 1️⃣: MINIMALISTINEN (nykyinen)

```
╔═══════════════════════════════════════╗
║                                       ║
║              NOKIA.HE                 ║
║                                       ║
║              4.75 EUR                 ║
║                                       ║
║              100 kpl                  ║
║         Arvo: 475.00 EUR              ║
║                                       ║
╚═══════════════════════════════════════╝
```

### ✅ Hyvät puolet:

- Yksinkertainen
- Selkeä
- Ei hälyä
- Sopii aloittelijalle

### ❌ Huonot puolet:

- Ei näe muuttuuko hinta
- Ei tiedä nouseeko vai laskeeko
- Ei kontekstia

### 📊 Data:

```typescript
{
  symbol: "NOKIA.HE",
  currentPrice: 4.75
}
```

### 👥 Käyttäjä ajattelee:

> “Okei, hinta on 4.75 EUR. Mutta onko se hyvä vai huono? Nouseeko vai laskeeko?”

-----

## TASO 2️⃣: PERUSTASO (suositus)

```
╔═══════════════════════════════════════╗
║                                       ║
║         NOKIA.HE        [▲ +2.60%]   ║
║                                       ║
║         4.75 EUR                      ║
║         ▲ +0.12 (+2.60%)             ║
║                                       ║
║         100 kpl @ 4.50 EUR            ║
║         Arvo: 475.00 EUR              ║
║         Tuotto: +25 EUR (+5.56%)     ║
║                                       ║
╚═══════════════════════════════════════╝
```

### ✅ Hyvät puolet:

- Näkee HETI onko hyvä päivä (vihreä ▲)
- Näkee prosenttina (helppo vertailla)
- Näkee myös kokonaistuoton
- Ei liian paljon infoa
- PARAS 80/20 kompromissi

### ❌ Huonot puolet:

- Ei historiaa (52vk high/low)
- Ei tunnuslukuja (P/E)

### 📊 Data:

```typescript
{
  symbol: "NOKIA.HE",
  currentPrice: 4.75,
  priceChange: 0.12,
  priceChangePercent: 2.60,
  currency: "EUR"
}
```

### 👥 Käyttäjä ajattelee:

> “Nice! Osake on noussut 2.6% tänään. Kokonaisuutena olen 5.5% plussalla. 👍”

-----

## TASO 3️⃣: TÄYSI (maksimi)

```
╔═══════════════════════════════════════════════╗
║                                               ║
║    NOKIA.HE - Nokia Corporation  [▲ +2.60%] ║
║                                               ║
║    4.75 EUR  ▲ +0.12 (+2.60%)               ║
║    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    ║
║                                               ║
║    Päivän vaihteluväli                        ║
║    4.50 ━━━━━━━━●━━━━━━━━ 4.85              ║
║            4.75 (nyt)                         ║
║                                               ║
║    52 viikon vaihteluväli                     ║
║    3.20 ━━━━━━━━━━━━━━━━●━ 5.80             ║
║                      4.75                     ║
║                                               ║
║    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    ║
║                                               ║
║    Omistus                                    ║
║    100 kpl @ 4.50 EUR                         ║
║    Arvo: 475.00 EUR                           ║
║    Tuotto: +25.00 EUR (+5.56%)               ║
║                                               ║
║    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    ║
║                                               ║
║    Päivän tiedot                              ║
║    Volyymi:  2.5M kpl                         ║
║    Avaus:    4.65 EUR                         ║
║                                               ║
║    Tunnusluvut                                ║
║    P/E:           15.2                        ║
║    Osinko:        4.2%                        ║
║    Markkina-arvo: 27.8B EUR                   ║
║                                               ║
╚═══════════════════════════════════════════════╝
```

### ✅ Hyvät puolet:

- KAIKKI tieto yhdellä vilkaisulla
- Näkee onko lähellä 52vk huippua
- Näkee päivän volatiliteetin
- Tunnusluvut sijoittajille
- Vakuuttava, ammattimainen

### ❌ Huonot puolet:

- Liikaa infoa (information overload)
- Ei mahdu pienelle ruudulle
- Hidastaa latausta (enemmän dataa)
- Aloittelija ei ymmärrä P/E:tä

### 📊 Data:

```typescript
{
  symbol: "NOKIA.HE",
  shortName: "Nokia Corporation",
  currentPrice: 4.75,
  priceChange: 0.12,
  priceChangePercent: 2.60,
  currency: "EUR",
  dayHigh: 4.85,
  dayLow: 4.50,
  fiftyTwoWeekHigh: 5.80,
  fiftyTwoWeekLow: 3.20,
  volume: 2500000,
  open: 4.65,
  trailingPE: 15.2,
  dividendYield: 4.2,
  marketCap: 27800000000
}
```

### 👥 Käyttäjä ajattelee:

> “Wow, paljon tietoa! Hinta on lähellä 52vk keskikohtaa. P/E on ok. Hyvä osinkotuotto!”

-----

## 🔄 RINNAKKAISVERTAILU

### Sama osake, 3 eri tasoa:

```
┌─────────────────┐  ┌──────────────────────┐  ┌───────────────────────────┐
│   TASO 1        │  │   TASO 2             │  │   TASO 3                  │
│   Minimalistinen│  │   Perustaso          │  │   Täysi                   │
├─────────────────┤  ├──────────────────────┤  ├───────────────────────────┤
│                 │  │                      │  │                           │
│  NOKIA.HE       │  │  NOKIA.HE   [+2.6%]  │  │  NOKIA.HE - Nokia Corp    │
│                 │  │                      │  │  [▲ +2.60%]              │
│  4.75 EUR       │  │  4.75 EUR            │  │                           │
│                 │  │  ▲ +0.12 (+2.6%)     │  │  4.75 EUR ▲ +0.12        │
│  100 kpl        │  │                      │  │  Päivän: 4.50 - 4.85      │
│  475 EUR        │  │  100 kpl @ 4.50      │  │  52vk: 3.20 - 5.80       │
│                 │  │  Arvo: 475 EUR       │  │                           │
│                 │  │  Tuotto: +25 EUR     │  │  Omistus: 100 kpl         │
│                 │  │  (+5.56%)            │  │  Arvo: 475 EUR            │
│                 │  │                      │  │  Tuotto: +25 EUR (+5.6%)  │
│                 │  │                      │  │                           │
│                 │  │                      │  │  P/E: 15.2 | Osinko: 4.2% │
│                 │  │                      │  │  Markkina-arvo: 27.8B EUR │
│                 │  │                      │  │                           │
└─────────────────┘  └──────────────────────┘  └───────────────────────────┘

Korkeus: 120px      Korkeus: 180px          Korkeus: 350px
Leveys: 300px       Leveys: 350px           Leveys: 450px
Data: 2 kenttää     Data: 5 kenttää         Data: 15 kenttää
Latausaika: 100ms   Latausaika: 150ms       Latausaika: 300ms
```

-----

## 📊 VERTAILUTAULUKKO

|Ominaisuus          |Taso 1|Taso 2|Taso 3|
|--------------------|------|------|------|
|Hinta               |✅     |✅     |✅     |
|Päivän muutos       |❌     |✅     |✅     |
|Päivän muutos %     |❌     |✅     |✅     |
|Kokonaistuotto      |❌     |✅     |✅     |
|Päivän vaihteluväli |❌     |❌     |✅     |
|52vk vaihteluväli   |❌     |❌     |✅     |
|Volyymi             |❌     |❌     |✅     |
|P/E-luku            |❌     |❌     |✅     |
|Osinkotuotto        |❌     |❌     |✅     |
|Markkina-arvo       |❌     |❌     |✅     |
|                    |      |      |      |
|**Käytettävyys**    |      |      |      |
|Nopea ymmärtää      |⭐⭐⭐⭐⭐ |⭐⭐⭐⭐⭐ |⭐⭐⭐   |
|Tarpeeksi tietoa    |⭐⭐    |⭐⭐⭐⭐⭐ |⭐⭐⭐⭐⭐ |
|Ei liikaa infoa     |⭐⭐⭐⭐⭐ |⭐⭐⭐⭐  |⭐⭐    |
|Mahtuu ruudulle     |⭐⭐⭐⭐⭐ |⭐⭐⭐⭐⭐ |⭐⭐⭐   |
|Latausnopeus        |⭐⭐⭐⭐⭐ |⭐⭐⭐⭐  |⭐⭐⭐   |
|                    |      |      |      |
|**Kokonaisarvosana**|3/5   |5/5   |4/5   |

-----

## 🎯 SUOSITUS ERI KÄYTTÄJÄTYYPEILLE

### 👶 Aloittelija / Casual-käyttäjä

→ **TASO 1 tai TASO 2**

- Ei halua ylikuormitusta
- Haluaa vain tietää “miten menee”
- Ei ymmärrä P/E:tä tai osinkotuottoa
- **Suositus: TASO 2** (päivän muutos on must!)

### 📊 Aktiivinen sijoittaja

→ **TASO 2 tai TASO 3**

- Haluaa nähdä trendit
- Vertailee osakkeita keskenään
- Kiinnostaa päivän volatiliteetti
- **Suositus: TASO 2** (riittää 90% käyttöön)

### 🤓 Power user / Analyytikko

→ **TASO 3 + lisää**

- Haluaa KAIKEN datan
- Käyttää tunnuslukuja
- Tekee päätöksiä P/E:n perusteella
- **Suositus: TASO 3 + laajennettava kortit**

-----

## 💡 HYBRIDIRATKAISUT

### Ratkaisu A: Perus + Laajennettava

```
Oletuksena: TASO 2
Tap → Laajenee: TASO 3

┌──────────────────────┐
│ NOKIA.HE    [+2.6%] │  ← Oletuksena TASO 2
│ 4.75 EUR             │
│ ▲ +0.12 (+2.6%)     │
│ [Tap to expand ▼]    │
└──────────────────────┘

  ↓ Tap

┌──────────────────────┐
│ NOKIA.HE    [+2.6%] │
│ 4.75 EUR             │
│ ▲ +0.12 (+2.6%)     │
│ ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬  │  ← Laajenee TASO 3:ksi
│ Päivän: 4.50-4.85    │
│ 52vk: 3.20-5.80      │
│ P/E: 15.2            │
│ Osinko: 4.2%         │
│ [Collapse ▲]         │
└──────────────────────┘
```

**Hyödyt:**

- ✅ Oletuksena kevyt (TASO 2)
- ✅ Halutessaan saa lisää (TASO 3)
- ✅ Paras molemmista maailmoista

### Ratkaisu B: Välilehdet

```
┌──────────────────────────────────┐
│ [Yleistä] [Päivä] [Tunnusluvut]  │  ← Välilehdet
├──────────────────────────────────┤
│                                  │
│  TASO 2 sisältö                  │
│  (oletuksena "Yleistä")          │
│                                  │
└──────────────────────────────────┘

Tap "Päivä":
→ Näyttää päivän vaihteluvälin, volyymin, jne.

Tap "Tunnusluvut":
→ Näyttää P/E, P/B, osingon, jne.
```

-----

## 🚀 TOTEUTUSOHJE

### Vaihe 1: Aloita TASO 2:sta

```bash
# Kopio KOODIESIMERKIT-PAIVAN-MUUTOS.md
# Toteuta TASO 2
# Testaa
```

### Vaihe 2: Lisää laajennettavuus (optional)

```typescript
function StockCard({ stock }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div onClick={() => setIsExpanded(!isExpanded)}>
      {/* TASO 2: Aina näkyvissä */}
      <BasicView stock={stock} />
      
      {/* TASO 3: Vain jos laajennettu */}
      {isExpanded && <DetailedView stock={stock} />}
    </div>
  );
}
```

### Vaihe 3: Mittaa käyttäjäpalaute

- Kysele käyttäjiltä: “Haluatko enemmän tietoa?”
- Seuraa: Kuinka moni laajentaa kortteja?
- Jos > 80% laajentaa → Tee TASO 3 oletukseksi
- Jos < 20% laajentaa → TASO 2 riittää

-----

## 🎨 MUOTOILUVAIHTOEHDOT

### Kompakti (monta osaketta ruudulla)

```
┌──────────┬──────────┬──────────┐
│ NOKIA.HE │ AAPL     │ MSFT     │
│ 4.75 EUR │ 182.50 $ │ 415.20 $ │
│ ▲ +2.6%  │ ▼ -1.2%  │ ▲ +0.8%  │
└──────────┴──────────┴──────────┘
```

### Lista (helppo skrollata)

```
┌────────────────────────────────┐
│ NOKIA.HE      4.75 EUR  ▲ +2.6% │
├────────────────────────────────┤
│ AAPL         182.50 USD ▼ -1.2% │
├────────────────────────────────┤
│ MSFT         415.20 USD ▲ +0.8% │
└────────────────────────────────┘
```

### Kortit (visuaalinen)

```
┌───────────────┐ ┌───────────────┐
│   NOKIA.HE    │ │     AAPL      │
│               │ │               │
│   4.75 EUR    │ │  182.50 USD   │
│   ▲ +2.6%     │ │   ▼ -1.2%     │
│               │ │               │
│  +25 EUR tuotto│ │ -337 USD tuotto│
└───────────────┘ └───────────────┘
```

-----

## 🎯 LOPULLINEN SUOSITUS

**Aloita tästä:**

```
TASO 2: Perustaso
━━━━━━━━━━━━━━━
✅ Hinta
✅ Päivän muutos €
✅ Päivän muutos %
✅ Kokonaistuotto

= 80% hyödystä, 20% työstä
```

**Jos tarvitset enemmän:**

```
Lisää laajennettavuus:
Tap → Näyttää TASO 3

= 100% hyödystä, 40% työstä
```

**Älä aloita TASO 3:sta:**

- Liikaa työtä
- Liikaa dataa
- Liikaa ylläpitoa

**Muista:**

> “Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away.” - Antoine de Saint-Exupéry

**TASO 2 on täydellinen balanssi.** 🎯