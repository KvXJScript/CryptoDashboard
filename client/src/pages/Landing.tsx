import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChartLine, Shield, Zap, TrendingUp } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-crypto-dark dark:to-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-crypto-card-dark/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-crypto-primary to-crypto-success rounded-lg flex items-center justify-center">
                <ChartLine className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold">CryptoTracker</span>
            </div>

            <Button
              onClick={handleLogin}
              className="bg-crypto-primary hover:bg-crypto-primary/90 text-white"
            >
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Track, Trade, and
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-crypto-primary to-crypto-success">
              {" "}Grow{" "}
            </span>
            Your Crypto Portfolio
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            A modern cryptocurrency portfolio tracking platform with simulated trading, 
            live price data, and professional-grade analytics. Start your crypto journey today.
          </p>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <Button
              size="lg"
              onClick={handleLogin}
              className="bg-crypto-primary hover:bg-crypto-primary/90 text-white px-8 py-3 text-lg"
            >
              Get Started Free
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-3 text-lg border-crypto-primary text-crypto-primary hover:bg-crypto-primary hover:text-white"
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Hero Image/Chart Placeholder */}
        <div className="mt-16 relative">
          <div className="bg-white dark:bg-crypto-card-dark rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
            <div className="h-64 bg-gradient-to-r from-crypto-primary/20 to-crypto-success/20 rounded-xl flex items-end justify-center relative overflow-hidden">
              <div className="absolute inset-0 flex items-end justify-between px-4 pb-4">
                {[60, 45, 70, 55, 80, 75, 90, 85, 95, 100].map((height, index) => (
                  <div
                    key={index}
                    className="w-4 bg-crypto-success/60 rounded-t transition-all duration-1000 hover:bg-crypto-success/80"
                    style={{ 
                      height: `${height}%`,
                      animationDelay: `${index * 100}ms`,
                    }}
                  />
                ))}
              </div>
              <div className="text-center z-10 mb-8">
                <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">$24,891.45</p>
                <p className="text-crypto-success flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +5.2% Portfolio Growth
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Everything you need to manage your crypto portfolio
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Professional-grade tools and real-time data to help you make informed investment decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <Card>
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-crypto-primary/20 rounded-lg flex items-center justify-center mb-4">
                <ChartLine className="w-6 h-6 text-crypto-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Live Price Tracking
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Real-time cryptocurrency prices powered by CoinGecko API with 24/7 market data updates.
              </p>
            </CardContent>
          </Card>

          {/* Feature 2 */}
          <Card>
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-crypto-success/20 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-crypto-success" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Simulated Trading
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Practice trading with virtual funds. Perfect for learning without financial risk.
              </p>
            </CardContent>
          </Card>

          {/* Feature 3 */}
          <Card>
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-crypto-danger/20 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-crypto-danger" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Portfolio Analytics
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Comprehensive portfolio analysis with performance metrics and distribution charts.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-crypto-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to start your crypto journey?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of users who trust CryptoTracker for their portfolio management needs.
            </p>
            <Button
              size="lg"
              onClick={handleLogin}
              className="bg-white text-crypto-primary hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
            >
              Get Started Now
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-crypto-card-dark border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-crypto-primary to-crypto-success rounded-lg flex items-center justify-center">
                <ChartLine className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold">CryptoTracker</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              © 2025 CryptoTracker. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
