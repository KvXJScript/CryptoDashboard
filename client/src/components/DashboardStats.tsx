import { Card, CardContent } from "@/components/ui/card";
import { Wallet, TrendingUp, DollarSign, ArrowUp, ArrowDown } from "lucide-react";
import { usePortfolio, useUserBalance } from "@/hooks/usePortfolio";
import { useCryptoPrices } from "@/hooks/useCryptoPrices";

export default function DashboardStats() {
  const { data: holdings, isLoading: holdingsLoading } = usePortfolio();
  const { data: userBalance } = useUserBalance();
  const { data: cryptoPrices } = useCryptoPrices();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return "text-green-400";
    if (change < 0) return "text-red-400";
    return "text-gray-400";
  };

  if (holdingsLoading) {
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

  // Calculate portfolio metrics
  const portfolioData = holdings ? holdings.map(holding => {
    const cryptoPrice = cryptoPrices?.find(p => p.symbol === holding.symbol);
    const currentPrice = cryptoPrice?.price || 0;
    const amount = parseFloat(holding.amount);
    const value = amount * currentPrice;
    
    return {
      value,
      change24h: cryptoPrice?.change24h || 0,
    };
  }) : [];

  const totalValue = portfolioData.reduce((sum, item) => sum + item.value, 0);
  const availableCash = userBalance ? parseFloat(userBalance.balance) : 0;
  const todayPnL = portfolioData.reduce((total, item) => {
    const changeValue = (item.value * item.change24h) / 100;
    return total + changeValue;
  }, 0);

  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/5 via-background to-background">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Portfolio</p>
                <p className="text-2xl font-bold">{formatCurrency(totalValue)}</p>
                <p className={`text-sm ${getChangeColor(todayPnL)}`}>
                  {todayPnL >= 0 ? <ArrowUp className="inline w-3 h-3 mr-1" /> : <ArrowDown className="inline w-3 h-3 mr-1" />}
                  {formatCurrency(Math.abs(todayPnL))} today
                </p>
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
                <p className="text-2xl font-bold">{formatCurrency(availableCash)}</p>
                <p className="text-sm text-muted-foreground">Ready to invest</p>
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
                <p className="text-2xl font-bold">{formatCurrency(totalValue + availableCash)}</p>
                <p className="text-sm text-muted-foreground">All holdings + cash</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}