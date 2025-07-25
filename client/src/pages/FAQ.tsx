import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Shield, TrendingUp, Wallet, HelpCircle, Lock, DollarSign } from "lucide-react";
import { useState } from "react";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  icon: React.ReactNode;
  category: string;
}

const faqData: FAQItem[] = [
  {
    id: 1,
    question: "Is my money safe on this platform?",
    answer: "This is a simulated trading platform using virtual funds. No real money is involved in any transactions. Your account starts with $10,000 in virtual cash to practice trading without financial risk.",
    icon: <Shield className="w-5 h-5 text-crypto-success" />,
    category: "Security"
  },
  {
    id: 2,
    question: "How accurate are the cryptocurrency prices?",
    answer: "All prices are pulled in real-time from CoinGecko API, ensuring you see the most current market data. Price updates occur every 30 seconds to provide accurate trading simulations.",
    icon: <TrendingUp className="w-5 h-5 text-crypto-primary" />,
    category: "Trading"
  },
  {
    id: 3,
    question: "Can I withdraw my portfolio balance?",
    answer: "No, this platform uses virtual money for educational purposes only. All funds, gains, and losses are simulated. This allows you to learn crypto trading strategies without any financial risk.",
    icon: <Wallet className="w-5 h-5 text-crypto-warning" />,
    category: "Portfolio"
  },
  {
    id: 4,
    question: "How do I add cryptocurrencies to my watchlist?",
    answer: "Navigate to the Watchlist tab and click the '+' button to search and add cryptocurrencies. You can monitor price movements and receive updates on your favorite coins.",
    icon: <HelpCircle className="w-5 h-5 text-crypto-danger" />,
    category: "Features"
  },
  {
    id: 5,
    question: "Are there any trading fees?",
    answer: "Yes, realistic trading fees are applied to simulate real market conditions. This helps you understand the impact of fees on your trading strategy and portfolio performance.",
    icon: <DollarSign className="w-5 h-5 text-crypto-success" />,
    category: "Trading"
  },
  {
    id: 6,
    question: "How is my data protected?",
    answer: "We use industry-standard security measures including encrypted connections, secure authentication, and data protection protocols. Your trading activity and personal information are kept secure.",
    icon: <Lock className="w-5 h-5 text-crypto-primary" />,
    category: "Security"
  },
  {
    id: 7,
    question: "Can I reset my portfolio?",
    answer: "Currently, portfolio reset is not available through the interface. Your virtual trading history helps track your learning progress over time.",
    icon: <TrendingUp className="w-5 h-5 text-crypto-danger" />,
    category: "Portfolio"
  },
  {
    id: 8,
    question: "What cryptocurrencies can I trade?",
    answer: "You can trade 20+ major cryptocurrencies including Bitcoin, Ethereum, Cardano, Solana, and many others. All supported coins are listed in the trading section.",
    icon: <Wallet className="w-5 h-5 text-crypto-warning" />,
    category: "Trading"
  }
];

export default function FAQ() {
  const { isAuthenticated, isLoading } = useAuth();
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", ...Array.from(new Set(faqData.map(item => item.category)))];

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const filteredFAQs = selectedCategory === "All" 
    ? faqData 
    : faqData.filter(item => item.category === selectedCategory);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-muted rounded w-64"></div>
            <div className="h-6 bg-muted rounded w-96"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 bg-muted rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get answers to common questions about our crypto trading simulator
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap gap-2 mb-8 justify-center"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? "bg-crypto-primary text-white shadow-lg"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFAQs.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
            >
              <Card className="glass-card border-border/20 bg-card/50 backdrop-blur-xl hover:bg-card/60 transition-all duration-300">
                <CardContent className="p-0">
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="w-full p-6 text-left focus:outline-none focus:ring-2 focus:ring-crypto-primary focus:ring-offset-2 rounded-xl"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 rounded-lg bg-muted/50">
                          {item.icon}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-foreground mb-1">
                            {item.question}
                          </h3>
                          <span className="text-xs text-crypto-primary font-medium px-2 py-1 bg-crypto-primary/10 rounded-full">
                            {item.category}
                          </span>
                        </div>
                      </div>
                      <motion.div
                        animate={{ rotate: openItems.includes(item.id) ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      </motion.div>
                    </div>
                  </button>
                  
                  <motion.div
                    initial={false}
                    animate={{
                      height: openItems.includes(item.id) ? "auto" : 0,
                      opacity: openItems.includes(item.id) ? 1 : 0
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6">
                      <div className="pl-16">
                        <p className="text-muted-foreground leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <Card className="glass-card border-border/20 bg-gradient-to-r from-crypto-primary/10 to-crypto-success/10 backdrop-blur-xl">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Still have questions?
              </h2>
              <p className="text-muted-foreground mb-6">
                This platform is designed for educational purposes to help you learn cryptocurrency trading.
              </p>
              <div className="flex justify-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4 text-crypto-success" />
                  <span>100% Safe & Educational</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <TrendingUp className="w-4 h-4 text-crypto-primary" />
                  <span>Real Market Data</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Wallet className="w-4 h-4 text-crypto-warning" />
                  <span>Virtual Funds Only</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}