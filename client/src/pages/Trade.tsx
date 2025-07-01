import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import CryptoList from "@/components/CryptoList";
import TradingModal from "@/components/TradingModal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { Search, TrendingUp, TrendingDown } from "lucide-react";

interface CryptoPrice {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  coinGeckoId: string;
}

interface PortfolioData {
  totalValue: number;
  availableCash: number;
  holdings: Array<{
    symbol: string;
    amount: string;
    currentPrice: number;
    value: number;
    change24h: number;
  }>;
}

export default function Trade() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [tradingModalOpen, setTradingModalOpen] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoPrice | null>(null);
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");

  const { data: cryptos, isLoading: cryptosLoading } = useQuery<CryptoPrice[]>({
    queryKey: ["/api/crypto/prices"],
    refetchInterval: 30000,
  });

  const { data: portfolio } = useQuery<PortfolioData>({
    queryKey: ["/api/portfolio"],
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

  const handleTrade = (crypto: CryptoPrice, type: "buy" | "sell") => {
    setSelectedCrypto(crypto);
    setTradeType(type);
    setTradingModalOpen(true);
  };

  const filteredCryptos = cryptos?.filter((crypto) =>
    crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

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

  const topGainers = cryptos?.filter(c => c.change24h > 0).sort((a, b) => b.change24h - a.change24h).slice(0, 3) || [];
  const topLosers = cryptos?.filter(c => c.change24h < 0).sort((a, b) => a.change24h - b.change24h).slice(0, 3) || [];

  return (
    <motion.div 
      className="min-h-screen bg-background text-foreground"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Trade</h1>
          <p className="text-muted-foreground">Buy and sell cryptocurrencies with live market data</p>
        </div>

        {/* Quick Stats */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="glass-card border-border/20 bg-card/50 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">Available Cash</h3>
                <div className="w-8 h-8 bg-crypto-success/20 rounded-full flex items-center justify-center">
                  <span className="text-crypto-success text-xs font-semibold">$</span>
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {formatCurrency(portfolio?.availableCash || 0)}
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card border-border/20 bg-card/50 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">Top Gainer</h3>
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              {topGainers[0] ? (
                <div>
                  <p className="text-lg font-bold text-foreground">{topGainers[0].symbol}</p>
                  <p className={`text-sm ${getChangeColor(topGainers[0].change24h)}`}>+{topGainers[0].change24h.toFixed(2)}%</p>
                </div>
              ) : (
                <p className="text-muted-foreground">No data</p>
              )}
            </CardContent>
          </Card>

          <Card className="glass-card border-border/20 bg-card/50 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">Top Loser</h3>
                <TrendingDown className="w-5 h-5 text-red-400" />
              </div>
              {topLosers[0] ? (
                <div>
                  <p className="text-lg font-bold text-foreground">{topLosers[0].symbol}</p>
                  <p className={`text-sm ${getChangeColor(topLosers[0].change24h)}`}>{topLosers[0].change24h.toFixed(2)}%</p>
                </div>
              ) : (
                <p className="text-muted-foreground">No data</p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Main Trading Interface */}
          <div className="lg:col-span-2">
            <Card className="glass-card border-border/20 bg-card/50 backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-foreground">Market</h2>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search cryptocurrencies..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64 bg-muted/50 border-border/40"
                    />
                  </div>
                </div>

                {cryptosLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
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
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                    {filteredCryptos.map((crypto) => (
                      <div
                        key={crypto.symbol}
                        className="flex items-center justify-between p-4 rounded-xl hover:bg-muted/30 transition-all duration-300 group cursor-pointer"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-crypto-primary to-crypto-success rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">{crypto.symbol}</span>
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{crypto.name}</p>
                            <p className="text-sm text-muted-foreground">{crypto.symbol}</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="font-semibold text-foreground">
                            {formatCurrency(crypto.price)}
                          </p>
                          <p className={`text-sm font-medium ${getChangeColor(crypto.change24h)}`}>
                            {crypto.change24h >= 0 ? "+" : ""}{crypto.change24h.toFixed(2)}%
                          </p>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            className="px-4 py-2 text-xs bg-green-400 text-white rounded-lg hover:bg-green-500 transition-colors"
                            onClick={() => handleTrade(crypto, "buy")}
                          >
                            Buy
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="px-4 py-2 text-xs bg-red-400 text-white rounded-lg hover:bg-red-500 transition-colors"
                            onClick={() => handleTrade(crypto, "sell")}
                          >
                            Sell
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Market Overview */}
          <div className="space-y-6">
            <Card className="glass-card border-border/20 bg-card/50 backdrop-blur-xl">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Top Gainers</h3>
                <div className="space-y-4">
                  {topGainers.slice(0, 5).map((crypto) => (
                    <div key={crypto.symbol} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">{crypto.symbol}</p>
                        <p className="text-xs text-muted-foreground">{formatCurrency(crypto.price)}</p>
                      </div>
                      <p className={`font-medium ${getChangeColor(crypto.change24h)}`}>
                        +{crypto.change24h.toFixed(2)}%
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-border/20 bg-card/50 backdrop-blur-xl">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Top Losers</h3>
                <div className="space-y-4">
                  {topLosers.slice(0, 5).map((crypto) => (
                    <div key={crypto.symbol} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">{crypto.symbol}</p>
                        <p className="text-xs text-muted-foreground">{formatCurrency(crypto.price)}</p>
                      </div>
                      <p className={`font-medium ${getChangeColor(crypto.change24h)}`}>
                        {crypto.change24h.toFixed(2)}%
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>

      {/* Trading Modal */}
      <TradingModal
        isOpen={tradingModalOpen}
        onClose={() => setTradingModalOpen(false)}
        crypto={selectedCrypto}
        tradeType={tradeType}
      />
    </motion.div>
  );
}