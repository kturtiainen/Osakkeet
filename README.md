# 📊 Osakesalkku

Moderni, iPad-optimoitu osakesalkun seurantasovellus reaaliaikaisilla hinnoilla.

## 🚀 Käyttö

### 1. Avaa sovellus
**GitHub Pages:** [https://kturtiainen.github.io/Osakkeet/](https://kturtiainen.github.io/Osakkeet/)

### 2. Aseta API-avain
1. Paina ⚙️-kuvaketta (asetukset)
2. Hanki ilmainen API-avain: [RapidAPI - Yahoo Finance](https://rapidapi.com/sparior/api/yahoo-finance15)
3. Syötä avain ja paina "Tallenna"
4. Voit viedä avaimen tiedostoon varmuuskopiota varten

### 3. Lisää osakkeita
1. Asetuksissa täytä:
   - **Symboli**: Esim. `NOKIA.HE` (Helsinki), `AAPL` (USA)
   - **Määrä**: Osakkeiden lukumäärä
   - **Hankintahinta**: Hinta jonka maksoit per osake
2. Paina "Lisää osake"
3. Hinnat päivittyvät automaattisesti

### 4. Käytä sovellusta
- 🔄 **Päivitä hinnat** - Hae uusimmat hinnat
- ⚙️ **Asetukset** - Hallinnoi osakkeita ja API-avainta
- **Automaattinen päivitys** - Hinnat päivittyvät 5 min välein
- **Offline-tuki** - Toimii ilman nettiä (näyttää välimuistin hinnat)

## 📱 Asennus iPadille/iPhonelle

### Safari:
1. Avaa [https://kturtiainen.github.io/Osakkeet/](https://kturtiainen.github.io/Osakkeet/)
2. Paina **Share**-nappia (neliö nuolella)
3. Valitse **"Add to Home Screen"**
4. Sovellus toimii nyt kuin natiiviapp!

## 💾 Varmuuskopiot

### Vie salkku
1. Asetukset → "💾 Vie salkku"
2. JSON-tiedosto tallentuu laitteellesi

### Tuo salkku
1. Asetukset → "📂 Tuo salkku"
2. Valitse aiemmin tallennettu JSON-tiedosto

## 🔧 Teknologia

- **Frontend**: Pure HTML/CSS/JavaScript (ei riippuvuuksia)
- **Tallennus**: IndexedDB (fallback: localStorage)
- **API**: Yahoo Finance via RapidAPI
- **PWA**: Service Worker + Manifest
- **Hosting**: GitHub Pages (ilmainen)

## 🔒 Tietoturva

- ✅ Kaikki data tallennetaan **vain laitteellesi** (IndexedDB)
- ✅ API-avain tallennetaan **vain laitteellesi**
- ✅ Ei palvelinpuolen tallennusta
- ✅ GitHub Pages on julkinen, mutta **sinun datasi on yksityinen**

## 📊 Pörssit

Tuetut symbolit:
- 🇫🇮 **Helsinki**: `NOKIA.HE`, `WRT1V.HE`, `NESTE.HE`
- 🇺🇸 **USA**: `AAPL`, `MSFT`, `GOOGL`, `TSLA`
- 🇸🇪 **Tukholma**: `VOLV-B.ST`, `ERIC-B.ST`
- 🇬🇧 **Lontoo**: `BP.L`, `SHEL.L`

Löydät symbolit: [Yahoo Finance](https://finance.yahoo.com/)

## 🐛 Ongelmanratkaisu

**Hinnat eivät päivity:**
- Tarkista API-avain asetuksista
- Varmista että olet online
- Tarkista että symboli on oikein (esim. `NOKIA.HE`, ei `NOKIA`)

**Sovellus ei toimi:**
- Tyhjennä selaimen välimuisti
- Päivitä sivu (F5 tai ⌘+R)
- Varmista että käytät modernia selainta

**Data katosi:**
- iOS voi tyhjentää IndexedDB:n jos tila loppuu
- **Vie salkku säännöllisesti varmuuskopioksi!**

## 📄 Lisenssi

MIT License - Vapaa käyttöön

## 🤝 Kehitys

Pull requestit tervetulleita! 

---

**Kehittäjä:** Kape Turtiainen  
**Versio:** 1.0.0  
**Päivitetty:** 2026-02-14