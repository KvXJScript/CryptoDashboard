import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import CryptoIcon from "@/components/CryptoIcon";
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

export default function PortfolioDistribution() {
  const { data: portfolio, isLoading } = useQuery<PortfolioData>({
    queryKey: ["/api/portfolio"],
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);
  };

  const getDistributionData = () => {
    if (!portfolio) return [];

    const total = portfolio.totalValue;
    const items = portfolio.holdings
      .filter(holding => parseFloat(holding.amount) > 0)
      .map(holding => ({
        name: holding.symbol,
        value: holding.value,
        percentage: ((holding.value / total) * 100).toFixed(1),
      }))
      .sort((a, b) => b.value - a.value);

    // Add cash if significant
    if (portfolio.availableCash > total * 0.01) {
      items.push({
        name: "Cash",
        value: portfolio.availableCash,
        percentage: ((portfolio.availableCash / total) * 100).toFixed(1),
      });
    }

    return items.slice(0, 5); // Show top 5
  };

  const distributionData = getDistributionData();

  const colors = [
    "bg-crypto-primary",
    "bg-crypto-success",
    "bg-crypto-danger",
    "bg-yellow-500",
    "bg-purple-500",
  ];

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-6">Portfolio Distribution</h3>
          <div className="animate-pulse">
            <div className="w-32 h-32 mx-auto mb-6 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                  </div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!portfolio || distributionData.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-6">Portfolio Distribution</h3>
          <div className="text-center py-8">
            <p className="text-gray-500">No holdings to display</p>
            <p className="text-sm text-gray-400 mt-2">Start trading to see your portfolio distribution</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-6">Portfolio Distribution</h3>

        {/* Portfolio Distribution Chart Placeholder */}
        <div className="relative mb-6">
          <div className="w-32 h-32 mx-auto relative">
            <div className="w-full h-full rounded-full border-8 border-gray-200 dark:border-gray-700"></div>
            {/* Simplified donut chart representation */}
            <div
              className="absolute inset-0 w-full h-full rounded-full border-8 border-transparent border-t-crypto-primary border-r-crypto-success border-b-crypto-danger transform -rotate-90"
              style={{
                clipPath: "polygon(50% 50%, 100% 0%, 100% 35%, 85% 85%, 50% 50%)",
              }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-xs text-gray-500">Total</p>
                <p className="text-sm font-bold">
                  {formatCurrency(portfolio.totalValue)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Distribution List */}
        <div className="space-y-3">
          {distributionData.map((item, index) => (
            <motion.div 
              key={item.name} 
              className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-all duration-200"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center space-x-3">
                {item.name !== "Cash" ? (
                  <CryptoIcon 
                    coinId={item.name.toLowerCase()}
                    symbol={item.name}
                    size="sm"
                    className="ring-1 ring-border/20"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">$</span>
                  </div>
                )}
                <div>
                  <span className="text-sm font-medium text-foreground">{item.name}</span>
                  <p className="text-xs text-muted-foreground">{formatCurrency(item.value)}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold text-foreground">{item.percentage}%</span>
                <div className="w-16 h-1.5 bg-muted rounded-full mt-1 overflow-hidden">
                  <motion.div 
                    className={`h-full ${colors[index % colors.length]}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
