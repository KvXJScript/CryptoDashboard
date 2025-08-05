import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  TrendingDown, 
  Building2, 
  Coins, 
  DollarSign,
  Calendar,
  Globe,
  Users,
  BarChart3,
  Zap,
  Shield,
  Info
} from "lucide-react";
import { useCryptoPrices } from "@/hooks/useCryptoPrices";

interface CryptoDetails {
  symbol: string;
  name: string;
  marketCap: string;
  totalSupply: string;
  circulatingSupply: string;
  maxSupply: string | null;
  issuer: string;
  founded: string;
  consensus: string;
  website: string;
  description: string;
  performance: {
    "7d": number;
    "30d": number;
    "90d": number;
    "1y": number;
  };
  metrics: {
    allTimeHigh: number;
    allTimeLow: number;
    fromATH: number;
    fromATL: number;
  };
}

const cryptoDetailsData: Record<string, CryptoDetails> = {
  BTC: {
    symbol: "BTC",
    name: "Bitcoin",
    marketCap: "$2.1T",
    totalSupply: "21,000,000",
    circulatingSupply: "19,756,893",
    maxSupply: "21,000,000",
    issuer: "Satoshi Nakamoto",
    founded: "2009",
    consensus: "Proof of Work",
    website: "bitcoin.org",
    description: "The first and largest cryptocurrency by market capitalization, serving as digital gold and a store of value.",
    performance: { "7d": 8.45, "30d": 15.23, "90d": 45.67, "1y": 123.45 },
    metrics: { allTimeHigh: 108135, allTimeLow: 0.003, fromATH: -1.48, fromATL: 3551166.67 }
  },
  ETH: {
    symbol: "ETH",
    name: "Ethereum",
    marketCap: "$390B",
    totalSupply: "120,426,315",
    circulatingSupply: "120,426,315",
    maxSupply: null,
    issuer: "Ethereum Foundation",
    founded: "2015",
    consensus: "Proof of Stake",
    website: "ethereum.org",
    description: "A decentralized platform for smart contracts and decentralized applications (dApps).",
    performance: { "7d": -2.34, "30d": 12.45, "90d": 34.56, "1y": 78.90 },
    metrics: { allTimeHigh: 4891.70, allTimeLow: 0.43, fromATH: -33.70, fromATL: 754774.42 }
  },
  USDT: {
    symbol: "USDT",
    name: "Tether",
    marketCap: "$137B",
    totalSupply: "137,459,847,671",
    circulatingSupply: "137,459,847,671",
    maxSupply: null,
    issuer: "Tether Ltd.",
    founded: "2014",
    consensus: "Multi-blockchain",
    website: "tether.to",
    description: "A stablecoin pegged to the US Dollar, providing stability in the volatile crypto market.",
    performance: { "7d": 0.01, "30d": -0.02, "90d": 0.05, "1y": 0.12 },
    metrics: { allTimeHigh: 1.32, allTimeLow: 0.57, fromATH: -24.24, fromATL: 75.44 }
  },
  BNB: {
    symbol: "BNB",
    name: "BNB",
    marketCap: "$95B",
    totalSupply: "145,887,575",
    circulatingSupply: "145,887,575",
    maxSupply: "200,000,000",
    issuer: "Binance",
    founded: "2017",
    consensus: "Proof of Stake Authority",
    website: "binance.org",
    description: "Native token of the Binance ecosystem, used for trading fee discounts and DeFi applications.",
    performance: { "7d": -1.23, "30d": 8.90, "90d": 25.34, "1y": 67.89 },
    metrics: { allTimeHigh: 721.80, allTimeLow: 0.10, fromATH: -9.58, fromATL: 652566.00 }
  },
  ADA: {
    symbol: "ADA",
    name: "Cardano",
    marketCap: "$16.8B",
    totalSupply: "45,000,000,000",
    circulatingSupply: "36,849,731,536",
    maxSupply: "45,000,000,000",
    issuer: "IOHK",
    founded: "2017",
    consensus: "Proof of Stake",
    website: "cardano.org",
    description: "A blockchain platform focused on sustainability, scalability, and transparency, using peer-reviewed academic research.",
    performance: { "7d": 2.15, "30d": -5.67, "90d": 18.34, "1y": -12.45 },
    metrics: { allTimeHigh: 3.10, allTimeLow: 0.017, fromATH: -85.29, fromATL: 2582.35 }
  },
  SOL: {
    symbol: "SOL",
    name: "Solana",
    marketCap: "$42.3B",
    totalSupply: "584,793,097",
    circulatingSupply: "474,126,316",
    maxSupply: null,
    issuer: "Solana Labs",
    founded: "2020",
    consensus: "Proof of History + Proof of Stake",
    website: "solana.com",
    description: "A high-performance blockchain supporting fast, decentralized apps and crypto transactions.",
    performance: { "7d": -0.87, "30d": 8.45, "90d": 28.67, "1y": 245.78 },
    metrics: { allTimeHigh: 259.96, allTimeLow: 0.50, fromATH: -65.59, fromATL: 17790.00 }
  },
  MATIC: {
    symbol: "MATIC",
    name: "Polygon",
    marketCap: "$9.8B",
    totalSupply: "10,000,000,000",
    circulatingSupply: "9,319,469,069",
    maxSupply: "10,000,000,000",
    issuer: "Polygon Technology",
    founded: "2017",
    consensus: "Proof of Stake",
    website: "polygon.technology",
    description: "A layer-2 scaling solution for Ethereum, providing faster and cheaper transactions.",
    performance: { "7d": 1.23, "30d": -8.90, "90d": 12.45, "1y": -15.67 },
    metrics: { allTimeHigh: 2.92, allTimeLow: 0.003, fromATH: -88.15, fromATL: 11420.00 }
  },
  LINK: {
    symbol: "LINK",
    name: "Chainlink",
    marketCap: "$7.2B",
    totalSupply: "1,000,000,000",
    circulatingSupply: "608,099,971",
    maxSupply: "1,000,000,000",
    issuer: "Chainlink Labs",
    founded: "2017",
    consensus: "Ethereum-based",
    website: "chain.link",
    description: "A decentralized oracle network providing real-world data to smart contracts.",
    performance: { "7d": -2.34, "30d": 5.67, "90d": 15.89, "1y": -8.45 },
    metrics: { allTimeHigh: 52.70, allTimeLow: 0.148, fromATH: -77.65, fromATL: 7856.76 }
  },
  AVAX: {
    symbol: "AVAX",
    name: "Avalanche",
    marketCap: "$15.2B",
    totalSupply: "720,000,000",
    circulatingSupply: "406,725,365",
    maxSupply: "720,000,000",
    issuer: "Ava Labs",
    founded: "2020",
    consensus: "Avalanche Consensus",
    website: "avax.network",
    description: "A platform for launching DeFi applications and enterprise blockchain deployments in one ecosystem.",
    performance: { "7d": -2.76, "30d": 12.34, "90d": 23.45, "1y": -25.67 },
    metrics: { allTimeHigh: 146.22, allTimeLow: 2.80, fromATH: -87.97, fromATL: 528.21 }
  },
  XRP: {
    symbol: "XRP",
    name: "XRP",
    marketCap: "$134B",
    totalSupply: "99,988,625,754",
    circulatingSupply: "57,187,908,462",
    maxSupply: "100,000,000,000",
    issuer: "Ripple Labs",
    founded: "2012",
    consensus: "Ripple Protocol Consensus Algorithm",
    website: "ripple.com",
    description: "A digital payment protocol designed for fast, low-cost international money transfers.",
    performance: { "7d": 0.56, "30d": 45.67, "90d": 178.90, "1y": 267.89 },
    metrics: { allTimeHigh: 3.84, allTimeLow: 0.002, fromATH: -39.06, fromATL: 117000.00 }
  },
  DOGE: {
    symbol: "DOGE",
    name: "Dogecoin",
    marketCap: "$55.8B",
    totalSupply: "147,295,886,384",
    circulatingSupply: "147,295,886,384",
    maxSupply: null,
    issuer: "Billy Markus & Jackson Palmer",
    founded: "2013",
    consensus: "Proof of Work",
    website: "dogecoin.com",
    description: "A cryptocurrency featuring a Shiba Inu dog from the 'Doge' meme, known for its vibrant community.",
    performance: { "7d": 4.21, "30d": 12.67, "90d": 89.45, "1y": 178.90 },
    metrics: { allTimeHigh: 0.737, allTimeLow: 0.00008, fromATH: -48.57, fromATL: 473625.00 }
  },
  DOT: {
    symbol: "DOT",
    name: "Polkadot",
    marketCap: "$6.8B",
    totalSupply: "1,504,357,843",
    circulatingSupply: "1,504,357,843",
    maxSupply: null,
    issuer: "Web3 Foundation",
    founded: "2020",
    consensus: "Nominated Proof of Stake",
    website: "polkadot.network",
    description: "A multi-chain blockchain platform enabling cross-blockchain transfers of any type of data or asset.",
    performance: { "7d": -1.45, "30d": -3.67, "90d": 8.90, "1y": -45.67 },
    metrics: { allTimeHigh: 55.00, allTimeLow: 2.70, fromATH: -91.71, fromATL: 68.89 }
  }
};

export default function CryptoInfo() {
  const [selectedCrypto, setSelectedCrypto] = useState<string>("BTC");
  const { data: prices, isLoading } = useCryptoPrices();
  
  const selectedData = cryptoDetailsData[selectedCrypto];
  const currentPrice = prices?.find(p => p.symbol === selectedCrypto);

  const formatPerformance = (value: number) => {
    const isPositive = value >= 0;
    return (
      <div className={`flex items-center gap-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
        {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
        <span>{isPositive ? '+' : ''}{value.toFixed(2)}%</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Info className="h-6 w-6 text-blue-500" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Cryptocurrency Information
        </h2>
      </div>

      {/* Crypto Selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {Object.keys(cryptoDetailsData).map((symbol) => (
          <Button
            key={symbol}
            variant={selectedCrypto === symbol ? "default" : "outline"}
            onClick={() => setSelectedCrypto(symbol)}
            className="flex items-center gap-2"
          >
            <Coins className="h-4 w-4" />
            {symbol}
          </Button>
        ))}
      </div>

      {selectedData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Basic Information */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-500" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{selectedData.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Symbol</p>
                  <Badge variant="secondary">{selectedData.symbol}</Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Current Price</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    ${currentPrice?.price.toLocaleString() || 'Loading...'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">24h Change</p>
                  {currentPrice && formatPerformance(currentPrice.change24h)}
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Issuer</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{selectedData.issuer}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Founded</p>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="font-semibold text-gray-900 dark:text-white">{selectedData.founded}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Consensus</p>
                  <div className="flex items-center gap-1">
                    <Shield className="h-4 w-4 text-gray-500" />
                    <span className="font-semibold text-gray-900 dark:text-white">{selectedData.consensus}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Website</p>
                  <div className="flex items-center gap-1">
                    <Globe className="h-4 w-4 text-gray-500" />
                    <a 
                      href={`https://${selectedData.website}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-semibold text-blue-500 hover:text-blue-600 transition-colors"
                    >
                      {selectedData.website}
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Market Data */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-green-500" />
                Market Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Market Cap</p>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-500" />
                    <span className="font-bold text-xl text-gray-900 dark:text-white">{selectedData.marketCap}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Circulating Supply</p>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-blue-500" />
                      <span className="font-semibold text-gray-900 dark:text-white">{selectedData.circulatingSupply}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Supply</p>
                    <div className="flex items-center gap-1">
                      <Coins className="h-4 w-4 text-purple-500" />
                      <span className="font-semibold text-gray-900 dark:text-white">{selectedData.totalSupply}</span>
                    </div>
                  </div>
                </div>
                {selectedData.maxSupply && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Max Supply</p>
                    <div className="flex items-center gap-1">
                      <Zap className="h-4 w-4 text-orange-500" />
                      <span className="font-semibold text-gray-900 dark:text-white">{selectedData.maxSupply}</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Price Performance */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-500" />
                Price Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(selectedData.performance).map(([period, performance]) => (
                  <div key={period} className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{period.toUpperCase()}</p>
                    <div className="flex justify-center">
                      {formatPerformance(performance)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Price Metrics */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-red-500" />
                Price Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">All-Time High</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      ${selectedData.metrics.allTimeHigh.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">From ATH</p>
                    {formatPerformance(selectedData.metrics.fromATH)}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">All-Time Low</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      ${selectedData.metrics.allTimeLow}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">From ATL</p>
                    {formatPerformance(selectedData.metrics.fromATL)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card className="glass-card lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-indigo-500" />
                About {selectedData.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {selectedData.description}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}