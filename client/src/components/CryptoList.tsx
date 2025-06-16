import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { ArrowUp, ArrowDown } from "lucide-react";
import { useState } from "react";

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
      maximumFractionDigits: price < 1 ? 6 : 2,
    }).format(price);
  };

  const formatPercent = (change: number) => {
    return `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`;
  };

  const getCryptoIcon = (symbol: string) => {
    const icons: Record<string, string> = {
      BTC: "https://images.unsplash.com/photo-1605792657660-596af9009e82?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40",
      ETH: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40",
      ADA: "https://images.unsplash.com/photo-1640340434855-6084b1f4901c?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40",
      SOL: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40",
    };
    return icons[symbol] || "https://images.unsplash.com/photo-1605792657660-596af9009e82?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40";
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
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Live Prices</h2>
          <button className="text-sm text-crypto-primary hover:underline">
            View all
          </button>
        </div>

        <div className="space-y-4">
          {cryptos?.map((crypto) => (
            <div
              key={crypto.symbol}
              className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={getCryptoIcon(crypto.symbol)}
                  alt={`${crypto.name} logo`}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium">{crypto.name}</p>
                  <p className="text-sm text-gray-500">{crypto.symbol}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">{formatPrice(crypto.price)}</p>
                <p
                  className={`text-sm flex items-center justify-end ${
                    crypto.change24h >= 0 ? "text-crypto-success" : "text-crypto-danger"
                  }`}
                >
                  {crypto.change24h >= 0 ? (
                    <ArrowUp className="w-3 h-3 mr-1" />
                  ) : (
                    <ArrowDown className="w-3 h-3 mr-1" />
                  )}
                  <span>{formatPercent(crypto.change24h)}</span>
                </p>
              </div>
              <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="sm"
                  className="px-3 py-1 text-xs bg-crypto-success text-white rounded-full hover:bg-crypto-success/80 transition-colors"
                  onClick={() => onTrade(crypto, "buy")}
                >
                  Buy
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="px-3 py-1 text-xs bg-crypto-danger text-white rounded-full hover:bg-crypto-danger/80 transition-colors"
                  onClick={() => onTrade(crypto, "sell")}
                >
                  Sell
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
