import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { usePortfolio, useUserBalance } from "@/hooks/usePortfolio";
import { useCryptoPrices } from "@/hooks/useCryptoPrices";
import Header from "@/components/Header";
import PortfolioDistribution from "@/components/PortfolioDistribution";
import RecentTransactions from "@/components/RecentTransactions";
import CryptoIcon from "@/components/CryptoIcon";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrendingUp, TrendingDown, ArrowUp, ArrowDown, DollarSign, Wallet, Search } from "lucide-react";

export default function Portfolio() {
  const { isAuthenticated, isLoading } = useAuth();
  const { data: holdings, isLoading: holdingsLoading } = usePortfolio();
  const { data: userBalance } = useUserBalance();
  const { data: cryptoPrices } = useCryptoPrices();
  const [searchTerm, setSearchTerm] = useState("");

  if (isLoading || holdingsLoading) {
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

  const getCryptoName = (symbol: string) => {
    const nameMap: { [key: string]: string } = {
      'BTC': 'Bitcoin',
      'ETH': 'Ethereum',
      'ADA': 'Cardano',
      'SOL': 'Solana',
      'MATIC': 'Polygon',
      'LINK': 'Chainlink',
      'AVAX': 'Avalanche',
      'BNB': 'BNB',
      'XRP': 'XRP',
      'DOGE': 'Dogecoin',
      'DOT': 'Polkadot',
      'SHIB': 'Shiba Inu',
      'UNI': 'Uniswap',
      'LTC': 'Litecoin',
      'ATOM': 'Cosmos',
      'ALGO': 'Algorand',
      'NEAR': 'NEAR Protocol',
      'VET': 'VeChain',
      'FIL': 'Filecoin',
      'TRX': 'TRON'
    };
    return nameMap[symbol] || symbol;
  };

  // Calculate portfolio data with current prices
  const portfolioData = holdings ? holdings.map(holding => {
    const cryptoPrice = cryptoPrices?.find(p => p.symbol === holding.symbol);
    const currentPrice = cryptoPrice?.price || 0;
    const amount = parseFloat(holding.amount);
    const value = amount * currentPrice;
    
    return {
      ...holding,
      name: getCryptoName(holding.symbol),
      currentPrice,
      value,
      change24h: cryptoPrice?.change24h || 0,
    };
  }) : [];

  const totalValue = portfolioData.reduce((sum, holding) => sum + holding.value, 0);
  const availableCash = userBalance ? parseFloat(userBalance.balance) : 0;

  const filteredHoldings = portfolioData.filter(holding =>
    holding.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    holding.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Portfolio</h1>
          <p className="text-muted-foreground">Track your crypto investments and performance</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/5 via-background to-background">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Portfolio Value</p>
                  <p className="text-2xl font-bold">${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Wallet className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Available Cash</p>
                  <p className="text-2xl font-bold">${availableCash.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
                <div className="h-12 w-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Assets</p>
                  <p className="text-2xl font-bold">${(totalValue + availableCash).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Your Holdings</h2>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Search assets..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    {filteredHoldings.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No holdings found.</p>
                      </div>
                    ) : (
                      filteredHoldings.map((holding) => (
                        <div
                          key={holding.id}
                          className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center space-x-4">
                            <CryptoIcon symbol={holding.symbol} size={40} />
                            <div>
                              <h3 className="font-medium">{holding.name}</h3>
                              <p className="text-sm text-muted-foreground">{holding.symbol}</p>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="font-medium">{parseFloat(holding.amount).toFixed(6)} {holding.symbol}</div>
                            <div className="text-sm text-muted-foreground">
                              ${holding.currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="font-medium">${holding.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                            <div className={`text-sm flex items-center ${holding.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {holding.change24h >= 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                              {Math.abs(holding.change24h).toFixed(2)}%
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <RecentTransactions />
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <PortfolioDistribution />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}