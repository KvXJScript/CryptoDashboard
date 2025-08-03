var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  holdings: () => holdings,
  holdingsRelations: () => holdingsRelations,
  insertHoldingSchema: () => insertHoldingSchema,
  insertTransactionSchema: () => insertTransactionSchema,
  insertUserBalanceSchema: () => insertUserBalanceSchema,
  insertWatchlistSchema: () => insertWatchlistSchema,
  sessions: () => sessions,
  transactions: () => transactions,
  transactionsRelations: () => transactionsRelations,
  userBalance: () => userBalance,
  userBalanceRelations: () => userBalanceRelations,
  users: () => users,
  usersRelations: () => usersRelations,
  watchlist: () => watchlist,
  watchlistRelations: () => watchlistRelations
});
import {
  pgTable,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  decimal
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
var sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull()
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);
var users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var holdings = pgTable("holdings", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  symbol: varchar("symbol").notNull(),
  // BTC, ETH, etc.
  amount: decimal("amount", { precision: 18, scale: 8 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  symbol: varchar("symbol").notNull(),
  type: varchar("type").notNull(),
  // 'buy' or 'sell'
  amount: decimal("amount", { precision: 18, scale: 8 }).notNull(),
  price: decimal("price", { precision: 18, scale: 8 }).notNull(),
  total: decimal("total", { precision: 18, scale: 8 }).notNull(),
  fee: decimal("fee", { precision: 18, scale: 8 }).default("0"),
  createdAt: timestamp("created_at").defaultNow()
});
var watchlist = pgTable("watchlist", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  symbol: varchar("symbol").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});
var userBalance = pgTable("user_balance", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id).unique(),
  balance: decimal("balance", { precision: 18, scale: 2 }).default("10000.00"),
  updatedAt: timestamp("updated_at").defaultNow()
});
var usersRelations = relations(users, ({ many, one }) => ({
  holdings: many(holdings),
  transactions: many(transactions),
  watchlist: many(watchlist),
  balance: one(userBalance)
}));
var holdingsRelations = relations(holdings, ({ one }) => ({
  user: one(users, {
    fields: [holdings.userId],
    references: [users.id]
  })
}));
var transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users, {
    fields: [transactions.userId],
    references: [users.id]
  })
}));
var watchlistRelations = relations(watchlist, ({ one }) => ({
  user: one(users, {
    fields: [watchlist.userId],
    references: [users.id]
  })
}));
var userBalanceRelations = relations(userBalance, ({ one }) => ({
  user: one(users, {
    fields: [userBalance.userId],
    references: [users.id]
  })
}));
var insertHoldingSchema = createInsertSchema(holdings).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true
});
var insertWatchlistSchema = createInsertSchema(watchlist).omit({
  id: true,
  createdAt: true
});
var insertUserBalanceSchema = createInsertSchema(userBalance).omit({
  id: true,
  updatedAt: true
});

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq, desc, and } from "drizzle-orm";
var MemoryStorage = class {
  users = /* @__PURE__ */ new Map();
  holdings = /* @__PURE__ */ new Map();
  transactions = /* @__PURE__ */ new Map();
  watchlists = /* @__PURE__ */ new Map();
  balances = /* @__PURE__ */ new Map();
  nextId = 1;
  async getUser(id) {
    return this.users.get(id);
  }
  async upsertUser(userData) {
    const existingUser = Array.from(this.users.values()).find((u) => u.email === userData.email);
    if (existingUser) {
      const updated = { ...existingUser, ...userData };
      this.users.set(existingUser.id.toString(), updated);
      return updated;
    }
    const newUser = {
      id: (this.nextId++).toString(),
      email: userData.email || null,
      firstName: userData.firstName || null,
      lastName: userData.lastName || null,
      profileImageUrl: userData.profileImageUrl || null,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.users.set(newUser.id.toString(), newUser);
    return newUser;
  }
  async getUserHoldings(userId) {
    return this.holdings.get(userId) || [];
  }
  async getHolding(userId, symbol) {
    const userHoldings = this.holdings.get(userId) || [];
    return userHoldings.find((h) => h.symbol === symbol);
  }
  async createHolding(holding) {
    const newHolding = {
      id: this.nextId++,
      ...holding,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    const userHoldings = this.holdings.get(holding.userId) || [];
    userHoldings.push(newHolding);
    this.holdings.set(holding.userId, userHoldings);
    return newHolding;
  }
  async updateHolding(userId, symbol, amount) {
    const userHoldings = this.holdings.get(userId) || [];
    const holdingIndex = userHoldings.findIndex((h) => h.symbol === symbol);
    if (holdingIndex >= 0) {
      userHoldings[holdingIndex] = {
        ...userHoldings[holdingIndex],
        amount,
        updatedAt: /* @__PURE__ */ new Date()
      };
      return userHoldings[holdingIndex];
    }
    throw new Error("Holding not found");
  }
  async createTransaction(transaction) {
    const newTransaction = {
      id: this.nextId++,
      ...transaction,
      fee: transaction.fee || null,
      createdAt: /* @__PURE__ */ new Date()
    };
    const userTransactions = this.transactions.get(transaction.userId) || [];
    userTransactions.unshift(newTransaction);
    this.transactions.set(transaction.userId, userTransactions);
    return newTransaction;
  }
  async getUserTransactions(userId, limit = 10) {
    const userTransactions = this.transactions.get(userId) || [];
    return userTransactions.slice(0, limit);
  }
  async getUserWatchlist(userId) {
    return this.watchlists.get(userId) || [];
  }
  async addToWatchlist(item) {
    const newItem = {
      id: this.nextId++,
      ...item,
      createdAt: /* @__PURE__ */ new Date()
    };
    const userWatchlist = this.watchlists.get(item.userId) || [];
    userWatchlist.push(newItem);
    this.watchlists.set(item.userId, userWatchlist);
    return newItem;
  }
  async removeFromWatchlist(userId, symbol) {
    const userWatchlist = this.watchlists.get(userId) || [];
    const filtered = userWatchlist.filter((item) => item.symbol !== symbol);
    this.watchlists.set(userId, filtered);
  }
  async getUserBalance(userId) {
    return this.balances.get(userId);
  }
  async updateUserBalance(userId, balance) {
    const existing = this.balances.get(userId);
    if (!existing) {
      throw new Error("Balance not found");
    }
    const updated = {
      ...existing,
      balance,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.balances.set(userId, updated);
    return updated;
  }
  async initializeUserBalance(userId) {
    const newBalance = {
      id: this.nextId++,
      userId,
      balance: "10000.00",
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.balances.set(userId, newBalance);
    return newBalance;
  }
};
console.warn("Using memory storage due to database connection issues");
var storage = new MemoryStorage();

// server/replitAuth.ts
import * as client from "openid-client";
import { Strategy } from "openid-client/passport";
import passport from "passport";
import session from "express-session";
import memoize from "memoizee";
import MemoryStore from "memorystore";
if (!process.env.REPLIT_DOMAINS) {
  throw new Error("Environment variable REPLIT_DOMAINS not provided");
}
var getOidcConfig = memoize(
  async () => {
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID
    );
  },
  { maxAge: 3600 * 1e3 }
);
function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1e3;
  console.warn("Using memory store for sessions due to database unavailability");
  const MemStore = MemoryStore(session);
  const sessionStore = new MemStore({
    checkPeriod: sessionTtl
  });
  return session({
    secret: process.env.SESSION_SECRET || process.env.REPL_ID || "fallback-secret-for-development",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: sessionTtl
    }
  });
}
function updateUserSession(user, tokens) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}
async function upsertUser(claims) {
  await storage.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"]
  });
}
async function setupAuth(app2) {
  app2.set("trust proxy", 1);
  app2.use(getSession());
  app2.use(passport.initialize());
  app2.use(passport.session());
  const config = await getOidcConfig();
  const verify = async (tokens, verified) => {
    const claims = tokens.claims();
    const user = {
      sub: claims.sub,
      email: claims.email,
      name: claims.name,
      picture: claims.picture,
      claims
    };
    updateUserSession(user, tokens);
    await upsertUser(claims);
    verified(null, user);
  };
  for (const domain of process.env.REPLIT_DOMAINS.split(",")) {
    const strategy = new Strategy(
      {
        name: `replitauth:${domain}`,
        config,
        scope: "openid email profile offline_access",
        callbackURL: `https://${domain}/api/callback`
      },
      verify
    );
    passport.use(strategy);
  }
  passport.serializeUser((user, cb) => cb(null, user));
  passport.deserializeUser((user, cb) => cb(null, user));
  app2.get("/api/login", (req, res, next) => {
    const hostname = req.hostname || req.get("host")?.split(":")[0] || "localhost";
    passport.authenticate(`replitauth:${hostname}`, {
      prompt: "login consent",
      scope: ["openid", "email", "profile", "offline_access"]
    })(req, res, next);
  });
  app2.get("/api/callback", (req, res, next) => {
    const hostname = req.hostname || req.get("host")?.split(":")[0] || "localhost";
    passport.authenticate(`replitauth:${hostname}`, {
      successReturnToOrRedirect: "/",
      failureRedirect: "/api/login"
    })(req, res, next);
  });
  app2.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.redirect(
        client.buildEndSessionUrl(config, {
          client_id: process.env.REPL_ID,
          post_logout_redirect_uri: `${req.protocol}://${req.hostname}`
        }).href
      );
    });
  });
}
var isAuthenticated = async (req, res, next) => {
  const user = req.user;
  if (!req.isAuthenticated() || !user.expires_at) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const now = Math.floor(Date.now() / 1e3);
  if (now <= user.expires_at) {
    return next();
  }
  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  try {
    const config = await getOidcConfig();
    const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
    updateUserSession(user, tokenResponse);
    return next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};

// server/routes.ts
var CoinGeckoService = class {
  baseUrl = "https://api.coingecko.com/api/v3";
  lastRequestTime = 0;
  requestDelay = 1e3;
  // 1 second between requests
  // Fallback data for when API is unavailable
  fallbackPrices = {
    bitcoin: { usd: 106535, usd_24h_change: 3.68 },
    ethereum: { usd: 3245.5, usd_24h_change: -1.24 },
    cardano: { usd: 0.4567, usd_24h_change: 2.15 },
    solana: { usd: 89.45, usd_24h_change: -0.87 },
    polygon: { usd: 0.3456, usd_24h_change: 1.23 },
    chainlink: { usd: 11.78, usd_24h_change: -2.34 },
    "avalanche-2": { usd: 17.59, usd_24h_change: -2.76 },
    binancecoin: { usd: 652.67, usd_24h_change: -0.13 },
    ripple: { usd: 2.34, usd_24h_change: 0.56 },
    dogecoin: { usd: 0.3789, usd_24h_change: 4.21 },
    polkadot: { usd: 4.56, usd_24h_change: -1.45 },
    "shiba-inu": { usd: 1234e-8, usd_24h_change: 2.67 },
    uniswap: { usd: 8.45, usd_24h_change: -0.98 },
    litecoin: { usd: 67.89, usd_24h_change: 1.87 },
    cosmos: { usd: 5.67, usd_24h_change: -0.43 },
    algorand: { usd: 0.1871, usd_24h_change: 3.68 },
    near: { usd: 3.45, usd_24h_change: -1.23 },
    vechain: { usd: 0.02345, usd_24h_change: 0.87 },
    filecoin: { usd: 4.23, usd_24h_change: -2.15 },
    tron: { usd: 0.2456, usd_24h_change: 1.45 }
  };
  async rateLimitedFetch(url) {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < this.requestDelay) {
      await new Promise((resolve) => setTimeout(resolve, this.requestDelay - timeSinceLastRequest));
    }
    this.lastRequestTime = Date.now();
    return fetch(url);
  }
  async getCryptoPrices(symbols = ["bitcoin", "ethereum", "cardano", "solana", "polygon", "chainlink", "avalanche-2", "binancecoin", "ripple", "dogecoin", "polkadot", "shiba-inu", "uniswap", "litecoin", "cosmos", "algorand", "near", "vechain", "filecoin", "tron"]) {
    try {
      const symbolsString = symbols.join(",");
      const response = await this.rateLimitedFetch(
        `${this.baseUrl}/simple/price?ids=${symbolsString}&vs_currencies=usd&include_24hr_change=true`
      );
      if (!response.ok) {
        console.log("API request failed, using fallback data");
        return this.fallbackPrices;
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching crypto prices, using fallback data:", error);
      return this.fallbackPrices;
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
  async getCryptoDetails(coinId) {
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
  async getHistoricalData(coinId, days = 7) {
    try {
      const response = await this.rateLimitedFetch(
        `${this.baseUrl}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}&interval=${days <= 1 ? "hourly" : "daily"}`
      );
      if (!response.ok) {
        console.log("Historical data API request failed, using fallback data");
        return this.generateFallbackHistoricalData(coinId, days);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching historical data, using fallback data:", error);
      return this.generateFallbackHistoricalData(coinId, days);
    }
  }
  generateFallbackHistoricalData(coinId, days) {
    const basePrice = this.fallbackPrices[coinId]?.usd || 100;
    const prices = [];
    const volumes = [];
    for (let i = days; i >= 0; i--) {
      const timestamp2 = Date.now() - i * 24 * 60 * 60 * 1e3;
      const priceVariation = (Math.random() - 0.5) * 0.1;
      const price = basePrice * (1 + priceVariation);
      const volume = Math.random() * 1e9;
      prices.push([timestamp2, price]);
      volumes.push([timestamp2, volume]);
    }
    return { prices, total_volumes: volumes };
  }
};
var coinGecko = new CoinGeckoService();
var symbolToCoinGeckoId = {
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
var coinGeckoIdToSymbol = {
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
async function registerRoutes(app2) {
  await setupAuth(app2);
  app2.get("/api/auth/user", isAuthenticated, async (req, res) => {
    try {
      let userId;
      if (req.user.claims && req.user.claims.sub) {
        userId = req.user.claims.sub;
      } else if (req.user.sub) {
        userId = req.user.sub;
      } else if (req.user.id) {
        userId = req.user.id;
      } else {
        userId = "default-user";
      }
      let user = await storage.getUser(userId);
      if (!user) {
        const userData = {
          id: userId,
          email: req.user.email || "user@example.com",
          name: req.user.name || "Demo User",
          avatarUrl: req.user.picture || null,
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        };
        user = await storage.upsertUser(userData);
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  app2.get("/api/crypto/prices", async (req, res) => {
    try {
      const prices = await coinGecko.getCryptoPrices();
      const formattedPrices = Object.entries(prices).map(([coinId, data]) => ({
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
  app2.get("/api/portfolio", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const holdings2 = await storage.getUserHoldings(userId);
      let balance = await storage.getUserBalance(userId);
      if (!balance) {
        balance = await storage.initializeUserBalance(userId);
      }
      const symbols = holdings2.map((h) => symbolToCoinGeckoId[h.symbol]).filter(Boolean);
      let prices = {};
      if (symbols.length > 0) {
        prices = await coinGecko.getCryptoPrices(symbols);
      }
      let totalValue = parseFloat(balance?.balance || "0");
      const holdingsWithValue = holdings2.map((holding) => {
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
  app2.post("/api/trade", isAuthenticated, async (req, res) => {
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
      const fee = total * 1e-3;
      const totalWithFee = type === "buy" ? total + fee : total - fee;
      let balance = await storage.getUserBalance(userId);
      if (!balance) {
        balance = await storage.initializeUserBalance(userId);
      }
      const currentBalance = parseFloat(balance.balance || "0");
      if (type === "buy") {
        if (currentBalance < total + fee) {
          return res.status(400).json({ message: "Insufficient balance" });
        }
        await storage.updateUserBalance(userId, (currentBalance - total - fee).toString());
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
        const existingHolding = await storage.getHolding(userId, symbol);
        if (!existingHolding || parseFloat(existingHolding.amount) < amountNum) {
          return res.status(400).json({ message: "Insufficient holdings" });
        }
        await storage.updateUserBalance(userId, (currentBalance + total - fee).toString());
        const newAmount = parseFloat(existingHolding.amount) - amountNum;
        if (newAmount > 0) {
          await storage.updateHolding(userId, symbol, newAmount.toString());
        } else {
          await storage.updateHolding(userId, symbol, "0");
        }
      }
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
  app2.get("/api/transactions", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const limit = parseInt(req.query.limit) || 10;
      const transactions2 = await storage.getUserTransactions(userId, limit);
      res.json(transactions2);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });
  app2.get("/api/watchlist", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const watchlistItems = await storage.getUserWatchlist(userId);
      const symbols = watchlistItems.map((item) => symbolToCoinGeckoId[item.symbol]).filter(Boolean);
      let prices = {};
      if (symbols.length > 0) {
        prices = await coinGecko.getCryptoPrices(symbols);
      }
      const watchlistWithPrices = watchlistItems.map((item) => {
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
  app2.post("/api/watchlist", isAuthenticated, async (req, res) => {
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
  app2.delete("/api/watchlist/:symbol", isAuthenticated, async (req, res) => {
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
  app2.get("/api/crypto/:coinId/details", async (req, res) => {
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
  app2.get("/api/crypto/:coinId/history", async (req, res) => {
    try {
      const { coinId } = req.params;
      const days = parseInt(req.query.days) || 7;
      const data = await coinGecko.getHistoricalData(coinId, days);
      const chartData = data.prices.map((price, index2) => ({
        timestamp: price[0],
        price: price[1],
        volume: data.total_volumes[index2]?.[1] || 0
      }));
      res.json(chartData);
    } catch (error) {
      console.error("Error fetching historical data:", error);
      res.status(500).json({ message: "Failed to fetch historical data" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    await import("@replit/vite-plugin-cartographer").then((m) => m.cartographer())
  ],
  base: "/CryptoDashboard/",
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    if (!res.headersSent) {
      res.status(status).json({ message });
    }
    console.error("Error:", err);
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
