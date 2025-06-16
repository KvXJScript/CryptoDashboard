import { Card, CardContent } from "@/components/ui/card";
import { Wallet, TrendingUp, DollarSign, ArrowUp, ArrowDown, Activity } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

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

export default function DashboardStats() {
  const { data: portfolio, isLoading } = useQuery<PortfolioData>({
    queryKey: ["/api/portfolio"],
  });

  const { data: transactions } = useQuery({
    queryKey: ["/api/transactions", 1],
    queryFn: async () => {
      const response = await fetch("/api/transactions?limit=1", {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch transactions");
      return response.json();
    },
  });

  // Calculate comprehensive portfolio metrics
  const todayPnL = portfolio?.holdings.reduce((total, holding) => {
    const changeValue = (holding.value * holding.change24h) / 100;
    return total + changeValue;
  }, 0) || 0;

  const portfolioPercentage = portfolio?.totalValue > 0 ? (todayPnL / portfolio.totalValue) * 100 : 0;
  const totalInvested = 10000; // Initial portfolio value
  const totalReturn = portfolio?.totalValue ? portfolio.totalValue - totalInvested : 0;
  const totalReturnPercentage = totalInvested > 0 ? (totalReturn / totalInvested) * 100 : 0;
  const portfolioDiversity = portfolio?.holdings.length || 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
  };

  if (isLoading) {
    return (
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Portfolio Value */}
        <Card className="glass-card border-border/20 bg-card/50 backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                Portfolio Value
              </h3>
              <Wallet className="w-5 h-5 text-crypto-primary" />
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-foreground">
                {formatCurrency(portfolio?.totalValue || 0)}
              </p>
              <p className="text-sm text-crypto-success flex items-center">
                <ArrowUp className="w-3 h-3 mr-1" />
                <span>
                  {formatCurrency(Math.abs(todayPnL))} ({formatPercent(((todayPnL / (portfolio?.totalValue || 1)) * 100))})
                </span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Today's P&L */}
        <Card className="glass-card border-border/20 bg-card/50 backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                Today's P&L
              </h3>
              <TrendingUp className={`w-5 h-5 ${todayPnL >= 0 ? "text-crypto-success" : "text-crypto-danger"}`} />
            </div>
            <div className="space-y-2">
              <p className={`text-2xl font-bold ${todayPnL >= 0 ? "text-crypto-success" : "text-crypto-danger"}`}>
                {todayPnL >= 0 ? "+" : ""}{formatCurrency(todayPnL)}
              </p>
              <p className={`text-sm flex items-center ${todayPnL >= 0 ? "text-crypto-success" : "text-crypto-danger"}`}>
                {todayPnL >= 0 ? (
                  <ArrowUp className="w-3 h-3 mr-1" />
                ) : (
                  <ArrowDown className="w-3 h-3 mr-1" />
                )}
                <span>{formatPercent(((todayPnL / (portfolio?.totalValue || 1)) * 100))} from yesterday</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Available Cash */}
        <Card className="glass-card border-border/20 bg-card/50 backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                Available Cash
              </h3>
              <DollarSign className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-foreground">
                {formatCurrency(portfolio?.availableCash || 0)}
              </p>
              <button className="text-sm text-crypto-primary hover:text-crypto-primary/80 transition-colors">
                Add funds
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
