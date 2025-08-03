import { Card, CardContent } from "@/components/ui/card";
import { usePortfolio, useUserBalance } from "@/hooks/usePortfolio";
import { useCryptoPrices } from "@/hooks/useCryptoPrices";
import CryptoIcon from "@/components/CryptoIcon";
import { motion } from "framer-motion";

export default function PortfolioDistribution() {
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

  const getDistributionData = () => {
    if (!holdings || !cryptoPrices) return [];

    const portfolioData = holdings.map(holding => {
      const cryptoPrice = cryptoPrices.find(p => p.symbol === holding.symbol);
      const currentPrice = cryptoPrice?.price || 0;
      const amount = parseFloat(holding.amount);
      const value = amount * currentPrice;
      
      return {
        name: holding.symbol,
        value,
        change24h: cryptoPrice?.change24h || 0,
      };
    }).filter(item => item.value > 0);

    const totalValue = portfolioData.reduce((sum, item) => sum + item.value, 0);
    
    const items = portfolioData
      .map(item => ({
        ...item,
        percentage: totalValue > 0 ? ((item.value / totalValue) * 100).toFixed(1) : "0",
      }))
      .sort((a, b) => b.value - a.value);

    // Add cash if significant
    const availableCash = userBalance ? parseFloat(userBalance.balance) : 0;
    if (availableCash > 0) {
      const totalWithCash = totalValue + availableCash;
      items.push({
        name: "Cash",
        value: availableCash,
        percentage: ((availableCash / totalWithCash) * 100).toFixed(1),
        change24h: 0,
      });
      
      // Recalculate percentages with cash included
      items.forEach(item => {
        if (item.name !== "Cash") {
          item.percentage = ((item.value / totalWithCash) * 100).toFixed(1);
        }
      });
    }

    return items.slice(0, 5); // Show top 5
  };

  const distributionData = getDistributionData();

  const colors = [
    "bg-blue-500",
    "bg-green-500", 
    "bg-red-500",
    "bg-yellow-500",
    "bg-purple-500",
  ];

  if (holdingsLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-6">Portfolio Distribution</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
                  </div>
                </div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (distributionData.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-6">Portfolio Distribution</h3>
          <div className="text-center py-8">
            <p className="text-muted-foreground">No portfolio data</p>
            <p className="text-sm text-muted-foreground mt-2">Start trading to see your distribution</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-6">Portfolio Distribution</h3>
        <div className="space-y-4">
          {distributionData.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                {item.name === "Cash" ? (
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                    <span className="text-green-600 dark:text-green-400 text-xs font-semibold">$</span>
                  </div>
                ) : (
                  <CryptoIcon symbol={item.name} size={32} />
                )}
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(item.value)}
                    {item.name !== "Cash" && (
                      <span className={`ml-1 ${item.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {item.change24h >= 0 ? '+' : ''}{item.change24h.toFixed(1)}%
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{item.percentage}%</span>
                  <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]}`}></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}