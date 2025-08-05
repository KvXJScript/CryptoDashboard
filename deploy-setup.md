# GitHub Pages Deployment Setup

## Overview
This guide will help you deploy your Crypto Dashboard to GitHub Pages as a static Single Page Application (SPA).

## Required Environment Variables

Since GitHub Pages only serves static files, the app will run entirely in the browser. You'll need these API keys for full functionality:

### Required APIs:
1. **CoinGecko API** (Free tier available)
   - No API key required for basic usage
   - Rate limited to 30 calls/minute
   - Used for: Real-time crypto prices and historical data

2. **Optional: CoinGecko Pro API** (For higher rate limits)
   - Environment Variable: `VITE_COINGECKO_API_KEY`
   - Get it from: https://www.coingecko.com/en/api/pricing
   - Used for: Higher rate limits and more detailed data

### Environment File Setup
Create a `.env` file in your project root:

```env
# CoinGecko Pro API Key (optional, for higher rate limits)
VITE_COINGECKO_API_KEY=your_coingecko_pro_key_here

# GitHub Pages deployment base path
VITE_BASE_PATH=/your-repository-name
```

## Pre-Deployment Steps

### 1. Repository Setup
- Create a new GitHub repository for your project
- Push your code to the repository
- Enable GitHub Pages in repository settings

### 2. Update Configuration
- Update the repository name in `vite.config.github.ts`
- Configure the correct base path for your GitHub Pages URL

### 3. Build Configuration
The app includes optimized build scripts that:
- Bundle the frontend for static deployment
- Remove server dependencies
- Configure routing for SPA
- Optimize assets for production

## Deployment Commands

```bash
# Install dependencies
npm install

# Build for GitHub Pages
npm run build:github

# Deploy to GitHub Pages
npm run deploy:github
```

## GitHub Actions (Automated Deployment)

Alternatively, use GitHub Actions for automatic deployment on every push to main branch. The workflow file will be created automatically.

## Post-Deployment Features

### Available Features:
✅ Real-time cryptocurrency prices (via CoinGecko API)
✅ Interactive price charts with historical data
✅ Portfolio simulation with local storage
✅ Watchlist functionality
✅ Dark/light theme toggle
✅ Responsive design for all devices
✅ Trading simulation with transaction history

### Limitations on GitHub Pages:
❌ No user authentication (frontend-only)
❌ No server-side database (uses browser local storage)
❌ No server-side session management

### Data Persistence:
- Portfolio data: Stored in browser localStorage
- User preferences: Stored in browser localStorage
- Crypto prices: Fetched from CoinGecko API
- Charts data: Generated from API or mock data

## Testing Your Deployment

After deployment, your app will be available at:
```
https://your-username.github.io/your-repository-name/
```

Test the following features:
1. Dashboard loads with crypto prices
2. Trading simulation works
3. Portfolio tracking functions
4. Charts display properly
5. Theme switching works
6. Mobile responsiveness

## Troubleshooting

### Common Issues:
1. **Blank page**: Check browser console for routing issues
2. **API errors**: Verify CoinGecko API is accessible
3. **Asset loading**: Ensure correct base path configuration
4. **Local storage**: Clear browser data if experiencing issues

### Debug Mode:
Add `?debug=true` to your URL to see additional logging information.