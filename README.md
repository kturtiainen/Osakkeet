# 📊 Osakesalkku

Moderni, iPad-optimoitu osakesalkun seurantasovellus reaaliaikaisilla hinnoilla.

## 🚀 Käyttö

### 1. Avaa sovellus
**GitHub Pages:** [https://kturtiainen.github.io/Osakkeet/](https://kturtiainen.github.io/Osakkeet/)

### 2. Aseta API-avain
1. Paina ⚙️-kuvaketta (asetukset)
2. Hanki ilmainen API-avain: [RapidAPI Yahoo Finance](https://rapidapi.com/sparior/api/yahoo-finance15)
3. Syötä avain ja paina "Tallenna"
4. Voit viedä avaimen tiedostoon varmuuskopiota varten

**Huomio:** API-avain on turvallista säilyttää selaimen lokaalisessa muistissa. Ilmainen taso on rajoitettu 100 pyyntöön/kuukausi.

### 3. Lisää osakkeita
1. Asetuksissa täytä:
   - **Symboli**: Esim. `NOKIA.HE`, `AAPL`, `VOLV-B.ST` (Yahoo Finance -muodossa)
   - **Määrä**: Osakkeiden lukumäärä
   - **Hankintahinta**: Hinta jonka maksoit per osake
2. Paina "Lisää osake"
3. Hinnat päivittyvät automaattisesti

### 4. Käytä sovellusta
- 🔄 **Päivitä hinnat** - Hae uusimmat hinnat (vahvistus vaaditaan)
- ⚙️ **Asetukset** - Hallinnoi osakkeita ja API-avainta
- **Automaattinen päivitys** - Hinnat päivittyvät automaattisesti kerran päivässä klo 14:00 (ma-pe)
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
- **API**: Yahoo Finance via RapidAPI (ilmainen, 100 pyyntöä/kuukausi)
- **PWA**: Service Worker + Manifest
- **Hosting**: GitHub Pages (ilmainen)

## 🔒 Tietoturva

- ✅ Kaikki data tallennetaan **vain laitteellesi** (IndexedDB)
- ✅ API-avain tallennetaan **vain laitteellesi**
- ✅ Ei palvelinpuolen tallennusta
- ✅ GitHub Pages on julkinen, mutta **sinun datasi on yksityinen**

## 📊 Pörssit

Tuetut symbolit (Yahoo Finance -muodossa):
- 🇫🇮 **Helsinki**: `NOKIA.HE`, `FORTUM.HE`, `NESTE.HE`, `AKTIA.HE`
- 🇺🇸 **USA**: `AAPL`, `MSFT`, `GOOGL`, `TSLA`
- 🇸🇪 **Tukholma**: `VOLV-B.ST`, `ERIC-B.ST`
- 🇬🇧 **Lontoo**: `BP.L`, `SHEL.L`

Löydät symbolit: [Yahoo Finance](https://finance.yahoo.com/)

## 🐛 Ongelmanratkaisu

**Hinnat eivät päivity:**
- Tarkista API-avain asetuksista
- Varmista että olet online
- Tarkista että symboli on oikein Yahoo Finance -muodossa (esim. `NOKIA.HE`, `AAPL`)
- Huomaa: Ilmainen taso on rajoitettu 100 pyyntöön/kuukausi
- Automaattinen päivitys tapahtuu kerran päivässä klo 14:00 (ma-pe)

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