// Static storage service for GitHub Pages deployment
// Uses localStorage for data persistence

import type { 
  Holding, 
  Transaction, 
  WatchlistItem, 
  UserBalance,
  Deposit,
  PortfolioHistory
} from "@shared/schema";

const STORAGE_KEYS = {
  HOLDINGS: 'crypto-dashboard-holdings',
  TRANSACTIONS: 'crypto-dashboard-transactions',
  WATCHLIST: 'crypto-dashboard-watchlist',
  BALANCE: 'crypto-dashboard-balance',
  DEPOSITS: 'crypto-dashboard-deposits',
  PORTFOLIO_HISTORY: 'crypto-dashboard-portfolio-history',
} as const;

export class StaticStorageService {
  // Generic localStorage helper
  private static get<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') return defaultValue;
    
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
      return defaultValue;
    }
  }

  private static set<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  }

  // Holdings management
  static getHoldings(): Holding[] {
    return this.get(STORAGE_KEYS.HOLDINGS, []);
  }

  static saveHoldings(holdings: Holding[]): void {
    this.set(STORAGE_KEYS.HOLDINGS, holdings);
  }

  static addOrUpdateHolding(symbol: string, amount: string, userId: string): void {
    const holdings = this.getHoldings();
    const existingIndex = holdings.findIndex(h => h.symbol === symbol && h.userId === userId);
    
    if (existingIndex >= 0) {
      holdings[existingIndex] = {
        ...holdings[existingIndex],
        amount,
        updatedAt: new Date(),
      };
    } else {
      const newHolding: Holding = {
        id: Date.now(), // Simple ID generation for demo
        userId,
        symbol,
        amount,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      holdings.push(newHolding);
    }
    
    this.saveHoldings(holdings);
  }

  // Transactions management
  static getTransactions(): Transaction[] {
    return this.get(STORAGE_KEYS.TRANSACTIONS, []);
  }

  static saveTransactions(transactions: Transaction[]): void {
    this.set(STORAGE_KEYS.TRANSACTIONS, transactions);
  }

  static addTransaction(transaction: Omit<Transaction, 'id' | 'createdAt'>): void {
    const transactions = this.getTransactions();
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now(), // Simple ID generation for demo
      createdAt: new Date(),
    };
    
    transactions.unshift(newTransaction); // Add to beginning for recent-first order
    this.saveTransactions(transactions);
  }

  // Watchlist management
  static getWatchlist(): WatchlistItem[] {
    return this.get(STORAGE_KEYS.WATCHLIST, []);
  }

  static saveWatchlist(watchlist: WatchlistItem[]): void {
    this.set(STORAGE_KEYS.WATCHLIST, watchlist);
  }

  static addToWatchlist(symbol: string, userId: string): void {
    const watchlist = this.getWatchlist();
    const exists = watchlist.some(item => item.symbol === symbol && item.userId === userId);
    
    if (!exists) {
      const newItem: WatchlistItem = {
        id: Date.now(), // Simple ID generation for demo
        userId,
        symbol,
        createdAt: new Date(),
      };
      watchlist.push(newItem);
      this.saveWatchlist(watchlist);
    }
  }

  static removeFromWatchlist(symbol: string, userId: string): void {
    const watchlist = this.getWatchlist();
    const filteredWatchlist = watchlist.filter(
      item => !(item.symbol === symbol && item.userId === userId)
    );
    this.saveWatchlist(filteredWatchlist);
  }

  // User balance management
  static getUserBalance(userId: string): UserBalance | null {
    const balances: UserBalance[] = this.get(STORAGE_KEYS.BALANCE, []);
    return balances.find((b: UserBalance) => b.userId === userId) || null;
  }

  static updateUserBalance(userId: string, balance: string): void {
    const balances: UserBalance[] = this.get(STORAGE_KEYS.BALANCE, []);
    const existingIndex = balances.findIndex((b: UserBalance) => b.userId === userId);
    
    if (existingIndex >= 0) {
      balances[existingIndex] = {
        ...balances[existingIndex],
        balance,
        updatedAt: new Date(),
      };
    } else {
      const newBalance: UserBalance = {
        id: Date.now(), // Simple ID generation for demo
        userId,
        balance,
        updatedAt: new Date(),
      };
      balances.push(newBalance);
    }
    
    this.set(STORAGE_KEYS.BALANCE, balances);
  }

  // Deposits and withdrawals management
  static getDeposits(): Deposit[] {
    return this.get(STORAGE_KEYS.DEPOSITS, []);
  }

  static saveDeposits(deposits: Deposit[]): void {
    this.set(STORAGE_KEYS.DEPOSITS, deposits);
  }

  static addDeposit(deposit: Omit<Deposit, 'id' | 'createdAt'>): Deposit {
    const deposits = this.getDeposits();
    const newDeposit: Deposit = {
      ...deposit,
      id: Date.now(),
      createdAt: new Date(),
    };
    
    deposits.unshift(newDeposit);
    this.saveDeposits(deposits);
    
    // Auto-complete after 1 minute for demo
    setTimeout(() => {
      this.completeDeposit(newDeposit.id);
    }, 60000);
    
    return newDeposit;
  }

  static completeDeposit(depositId: number): void {
    const deposits = this.getDeposits();
    const depositIndex = deposits.findIndex(d => d.id === depositId);
    
    if (depositIndex >= 0) {
      deposits[depositIndex] = {
        ...deposits[depositIndex],
        status: "completed",
        completedAt: new Date(),
      };
      this.saveDeposits(deposits);
    }
  }

  // Portfolio history management
  static getPortfolioHistory(): PortfolioHistory[] {
    return this.get(STORAGE_KEYS.PORTFOLIO_HISTORY, []);
  }

  static savePortfolioHistory(history: PortfolioHistory[]): void {
    this.set(STORAGE_KEYS.PORTFOLIO_HISTORY, history);
  }

  static addPortfolioSnapshot(userId: string, totalValue: string, cashBalance: string, holdings: any[]): void {
    const history = this.getPortfolioHistory();
    const snapshot: PortfolioHistory = {
      id: Date.now(),
      userId,
      totalValue,
      cashBalance,
      holdings,
      createdAt: new Date(),
    };
    
    history.push(snapshot);
    
    // Keep only last 100 snapshots for performance
    if (history.length > 100) {
      history.shift();
    }
    
    this.savePortfolioHistory(history);
  }

  // Generate historical portfolio data for demo
  static generatePortfolioHistory(userId: string): void {
    const existing = this.getPortfolioHistory();
    if (existing.length > 0) return; // Don't regenerate if data exists
    
    const history: PortfolioHistory[] = [];
    const now = new Date();
    
    // Generate 30 days of historical data
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
      const baseValue = 41000;
      const variance = (Math.random() - 0.5) * 2000; // ±1000 variance
      const totalValue = baseValue + variance + (i * 10); // Slight upward trend
      
      const snapshot: PortfolioHistory = {
        id: Date.now() + i,
        userId,
        totalValue: totalValue.toString(),
        cashBalance: "5000.00",
        holdings: [],
        createdAt: date,
      };
      
      history.push(snapshot);
    }
    
    this.savePortfolioHistory(history);
  }

  // Initialize demo data
  static initializeDemoData(userId: string): void {
    // Only initialize if no data exists
    if (this.getHoldings().length === 0) {
      const demoHoldings: Holding[] = [
        {
          id: 1,
          userId,
          symbol: "BTC",
          amount: "0.25000000",
          createdAt: new Date("2024-01-15"),
          updatedAt: new Date("2024-01-15"),
        },
        {
          id: 2,
          userId,
          symbol: "ETH",
          amount: "2.50000000",
          createdAt: new Date("2024-01-20"),
          updatedAt: new Date("2024-01-20"),
        },
        {
          id: 3,
          userId,
          symbol: "ADA",
          amount: "1000.00000000",
          createdAt: new Date("2024-01-25"),
          updatedAt: new Date("2024-01-25"),
        },
      ];
      this.saveHoldings(demoHoldings);
    }

    if (this.getUserBalance(userId) === null) {
      this.updateUserBalance(userId, "50000.00000000"); // $50,000 demo balance
    }

    if (this.getWatchlist().filter(w => w.userId === userId).length === 0) {
      const demoWatchlist: WatchlistItem[] = [
        { id: 1, userId, symbol: "BTC", createdAt: new Date() },
        { id: 2, userId, symbol: "ETH", createdAt: new Date() },
        { id: 3, userId, symbol: "SOL", createdAt: new Date() },
      ];
      this.saveWatchlist(demoWatchlist);
    }
  }

  // Clear all data (for testing)
  static clearAllData(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(key);
      }
    });
  }
}