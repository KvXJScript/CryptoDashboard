import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";

interface HistoricalData {
  timestamp: number;
  price: number;
  volume: number;
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

export default function PriceChart() {
  const [activeTimeframe, setActiveTimeframe] = useState("7");
  const [selectedCrypto, setSelectedCrypto] = useState("bitcoin");

  const timeframes = [
    { label: "1D", value: "1" },
    { label: "1W", value: "7" },
    { label: "1M", value: "30" },
    { label: "1Y", value: "365" },
  ];

  const cryptoOptions = [
    { label: "Bitcoin", value: "bitcoin" },
    { label: "Ethereum", value: "ethereum" },
    { label: "Solana", value: "solana" },
    { label: "Cardano", value: "cardano" },
  ];

  const { data: portfolio } = useQuery<PortfolioData>({
    queryKey: ["/api/portfolio"],
  });

  const { data: chartData, isLoading } = useQuery<HistoricalData[]>({
    queryKey: [`/api/crypto/${selectedCrypto}/history`, activeTimeframe],
    queryFn: () => fetch(`/api/crypto/${selectedCrypto}/history?days=${activeTimeframe}`).then(res => res.json()),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const [animatedData, setAnimatedData] = useState<HistoricalData[]>([]);

  useEffect(() => {
    if (chartData) {
      setAnimatedData([]);
      const timer = setTimeout(() => {
        setAnimatedData(chartData);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [chartData]);

  const formatChartData = (data: HistoricalData[]) => {
    return data.map(item => ({
      ...item,
      date: new Date(item.timestamp).toLocaleDateString(),
      time: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }));
  };

  const calculatePortfolioChange = () => {
    if (!portfolio || !portfolio.holdings.length) return { change: 0, percentage: 0 };
    
    const totalChange = portfolio.holdings.reduce((sum, holding) => {
      return sum + (holding.value * holding.change24h / 100);
    }, 0);
    
    const percentage = portfolio.totalValue > 0 ? (totalChange / portfolio.totalValue) * 100 : 0;
    return { change: totalChange, percentage };
  };

  const portfolioChange = calculatePortfolioChange();

  return (
    <Card className="glass-card border-border/20 bg-card/50 backdrop-blur-xl">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-foreground">Portfolio Performance</h2>
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-sm font-medium ${
              portfolioChange.percentage >= 0 
                ? "bg-crypto-success/10 text-crypto-success" 
                : "bg-crypto-danger/10 text-crypto-danger"
            }`}>
              {portfolioChange.percentage >= 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>{portfolioChange.percentage >= 0 ? "+" : ""}{portfolioChange.percentage.toFixed(2)}%</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex items-center space-x-2">
              {cryptoOptions.map((crypto) => (
                <Button
                  key={crypto.value}
                  size="sm"
                  variant={selectedCrypto === crypto.value ? "default" : "outline"}
                  className="text-xs"
                  onClick={() => setSelectedCrypto(crypto.value)}
                >
                  {crypto.label}
                </Button>
              ))}
            </div>
            
            <div className="flex items-center space-x-2">
              {timeframes.map((timeframe) => (
                <Button
                  key={timeframe.value}
                  size="sm"
                  variant={activeTimeframe === timeframe.value ? "default" : "outline"}
                  className="px-3 py-1 text-xs"
                  onClick={() => setActiveTimeframe(timeframe.value)}
                >
                  {timeframe.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="h-80 w-full">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <div className="animate-pulse text-muted-foreground">Loading chart data...</div>
            </div>
          ) : animatedData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={formatChartData(animatedData)}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
                <XAxis 
                  dataKey={activeTimeframe === "1" ? "time" : "date"}
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                />
                <YAxis 
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  labelStyle={{ color: 'var(--foreground)' }}
                  formatter={(value: any) => [`$${value.toLocaleString()}`, 'Price']}
                />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="var(--crypto-primary)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: "var(--crypto-primary)" }}
                  animationDuration={1000}
                  animationEasing="ease-out"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <p className="text-muted-foreground mb-2">Chart data unavailable</p>
                <p className="text-sm text-muted-foreground">Try selecting a different cryptocurrency or timeframe</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
