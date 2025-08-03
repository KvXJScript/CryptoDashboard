import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Holding, Transaction, WatchlistItem, UserBalance } from "@shared/schema";
import { 
  mockHoldings, 
  mockTransactions, 
  mockWatchlist, 
  mockUserBalance,
  loadFromLocalStorage,
  saveToLocalStorage,
  initializeMockData 
} from "@/lib/mockData";

// Initialize mock data on first load
initializeMockData();

export function usePortfolio() {
  return useQuery<Holding[]>({
    queryKey: ["portfolio"],
    queryFn: () => {
      return loadFromLocalStorage("cryptotracker_holdings", mockHoldings);
    },
    staleTime: 0,
  });
}

export function useTransactions() {
  return useQuery<Transaction[]>({
    queryKey: ["transactions"],
    queryFn: () => {
      return loadFromLocalStorage("cryptotracker_transactions", mockTransactions);
    },
    staleTime: 0,
  });
}

export function useWatchlist() {
  return useQuery<WatchlistItem[]>({
    queryKey: ["watchlist"],
    queryFn: () => {
      return loadFromLocalStorage("cryptotracker_watchlist", mockWatchlist);
    },
    staleTime: 0,
  });
}

export function useUserBalance() {
  return useQuery<UserBalance>({
    queryKey: ["balance"],
    queryFn: () => {
      return loadFromLocalStorage("cryptotracker_balance", mockUserBalance);
    },
    staleTime: 0,
  });
}

export function useTradeMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ symbol, type, amount, price }: {
      symbol: string;
      type: "buy" | "sell";
      amount: string;
      price: string;
    }) => {
      // Simulate trade processing
      const holdings = loadFromLocalStorage("cryptotracker_holdings", mockHoldings);
      const transactions = loadFromLocalStorage("cryptotracker_transactions", mockTransactions);
      const balance = loadFromLocalStorage("cryptotracker_balance", mockUserBalance);
      
      const total = parseFloat(amount) * parseFloat(price);
      const fee = total * 0.005; // 0.5% fee
      
      // Create new transaction
      const newTransaction: Transaction = {
        id: Date.now(),
        userId: "demo-user-1",
        symbol,
        type,
        amount,
        price,
        total: total.toFixed(8),
        fee: fee.toFixed(8),
        createdAt: new Date(),
      };
      
      // Update holdings
      let updatedHoldings = [...holdings];
      const existingHoldingIndex = holdings.findIndex((h: Holding) => h.symbol === symbol);
      
      if (type === "buy") {
        if (existingHoldingIndex >= 0) {
          const currentAmount = parseFloat(updatedHoldings[existingHoldingIndex].amount);
          updatedHoldings[existingHoldingIndex].amount = (currentAmount + parseFloat(amount)).toFixed(8);
          updatedHoldings[existingHoldingIndex].updatedAt = new Date();
        } else {
          updatedHoldings.push({
            id: Date.now() + 1,
            userId: "demo-user-1",
            symbol,
            amount,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
        
        // Deduct from balance
        balance.balance = (parseFloat(balance.balance) - total - fee).toFixed(2);
      } else {
        // Sell
        if (existingHoldingIndex >= 0) {
          const currentAmount = parseFloat(updatedHoldings[existingHoldingIndex].amount);
          const newAmount = currentAmount - parseFloat(amount);
          
          if (newAmount <= 0) {
            updatedHoldings.splice(existingHoldingIndex, 1);
          } else {
            updatedHoldings[existingHoldingIndex].amount = newAmount.toFixed(8);
            updatedHoldings[existingHoldingIndex].updatedAt = new Date();
          }
        }
        
        // Add to balance
        balance.balance = (parseFloat(balance.balance) + total - fee).toFixed(2);
      }
      
      balance.updatedAt = new Date();
      
      // Save updates
      saveToLocalStorage("cryptotracker_holdings", updatedHoldings);
      saveToLocalStorage("cryptotracker_transactions", [newTransaction, ...transactions]);
      saveToLocalStorage("cryptotracker_balance", balance);
      
      return newTransaction;
    },
    onSuccess: () => {
      // Invalidate and refetch portfolio data
      queryClient.invalidateQueries({ queryKey: ["portfolio"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["balance"] });
    },
  });
}

export function useWatchlistMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ action, symbol }: {
      action: "add" | "remove";
      symbol: string;
    }) => {
      const watchlist = loadFromLocalStorage("cryptotracker_watchlist", mockWatchlist);
      
      if (action === "add") {
        const newItem: WatchlistItem = {
          id: Date.now(),
          userId: "demo-user-1",
          symbol,
          createdAt: new Date(),
        };
        
        const updatedWatchlist = [...watchlist, newItem];
        saveToLocalStorage("cryptotracker_watchlist", updatedWatchlist);
        return updatedWatchlist;
      } else {
        const updatedWatchlist = watchlist.filter((item: WatchlistItem) => item.symbol !== symbol);
        saveToLocalStorage("cryptotracker_watchlist", updatedWatchlist);
        return updatedWatchlist;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });
    },
  });
}