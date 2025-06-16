import { useState, useEffect } from "react";
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

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

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

  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-crypto-dark text-gray-900 dark:text-white transition-colors duration-300">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardStats />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <PriceChart />
            <CryptoList onTrade={handleTrade} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <PortfolioDistribution />
            <RecentTransactions />
            <Watchlist />
          </div>
        </div>
      </div>

      {/* Trading Modal */}
      <TradingModal
        isOpen={tradingModalOpen}
        onClose={() => setTradingModalOpen(false)}
        crypto={selectedCrypto}
        tradeType={tradeType}
      />

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-crypto-card-dark border-t border-gray-200 dark:border-gray-700 md:hidden">
        <div className="flex items-center justify-around py-3">
          <button className="flex flex-col items-center space-y-1 text-crypto-primary">
            <Home className="w-5 h-5" />
            <span className="text-xs">Home</span>
          </button>
          <button className="flex flex-col items-center space-y-1 text-gray-400">
            <PieChart className="w-5 h-5" />
            <span className="text-xs">Portfolio</span>
          </button>
          <button className="flex flex-col items-center space-y-1 text-gray-400">
            <ArrowUpDown className="w-5 h-5" />
            <span className="text-xs">Trade</span>
          </button>
          <button className="flex flex-col items-center space-y-1 text-gray-400">
            <Star className="w-5 h-5" />
            <span className="text-xs">Watchlist</span>
          </button>
        </div>
      </div>
    </div>
  );
}
