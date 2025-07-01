import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertTransactionSchema, insertWatchlistSchema } from "@shared/schema";
import { z } from "zod";

// CoinGecko API service
class CoinGeckoService {
  private baseUrl = "https://api.coingecko.com/api/v3";

  async getCryptoPrices(symbols: string[] = ["bitcoin", "ethereum", "cardano", "solana", "polygon", "chainlink", "avalanche-2", "binancecoin", "ripple", "dogecoin", "polkadot", "shiba-inu", "uniswap", "litecoin", "cosmos", "algorand", "near", "vechain", "filecoin", "tron"]) {
    try {
      const symbolsString = symbols.join(",");
      const response = await fetch(
        `${this.baseUrl}/simple/price?ids=${symbolsString}&vs_currencies=usd&include_24hr_change=true`
      );
      
      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error fetching crypto prices:", error);
      throw error;
    }
  }

  async getCryptoList() {
    try {
      const response = await fetch(`${this.baseUrl}/coins/list`);
      
      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error fetching crypto list:", error);
      throw error;
    }
  }

  async getCryptoDetails(coinId: string) {
    try {
      const response = await fetch(
        `${this.baseUrl}/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
      );
      
      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error fetching crypto details:", error);
      throw error;
    }
  }

  async getHistoricalData(coinId: string, days: number = 7) {
    try {
      const response = await fetch(
        `${this.baseUrl}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}&interval=${days <= 1 ? 'hourly' : 'daily'}`
      );
      
      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error fetching historical data:", error);
      throw error;
    }
  }
}

const coinGecko = new CoinGeckoService();

// Symbol mapping for CoinGecko IDs
const symbolToCoinGeckoId: Record<string, string> = {
  "BTC": "bitcoin",
  "ETH": "ethereum", 
  "ADA": "cardano",
  "SOL": "solana",
  "MATIC": "polygon",
  "LINK": "chainlink",
  "AVAX": "avalanche-2",
  "BNB": "binancecoin",
  "XRP": "ripple",
  "DOGE": "dogecoin",
  "DOT": "polkadot",
  "SHIB": "shiba-inu",
  "UNI": "uniswap",
  "LTC": "litecoin",
  "ATOM": "cosmos",
  "ALGO": "algorand",
  "NEAR": "near",
  "VET": "vechain",
  "FIL": "filecoin",
  "TRX": "tron"
};

const coinGeckoIdToSymbol: Record<string, string> = {
  "bitcoin": "BTC",
  "ethereum": "ETH",
  "cardano": "ADA", 
  "solana": "SOL",
  "polygon": "MATIC",
  "chainlink": "LINK",
  "avalanche-2": "AVAX",
  "binancecoin": "BNB",
  "ripple": "XRP",
  "dogecoin": "DOGE",
  "polkadot": "DOT",
  "shiba-inu": "SHIB",
  "uniswap": "UNI",
  "litecoin": "LTC",
  "cosmos": "ATOM",
  "algorand": "ALGO",
  "near": "NEAR",
  "vechain": "VET",
  "filecoin": "FIL",
  "tron": "TRX"
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Crypto prices endpoint
  app.get('/api/crypto/prices', async (req, res) => {
    try {
      const prices = await coinGecko.getCryptoPrices();
      
      // Transform to our format
      const formattedPrices = Object.entries(prices).map(([coinId, data]: [string, any]) => ({
        symbol: coinGeckoIdToSymbol[coinId] || coinId.toUpperCase(),
        name: coinId.charAt(0).toUpperCase() + coinId.slice(1),
        price: data.usd,
        change24h: data.usd_24h_change || 0,
        coinGeckoId: coinId
      }));

      res.json(formattedPrices);
    } catch (error) {
      console.error("Error fetching crypto prices:", error);
      res.status(500).json({ message: "Failed to fetch crypto prices" });
    }
  });

  // Portfolio endpoints
  app.get('/api/portfolio', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const holdings = await storage.getUserHoldings(userId);
      let balance = await storage.getUserBalance(userId);
      
      // Initialize balance if it doesn't exist
      if (!balance) {
        balance = await storage.initializeUserBalance(userId);
      }
      
      // Get current prices for portfolio calculation
      const symbols = holdings.map(h => symbolToCoinGeckoId[h.symbol]).filter(Boolean);
      let prices: Record<string, any> = {};
      
      if (symbols.length > 0) {
        prices = await coinGecko.getCryptoPrices(symbols);
      }

      // Calculate portfolio value
      let totalValue = parseFloat(balance?.balance || "0");
      const holdingsWithValue = holdings.map(holding => {
        const coinGeckoId = symbolToCoinGeckoId[holding.symbol];
        const price = prices[coinGeckoId]?.usd || 0;
        const value = parseFloat(holding.amount) * price;
        totalValue += value;
        
        return {
          ...holding,
          currentPrice: price,
          value,
          change24h: prices[coinGeckoId]?.usd_24h_change || 0
        };
      });

      res.json({
        totalValue,
        availableCash: parseFloat(balance?.balance || "0"),
        holdings: holdingsWithValue
      });
    } catch (error) {
      console.error("Error fetching portfolio:", error);
      res.status(500).json({ message: "Failed to fetch portfolio" });
    }
  });

  // Trade endpoint (buy/sell)
  app.post('/api/trade', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { symbol, type, amount, price } = req.body;

      if (!symbol || !type || !amount || !price) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      if (type !== "buy" && type !== "sell") {
        return res.status(400).json({ message: "Invalid trade type" });
      }

      const amountNum = parseFloat(amount);
      const priceNum = parseFloat(price);
      const total = amountNum * priceNum;
      const fee = total * 0.001; // 0.1% fee
      const totalWithFee = type === "buy" ? total + fee : total - fee;

      // Get user balance and initialize if needed
      let balance = await storage.getUserBalance(userId);
      if (!balance) {
        balance = await storage.initializeUserBalance(userId);
      }

      const currentBalance = parseFloat(balance.balance || "0");

      if (type === "buy") {
        // Check if user has enough balance
        if (currentBalance < total + fee) {
          return res.status(400).json({ message: "Insufficient balance" });
        }

        // Update balance
        await storage.updateUserBalance(userId, (currentBalance - total - fee).toString());

        // Update or create holding
        const existingHolding = await storage.getHolding(userId, symbol);
        if (existingHolding) {
          const newAmount = parseFloat(existingHolding.amount) + amountNum;
          await storage.updateHolding(userId, symbol, newAmount.toString());
        } else {
          await storage.createHolding({
            userId,
            symbol,
            amount: amount.toString()
          });
        }
      } else {
        // Sell
        const existingHolding = await storage.getHolding(userId, symbol);
        if (!existingHolding || parseFloat(existingHolding.amount) < amountNum) {
          return res.status(400).json({ message: "Insufficient holdings" });
        }

        // Update balance
        await storage.updateUserBalance(userId, (currentBalance + total - fee).toString());

        // Update holding
        const newAmount = parseFloat(existingHolding.amount) - amountNum;
        if (newAmount > 0) {
          await storage.updateHolding(userId, symbol, newAmount.toString());
        } else {
          // Remove holding if amount becomes 0 or negative
          await storage.updateHolding(userId, symbol, "0");
        }
      }

      // Create transaction record
      const transaction = await storage.createTransaction({
        userId,
        symbol,
        type,
        amount: amount.toString(),
        price: price.toString(),
        total: total.toString(),
        fee: fee.toString()
      });

      res.json({ success: true, transaction });
    } catch (error) {
      console.error("Error processing trade:", error);
      res.status(500).json({ message: "Failed to process trade" });
    }
  });

  // Transactions endpoint
  app.get('/api/transactions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const limit = parseInt(req.query.limit as string) || 10;
      const transactions = await storage.getUserTransactions(userId, limit);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  // Watchlist endpoints
  app.get('/api/watchlist', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const watchlistItems = await storage.getUserWatchlist(userId);
      
      // Get prices for watchlist items
      const symbols = watchlistItems.map(item => symbolToCoinGeckoId[item.symbol]).filter(Boolean);
      let prices: Record<string, any> = {};
      
      if (symbols.length > 0) {
        prices = await coinGecko.getCryptoPrices(symbols);
      }

      const watchlistWithPrices = watchlistItems.map(item => {
        const coinGeckoId = symbolToCoinGeckoId[item.symbol];
        return {
          ...item,
          price: prices[coinGeckoId]?.usd || 0,
          change24h: prices[coinGeckoId]?.usd_24h_change || 0
        };
      });

      res.json(watchlistWithPrices);
    } catch (error) {
      console.error("Error fetching watchlist:", error);
      res.status(500).json({ message: "Failed to fetch watchlist" });
    }
  });

  app.post('/api/watchlist', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { symbol } = req.body;

      if (!symbol) {
        return res.status(400).json({ message: "Symbol is required" });
      }

      const item = await storage.addToWatchlist({ userId, symbol });
      res.json(item);
    } catch (error) {
      console.error("Error adding to watchlist:", error);
      res.status(500).json({ message: "Failed to add to watchlist" });
    }
  });

  app.delete('/api/watchlist/:symbol', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { symbol } = req.params;

      await storage.removeFromWatchlist(userId, symbol);
      res.json({ success: true });
    } catch (error) {
      console.error("Error removing from watchlist:", error);
      res.status(500).json({ message: "Failed to remove from watchlist" });
    }
  });

  // Crypto details endpoint for icons and additional data
  app.get('/api/crypto/:coinId/details', async (req, res) => {
    try {
      const { coinId } = req.params;
      const details = await coinGecko.getCryptoDetails(coinId);
      
      res.json({
        id: details.id,
        symbol: details.symbol.toUpperCase(),
        name: details.name,
        image: details.image?.large || details.image?.small,
        current_price: details.market_data?.current_price?.usd,
        price_change_24h: details.market_data?.price_change_percentage_24h,
        market_cap: details.market_data?.market_cap?.usd,
        market_cap_rank: details.market_cap_rank,
        total_volume: details.market_data?.total_volume?.usd,
        description: details.description?.en?.substring(0, 500)
      });
    } catch (error) {
      console.error("Error fetching crypto details:", error);
      res.status(500).json({ message: "Failed to fetch crypto details" });
    }
  });

  // Historical data endpoint for charts
  app.get('/api/crypto/:coinId/history', async (req, res) => {
    try {
      const { coinId } = req.params;
      const days = parseInt(req.query.days as string) || 7;
      const data = await coinGecko.getHistoricalData(coinId, days);
      
      // Transform the data for easier frontend consumption
      const chartData = data.prices.map((price: [number, number], index: number) => ({
        timestamp: price[0],
        price: price[1],
        volume: data.total_volumes[index]?.[1] || 0
      }));
      
      res.json(chartData);
    } catch (error) {
      console.error("Error fetching historical data:", error);
      res.status(500).json({ message: "Failed to fetch historical data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
