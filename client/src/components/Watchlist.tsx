import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, X, ArrowUp, ArrowDown } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import CryptoIcon from "@/components/CryptoIcon";
import { motion } from "framer-motion";

interface WatchlistItem {
  id: number;
  symbol: string;
  price: number;
  change24h: number;
}

export default function Watchlist() {
  const queryClient = useQueryClient();

  const { data: watchlist, isLoading } = useQuery<WatchlistItem[]>({
    queryKey: ["/api/watchlist"],
  });

  const addToWatchlistMutation = useMutation({
    mutationFn: async (symbol: string) => {
      await apiRequest("POST", "/api/watchlist", { symbol });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/watchlist"] });
    },
  });

  const removeFromWatchlistMutation = useMutation({
    mutationFn: async (symbol: string) => {
      await apiRequest("DELETE", `/api/watchlist/${symbol}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/watchlist"] });
    },
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: price < 1 ? 6 : 2,
    }).format(price);
  };

  const formatPercent = (change: number) => {
    return `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`;
  };

  const getCryptoIcon = (symbol: string) => {
    const icons: Record<string, string> = {
      MATIC: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=24&h=24",
      LINK: "https://images.unsplash.com/photo-1639322537228-f710d846310a?ixlib=rb-4.0.3&auto=format&fit=crop&w=24&h=24",
      AVAX: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=24&h=24",
    };
    return icons[symbol] || "https://images.unsplash.com/photo-1605792657660-596af9009e82?ixlib=rb-4.0.3&auto=format&fit=crop&w=24&h=24";
  };

  const getCryptoName = (symbol: string) => {
    const names: Record<string, string> = {
      MATIC: "Polygon",
      LINK: "Chainlink",
      AVAX: "Avalanche",
      BTC: "Bitcoin",
      ETH: "Ethereum",
      ADA: "Cardano",
      SOL: "Solana",
    };
    return names[symbol] || symbol;
  };

  const handleAddToWatchlist = () => {
    // In a real app, this would open a modal to select a crypto to add
    // For now, we'll add a random one from common cryptos
    const availableCryptos = ["MATIC", "LINK", "AVAX"];
    const currentSymbols = watchlist?.map(item => item.symbol) || [];
    const availableToAdd = availableCryptos.filter(symbol => !currentSymbols.includes(symbol));
    
    if (availableToAdd.length > 0) {
      const randomSymbol = availableToAdd[Math.floor(Math.random() * availableToAdd.length)];
      addToWatchlistMutation.mutate(randomSymbol);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Watchlist</h3>
            <Button size="icon" variant="ghost">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-1"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-8"></div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12 mb-1"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-8"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Watchlist</h3>
          <Button
            size="icon"
            variant="ghost"
            className="text-crypto-primary hover:text-crypto-primary/80"
            onClick={handleAddToWatchlist}
            disabled={addToWatchlistMutation.isPending}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {!watchlist || watchlist.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No items in watchlist</p>
            <p className="text-sm text-gray-400 mt-2">Add cryptocurrencies to track their prices</p>
          </div>
        ) : (
          <div className="space-y-2">
            {watchlist.map((item, index) => (
              <motion.div 
                key={item.id} 
                className="grid grid-cols-12 items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-all duration-200 group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="col-span-1">
                  <CryptoIcon 
                    coinId={item.symbol.toLowerCase()}
                    symbol={item.symbol}
                    size="sm"
                    className="ring-1 ring-border/20"
                  />
                </div>
                <div className="col-span-6">
                  <p className="text-sm font-medium text-foreground">{getCryptoName(item.symbol)}</p>
                  <p className="text-xs text-muted-foreground">{item.symbol}</p>
                </div>
                <div className="col-span-3 text-right">
                  <p className="text-sm font-medium text-foreground">{formatPrice(item.price)}</p>
                </div>
                <div className="col-span-2 flex items-center justify-end space-x-2">
                  <div className="text-right">
                    <p className={`text-sm font-medium flex items-center justify-end ${
                      item.change24h >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                    }`}>
                      {item.change24h >= 0 ? (
                        <ArrowUp className="w-3 h-3 mr-1" />
                      ) : (
                        <ArrowDown className="w-3 h-3 mr-1" />
                      )}
                      {formatPercent(item.change24h)}
                    </p>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="w-6 h-6 ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-red-600 dark:hover:text-red-400"
                    onClick={() => removeFromWatchlistMutation.mutate(item.symbol)}
                    disabled={removeFromWatchlistMutation.isPending}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
