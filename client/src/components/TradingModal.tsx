import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

interface CryptoPrice {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  coinGeckoId: string;
}

interface TradingModalProps {
  isOpen: boolean;
  onClose: () => void;
  crypto: CryptoPrice | null;
  tradeType: "buy" | "sell";
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

export default function TradingModal({ isOpen, onClose, crypto, tradeType }: TradingModalProps) {
  const [amount, setAmount] = useState("");
  const [activeTradeType, setActiveTradeType] = useState<"buy" | "sell">(tradeType);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: portfolio } = useQuery<PortfolioData>({
    queryKey: ["/api/portfolio"],
  });

  useEffect(() => {
    setActiveTradeType(tradeType);
  }, [tradeType]);

  const tradeMutation = useMutation({
    mutationFn: async (tradeData: {
      symbol: string;
      type: "buy" | "sell";
      amount: string;
      price: string;
    }) => {
      await apiRequest("POST", "/api/trade", tradeData);
    },
    onSuccess: () => {
      toast({
        title: "Trade Successful",
        description: `Successfully ${activeTradeType === "buy" ? "bought" : "sold"} ${crypto?.symbol}`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] });
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      onClose();
      setAmount("");
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Trade Failed",
        description: error.message || "Failed to execute trade",
        variant: "destructive",
      });
    },
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const calculateTotal = () => {
    if (!crypto || !amount) return 0;
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum)) return 0;
    return amountNum * crypto.price;
  };

  const calculateFee = () => {
    const total = calculateTotal();
    return total * 0.001; // 0.1% fee
  };

  const calculateFinalTotal = () => {
    const total = calculateTotal();
    const fee = calculateFee();
    return activeTradeType === "buy" ? total + fee : total - fee;
  };

  const calculateCryptoAmount = () => {
    if (!crypto || !amount) return 0;
    const usdAmount = parseFloat(amount);
    if (isNaN(usdAmount)) return 0;
    return usdAmount / crypto.price;
  };

  const getCurrentHolding = () => {
    if (!crypto || !portfolio) return 0;
    const holding = portfolio.holdings.find(h => h.symbol === crypto.symbol);
    return holding ? parseFloat(holding.amount) : 0;
  };

  const canExecuteTrade = () => {
    if (!crypto || !amount) return false;
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) return false;

    if (activeTradeType === "buy") {
      return portfolio && parseFloat(amount) <= portfolio.availableCash;
    } else {
      const currentHolding = getCurrentHolding();
      const cryptoAmount = calculateCryptoAmount();
      return cryptoAmount <= currentHolding;
    }
  };

  const handleTrade = () => {
    if (!crypto || !amount || !canExecuteTrade()) return;

    const cryptoAmount = calculateCryptoAmount();
    tradeMutation.mutate({
      symbol: crypto.symbol,
      type: activeTradeType,
      amount: cryptoAmount.toString(),
      price: crypto.price.toString(),
    });
  };

  const handleClose = () => {
    onClose();
    setAmount("");
  };

  if (!crypto) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-full max-w-md">
        <DialogHeader>
          <DialogTitle>Trade {crypto.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Trade Type Toggle */}
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <Button
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
                activeTradeType === "buy"
                  ? "bg-green-400 text-white"
                  : "text-gray-500 hover:text-gray-700 bg-transparent"
              }`}
              onClick={() => setActiveTradeType("buy")}
            >
              Buy
            </Button>
            <Button
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
                activeTradeType === "sell"
                  ? "bg-red-400 text-white"
                  : "text-gray-500 hover:text-gray-700 bg-transparent"
              }`}
              onClick={() => setActiveTradeType("sell")}
            >
              Sell
            </Button>
          </div>

          {/* Amount Input */}
          <div>
            <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Amount (USD)
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                $
              </span>
              <Input
                type="number"
                className="pl-8"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                step="0.01"
                min="0"
              />
            </div>
            {amount && (
              <p className="text-sm text-gray-500 mt-2">
                ≈ {calculateCryptoAmount().toFixed(crypto.symbol === "BTC" ? 8 : 4)} {crypto.symbol}
              </p>
            )}
          </div>

          {/* Current Holdings (for sell) */}
          {activeTradeType === "sell" && (
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Current Holdings: {getCurrentHolding().toFixed(crypto.symbol === "BTC" ? 8 : 4)} {crypto.symbol}
              </p>
            </div>
          )}

          {/* Available Cash (for buy) */}
          {activeTradeType === "buy" && portfolio && (
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Available Cash: {formatCurrency(portfolio.availableCash)}
              </p>
            </div>
          )}

          {/* Order Summary */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Current Price</span>
              <span>{formatCurrency(crypto.price)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>{formatCurrency(calculateTotal())}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Fee (0.1%)</span>
              <span>{formatCurrency(calculateFee())}</span>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-600 pt-2">
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>{formatCurrency(calculateFinalTotal())}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              className={`flex-1 ${
                activeTradeType === "buy"
                  ? "bg-crypto-success hover:bg-crypto-success/80"
                  : "bg-crypto-danger hover:bg-crypto-danger/80"
              } text-white`}
              onClick={handleTrade}
              disabled={!canExecuteTrade() || tradeMutation.isPending}
            >
              {tradeMutation.isPending
                ? "Processing..."
                : `${activeTradeType === "buy" ? "Buy" : "Sell"} ${crypto.symbol}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
