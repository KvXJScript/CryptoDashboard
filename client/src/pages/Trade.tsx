import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useCryptoPrices, type CryptoPrice } from "@/hooks/useCryptoPrices";
import { usePortfolio, useUserBalance } from "@/hooks/usePortfolio";
import Header from "@/components/Header";
import TradingModal from "@/components/TradingModal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, TrendingUp, TrendingDown } from "lucide-react";
import CryptoIcon from "@/components/CryptoIcon";

export default function Trade() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [tradingModalOpen, setTradingModalOpen] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoPrice | null>(null);
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");

  const { data: cryptos, isLoading: cryptosLoading } = useCryptoPrices();
  const { data: holdings } = usePortfolio();
  const { data: userBalance } = useUserBalance();

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
    return null; // Authentication handled by router
  }

  const handleTrade = (crypto: CryptoPrice, type: "buy" | "sell") => {
    setSelectedCrypto(crypto);
    setTradeType(type);
    setTradingModalOpen(true);
  };

  const filteredCryptos = cryptos?.filter(crypto =>
    crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    crypto.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const availableCash = userBalance ? parseFloat(userBalance.balance) : 0;

  // Check if user has holdings for each crypto
  const cryptosWithHoldings = filteredCryptos.map(crypto => {
    const holding = holdings?.find(h => h.symbol === crypto.symbol);
    return {
      ...crypto,
      hasHolding: !!holding,
      holdingAmount: holding ? parseFloat(holding.amount) : 0,
    };
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Trade</h1>
          <p className="text-muted-foreground">Buy and sell cryptocurrencies</p>
          <div className="mt-4 text-sm text-muted-foreground">
            Available Balance: <span className="font-semibold text-primary">${availableCash.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Available Cryptocurrencies</h2>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Search cryptocurrencies..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                  </div>

                  {cryptosLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="animate-pulse">
                          <div className="h-16 bg-muted rounded-lg"></div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cryptosWithHoldings.map((crypto) => (
                        <div
                          key={crypto.symbol}
                          className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center space-x-4">
                            <CryptoIcon symbol={crypto.symbol} size={40} />
                            <div>
                              <h3 className="font-medium">{crypto.name}</h3>
                              <p className="text-sm text-muted-foreground">{crypto.symbol}</p>
                              {crypto.hasHolding && (
                                <p className="text-xs text-primary">
                                  Holding: {crypto.holdingAmount.toFixed(6)} {crypto.symbol}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="text-right mr-4">
                            <div className="font-medium">
                              ${crypto.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                            </div>
                            <div className={`text-sm flex items-center justify-end ${crypto.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {crypto.change24h >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                              {Math.abs(crypto.change24h).toFixed(2)}%
                            </div>
                          </div>

                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              onClick={() => handleTrade(crypto, "buy")}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              Buy
                            </Button>
                            {crypto.hasHolding && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleTrade(crypto, "sell")}
                                className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                              >
                                Sell
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Trading Tips</h3>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <p>• Always do your own research before investing</p>
                    <p>• Start with small amounts to learn</p>
                    <p>• Diversify your portfolio</p>
                    <p>• Keep track of your transactions</p>
                    <p>• Set stop-loss orders to manage risk</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      <TradingModal
        isOpen={tradingModalOpen}
        onClose={() => setTradingModalOpen(false)}
        crypto={selectedCrypto}
        tradeType={tradeType}
      />
    </div>
  );
}