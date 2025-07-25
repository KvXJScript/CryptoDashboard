import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import PortfolioDistribution from "@/components/PortfolioDistribution";
import RecentTransactions from "@/components/RecentTransactions";
import CryptoIcon from "@/components/CryptoIcon";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { TrendingUp, TrendingDown, ArrowUp, ArrowDown, DollarSign, Wallet, Plus, X, Search } from "lucide-react";

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

const getCoinGeckoId = (symbol: string) => {
    const symbolMap: { [key: string]: string } = {
        'BTC': 'bitcoin',
        'ETH': 'ethereum',
        'ADA': 'cardano',
        'SOL': 'solana',
        'MATIC': 'polygon',
        'LINK': 'chainlink',
        'AVAX': 'avalanche-2',
        'BNB': 'binancecoin',
        'XRP': 'ripple',
        'DOGE': 'dogecoin',
        'DOT': 'polkadot',
        'SHIB': 'shiba-inu',
        'UNI': 'uniswap',
        'LTC': 'litecoin',
        'ATOM': 'cosmos',
        'ALGO': 'algorand',
        'NEAR': 'near',
        'VET': 'vechain',
        'FIL': 'filecoin',
        'TRX': 'tron'
    };
    return symbolMap[symbol] || symbol.toLowerCase();
};

const getCryptoName = (symbol: string) => {
    const nameMap: { [key: string]: string } = {
        'BTC': 'Bitcoin',
        'ETH': 'Ethereum',
        'ADA': 'Cardano',
        'SOL': 'Solana',
        'MATIC': 'Polygon',
        'LINK': 'Chainlink',
        'AVAX': 'Avalanche',
        'BNB': 'BNB',
        'XRP': 'XRP',
        'DOGE': 'Dogecoin',
        'DOT': 'Polkadot',
        'SHIB': 'Shiba Inu',
        'UNI': 'Uniswap',
        'LTC': 'Litecoin',
        'ATOM': 'Cosmos',
        'ALGO': 'Algorand',
        'NEAR': 'NEAR Protocol',
        'VET': 'VeChain',
        'FIL': 'Filecoin',
        'TRX': 'TRON'
    };
    return nameMap[symbol] || symbol;
};

export default function Portfolio() {
    const { isAuthenticated, isLoading } = useAuth();
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [showAddModal, setShowAddModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    
    const { data: portfolio, isLoading: portfolioLoading } = useQuery<PortfolioData>({
        queryKey: ["/api/portfolio"],
    });
    
    const { data: cryptos } = useQuery<CryptoPrice[]>({
        queryKey: ["/api/crypto/prices"],
        refetchInterval: 30000,
    });
    
    interface CryptoPrice {
        symbol: string;
        name: string;
        price: number;
        change24h: number;
        coinGeckoId: string;
    }
    
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value);
    };
    
    const getChangeColor = (change: number) => {
        if (change > 0) return "text-green-400"; // Bright green for positive
        if (change < 0) return "text-red-400"; // Light red for negative
        return "text-gray-400"; // Neutral for zero
    };
    
    const tradeMutation = useMutation({
        mutationFn: async ({ symbol, type, amount }: { symbol: string; type: "buy" | "sell"; amount: number }) => {
            await apiRequest("POST", "/api/trade", {
                symbol,
                type,
                amount: amount.toString(),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] });
            queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
            toast({
                title: "Trade Successful",
                description: "Your trade has been executed successfully",
            });
            setShowAddModal(false);
            setSearchTerm("");
        },
        onError: () => {
            toast({
                title: "Trade Failed",
                description: "There was an error executing your trade",
                variant: "destructive",
            });
        },
    });
    
    if (isLoading || portfolioLoading) {
        return (
            <div className="min-h-screen bg-background text-foreground">
                <Header />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="animate-pulse space-y-8">
                        <div className="h-8 bg-muted rounded w-48"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-32 bg-muted rounded-2xl"></div>
                            ))}
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="h-96 bg-muted rounded-2xl"></div>
                            <div className="h-96 bg-muted rounded-2xl"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    if (!isAuthenticated) {
        toast({
            title: "Unauthorized",
            description: "You are logged out. Logging in again...",
            variant: "destructive",
        });
        setTimeout(() => {
            window.location.href = "/api/login";
        }, 500);
        return null;
    }
    
    const formatPercent = (value: number) => {
        return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
    };
    
    const todayPnL = portfolio?.holdings.reduce((total, holding) => {
        const changeValue = (holding.value * holding.change24h) / 100;
        return total + changeValue;
    }, 0) || 0;
    
    const totalInvestmentValue = portfolio?.holdings.reduce((total, holding) => total + holding.value, 0) || 0;
    
    return (
        <motion.div
            className="min-h-screen bg-background text-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <Header />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">Portfolio</h1>
                    <p className="text-muted-foreground">Track your cryptocurrency investments and performance</p>
                </div>
                
                {/* Portfolio Overview */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    <Card className="glass-card border-border/20 bg-card/50 backdrop-blur-xl">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-medium text-muted-foreground">Total Value</h3>
                                <Wallet className="w-5 h-5 text-crypto-primary" />
                            </div>
                            <p className="text-2xl font-bold text-foreground">
                                {formatCurrency(portfolio?.totalValue || 0)}
                            </p>
                        </CardContent>
                    </Card>
                    
                    <Card className="glass-card border-border/20 bg-card/50 backdrop-blur-xl">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-medium text-muted-foreground">Investments</h3>
                                <TrendingUp className="w-5 h-5 text-crypto-success" />
                            </div>
                            <p className="text-2xl font-bold text-foreground">
                                {formatCurrency(totalInvestmentValue)}
                            </p>
                        </CardContent>
                    </Card>
                    
                    <Card className="glass-card border-border/20 bg-card/50 backdrop-blur-xl">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-medium text-muted-foreground">Available Cash</h3>
                                <DollarSign className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <p className="text-2xl font-bold text-foreground">
                                {formatCurrency(portfolio?.availableCash || 0)}
                            </p>
                        </CardContent>
                    </Card>
                    
                    <Card className="glass-card border-border/20 bg-card/50 backdrop-blur-xl">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-medium text-muted-foreground">Today's P&L</h3>
                                <TrendingUp className={`w-5 h-5 ${getChangeColor(todayPnL)}`} />
                            </div>
                            <p className={`text-2xl font-bold ${getChangeColor(todayPnL)}`}>
                                {todayPnL >= 0 ? "+" : ""}{formatCurrency(todayPnL)}
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
                
                {/* Holdings Table */}
                <motion.div
                    className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    <div className="lg:col-span-2">
                        <Card className="glass-card border-border/20 bg-card/50 backdrop-blur-xl">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-semibold text-foreground">Holdings</h2>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-crypto-primary border-crypto-primary"
                                        onClick={() => setShowAddModal(true)}
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Position
                                    </Button>
                                </div>
                                
                                {!portfolio?.holdings || portfolio.holdings.length === 0 ? (
                                    <div className="text-center py-12">
                                        <p className="text-muted-foreground text-lg mb-4">No holdings yet</p>
                                        <p className="text-muted-foreground">Start trading to build your portfolio</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {portfolio.holdings
                                            .filter(holding => parseFloat(holding.amount) > 0)
                                            .map((holding, index) => (
                                                <motion.div
                                                    key={holding.symbol}
                                                    className="flex items-center justify-between p-4 rounded-xl hover:bg-muted/30 transition-colors border border-border/10"
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                                >
                                                    <div className="flex items-center space-x-4 flex-1">
                                                        <CryptoIcon
                                                            coinId={getCoinGeckoId(holding.symbol)}
                                                            symbol={holding.symbol}
                                                            size="lg"
                                                            className="ring-2 ring-border/20"
                                                        />
                                                        <div className="flex-1">
                                                            <div className="flex items-center space-x-2 mb-1">
                                                                <p className="font-semibold text-foreground text-lg">{getCryptoName(holding.symbol)}</p>
                                                                <span className="text-sm text-muted-foreground font-mono font-semibold bg-muted/30 px-2 py-1 rounded">
                                {parseFloat(holding.amount).toFixed(4)} {holding.symbol}
                              </span>
                                                            </div>
                                                            <p className="text-sm text-muted-foreground">
                                                                Current Price: {formatCurrency(holding.currentPrice)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="text-right flex-shrink-0 mx-4">
                                                        <p className="font-bold text-foreground text-lg">
                                                            {formatCurrency(holding.value)}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            @ {formatCurrency(holding.currentPrice)}
                                                        </p>
                                                    </div>
                                                    
                                                    <div className="text-right flex-shrink-0 min-w-[100px]">
                                                        <p className={`font-semibold flex items-center justify-end text-sm px-2 py-1 rounded-full ${
                                                            holding.change24h >= 0
                                                                ? "text-green-400 bg-green-400/10"
                                                                : "text-red-400 bg-red-400/10"
                                                        }`}>
                                                            {holding.change24h >= 0 ? (
                                                                <ArrowUp className="w-3 h-3 mr-1" />
                                                            ) : (
                                                                <ArrowDown className="w-3 h-3 mr-1" />
                                                            )}
                                                            {formatPercent(holding.change24h)}
                                                        </p>
                                                        <p className={`text-sm ${getChangeColor(holding.change24h)}`}>
                                                            {holding.change24h >= 0 ? "+" : ""}{formatCurrency(Math.abs((holding.value * holding.change24h) / 100))}
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                    
                    <div className="space-y-6">
                        <PortfolioDistribution />
                        <RecentTransactions />
                    </div>
                </motion.div>
            </div>
            
            {/* Add Position Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <Card className="w-full max-w-md glass-card border-border/20">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-foreground">Add Position</h3>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => setShowAddModal(false)}
                                    className="text-muted-foreground hover:text-foreground"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                            
                            <div className="relative mb-4">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                <Input
                                    placeholder="Search cryptocurrencies..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 bg-muted/50 border-border/40"
                                />
                            </div>
                            
                            <div className="max-h-64 overflow-y-auto custom-scrollbar space-y-2">
                                {cryptos?.filter(crypto =>
                                    crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
                                ).slice(0, 10).map((crypto) => (
                                    <div
                                        key={crypto.symbol}
                                        className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer"
                                        onClick={() => {
                                            tradeMutation.mutate({ symbol: crypto.symbol, type: "buy", amount: 10 });
                                        }}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <CryptoIcon
                                                coinId={crypto.coinGeckoId}
                                                symbol={crypto.symbol}
                                                size="sm"
                                                className="ring-1 ring-border/20"
                                            />
                                            <div>
                                                <p className="font-medium text-foreground">{crypto.name}</p>
                                                <p className="text-xs text-muted-foreground">{crypto.symbol}</p>
                                            </div>
                                        </div>
                                        <div className="text-right mr-4">
                                            <p className="font-medium text-foreground">${crypto.price.toFixed(4)}</p>
                                            <p className={`text-xs font-medium ${
                                                crypto.change24h >= 0 ? "text-crypto-success" : "text-crypto-danger"
                                            }`}>
                                                {crypto.change24h >= 0 ? "+" : ""}{crypto.change24h.toFixed(2)}%
                                            </p>
                                        </div>
                                        <Plus className="w-4 h-4 text-crypto-primary" />
                                    </div>
                                ))}
                                {cryptos?.filter(crypto =>
                                    crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
                                ).length === 0 && searchTerm && (
                                    <p className="text-center text-muted-foreground py-4">No cryptocurrencies found</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </motion.div>
    );
}