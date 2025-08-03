import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, X, ArrowUp, ArrowDown } from "lucide-react";
import { useWatchlist, useWatchlistMutation } from "@/hooks/usePortfolio";
import { useCryptoPrices } from "@/hooks/useCryptoPrices";
import CryptoIcon from "@/components/CryptoIcon";
import { motion } from "framer-motion";

export default function Watchlist() {
  const { data: watchlist, isLoading } = useWatchlist();
  const { data: cryptoPrices } = useCryptoPrices();
  const watchlistMutation = useWatchlistMutation();

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

  const handleAddToWatchlist = () => {
    const availableCryptos = ["MATIC", "LINK", "AVAX", "BNB", "XRP", "DOGE"];
    const currentSymbols = watchlist?.map(item => item.symbol) || [];
    const availableToAdd = availableCryptos.filter(symbol => !currentSymbols.includes(symbol));
    
    if (availableToAdd.length > 0) {
      const randomSymbol = availableToAdd[Math.floor(Math.random() * availableToAdd.length)];
      watchlistMutation.mutate({ action: "add", symbol: randomSymbol });
    }
  };

  const handleRemoveFromWatchlist = (symbol: string) => {
    watchlistMutation.mutate({ action: "remove", symbol });
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
                  <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
                  </div>
                </div>
                <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const watchlistWithPrices = watchlist?.map(item => {
    const cryptoPrice = cryptoPrices?.find(p => p.symbol === item.symbol);
    return {
      ...item,
      price: cryptoPrice?.price || 0,
      change24h: cryptoPrice?.change24h || 0,
    };
  }) || [];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Watchlist</h3>
          <Button 
            size="icon" 
            variant="ghost"
            onClick={handleAddToWatchlist}
            disabled={watchlistMutation.isPending}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        
        {watchlistWithPrices.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No cryptocurrencies in watchlist</p>
            <p className="text-sm text-muted-foreground mt-2">Add some to track their prices</p>
          </div>
        ) : (
          <div className="space-y-4">
            {watchlistWithPrices.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <CryptoIcon symbol={item.symbol} size={32} />
                  <div>
                    <p className="font-medium">{item.symbol}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatPrice(item.price)}
                      <span className={`ml-2 ${item.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {item.change24h >= 0 ? <ArrowUp className="inline w-3 h-3 mr-1" /> : <ArrowDown className="inline w-3 h-3 mr-1" />}
                        {formatPercent(item.change24h)}
                      </span>
                    </p>
                  </div>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleRemoveFromWatchlist(item.symbol)}
                  disabled={watchlistMutation.isPending}
                  className="text-muted-foreground hover:text-red-600"
                >
                  <X className="w-4 h-4" />
                </Button>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}