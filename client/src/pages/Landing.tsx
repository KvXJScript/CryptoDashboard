import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChartLine, Shield, Zap, TrendingUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// Enhanced floating particle background
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
      color: string;
      pulse: number;
    }> = [];

    // Create enhanced particles with different colors and behaviors
    for (let i = 0; i < 120; i++) {
      const colors = ['rgba(0, 255, 136, ', 'rgba(100, 255, 218, ', 'rgba(138, 43, 226, ', 'rgba(255, 255, 255, '];
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2 - 0.3, // Slightly upward drift
        size: Math.random() * 3 + 0.5,
        opacity: Math.random() * 0.6 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        pulse: Math.random() * Math.PI * 2,
      });
    }

    function animate() {
      if (!ctx || !canvas) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.pulse += 0.02;

        // Wrap around screen edges
        if (particle.x < -10) particle.x = canvas.width + 10;
        if (particle.x > canvas.width + 10) particle.x = -10;
        if (particle.y < -10) particle.y = canvas.height + 10;
        if (particle.y > canvas.height + 10) particle.y = -10;

        // Pulsing effect
        const pulseSize = particle.size + Math.sin(particle.pulse) * 0.5;
        const pulseOpacity = particle.opacity + Math.sin(particle.pulse * 1.5) * 0.2;

        // Draw particle with glow
        ctx.save();
        ctx.globalAlpha = pulseOpacity;
        ctx.shadowBlur = 15;
        ctx.shadowColor = particle.color + '0.8)';
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, pulseSize, 0, Math.PI * 2);
        ctx.fillStyle = particle.color + pulseOpacity + ')';
        ctx.fill();
        ctx.restore();
      });

      // Draw dynamic connections between nearby particles
      particles.forEach((particle, i) => {
        particles.slice(i + 1, i + 6).forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            const opacity = (1 - distance / 150) * 0.15;
            ctx.save();
            ctx.globalAlpha = opacity;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = 'rgba(0, 255, 136, 0.3)';
            ctx.lineWidth = 0.8;
            ctx.stroke();
            ctx.restore();
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
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
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
    const leftPadding = 80; // Increased left padding for price labels
    const rightPadding = 20;
    const topPadding = 20;
    const bottomPadding = 40;
    const chartWidth = canvas.offsetWidth - leftPadding - rightPadding;
    const chartHeight = canvas.offsetHeight - topPadding - bottomPadding;

    // Clear canvas with solid dark background
    ctx.fillStyle = '#0a0a0a';
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
      const y = topPadding + (chartHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(leftPadding, y);
      ctx.lineTo(canvas.offsetWidth - rightPadding, y);
      ctx.stroke();
      
      // Add price labels on the far left
      const priceValue = maxValue - (i * valueRange / 4);
      ctx.fillText(`$${priceValue.toLocaleString()}`, 8, y + 4);
    }
    
    // Draw vertical grid lines (time)
    for (let i = 0; i < data.length; i++) {
      const x = leftPadding + (chartWidth / (data.length - 1)) * i;
      ctx.beginPath();
      ctx.moveTo(x, topPadding);
      ctx.lineTo(x, topPadding + chartHeight);
      ctx.stroke();
      
      // Add time labels
      ctx.fillText(data[i].time, x - 15, canvas.offsetHeight - 10);
    }

    // Use solid green color for the line
    ctx.strokeStyle = '#00ff88';
    ctx.lineWidth = 3;
    ctx.beginPath();

    const animatedLength = Math.floor(data.length * animationProgress);
    const partialProgress = (data.length * animationProgress) % 1;

    // Draw all points up to animated length
    for (let i = 0; i <= animatedLength && i < data.length; i++) {
      const x = leftPadding + (chartWidth / (data.length - 1)) * i;
      const normalizedValue = (data[i].value - minValue) / valueRange;
      const y = topPadding + chartHeight - (normalizedValue * chartHeight);

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
      
      const currentX = leftPadding + (chartWidth / (data.length - 1)) * currentIndex;
      const nextX = leftPadding + (chartWidth / (data.length - 1)) * nextIndex;
      
      const currentY = topPadding + chartHeight - ((data[currentIndex].value - minValue) / valueRange * chartHeight);
      const nextY = topPadding + chartHeight - ((data[nextIndex].value - minValue) / valueRange * chartHeight);
      
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
      const x = leftPadding + (chartWidth / (data.length - 1)) * i;
      const normalizedValue = (data[i].value - minValue) / valueRange;
      const y = topPadding + chartHeight - (normalizedValue * chartHeight);

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
      const areaGradient = ctx.createLinearGradient(0, topPadding, 0, topPadding + chartHeight);
      areaGradient.addColorStop(0, 'rgba(0, 255, 136, 0.3)');
      areaGradient.addColorStop(1, 'rgba(0, 255, 136, 0.05)');
      
      ctx.fillStyle = areaGradient;
      ctx.beginPath();
      
      // Start from bottom left
      const firstX = leftPadding;
      ctx.moveTo(firstX, topPadding + chartHeight);
      
      // Draw to first point
      const firstY = topPadding + chartHeight - ((data[0].value - minValue) / valueRange * chartHeight);
      ctx.lineTo(firstX, firstY);
      
      // Follow the line
      for (let i = 1; i <= animatedLength && i < data.length; i++) {
        const x = leftPadding + (chartWidth / (data.length - 1)) * i;
        const normalizedValue = (data[i].value - minValue) / valueRange;
        const y = topPadding + chartHeight - (normalizedValue * chartHeight);
        ctx.lineTo(x, y);
      }
      
      // Close the path to bottom
      if (animatedLength > 0) {
        const lastX = leftPadding + (chartWidth / (data.length - 1)) * Math.min(animatedLength, data.length - 1);
        ctx.lineTo(lastX, topPadding + chartHeight);
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
        <div className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 border border-green-400/30 rounded-lg p-3 shadow-lg backdrop-blur-sm">
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
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                timeframe === period
                  ? 'bg-green-500 text-black shadow-lg border-2 border-green-400'
                  : 'bg-gray-800/80 text-gray-300 hover:bg-gray-700/90 border border-gray-600 backdrop-blur-sm'
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
    <div className="min-h-screen relative overflow-hidden" style={{ background: '#0a0a0a' }}>
      <ParticleBackground />
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg border-b border-white/10 animate-fade-in" style={{ zIndex: 10, backgroundColor: 'rgba(10, 10, 10, 0.9)' }}>
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
            <span className="text-green-400">
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
              onClick={() => document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' })}
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
      <section id="features-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative" style={{ zIndex: 2 }}>
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl font-bold text-white mb-4">
            Everything you need to master crypto trading
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Professional-grade tools and real-time data to help you make informed investment decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="glass-modern p-8 rounded-2xl hover:scale-105 transition-all duration-500 animate-slide-in-left animate-delay-200 hover:shadow-2xl hover:shadow-green-500/20">
            <div className="w-16 h-16 bg-green-500/20 rounded-xl flex items-center justify-center mb-6 animate-bounce-subtle">
              <ChartLine className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Live Price Tracking
            </h3>
            <p className="text-white/80 text-lg leading-relaxed">
              Real-time cryptocurrency prices powered by CoinGecko API with 24/7 market data updates and advanced charting.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="glass-modern p-8 rounded-2xl hover:scale-105 transition-all duration-500 animate-slide-up animate-delay-300 hover:shadow-2xl hover:shadow-blue-500/20">
            <div className="w-16 h-16 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6 animate-bounce-subtle animate-delay-100">
              <Zap className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Simulated Trading
            </h3>
            <p className="text-white/80 text-lg leading-relaxed">
              Practice trading with virtual funds. Perfect for learning strategies without financial risk or market pressure.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="glass-modern p-8 rounded-2xl hover:scale-105 transition-all duration-500 animate-slide-in-right animate-delay-400 hover:shadow-2xl hover:shadow-purple-500/20">
            <div className="w-16 h-16 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6 animate-bounce-subtle animate-delay-200">
              <Shield className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Portfolio Analytics
            </h3>
            <p className="text-white/80 text-lg leading-relaxed">
              Comprehensive portfolio analysis with performance metrics, distribution charts, and advanced insights.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative" style={{ zIndex: 2 }}>
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4 animate-fade-in">
            Trusted by crypto enthusiasts worldwide
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto animate-slide-up animate-delay-200">
            Join our growing community of traders and investors
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center animate-scale-in animate-delay-200">
            <div className="text-5xl font-bold text-green-400 mb-2">50K+</div>
            <div className="text-white/80 text-lg">Active Users</div>
          </div>
          <div className="text-center animate-scale-in animate-delay-400">
            <div className="text-5xl font-bold text-blue-400 mb-2">$2M+</div>
            <div className="text-white/80 text-lg">Virtual Trades</div>
          </div>
          <div className="text-center animate-scale-in animate-delay-600">
            <div className="text-5xl font-bold text-purple-400 mb-2">99.9%</div>
            <div className="text-white/80 text-lg">Uptime</div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative" style={{ zIndex: 2 }}>
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4 animate-fade-in">
            How it works
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto animate-slide-up animate-delay-200">
            Get started in minutes with our simple three-step process
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center animate-slide-in-left animate-delay-200">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-green-400 border-2 border-green-400/30">
              1
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Sign Up</h3>
            <p className="text-white/80">Create your free account and get $10,000 in virtual trading funds</p>
          </div>
          
          <div className="text-center animate-slide-up animate-delay-400">
            <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-blue-400 border-2 border-blue-400/30">
              2
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Track & Analyze</h3>
            <p className="text-white/80">Monitor real-time prices and analyze market trends with our advanced tools</p>
          </div>
          
          <div className="text-center animate-slide-in-right animate-delay-600">
            <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-purple-400 border-2 border-purple-400/30">
              3
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Trade & Learn</h3>
            <p className="text-white/80">Practice trading strategies and build your portfolio with confidence</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="backdrop-blur-sm relative animate-fade-in border-t-2 border-green-500/30" style={{ zIndex: 2, backgroundColor: 'rgba(50, 50, 50, 0.9)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-6 animate-slide-up">
              Ready to start your crypto journey?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto animate-slide-up animate-delay-200">
              Join thousands of users who trust CryptoTracker for their portfolio management needs.
            </p>
            <Button
              size="lg"
              onClick={handleLogin}
              className="bg-green-500 hover:bg-green-400 text-black px-12 py-4 text-xl font-bold backdrop-blur-sm animate-delay-400 transition-all duration-300 transform hover:scale-110 shadow-2xl shadow-green-500/30 hover:shadow-green-400/40"
            >
              Get Started Now - Free
            </Button>
          </div>
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="relative border-t border-white/10" style={{ zIndex: 2, backgroundColor: '#050505' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                  <ChartLine className="w-6 h-6 text-black" />
                </div>
                <span className="text-2xl font-bold text-white">CryptoTracker</span>
              </div>
              <p className="text-white/70 text-lg leading-relaxed max-w-md">
                The ultimate cryptocurrency portfolio tracking and trading platform.
                Start your journey to financial freedom with simulated trading and real-time analytics.
              </p>
              <div className="flex space-x-4 mt-6">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                  <span className="text-white">𝕏</span>
                </div>
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                  <span className="text-white">▶</span>
                </div>
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                  <span className="text-white">in</span>
                </div>
              </div>
            </div>

            {/* Product */}
            <div>
              <h3 className="text-white font-semibold text-lg mb-4">Product</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">Mobile App</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-white font-semibold text-lg mb-4">Company</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/60 text-sm">
              © 2025 CryptoTracker. All rights reserved. Built with ❤️ for crypto enthusiasts.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-white/60 hover:text-white text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-white/60 hover:text-white text-sm transition-colors">Terms of Service</a>
              <a href="#" className="text-white/60 hover:text-white text-sm transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
