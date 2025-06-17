import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChartLine, Shield, Zap, TrendingUp } from "lucide-react";
import { useEffect, useRef } from "react";

// Particle animation component
function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
    }> = [];

    // Create particles
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }

    function animate() {
      if (!ctx || !canvas) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59, 130, 246, ${particle.opacity})`;
        ctx.fill();
      });

      // Draw connections
      particles.forEach((particle, i) => {
        particles.slice(i + 1).forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = `rgba(59, 130, 246, ${0.1 * (1 - distance / 100)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 relative overflow-hidden">
      <ParticleBackground />
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-blue-900/20 border-b border-white/10" style={{ zIndex: 10 }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 gradient-animation rounded-lg flex items-center justify-center">
                <ChartLine className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-white">CryptoTracker</span>
            </div>

            <Button
              onClick={handleLogin}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 shadow-lg hover:shadow-white/25 transition-all duration-300 backdrop-blur-sm"
            >
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative" style={{ zIndex: 2 }}>
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
            Track, Trade, and
            <span className="text-white">
              {" "}Grow{" "}
            </span>
            Your Crypto Portfolio
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed">
            A modern cryptocurrency portfolio tracking platform with simulated trading, 
            live price data, and professional-grade analytics. Start your crypto journey today.
          </p>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <Button
              size="lg"
              onClick={handleLogin}
              className="bg-white/20 hover:bg-white/30 text-white border border-white/30 px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
            >
              Get Started Free
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-3 text-lg border-white/30 text-white hover:bg-white/10 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 backdrop-blur-sm"
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Hero Image/Chart Placeholder */}
        <div className="mt-16 relative">
          <div className="glass-card rounded-3xl shadow-2xl p-8 border border-border/20 backdrop-blur-xl">
            <div className="h-64 bg-gradient-to-r from-crypto-primary/20 via-crypto-success/20 to-crypto-warning/20 rounded-2xl flex items-end justify-center relative overflow-hidden">
              <div className="absolute inset-0 flex items-end justify-between px-6 pb-6">
                {[60, 45, 70, 55, 80, 75, 90, 85, 95, 100].map((height, index) => (
                  <div
                    key={index}
                    className="w-4 bg-gradient-to-t from-crypto-success to-crypto-primary rounded-t-lg transition-all duration-1000 hover:from-crypto-primary hover:to-crypto-warning transform hover:scale-110"
                    style={{ 
                      height: `${height}%`,
                      animationDelay: `${index * 100}ms`,
                    }}
                  />
                ))}
              </div>
              <div className="text-center z-10 mb-8">
                <p className="text-3xl font-bold text-foreground mb-2 bg-gradient-to-r from-crypto-success to-crypto-primary bg-clip-text text-transparent">$24,891.45</p>
                <p className="text-crypto-success flex items-center justify-center font-medium">
                  <TrendingUp className="w-5 h-5 mr-2" />
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
      <footer className="bg-gray-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-crypto-primary to-crypto-success rounded-lg flex items-center justify-center">
                <ChartLine className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-white">CryptoTracker</span>
            </div>
            <p className="text-white">
              © 2025 CryptoTracker. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
