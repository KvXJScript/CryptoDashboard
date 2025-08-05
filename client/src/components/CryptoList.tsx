import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowUp, ArrowDown } from "lucide-react";
import { useCryptoPrices, type CryptoPrice } from "@/hooks/useCryptoPrices";
import CryptoIcon from "@/components/CryptoIcon";

interface CryptoListProps {
  onTrade: (crypto: CryptoPrice, type: "buy" | "sell") => void;
}

export default function CryptoList({ onTrade }: CryptoListProps) {
  const { data: cryptos, isLoading } = useCryptoPrices();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: price < 1 ? 6 : 2,
    }).format(price);
  };

  const formatPercent = (change: number) => {
    return `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return "text-green-400";
    if (change < 0) return "text-red-400";
    return "text-gray-400";
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

  const topCryptos = cryptos?.slice(0, 6) || [];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Live Prices</h2>
        </div>
        <div className="space-y-4">
          {topCryptos.map((crypto, index) => (
            <motion.div
              key={crypto.symbol}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 rounded-xl border hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <CryptoIcon symbol={crypto.symbol} size={40} />
                <div>
                  <h3 className="font-medium">{crypto.name}</h3>
                  <p className="text-sm text-muted-foreground">{crypto.symbol}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">{formatPrice(crypto.price)}</p>
                <p className={`text-sm ${getChangeColor(crypto.change24h)}`}>
                  {crypto.change24h >= 0 ? <ArrowUp className="inline w-3 h-3 mr-1" /> : <ArrowDown className="inline w-3 h-3 mr-1" />}
                  {formatPercent(crypto.change24h)}
                </p>
              </div>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={() => onTrade(crypto, "buy")}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Buy
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}