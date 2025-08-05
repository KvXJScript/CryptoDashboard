# 🚀 Complete GitHub Pages Deployment Guide

## 📋 Requirements

### 1. GitHub Repository Setup
- Create a new GitHub repository
- Enable GitHub Pages in Settings → Pages
- Select "GitHub Actions" as the source

### 2. Environment Variables (Optional but Recommended)

#### For CoinGecko Pro API (Higher Rate Limits):
```bash
# In your GitHub repository settings → Secrets and variables → Actions
# Add this secret:
VITE_COINGECKO_API_KEY=your_coingecko_pro_api_key_here
```

**Get your CoinGecko Pro API key:**
1. Visit: https://www.coingecko.com/en/api/pricing
2. Sign up for a plan (free tier available)
3. Copy your API key
4. Add it to GitHub repository secrets

## 🛠️ Deployment Steps

### Method 1: Automatic Deployment (Recommended)

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Setup GitHub Pages deployment"
   git push origin main
   ```

2. **GitHub Actions will automatically:**
   - Install dependencies
   - Build the application
   - Deploy to GitHub Pages
   - Your app will be live at: `https://yourusername.github.io/your-repo-name/`

### Method 2: Manual Deployment

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build for GitHub Pages:**
   ```bash
   # Update the base path in vite.config.github.ts first
   npm run build:github
   ```

3. **Deploy:**
   ```bash
   npm run deploy:github
   ```

## ⚙️ Configuration Files Created

### ✅ Files Added/Modified:
- `.github/workflows/deploy.yml` - GitHub Actions workflow
- `vite.config.github.ts` - Optimized for static deployment
- `client/public/404.html` - SPA routing support
- `.env.example` - Environment variables template
- `client/src/lib/staticAuth.ts` - Frontend-only authentication
- `client/src/lib/staticStorage.ts` - LocalStorage data persistence

## 🎯 Features Available on GitHub Pages

### ✅ Working Features:
- **Real-time crypto prices** (CoinGecko API)
- **Interactive price charts** with historical data
- **Portfolio tracking** (localStorage persistence)
- **Trading simulation** with buy/sell functionality
- **Watchlist management** 
- **Transaction history**
- **Dark/light theme toggle**
- **Responsive design** (mobile/desktop)
- **Demo user authentication**

### ⚠️ Limitations:
- No server-side database (uses browser localStorage)
- No multi-user authentication
- Data persists only in browser storage
- No real money transactions (simulation only)

## 🔧 Customization

### Update Repository Name:
1. Edit `vite.config.github.ts`:
   ```typescript
   base: process.env.VITE_BASE_PATH || "/your-repository-name/",
   ```

2. Or set environment variable:
   ```bash
   VITE_BASE_PATH=/your-repository-name
   ```

### Demo Data:
- Portfolio starts with sample BTC, ETH, ADA holdings
- $50,000 demo cash balance
- Pre-configured watchlist
- All data stored in browser localStorage

## 🔍 Testing Your Deployment

After deployment, verify these features work:

1. **Dashboard loads** with crypto prices
2. **Trading works** - buy/sell cryptocurrencies
3. **Portfolio updates** after trades
4. **Watchlist functions** - add/remove coins
5. **Charts display** price history
6. **Theme switching** works
7. **Mobile responsive** design

## 🐛 Troubleshooting

### Common Issues:

1. **Blank page after deployment:**
   - Check browser console for errors
   - Verify base path configuration
   - Check GitHub Pages settings

2. **API errors:**
   - CoinGecko API has rate limits (30 calls/minute free tier)
   - App falls back to mock data if API fails
   - Consider upgrading to CoinGecko Pro for higher limits

3. **Data not persisting:**
   - Clear browser localStorage and refresh
   - Check browser storage permissions
   - Ensure JavaScript is enabled

4. **Build failures:**
   - Check GitHub Actions logs
   - Verify all dependencies are compatible
   - Review build configuration

### Debug Mode:
Add `?debug=true` to your URL for additional console logging.

## 📈 Production Considerations

### Performance:
- App uses code splitting for optimal loading
- Images and assets are optimized
- Service worker for offline functionality (optional)

### Security:
- No sensitive data stored
- API keys properly configured as secrets
- Client-side only, no server vulnerabilities

## 🚀 Your App is Ready!

Once deployed, your crypto dashboard will be available at:
**https://yourusername.github.io/your-repository-name/**

The app provides a full-featured cryptocurrency tracking and trading simulation experience, perfect for learning and demonstration purposes!