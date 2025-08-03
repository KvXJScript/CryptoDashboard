import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useWatchlist, useWatchlistMutation } from "@/hooks/usePortfolio";
import { useCryptoPrices } from "@/hooks/useCryptoPrices";
import Header from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X, Search, ArrowUp, ArrowDown, Star } from "lucide-react";
import CryptoIcon from "@/components/CryptoIcon";

export default function WatchlistPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const { data: watchlist, isLoading: watchlistLoading } = useWatchlist();
  const { data: cryptoPrices } = useCryptoPrices();
  const watchlistMutation = useWatchlistMutation();
  const [searchTerm, setSearchTerm] = useState("");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-48"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 h-96 bg-muted rounded-2xl"></div>
              <div className="h-96 bg-muted rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: value < 1 ? 6 : 2,
    }).format(value);
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return "text-green-400";
    if (change < 0) return "text-red-400";
    return "text-gray-400";
  };

  const watchlistWithPrices = watchlist?.map(item => {
    const cryptoPrice = cryptoPrices?.find(p => p.symbol === item.symbol);
    return {
      ...item,
      price: cryptoPrice?.price || 0,
      change24h: cryptoPrice?.change24h || 0,
      name: cryptoPrice?.name || item.symbol,
    };
  }) || [];

  const filteredWatchlist = watchlistWithPrices.filter(item =>
    item.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const availableCryptos = cryptoPrices?.filter(crypto => 
    !watchlist?.some(item => item.symbol === crypto.symbol)
  ) || [];

  const filteredAvailable = availableCryptos.filter(crypto =>
    crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    crypto.name.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 10);

  const handleAddToWatchlist = (symbol: string) => {
    watchlistMutation.mutate({ action: "add", symbol });
  };

  const handleRemoveFromWatchlist = (symbol: string) => {
    watchlistMutation.mutate({ action: "remove", symbol });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Watchlist</h1>
          <p className="text-muted-foreground">Keep track of your favorite cryptocurrencies</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Your Watchlist</h2>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search watchlist..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                </div>

                {watchlistLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-16 bg-muted rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                ) : filteredWatchlist.length === 0 ? (
                  <div className="text-center py-12">
                    <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No cryptocurrencies in your watchlist</p>
                    <p className="text-sm text-muted-foreground mt-2">Add some from the available list</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredWatchlist.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <CryptoIcon symbol={item.symbol} size={40} />
                          <div>
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="text-sm text-muted-foreground">{item.symbol}</p>
                          </div>
                        </div>

                        <div className="text-right mr-4">
                          <div className="font-medium">{formatCurrency(item.price)}</div>
                          <div className={`text-sm flex items-center justify-end ${getChangeColor(item.change24h)}`}>
                            {item.change24h >= 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                            {Math.abs(item.change24h).toFixed(2)}%
                          </div>
                        </div>

                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => handleRemoveFromWatchlist(item.symbol)}
                          disabled={watchlistMutation.isPending}
                          className="text-red-600 hover:bg-red-600 hover:text-white border-red-600"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-6">Add to Watchlist</h2>
                
                <div className="space-y-4">
                  {filteredAvailable.map((crypto) => (
                    <div
                      key={crypto.symbol}
                      className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <CryptoIcon symbol={crypto.symbol} size={40} />
                        <div>
                          <h3 className="font-medium">{crypto.name}</h3>
                          <p className="text-sm text-muted-foreground">{crypto.symbol}</p>
                        </div>
                      </div>

                      <div className="text-right mr-4">
                        <div className="font-medium">{formatCurrency(crypto.price)}</div>
                        <div className={`text-sm flex items-center justify-end ${getChangeColor(crypto.change24h)}`}>
                          {crypto.change24h >= 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                          {Math.abs(crypto.change24h).toFixed(2)}%
                        </div>
                      </div>

                      <Button
                        size="icon"
                        onClick={() => handleAddToWatchlist(crypto.symbol)}
                        disabled={watchlistMutation.isPending}
                        className="bg-primary hover:bg-primary/90"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}