import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  decimal,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Portfolio holdings table
export const holdings = pgTable("holdings", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  symbol: varchar("symbol").notNull(), // BTC, ETH, etc.
  amount: decimal("amount", { precision: 18, scale: 8 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Transactions table
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  symbol: varchar("symbol").notNull(),
  type: varchar("type").notNull(), // 'buy' or 'sell'
  amount: decimal("amount", { precision: 18, scale: 8 }).notNull(),
  price: decimal("price", { precision: 18, scale: 8 }).notNull(),
  total: decimal("total", { precision: 18, scale: 8 }).notNull(),
  fee: decimal("fee", { precision: 18, scale: 8 }).default("0"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Watchlist table
export const watchlist = pgTable("watchlist", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  symbol: varchar("symbol").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// User cash balance table
export const userBalance = pgTable("user_balance", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id).unique(),
  balance: decimal("balance", { precision: 18, scale: 2 }).default("10000.00"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Deposits and withdrawals table
export const deposits = pgTable("deposits", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  type: varchar("type").notNull(), // 'deposit' or 'withdrawal'
  method: varchar("method").notNull(), // 'crypto', 'bank', 'card'
  currency: varchar("currency").notNull(), // 'BTC', 'ETH', 'USD', 'PLN'
  amount: decimal("amount", { precision: 18, scale: 8 }).notNull(),
  blockchain: varchar("blockchain"), // For crypto: 'bitcoin', 'ethereum', 'polygon', 'bsc'
  address: varchar("address"), // Wallet address for crypto
  txHash: varchar("tx_hash"), // Transaction hash for crypto
  bankDetails: jsonb("bank_details"), // Bank account details
  status: varchar("status").notNull().default("pending"), // 'pending', 'completed', 'failed'
  fee: decimal("fee", { precision: 18, scale: 8 }).default("0"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Portfolio history for performance tracking
export const portfolioHistory = pgTable("portfolio_history", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  totalValue: decimal("total_value", { precision: 18, scale: 2 }).notNull(),
  cashBalance: decimal("cash_balance", { precision: 18, scale: 2 }).notNull(),
  holdings: jsonb("holdings").notNull(), // Snapshot of holdings
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  holdings: many(holdings),
  transactions: many(transactions),
  watchlist: many(watchlist),
  balance: one(userBalance),
  deposits: many(deposits),
  portfolioHistory: many(portfolioHistory),
}));

export const holdingsRelations = relations(holdings, ({ one }) => ({
  user: one(users, {
    fields: [holdings.userId],
    references: [users.id],
  }),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users, {
    fields: [transactions.userId],
    references: [users.id],
  }),
}));

export const watchlistRelations = relations(watchlist, ({ one }) => ({
  user: one(users, {
    fields: [watchlist.userId],
    references: [users.id],
  }),
}));

export const userBalanceRelations = relations(userBalance, ({ one }) => ({
  user: one(users, {
    fields: [userBalance.userId],
    references: [users.id],
  }),
}));

export const depositsRelations = relations(deposits, ({ one }) => ({
  user: one(users, {
    fields: [deposits.userId],
    references: [users.id],
  }),
}));

export const portfolioHistoryRelations = relations(portfolioHistory, ({ one }) => ({
  user: one(users, {
    fields: [portfolioHistory.userId],
    references: [users.id],
  }),
}));

// Schema types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type InsertHolding = typeof holdings.$inferInsert;
export type Holding = typeof holdings.$inferSelect;

export type InsertTransaction = typeof transactions.$inferInsert;
export type Transaction = typeof transactions.$inferSelect;

export type InsertWatchlistItem = typeof watchlist.$inferInsert;
export type WatchlistItem = typeof watchlist.$inferSelect;

export type InsertUserBalance = typeof userBalance.$inferInsert;
export type UserBalance = typeof userBalance.$inferSelect;

export type InsertDeposit = typeof deposits.$inferInsert;
export type Deposit = typeof deposits.$inferSelect;

export type InsertPortfolioHistory = typeof portfolioHistory.$inferInsert;
export type PortfolioHistory = typeof portfolioHistory.$inferSelect;

// Zod schemas for validation
export const insertHoldingSchema = createInsertSchema(holdings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
});

export const insertWatchlistSchema = createInsertSchema(watchlist).omit({
  id: true,
  createdAt: true,
});

export const insertUserBalanceSchema = createInsertSchema(userBalance).omit({
  id: true,
  updatedAt: true,
});

export const insertDepositSchema = createInsertSchema(deposits).omit({
  id: true,
  createdAt: true,
});

export const insertPortfolioHistorySchema = createInsertSchema(portfolioHistory).omit({
  id: true,
  createdAt: true,
});
