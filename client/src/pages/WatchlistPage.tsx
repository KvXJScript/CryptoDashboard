import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Plus, X, Search, ArrowUp, ArrowDown, Bell, Star } from "lucide-react";
import CryptoIcon from "@/components/CryptoIcon";

interface WatchlistItem {
  id: number;
  symbol: string;
  price: number;
  change24h: number;
}

interface CryptoPrice {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  coinGeckoId: string;
}

export default function WatchlistPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const { data: watchlist, isLoading: watchlistLoading } = useQuery<WatchlistItem[]>({
    queryKey: ["/api/watchlist"],
  });

  const { data: cryptos } = useQuery<CryptoPrice[]>({
    queryKey: ["/api/crypto/prices"],
    refetchInterval: 30000,
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return "text-green-400"; // Bright green for positive
    if (change < 0) return "text-red-400"; // Light red for negative
    return "text-gray-400"; // Neutral for zero
  };

  const addToWatchlistMutation = useMutation({
    mutationFn: async (symbol: string) => {
      await apiRequest("POST", "/api/watchlist", { symbol });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/watchlist"] });
      toast({
        title: "Added to Watchlist",
        description: "Cryptocurrency added to your watchlist successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add to watchlist",
        variant: "destructive",
      });
    },
  });

  const removeFromWatchlistMutation = useMutation({
    mutationFn: async (symbol: string) => {
      await apiRequest("DELETE", `/api/watchlist/${symbol}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/watchlist"] });
      toast({
        title: "Removed from Watchlist",
        description: "Cryptocurrency removed from your watchlist",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove from watchlist",
        variant: "destructive",
      });
    },
  });

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
    toast({
      title: "Unauthorized",
      description: "You are logged out. Logging in again...",
      variant: "destructive",
    });
    setTimeout(() => {
      window.location.href = "/api/login";
    }, 500);
    return null;
  }

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

  const watchlistSymbols = watchlist?.map(item => item.symbol) || [];
  const availableCryptos = cryptos?.filter(crypto => 
    !watchlistSymbols.includes(crypto.symbol) &&
    (crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  return (
    <motion.div 
      className="min-h-screen bg-background text-foreground"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Watchlist</h1>
              <p className="text-muted-foreground">Monitor your favorite cryptocurrencies</p>
            </div>
            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-crypto-primary hover:bg-crypto-primary/90 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Crypto
            </Button>
          </div>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Watchlist */}
          <div className="lg:col-span-2">
            <Card className="glass-card border-border/20 bg-card/50 backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-foreground">Your Watchlist</h2>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Bell className="w-4 h-4" />
                    <span className="text-sm">Live updates</span>
                  </div>
                </div>

                {watchlistLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center justify-between p-4 animate-pulse">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-muted rounded-full"></div>
                          <div>
                            <div className="h-4 bg-muted rounded w-20 mb-2"></div>
                            <div className="h-3 bg-muted rounded w-12"></div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="h-4 bg-muted rounded w-16 mb-2"></div>
                          <div className="h-3 bg-muted rounded w-12"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : !watchlist || watchlist.length === 0 ? (
                  <div className="text-center py-12">
                    <Star className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground text-lg mb-4">Your watchlist is empty</p>
                    <p className="text-muted-foreground mb-6">Add cryptocurrencies to track their prices and performance</p>
                    <Button
                      onClick={() => setShowAddModal(true)}
                      className="bg-crypto-primary hover:bg-crypto-primary/90 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Crypto
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {watchlist.map((item, index) => (
                      <motion.div 
                        key={item.id} 
                        className="flex items-center justify-between p-4 rounded-xl hover:bg-muted/30 transition-colors group"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <div className="flex items-center space-x-4">
                          <CryptoIcon 
                            coinId={cryptos?.find(c => c.symbol === item.symbol)?.coinGeckoId || item.symbol.toLowerCase()}
                            symbol={item.symbol}
                            size="lg"
                            className="ring-2 ring-border/30 shadow-md"
                          />
                          <div>
                            <p className="font-semibold text-foreground">{item.symbol}</p>
                            <p className="text-sm text-muted-foreground">
                              {cryptos?.find(c => c.symbol === item.symbol)?.name || item.symbol}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          <div className="text-right min-w-0 flex-shrink-0">
                            <p className="font-semibold text-foreground truncate">{formatPrice(item.price)}</p>
                            <p className={`text-sm font-medium flex items-center justify-end ${
                              item.change24h >= 0 
                                ? 'text-green-600 dark:text-green-400' 
                                : 'text-red-600 dark:text-red-400'
                            }`}>
                              {item.change24h >= 0 ? (
                                <ArrowUp className="w-3 h-3 mr-1 flex-shrink-0" />
                              ) : (
                                <ArrowDown className="w-3 h-3 mr-1 flex-shrink-0" />
                              )}
                              <span className="truncate">{formatPercent(item.change24h)}</span>
                            </p>
                          </div>

                          <Button
                            size="icon"
                            variant="ghost"
                            className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-red-400"
                            onClick={() => removeFromWatchlistMutation.mutate(item.symbol)}
                            disabled={removeFromWatchlistMutation.isPending}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Market Summary */}
          <div className="space-y-6">
            <Card className="glass-card border-border/20 bg-card/50 backdrop-blur-xl">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Market Summary</h3>
                <div className="space-y-4">
                  {cryptos?.slice(0, 5).map((crypto) => (
                    <div key={crypto.symbol} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">{crypto.symbol}</p>
                        <p className="text-xs text-muted-foreground">{formatPrice(crypto.price)}</p>
                      </div>
                      <p className={`font-medium ${getChangeColor(crypto.change24h)}`}>
                        {formatPercent(crypto.change24h)}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {watchlist && watchlist.length > 0 && (
              <Card className="glass-card border-border/20 bg-card/50 backdrop-blur-xl">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Watchlist Stats</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Items</span>
                      <span className="font-semibold text-foreground">{watchlist.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Gainers</span>
                      <span className="font-semibold text-green-400">
                        {watchlist.filter(item => item.change24h > 0).length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Losers</span>
                      <span className="font-semibold text-red-400">
                        {watchlist.filter(item => item.change24h < 0).length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </motion.div>
      </div>

      {/* Add Crypto Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md glass-card border-border/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">Add to Watchlist</h3>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setShowAddModal(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search cryptocurrencies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-muted/50 border-border/40"
                />
              </div>

              <div className="max-h-64 overflow-y-auto custom-scrollbar space-y-2">
                {availableCryptos.slice(0, 10).map((crypto) => (
                  <div
                    key={crypto.symbol}
                    className="grid grid-cols-12 items-center gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer group"
                    onClick={() => {
                      addToWatchlistMutation.mutate(crypto.symbol);
                      setShowAddModal(false);
                      setSearchTerm("");
                    }}
                  >
                    <div className="col-span-1">
                      <CryptoIcon 
                        coinId={crypto.coinGeckoId}
                        symbol={crypto.symbol}
                        size="sm"
                        className="ring-1 ring-border/20"
                      />
                    </div>
                    <div className="col-span-6">
                      <p className="font-medium text-foreground text-sm">{crypto.name}</p>
                      <p className="text-xs text-muted-foreground">{crypto.symbol}</p>
                    </div>
                    <div className="col-span-4 text-right">
                      <p className="font-medium text-foreground text-sm">{formatCurrency(crypto.price)}</p>
                      <p className={`text-xs font-medium ${
                        crypto.change24h >= 0 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {crypto.change24h >= 0 ? "+" : ""}{crypto.change24h.toFixed(2)}%
                      </p>
                    </div>
                    <div className="col-span-1 flex justify-center">
                      <Plus className="w-4 h-4 text-crypto-primary group-hover:text-crypto-primary/80 transition-colors" />
                    </div>
                  </div>
                ))}
                {availableCryptos.length === 0 && searchTerm && (
                  <p className="text-center text-muted-foreground py-4">No cryptocurrencies found</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </motion.div>
  );
}