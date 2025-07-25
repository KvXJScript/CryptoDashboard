import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowUp, ArrowDown } from "lucide-react";
import CryptoIcon from "@/components/CryptoIcon";

interface CryptoPrice {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  coinGeckoId: string;
}

interface CryptoListProps {
  onTrade: (crypto: CryptoPrice, type: "buy" | "sell") => void;
}

export default function CryptoList({ onTrade }: CryptoListProps) {
  const { data: cryptos, isLoading, error } = useQuery<CryptoPrice[]>({
    queryKey: ["/api/crypto/prices"],
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatPercent = (change: number) => {
    return `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return "text-green-400"; // Bright green for positive
    if (change < 0) return "text-red-400"; // Light red for negative
    return "text-gray-400"; // Neutral for zero
  };



  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Live Prices</h2>
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl animate-pulse">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-8"></div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <p className="text-red-500">Failed to load crypto prices</p>
            <p className="text-sm text-gray-500 mt-2">Please try again later</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-border/20 bg-card/50 backdrop-blur-xl">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">Live Prices</h2>
          <button className="text-sm text-crypto-primary hover:text-crypto-primary/80 transition-colors">
            View all
          </button>
        </div>

        <div className="space-y-2">
          {cryptos?.map((crypto, index) => (
            <motion.div
              key={crypto.symbol}
              className="grid grid-cols-12 items-center gap-3 p-4 rounded-xl hover:bg-muted/50 transition-all duration-300 group cursor-pointer hover-lift relative overflow-hidden"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              onHoverStart={() => {}}
            >
              <div className="col-span-1">
                <CryptoIcon 
                  coinId={crypto.coinGeckoId}
                  symbol={crypto.symbol}
                  size="md"
                  className="ring-2 ring-border/20"
                />
              </div>
              <div className="col-span-4">
                <p className="font-medium text-foreground">{crypto.name}</p>
                <p className="text-sm text-muted-foreground font-mono font-semibold">{crypto.symbol}</p>
              </div>
              <div className="col-span-2 text-right">
                <p className="font-semibold text-foreground">{formatPrice(crypto.price)}</p>
                <p className={`text-xs font-medium ${
                  crypto.change24h >= 0 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {crypto.change24h >= 0 ? (
                    <ArrowUp className="w-3 h-3 mr-1 inline" />
                  ) : (
                    <ArrowDown className="w-3 h-3 mr-1 inline" />
                  )}
                  <span>{formatPercent(crypto.change24h)}</span>
                </p>
              </div>
              <div className="col-span-3 flex items-center justify-end space-x-3">
                <Button
                  size="sm"
                  className="px-3 py-1 text-xs bg-green-600 dark:bg-green-500 text-white rounded-full hover:bg-green-700 dark:hover:bg-green-600 transition-colors"
                  onClick={() => onTrade(crypto, "buy")}
                >
                  Buy
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="px-3 py-1 text-xs bg-red-600 dark:bg-red-500 text-white rounded-full hover:bg-red-700 dark:hover:bg-red-600 transition-colors"
                  onClick={() => onTrade(crypto, "sell")}
                >
                  Sell
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
