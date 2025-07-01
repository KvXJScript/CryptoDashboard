import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import DashboardStats from "@/components/DashboardStats";
import PriceChart from "@/components/PriceChart";
import CryptoList from "@/components/CryptoList";
import PortfolioDistribution from "@/components/PortfolioDistribution";
import RecentTransactions from "@/components/RecentTransactions";
import Watchlist from "@/components/Watchlist";
import TradingModal from "@/components/TradingModal";
import { Home, PieChart, ArrowUpDown, Star } from "lucide-react";

interface CryptoPrice {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  coinGeckoId: string;
}

export default function Dashboard() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [tradingModalOpen, setTradingModalOpen] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoPrice | null>(null);
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");

  // No redirect logic needed - router handles authentication

  const handleTrade = (crypto: CryptoPrice, type: "buy" | "sell") => {
    setSelectedCrypto(crypto);
    setTradeType(type);
    setTradingModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-crypto-dark">
        <div className="animate-pulse">
          <div className="h-16 bg-white dark:bg-crypto-card-dark border-b"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-white dark:bg-crypto-card-dark rounded-2xl"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="h-96 bg-white dark:bg-crypto-card-dark rounded-2xl"></div>
                <div className="h-64 bg-white dark:bg-crypto-card-dark rounded-2xl"></div>
              </div>
              <div className="space-y-6">
                <div className="h-64 bg-white dark:bg-crypto-card-dark rounded-2xl"></div>
                <div className="h-48 bg-white dark:bg-crypto-card-dark rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard content (authentication is handled by router)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 text-foreground transition-all duration-500">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <DashboardStats />
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <PriceChart />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <CryptoList onTrade={handleTrade} />
            </motion.div>
          </div>

          {/* Sidebar */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <PortfolioDistribution />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <RecentTransactions />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <Watchlist />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Trading Modal */}
      <TradingModal
        isOpen={tradingModalOpen}
        onClose={() => setTradingModalOpen(false)}
        crypto={selectedCrypto}
        tradeType={tradeType}
      />

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 glass-card border-t border-border/40 md:hidden z-10">
        <div className="flex items-center justify-around py-3">
          <Link href="/">
            <span className="flex flex-col items-center space-y-1 text-crypto-primary cursor-pointer">
              <Home className="w-5 h-5" />
              <span className="text-xs font-medium">Home</span>
            </span>
          </Link>
          <Link href="/portfolio">
            <span className="flex flex-col items-center space-y-1 text-muted-foreground hover:text-crypto-primary transition-colors cursor-pointer">
              <PieChart className="w-5 h-5" />
              <span className="text-xs">Portfolio</span>
            </span>
          </Link>
          <Link href="/trade">
            <span className="flex flex-col items-center space-y-1 text-muted-foreground hover:text-crypto-primary transition-colors cursor-pointer">
              <ArrowUpDown className="w-5 h-5" />
              <span className="text-xs">Trade</span>
            </span>
          </Link>
          <Link href="/watchlist">
            <span className="flex flex-col items-center space-y-1 text-muted-foreground hover:text-crypto-primary transition-colors cursor-pointer">
              <Star className="w-5 h-5" />
              <span className="text-xs">Watchlist</span>
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
