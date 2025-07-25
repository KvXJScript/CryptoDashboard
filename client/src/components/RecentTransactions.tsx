import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { ArrowUp, ArrowDown } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Transaction {
  id: number;
  symbol: string;
  type: "buy" | "sell";
  amount: string;
  price: string;
  total: string;
  fee: string;
  createdAt: string;
}

export default function RecentTransactions() {
  const { data: transactions, isLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  const formatCurrency = (value: string | number) => {
    const num = typeof value === "string" ? parseFloat(value) : value;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const getTransactionColor = (type: "buy" | "sell") => {
    return type === "buy" ? "text-green-400" : "text-red-400";
  };

  const formatAmount = (amount: string, symbol: string) => {
    const num = parseFloat(amount);
    return `${num.toFixed(symbol === "BTC" ? 8 : 4)} ${symbol}`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Recent Transactions</h3>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Recent Transactions</h3>
          </div>
          <div className="text-center py-8">
            <p className="text-gray-500">No transactions yet</p>
            <p className="text-sm text-gray-400 mt-2">Your trading history will appear here</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Recent Transactions</h3>
          <button className="text-sm text-crypto-primary hover:underline">
            View all
          </button>
        </div>

        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    transaction.type === "buy"
                      ? "bg-green-400/20"
                      : "bg-red-400/20"
                  }`}
                >
                  {transaction.type === "buy" ? (
                    <ArrowUp className="text-green-400 text-xs w-4 h-4" />
                  ) : (
                    <ArrowDown className="text-red-400 text-xs w-4 h-4" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {transaction.type === "buy" ? "Bought" : "Sold"} {transaction.symbol}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(transaction.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-medium ${getTransactionColor(transaction.type)}`}>
                  {transaction.type === "buy" ? "+" : "-"}
                  {formatAmount(transaction.amount, transaction.symbol)}
                </p>
                <p className="text-xs text-gray-500">
                  {formatCurrency(transaction.total)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
