import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import PortfolioDistribution from "@/components/PortfolioDistribution";
import RecentTransactions from "@/components/RecentTransactions";
import CryptoIcon from "@/components/CryptoIcon";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp, TrendingDown, ArrowUp, ArrowDown, DollarSign, Wallet } from "lucide-react";

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

const getCoinGeckoId = (symbol: string) => {
  const symbolMap: { [key: string]: string } = {
    'BTC': 'bitcoin',
    'ETH': 'ethereum',
    'ADA': 'cardano',
    'SOL': 'solana',
    'MATIC': 'polygon',
    'LINK': 'chainlink',
    'AVAX': 'avalanche-2',
    'BNB': 'binancecoin',
    'XRP': 'ripple',
    'DOGE': 'dogecoin',
    'DOT': 'polkadot',
    'SHIB': 'shiba-inu',
    'UNI': 'uniswap',
    'LTC': 'litecoin',
    'ATOM': 'cosmos',
    'ALGO': 'algorand',
    'NEAR': 'near',
    'VET': 'vechain',
    'FIL': 'filecoin',
    'TRX': 'tron'
  };
  return symbolMap[symbol] || symbol.toLowerCase();
};

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

export default function Portfolio() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  const { data: portfolio, isLoading: portfolioLoading } = useQuery<PortfolioData>({
    queryKey: ["/api/portfolio"],
  });

  if (isLoading || portfolioLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-48"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-muted rounded-2xl"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-muted rounded-2xl"></div>
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
  };

  const todayPnL = portfolio?.holdings.reduce((total, holding) => {
    const changeValue = (holding.value * holding.change24h) / 100;
    return total + changeValue;
  }, 0) || 0;

  const totalInvestmentValue = portfolio?.holdings.reduce((total, holding) => total + holding.value, 0) || 0;

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
          <h1 className="text-3xl font-bold text-foreground mb-2">Portfolio</h1>
          <p className="text-muted-foreground">Track your cryptocurrency investments and performance</p>
        </div>

        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="glass-card border-border/20 bg-card/50 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">Total Value</h3>
                <Wallet className="w-5 h-5 text-crypto-primary" />
              </div>
              <p className="text-2xl font-bold text-foreground">
                {formatCurrency(portfolio?.totalValue || 0)}
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card border-border/20 bg-card/50 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">Investments</h3>
                <TrendingUp className="w-5 h-5 text-crypto-success" />
              </div>
              <p className="text-2xl font-bold text-foreground">
                {formatCurrency(totalInvestmentValue)}
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card border-border/20 bg-card/50 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">Available Cash</h3>
                <DollarSign className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold text-foreground">
                {formatCurrency(portfolio?.availableCash || 0)}
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card border-border/20 bg-card/50 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">Today's P&L</h3>
                <TrendingUp className={`w-5 h-5 ${todayPnL >= 0 ? "text-crypto-success" : "text-crypto-danger"}`} />
              </div>
              <p className={`text-2xl font-bold ${todayPnL >= 0 ? "text-crypto-success" : "text-crypto-danger"}`}>
                {todayPnL >= 0 ? "+" : ""}{formatCurrency(todayPnL)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Holdings Table */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="glass-card border-border/20 bg-card/50 backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-foreground">Holdings</h2>
                  <Button variant="outline" size="sm" className="text-crypto-primary border-crypto-primary">
                    Add Position
                  </Button>
                </div>

                {!portfolio?.holdings || portfolio.holdings.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground text-lg mb-4">No holdings yet</p>
                    <p className="text-muted-foreground">Start trading to build your portfolio</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {portfolio.holdings
                      .filter(holding => parseFloat(holding.amount) > 0)
                      .map((holding) => (
                      <div key={holding.symbol} className="flex items-center justify-between p-4 rounded-xl hover:bg-muted/30 transition-colors border border-border/10">
                        <div className="flex items-center space-x-4 flex-1">
                          <CryptoIcon 
                            coinId={getCoinGeckoId(holding.symbol)}
                            symbol={holding.symbol}
                            size="lg"
                            className="ring-2 ring-border/20"
                          />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <p className="font-semibold text-foreground text-lg">{holding.symbol}</p>
                              <span className="text-sm text-muted-foreground bg-muted/30 px-2 py-1 rounded">
                                {parseFloat(holding.amount).toFixed(4)}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {getCryptoName(holding.symbol)}
                            </p>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0 mx-4">
                          <p className="font-bold text-foreground text-lg">
                            {formatCurrency(holding.value)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            @ {formatCurrency(holding.currentPrice)}
                          </p>
                        </div>

                        <div className="text-right flex-shrink-0 min-w-[100px]">
                          <p className={`font-semibold flex items-center justify-end text-sm px-2 py-1 rounded-full ${
                            holding.change24h >= 0 
                              ? "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20" 
                              : "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20"
                          }`}>
                            {holding.change24h >= 0 ? (
                              <ArrowUp className="w-3 h-3 mr-1" />
                            ) : (
                              <ArrowDown className="w-3 h-3 mr-1" />
                            )}
                            {formatPercent(holding.change24h)}
                          </p>
                          <p className={`text-sm ${
                            holding.change24h >= 0 ? "text-crypto-success" : "text-crypto-danger"
                          }`}>
                            {formatCurrency((holding.value * holding.change24h) / 100)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <PortfolioDistribution />
            <RecentTransactions />
          </div>
        </div>
      </div>
    </motion.div>
  );
}