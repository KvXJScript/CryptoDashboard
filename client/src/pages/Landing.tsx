import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChartLine, Shield, Zap, TrendingUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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
        ctx.fillStyle = `rgba(2, 0, 59, ${particle.opacity})`;
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
            ctx.strokeStyle = `rgba(138, 43, 226, ${0.15 * (1 - distance / 100)})`;
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

// Animated Line Chart Component
function AnimatedLineChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M'>('1D');
  const [animationProgress, setAnimationProgress] = useState(0);

  // Sample data for different timeframes
  const chartData = {
    '1D': [
      { time: '00:00', value: 24000 },
      { time: '04:00', value: 24200 },
      { time: '08:00', value: 24500 },
      { time: '12:00', value: 24800 },
      { time: '16:00', value: 24600 },
      { time: '20:00', value: 24891 },
    ],
    '1W': [
      { time: 'Mon', value: 23500 },
      { time: 'Tue', value: 24100 },
      { time: 'Wed', value: 24300 },
      { time: 'Thu', value: 24600 },
      { time: 'Fri', value: 24800 },
      { time: 'Sat', value: 24700 },
      { time: 'Sun', value: 24891 },
    ],
    '1M': [
      { time: 'Week 1', value: 22800 },
      { time: 'Week 2', value: 23200 },
      { time: 'Week 3', value: 23800 },
      { time: 'Week 4', value: 24891 },
    ],
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);

    const data = chartData[timeframe];
    const padding = 40;
    const chartWidth = canvas.offsetWidth - padding * 2;
    const chartHeight = canvas.offsetHeight - padding * 2;

    // Clear canvas with gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.offsetHeight);
    gradient.addColorStop(0, '#000000');
    gradient.addColorStop(1, '#0a0a0a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

    // Calculate min/max values first
    const values = data.map(d => d.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const valueRange = maxValue - minValue;

    // Draw horizontal grid lines (price levels)
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 0.5;
    ctx.fillStyle = '#888888';
    ctx.font = '12px Inter, sans-serif';
    
    for (let i = 0; i <= 4; i++) {
      const y = padding + (chartHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvas.offsetWidth - padding, y);
      ctx.stroke();
      
      // Add price labels
      const priceValue = maxValue - (i * valueRange / 4);
      ctx.fillText(`$${priceValue.toLocaleString()}`, 5, y + 4);
    }
    
    // Draw vertical grid lines (time)
    for (let i = 0; i < data.length; i++) {
      const x = padding + (chartWidth / (data.length - 1)) * i;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, padding + chartHeight);
      ctx.stroke();
      
      // Add time labels
      ctx.fillText(data[i].time, x - 15, canvas.offsetHeight - 10);
    }

    // Create gradient for the line
    const lineGradient = ctx.createLinearGradient(0, 0, canvas.offsetWidth, 0);
    lineGradient.addColorStop(0, '#8a2be2');
    lineGradient.addColorStop(0.5, '#00ff88');
    lineGradient.addColorStop(1, '#ff6b6b');
    
    // Draw animated line with full connection
    ctx.strokeStyle = lineGradient;
    ctx.lineWidth = 3;
    ctx.beginPath();

    const animatedLength = Math.floor(data.length * animationProgress);
    const partialProgress = (data.length * animationProgress) % 1;

    // Draw all points up to animated length
    for (let i = 0; i <= animatedLength && i < data.length; i++) {
      const x = padding + (chartWidth / (data.length - 1)) * i;
      const normalizedValue = (data[i].value - minValue) / valueRange;
      const y = padding + chartHeight - (normalizedValue * chartHeight);

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    // Draw partial line for smooth animation
    if (animatedLength < data.length - 1 && partialProgress > 0) {
      const currentIndex = animatedLength;
      const nextIndex = currentIndex + 1;
      
      const currentX = padding + (chartWidth / (data.length - 1)) * currentIndex;
      const nextX = padding + (chartWidth / (data.length - 1)) * nextIndex;
      
      const currentY = padding + chartHeight - ((data[currentIndex].value - minValue) / valueRange * chartHeight);
      const nextY = padding + chartHeight - ((data[nextIndex].value - minValue) / valueRange * chartHeight);
      
      const interpolatedX = currentX + (nextX - currentX) * partialProgress;
      const interpolatedY = currentY + (nextY - currentY) * partialProgress;
      
      ctx.lineTo(interpolatedX, interpolatedY);
    }

    ctx.stroke();

    // Draw glow effect
    ctx.shadowColor = '#00ff88';
    ctx.shadowBlur = 15;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Draw points with hover effect
    for (let i = 0; i <= animatedLength && i < data.length; i++) {
      const x = padding + (chartWidth / (data.length - 1)) * i;
      const normalizedValue = (data[i].value - minValue) / valueRange;
      const y = padding + chartHeight - (normalizedValue * chartHeight);

      // Outer glow
      ctx.save();
      ctx.fillStyle = '#00ff88';
      ctx.shadowColor = '#00ff88';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Inner point
      ctx.save();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Fill area under the curve
    if (animatedLength > 0) {
      const areaGradient = ctx.createLinearGradient(0, padding, 0, padding + chartHeight);
      areaGradient.addColorStop(0, 'rgba(0, 255, 136, 0.3)');
      areaGradient.addColorStop(1, 'rgba(0, 255, 136, 0.05)');
      
      ctx.fillStyle = areaGradient;
      ctx.beginPath();
      
      // Start from bottom left
      const firstX = padding;
      ctx.moveTo(firstX, padding + chartHeight);
      
      // Draw to first point
      const firstY = padding + chartHeight - ((data[0].value - minValue) / valueRange * chartHeight);
      ctx.lineTo(firstX, firstY);
      
      // Follow the line
      for (let i = 1; i <= animatedLength && i < data.length; i++) {
        const x = padding + (chartWidth / (data.length - 1)) * i;
        const normalizedValue = (data[i].value - minValue) / valueRange;
        const y = padding + chartHeight - (normalizedValue * chartHeight);
        ctx.lineTo(x, y);
      }
      
      // Close the path to bottom
      if (animatedLength > 0) {
        const lastX = padding + (chartWidth / (data.length - 1)) * Math.min(animatedLength, data.length - 1);
        ctx.lineTo(lastX, padding + chartHeight);
      }
      
      ctx.closePath();
      ctx.fill();
    }
    
  }, [timeframe, animationProgress]);

  useEffect(() => {
    setAnimationProgress(0);
    const startTime = Date.now();
    const duration = 2000; // 2 seconds

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easedProgress = progress * progress * (3 - 2 * progress);
      setAnimationProgress(easedProgress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [timeframe]);

  return (
    <div className="bg-black rounded-2xl p-6 border-2 border-purple-500/30 shadow-2xl glass-modern">
      {/* Chart Controls */}
      <div className="flex justify-between items-center mb-4">
        <div className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 border border-purple-400/30 rounded-lg p-3 shadow-lg backdrop-blur-sm">
          <div className="text-2xl font-bold text-white">$24,891.45</div>
          <div className="text-green-400 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 mr-1" />
            +5.2% Growth
          </div>
        </div>
        
        <div className="flex space-x-2">
          {(['1D', '1W', '1M'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setTimeframe(period)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                timeframe === period
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg animate-pulse-glow'
                  : 'bg-gray-700/60 text-gray-300 hover:bg-gray-600/80 backdrop-blur-sm'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-64 rounded-lg border border-gray-700/50"
        style={{ display: 'block' }}
      />
    </div>
  );
}

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #02003b 0%, #1a0d4a 25%, #2d1b69 50%, #8a2be2 75%, #02003b 100%)' }}>
      <ParticleBackground />
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg border-b border-white/10 animate-fade-in" style={{ zIndex: 10, backgroundColor: 'rgba(2, 0, 59, 0.4)' }}>
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
          <h1 className="text-5xl font-bold text-white mb-6 leading-tight animate-fade-in">
            Track, Trade, and
            <span className="text-white animate-pulse-glow">
              {" "}Grow{" "}
            </span>
            Your Crypto Portfolio
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed animate-slide-up animate-delay-200">
            A modern cryptocurrency portfolio tracking platform with simulated trading, 
            live price data, and professional-grade analytics. Start your crypto journey today.
          </p>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center animate-slide-up animate-delay-400">
            <Button
              size="lg"
              onClick={handleLogin}
              className="bg-white/20 hover:bg-white/30 text-white border border-white/30 px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm animate-pulse-glow"
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

        {/* Hero Chart Section */}
        <div className="mt-16 relative animate-scale-in animate-delay-600">
          <AnimatedLineChart />
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative" style={{ zIndex: 2 }}>
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl font-bold text-white mb-4">
            Everything you need to manage your crypto portfolio
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Professional-grade tools and real-time data to help you make informed investment decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <Card className="glass-modern hover:scale-105 transition-all duration-300 animate-slide-in-left animate-delay-200">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-lg flex items-center justify-center mb-4 animate-bounce-subtle">
                <ChartLine className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Live Price Tracking
              </h3>
              <p className="text-white/80">
                Real-time cryptocurrency prices powered by CoinGecko API with 24/7 market data updates.
              </p>
            </CardContent>
          </Card>

          {/* Feature 2 */}
          <Card className="glass-modern hover:scale-105 transition-all duration-300 animate-slide-up animate-delay-300">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500/30 to-emerald-500/30 rounded-lg flex items-center justify-center mb-4 animate-bounce-subtle animate-delay-100">
                <Zap className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Simulated Trading
              </h3>
              <p className="text-white/80">
                Practice trading with virtual funds. Perfect for learning without financial risk.
              </p>
            </CardContent>
          </Card>

          {/* Feature 3 */}
          <Card className="glass-modern hover:scale-105 transition-all duration-300 animate-slide-in-right animate-delay-400">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-lg flex items-center justify-center mb-4 animate-bounce-subtle animate-delay-200">
                <Shield className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Portfolio Analytics
              </h3>
              <p className="text-white/80">
                Comprehensive portfolio analysis with performance metrics and distribution charts.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="backdrop-blur-sm relative animate-fade-in" style={{ zIndex: 2, backgroundColor: 'rgba(2, 0, 59, 0.8)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4 animate-slide-up">
              Ready to start your crypto journey?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto animate-slide-up animate-delay-200">
              Join thousands of users who trust CryptoTracker for their portfolio management needs.
            </p>
            <Button
              size="lg"
              onClick={handleLogin}
              className="bg-gradient-to-r from-purple-600/30 to-pink-600/30 hover:from-purple-600/50 hover:to-pink-600/50 text-white border border-white/30 px-8 py-3 text-lg font-semibold backdrop-blur-sm animate-pulse-glow animate-delay-400 transition-all duration-300 transform hover:scale-105"
            >
              Get Started Now
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 relative" style={{ zIndex: 2 }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                <ChartLine className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-white">CryptoTracker</span>
            </div>
            <p className="text-white/80">
              © 2025 CryptoTracker. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
