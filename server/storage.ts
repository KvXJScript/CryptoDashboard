import {
  users,
  holdings,
  transactions,
  watchlist,
  userBalance,
  type User,
  type UpsertUser,
  type Holding,
  type InsertHolding,
  type Transaction,
  type InsertTransaction,
  type WatchlistItem,
  type InsertWatchlist,
  type UserBalance,
  type InsertUserBalance,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Portfolio operations
  getUserHoldings(userId: string): Promise<Holding[]>;
  getHolding(userId: string, symbol: string): Promise<Holding | undefined>;
  createHolding(holding: InsertHolding): Promise<Holding>;
  updateHolding(userId: string, symbol: string, amount: string): Promise<Holding>;
  
  // Transaction operations
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getUserTransactions(userId: string, limit?: number): Promise<Transaction[]>;
  
  // Watchlist operations
  getUserWatchlist(userId: string): Promise<WatchlistItem[]>;
  addToWatchlist(item: InsertWatchlist): Promise<WatchlistItem>;
  removeFromWatchlist(userId: string, symbol: string): Promise<void>;
  
  // Balance operations
  getUserBalance(userId: string): Promise<UserBalance | undefined>;
  updateUserBalance(userId: string, balance: string): Promise<UserBalance>;
  initializeUserBalance(userId: string): Promise<UserBalance>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    
    // Initialize user balance if this is a new user
    await this.initializeUserBalance(user.id);
    
    return user;
  }

  // Portfolio operations
  async getUserHoldings(userId: string): Promise<Holding[]> {
    return await db
      .select()
      .from(holdings)
      .where(eq(holdings.userId, userId));
  }

  async getHolding(userId: string, symbol: string): Promise<Holding | undefined> {
    const [holding] = await db
      .select()
      .from(holdings)
      .where(and(eq(holdings.userId, userId), eq(holdings.symbol, symbol)));
    return holding;
  }

  async createHolding(holding: InsertHolding): Promise<Holding> {
    const [newHolding] = await db
      .insert(holdings)
      .values(holding)
      .returning();
    return newHolding;
  }

  async updateHolding(userId: string, symbol: string, amount: string): Promise<Holding> {
    const [updatedHolding] = await db
      .update(holdings)
      .set({ amount, updatedAt: new Date() })
      .where(and(eq(holdings.userId, userId), eq(holdings.symbol, symbol)))
      .returning();
    return updatedHolding;
  }

  // Transaction operations
  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const [newTransaction] = await db
      .insert(transactions)
      .values(transaction)
      .returning();
    return newTransaction;
  }

  async getUserTransactions(userId: string, limit: number = 10): Promise<Transaction[]> {
    return await db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, userId))
      .orderBy(desc(transactions.createdAt))
      .limit(limit);
  }

  // Watchlist operations
  async getUserWatchlist(userId: string): Promise<WatchlistItem[]> {
    return await db
      .select()
      .from(watchlist)
      .where(eq(watchlist.userId, userId));
  }

  async addToWatchlist(item: InsertWatchlist): Promise<WatchlistItem> {
    const [newItem] = await db
      .insert(watchlist)
      .values(item)
      .returning();
    return newItem;
  }

  async removeFromWatchlist(userId: string, symbol: string): Promise<void> {
    await db
      .delete(watchlist)
      .where(and(eq(watchlist.userId, userId), eq(watchlist.symbol, symbol)));
  }

  // Balance operations
  async getUserBalance(userId: string): Promise<UserBalance | undefined> {
    const [balance] = await db
      .select()
      .from(userBalance)
      .where(eq(userBalance.userId, userId));
    return balance;
  }

  async updateUserBalance(userId: string, balance: string): Promise<UserBalance> {
    const [updatedBalance] = await db
      .update(userBalance)
      .set({ balance, updatedAt: new Date() })
      .where(eq(userBalance.userId, userId))
      .returning();
    return updatedBalance;
  }

  async initializeUserBalance(userId: string): Promise<UserBalance> {
    try {
      const [newBalance] = await db
        .insert(userBalance)
        .values({ userId, balance: "10000.00" })
        .returning();
      return newBalance;
    } catch (error) {
      // If balance already exists, return it
      const existing = await this.getUserBalance(userId);
      if (existing) return existing;
      throw error;
    }
  }
}

// Memory storage implementation as fallback
class MemoryStorage implements IStorage {
  private users = new Map<string, User>();
  private holdings = new Map<string, Holding[]>();
  private transactions = new Map<string, Transaction[]>();
  private watchlists = new Map<string, WatchlistItem[]>();
  private balances = new Map<string, UserBalance>();
  private nextId = 1;

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const existingUser = Array.from(this.users.values()).find(u => u.email === userData.email);
    if (existingUser) {
      this.users.set(existingUser.id, { ...existingUser, ...userData });
      return this.users.get(existingUser.id)!;
    }
    
    const newUser: User = {
      id: this.nextId++,
      email: userData.email,
      name: userData.name,
      createdAt: new Date(),
    };
    this.users.set(newUser.id.toString(), newUser);
    return newUser;
  }

  async getUserHoldings(userId: string): Promise<Holding[]> {
    return this.holdings.get(userId) || [];
  }

  async getHolding(userId: string, symbol: string): Promise<Holding | undefined> {
    const userHoldings = this.holdings.get(userId) || [];
    return userHoldings.find(h => h.symbol === symbol);
  }

  async createHolding(holding: InsertHolding): Promise<Holding> {
    const newHolding: Holding = {
      id: this.nextId++,
      ...holding,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const userHoldings = this.holdings.get(holding.userId) || [];
    userHoldings.push(newHolding);
    this.holdings.set(holding.userId, userHoldings);
    return newHolding;
  }

  async updateHolding(userId: string, symbol: string, amount: string): Promise<Holding> {
    const userHoldings = this.holdings.get(userId) || [];
    const holdingIndex = userHoldings.findIndex(h => h.symbol === symbol);
    
    if (holdingIndex >= 0) {
      userHoldings[holdingIndex] = {
        ...userHoldings[holdingIndex],
        amount,
        updatedAt: new Date(),
      };
      return userHoldings[holdingIndex];
    }
    
    throw new Error('Holding not found');
  }

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const newTransaction: Transaction = {
      id: this.nextId++,
      ...transaction,
      createdAt: new Date(),
    };
    
    const userTransactions = this.transactions.get(transaction.userId) || [];
    userTransactions.unshift(newTransaction);
    this.transactions.set(transaction.userId, userTransactions);
    return newTransaction;
  }

  async getUserTransactions(userId: string, limit: number = 10): Promise<Transaction[]> {
    const userTransactions = this.transactions.get(userId) || [];
    return userTransactions.slice(0, limit);
  }

  async getUserWatchlist(userId: string): Promise<WatchlistItem[]> {
    return this.watchlists.get(userId) || [];
  }

  async addToWatchlist(item: InsertWatchlist): Promise<WatchlistItem> {
    const newItem: WatchlistItem = {
      id: this.nextId++,
      ...item,
      createdAt: new Date(),
    };
    
    const userWatchlist = this.watchlists.get(item.userId) || [];
    userWatchlist.push(newItem);
    this.watchlists.set(item.userId, userWatchlist);
    return newItem;
  }

  async removeFromWatchlist(userId: string, symbol: string): Promise<void> {
    const userWatchlist = this.watchlists.get(userId) || [];
    const filtered = userWatchlist.filter(item => item.symbol !== symbol);
    this.watchlists.set(userId, filtered);
  }

  async getUserBalance(userId: string): Promise<UserBalance | undefined> {
    return this.balances.get(userId);
  }

  async updateUserBalance(userId: string, balance: string): Promise<UserBalance> {
    const existing = this.balances.get(userId);
    if (!existing) {
      throw new Error('Balance not found');
    }
    
    const updated: UserBalance = {
      ...existing,
      balance,
      updatedAt: new Date(),
    };
    this.balances.set(userId, updated);
    return updated;
  }

  async initializeUserBalance(userId: string): Promise<UserBalance> {
    const newBalance: UserBalance = {
      id: this.nextId++,
      userId,
      balance: "10000.00",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.balances.set(userId, newBalance);
    return newBalance;
  }
}

// Export storage with fallback
let storage: IStorage;
try {
  storage = new DatabaseStorage();
} catch (error) {
  console.warn("Database unavailable, using memory storage:", error);
  storage = new MemoryStorage();
}

export { storage };
