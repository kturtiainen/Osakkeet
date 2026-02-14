# 📊 Osakesalkku

Modern, iPad-optimized stock portfolio tracking app with real-time prices and multi-portfolio support.

## 🚀 Features

- 📊 **Multiple Portfolios** - Create and manage multiple portfolios with tabs
- 💰 **Real-time Prices** - Yahoo Finance data via RapidAPI
- 📱 **Progressive Web App** - Install on iOS/Android, works offline
- 🌙 **Dark Theme** - Beautiful dark UI with purple/pink gradients
- 🔄 **Auto-refresh** - Daily automatic price updates at 14:00 (weekdays)
- 💾 **Import/Export** - Backup and restore your portfolios
- 🔒 **Privacy-first** - All data stored locally on your device

## 🎯 Quick Start

### 1. Open the App
**Live Demo:** [https://kturtiainen.github.io/Osakkeet/](https://kturtiainen.github.io/Osakkeet/)

### 2. Get API Key
1. Click ⚙️ (Settings)
2. Get free API key: [RapidAPI Yahoo Finance](https://rapidapi.com/sparior/api/yahoo-finance15)
3. Enter key and save

**Note:** Free tier limited to 100 requests/month. App auto-refreshes once daily.

### 3. Add Stocks
1. In Settings, add stocks:
   - **Symbol**: e.g., `NOKIA.HE`, `AAPL`, `VOLV-B.ST`
   - **Shares**: Number of shares owned
   - **Purchase Price**: Price paid per share
2. Click "Lisää osake" (Add stock)
3. Prices update automatically

### 4. Create Multiple Portfolios
- Click "+ Uusi salkku" to create new portfolios
- Switch between portfolios using tabs
- Rename or delete portfolios (hover over tab)

## 📱 Install as App

### iOS (Safari):
1. Open [app URL](https://kturtiainen.github.io/Osakkeet/)
2. Tap Share button
3. Select "Add to Home Screen"
4. App works like native app!

### Android (Chrome):
1. Open app URL
2. Tap menu (⋮)
3. Select "Install app" or "Add to Home screen"

## 🔧 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React 18+ |
| **Language** | TypeScript (strict mode) |
| **Build** | Vite |
| **Styling** | Tailwind CSS |
| **State** | Zustand with persist middleware |
| **Storage** | IndexedDB via idb-keyval |
| **PWA** | vite-plugin-pwa |
| **Testing** | Vitest |
| **Linting** | ESLint |
| **Hosting** | GitHub Pages |

## 💻 Development

### Prerequisites
- Node.js 20+
- npm

### Setup
```bash
# Clone repository
git clone https://github.com/kturtiainen/Osakkeet.git
cd Osakkeet

# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Lint code
npm run lint

# Type check
npm run type-check
```

### Project Structure
```
/Osakkeet/
├── src/
│   ├── components/      # React components
│   ├── hooks/           # Custom React hooks
│   ├── store/           # Zustand store
│   ├── services/        # API services
│   ├── types/           # TypeScript types
│   ├── utils/           # Utility functions
│   └── tests/           # Unit tests
├── public/              # Static assets
└── archive/             # Old single-file app
```

## 🔒 Security & Privacy

- ✅ All data stored **locally** on your device (IndexedDB)
- ✅ API key stored **only on your device**
- ✅ No server-side storage
- ✅ No tracking or analytics
- ✅ XSS prevention via React's built-in escaping
- ✅ Input validation for all user data

## 📊 Supported Exchanges

Stock symbols in Yahoo Finance format:
- 🇫🇮 **Helsinki**: `NOKIA.HE`, `FORTUM.HE`, `NESTE.HE`
- 🇺🇸 **USA**: `AAPL`, `MSFT`, `GOOGL`, `TSLA`
- 🇸🇪 **Stockholm**: `VOLV-B.ST`, `ERIC-B.ST`
- 🇬🇧 **London**: `BP.L`, `SHEL.L`

Find symbols at [Yahoo Finance](https://finance.yahoo.com/)

## 💾 Backup & Restore

### Export Portfolio
1. Settings → "💾 Vie salkku"
2. JSON file downloads to your device

### Import Portfolio
1. Settings → "📂 Tuo salkku"
2. Select previously saved JSON file

**Important:** Export regularly! iOS may clear app data if device storage is low.

## 🐛 Troubleshooting

**Prices not updating:**
- Check API key in settings
- Verify internet connection
- Ensure symbol is correct Yahoo Finance format
- Free tier: 100 requests/month limit
- Auto-refresh runs once daily at 14:00 (weekdays)

**App not working:**
- Clear browser cache
- Refresh page (F5 or ⌘+R)
- Use modern browser (Chrome, Safari, Firefox, Edge)

**Lost data:**
- iOS may clear IndexedDB if storage low
- **Export portfolios regularly!**

## 📄 License

MIT License - See [LICENSE](LICENSE) file

## 🤝 Contributing

Pull requests welcome! Please follow the coding standards in [CLAUDE.md](CLAUDE.md).

---

**Developer:** Kape Turtiainen  
**Version:** 2.0.0  
**Updated:** 2026-02-14