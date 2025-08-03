import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useTradeMutation, usePortfolio, useUserBalance } from "@/hooks/usePortfolio";
import { type CryptoPrice } from "@/hooks/useCryptoPrices";
import CryptoIcon from "@/components/CryptoIcon";
import { ArrowUp, ArrowDown, TrendingUp, TrendingDown } from "lucide-react";

interface TradingModalProps {
  isOpen: boolean;
  onClose: () => void;
  crypto: CryptoPrice | null;
  tradeType: "buy" | "sell";
}

export default function TradingModal({ isOpen, onClose, crypto, tradeType }: TradingModalProps) {
  const [amount, setAmount] = useState("");
  const [activeTradeType, setActiveTradeType] = useState<"buy" | "sell">(tradeType);
  const { toast } = useToast();
  const tradeMutation = useTradeMutation();
  const { data: holdings } = usePortfolio();
  const { data: userBalance } = useUserBalance();

  useEffect(() => {
    setActiveTradeType(tradeType);
  }, [tradeType]);

  useEffect(() => {
    if (!isOpen) {
      setAmount("");
    }
  }, [isOpen]);

  if (!crypto) return null;

  const availableCash = userBalance ? parseFloat(userBalance.balance) : 0;
  const holding = holdings?.find(h => h.symbol === crypto.symbol);
  const availableAmount = holding ? parseFloat(holding.amount) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    const total = parseFloat(amount) * crypto.price;
    const fee = total * 0.005; // 0.5% fee

    if (activeTradeType === "buy") {
      if (total + fee > availableCash) {
        toast({
          title: "Insufficient Funds",
          description: "You don't have enough cash for this purchase",
          variant: "destructive",
        });
        return;
      }
    } else {
      if (parseFloat(amount) > availableAmount) {
        toast({
          title: "Insufficient Holdings",
          description: "You don't have enough of this cryptocurrency to sell",
          variant: "destructive",
        });
        return;
      }
    }

    tradeMutation.mutate({
      symbol: crypto.symbol,
      type: activeTradeType,
      amount,
      price: crypto.price.toString(),
    });
  };

  const total = parseFloat(amount || "0") * crypto.price;
  const fee = total * 0.005;
  const finalTotal = activeTradeType === "buy" ? total + fee : total - fee;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <CryptoIcon symbol={crypto.symbol} size={32} />
            <div>
              <div className="text-left">
                {activeTradeType === "buy" ? "Buy" : "Sell"} {crypto.name}
              </div>
              <div className="text-sm text-muted-foreground font-normal">
                ${crypto.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                <span className={`ml-2 ${crypto.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {crypto.change24h >= 0 ? '+' : ''}{crypto.change24h.toFixed(2)}%
                </span>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex space-x-2">
            <Button
              type="button"
              variant={activeTradeType === "buy" ? "default" : "outline"}
              className="flex-1"
              onClick={() => setActiveTradeType("buy")}
            >
              Buy
            </Button>
            <Button
              type="button"
              variant={activeTradeType === "sell" ? "default" : "outline"}
              className="flex-1"
              onClick={() => setActiveTradeType("sell")}
              disabled={!holding || availableAmount === 0}
            >
              Sell
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="amount">Amount ({crypto.symbol})</Label>
              <Input
                id="amount"
                type="number"
                step="any"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={`Enter ${crypto.symbol} amount`}
                required
              />
              <div className="text-sm text-muted-foreground mt-1">
                {activeTradeType === "buy" 
                  ? `Available cash: $${availableCash.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  : `Available: ${availableAmount.toFixed(6)} ${crypto.symbol}`
                }
              </div>
            </div>

            {amount && parseFloat(amount) > 0 && (
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Amount:</span>
                  <span>{parseFloat(amount).toFixed(6)} {crypto.symbol}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Price:</span>
                  <span>${crypto.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Fee (0.5%):</span>
                  <span>${fee.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <hr className="border-muted-foreground/20" />
                <div className="flex justify-between font-medium">
                  <span>Total:</span>
                  <span className={activeTradeType === "buy" ? "text-red-600" : "text-green-600"}>
                    {activeTradeType === "buy" ? "-" : "+"}${Math.abs(finalTotal).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            )}

            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={tradeMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className={`flex-1 ${
                  activeTradeType === "buy" 
                    ? "bg-green-600 hover:bg-green-700" 
                    : "bg-red-600 hover:bg-red-700"
                }`}
                disabled={tradeMutation.isPending || !amount || parseFloat(amount) <= 0}
              >
                {tradeMutation.isPending ? "Processing..." : `${activeTradeType === "buy" ? "Buy" : "Sell"} ${crypto.symbol}`}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}