import type { Holding, Transaction, WatchlistItem, UserBalance } from "@shared/schema";

// Mock portfolio data for demo
export const mockHoldings: Holding[] = [
  {
    id: 1,
    userId: "demo-user-1",
    symbol: "BTC",
    amount: "0.25000000",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: 2,
    userId: "demo-user-1",
    symbol: "ETH",
    amount: "2.50000000",
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: 3,
    userId: "demo-user-1",
    symbol: "ADA",
    amount: "1000.00000000",
    createdAt: new Date("2024-01-25"),
    updatedAt: new Date("2024-01-25"),
  },
  {
    id: 4,
    userId: "demo-user-1",
    symbol: "SOL",
    amount: "15.00000000",
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01"),
  },
];

export const mockTransactions: Transaction[] = [
  {
    id: 1,
    userId: "demo-user-1",
    symbol: "BTC",
    type: "buy",
    amount: "0.25000000",
    price: "45000.00000000",
    total: "11250.00000000",
    fee: "56.25000000",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: 2,
    userId: "demo-user-1",
    symbol: "ETH",
    type: "buy",
    amount: "2.50000000",
    price: "2800.00000000",
    total: "7000.00000000",
    fee: "35.00000000",
    createdAt: new Date("2024-01-20"),
  },
  {
    id: 3,
    userId: "demo-user-1",
    symbol: "ADA",
    type: "buy",
    amount: "1000.00000000",
    price: "0.45000000",
    total: "450.00000000",
    fee: "2.25000000",
    createdAt: new Date("2024-01-25"),
  },
  {
    id: 4,
    userId: "demo-user-1",
    symbol: "SOL",
    type: "buy",
    amount: "15.00000000",
    price: "80.00000000",
    total: "1200.00000000",
    fee: "6.00000000",
    createdAt: new Date("2024-02-01"),
  },
  {
    id: 5,
    userId: "demo-user-1",
    symbol: "BTC",
    type: "sell",
    amount: "0.05000000",
    price: "48000.00000000",
    total: "2400.00000000",
    fee: "12.00000000",
    createdAt: new Date("2024-02-10"),
  },
];

export const mockWatchlist: WatchlistItem[] = [
  {
    id: 1,
    userId: "demo-user-1",
    symbol: "MATIC",
    createdAt: new Date("2024-01-10"),
  },
  {
    id: 2,
    userId: "demo-user-1",
    symbol: "LINK",
    createdAt: new Date("2024-01-12"),
  },
  {
    id: 3,
    userId: "demo-user-1",
    symbol: "AVAX",
    createdAt: new Date("2024-01-18"),
  },
  {
    id: 4,
    userId: "demo-user-1",
    symbol: "DOT",
    createdAt: new Date("2024-01-22"),
  },
];

export const mockUserBalance: UserBalance = {
  id: 1,
  userId: "demo-user-1",
  balance: "5843.75",
  updatedAt: new Date("2024-02-10"),
};

// Cryptocurrency price data (fallback when API is unavailable)
export const mockCryptoPrices = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    price: 106535.00,
    change24h: 3.68,
    cgId: "bitcoin"
  },
  {
    symbol: "ETH",
    name: "Ethereum", 
    price: 3245.50,
    change24h: -1.24,
    cgId: "ethereum"
  },
  {
    symbol: "ADA",
    name: "Cardano",
    price: 0.4567,
    change24h: 2.15,
    cgId: "cardano"
  },
  {
    symbol: "SOL",
    name: "Solana",
    price: 89.45,
    change24h: -0.87,
    cgId: "solana"
  },
  {
    symbol: "MATIC",
    name: "Polygon",
    price: 0.3456,
    change24h: 1.23,
    cgId: "polygon"
  },
  {
    symbol: "LINK",
    name: "Chainlink",
    price: 11.78,
    change24h: -2.34,
    cgId: "chainlink"
  },
  {
    symbol: "AVAX",
    name: "Avalanche",
    price: 17.59,
    change24h: -2.76,
    cgId: "avalanche-2"
  },
  {
    symbol: "BNB",
    name: "BNB",
    price: 652.67,
    change24h: -0.13,
    cgId: "binancecoin"
  },
  {
    symbol: "XRP",
    name: "XRP",
    price: 2.34,
    change24h: 0.56,
    cgId: "ripple"
  },
  {
    symbol: "DOGE",
    name: "Dogecoin",
    price: 0.3789,
    change24h: 4.21,
    cgId: "dogecoin"
  },
  {
    symbol: "DOT",
    name: "Polkadot",
    price: 4.56,
    change24h: -1.45,
    cgId: "polkadot"
  },
  {
    symbol: "SHIB",
    name: "Shiba Inu",
    price: 0.00001234,
    change24h: 2.67,
    cgId: "shiba-inu"
  },
  {
    symbol: "UNI",
    name: "Uniswap",
    price: 8.45,
    change24h: -0.98,
    cgId: "uniswap"
  },
  {
    symbol: "LTC",
    name: "Litecoin",
    price: 67.89,
    change24h: 1.87,
    cgId: "litecoin"
  },
  {
    symbol: "ATOM",
    name: "Cosmos",
    price: 5.67,
    change24h: -0.43,
    cgId: "cosmos"
  },
  {
    symbol: "ALGO",
    name: "Algorand",
    price: 0.1871,
    change24h: 3.68,
    cgId: "algorand"
  },
  {
    symbol: "NEAR",
    name: "NEAR Protocol",
    price: 3.45,
    change24h: -1.23,
    cgId: "near"
  },
  {
    symbol: "VET",
    name: "VeChain",
    price: 0.02345,
    change24h: 0.87,
    cgId: "vechain"
  },
  {
    symbol: "FIL",
    name: "Filecoin",
    price: 4.23,
    change24h: -2.15,
    cgId: "filecoin"
  },
  {
    symbol: "TRX",
    name: "TRON",
    price: 0.2456,
    change24h: 1.45,
    cgId: "tron"
  },
];

// Store data in localStorage
export const saveToLocalStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
};

// Load data from localStorage
export const loadFromLocalStorage = (key: string, fallback: any) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch (error) {
    console.error("Error loading from localStorage:", error);
    return fallback;
  }
};

// Initialize mock data in localStorage
export const initializeMockData = () => {
  if (!localStorage.getItem("cryptotracker_holdings")) {
    saveToLocalStorage("cryptotracker_holdings", mockHoldings);
  }
  if (!localStorage.getItem("cryptotracker_transactions")) {
    saveToLocalStorage("cryptotracker_transactions", mockTransactions);
  }
  if (!localStorage.getItem("cryptotracker_watchlist")) {
    saveToLocalStorage("cryptotracker_watchlist", mockWatchlist);
  }
  if (!localStorage.getItem("cryptotracker_balance")) {
    saveToLocalStorage("cryptotracker_balance", mockUserBalance);
  }
};