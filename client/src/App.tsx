import { Switch, Route, Router as WouterRouter } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import Portfolio from "@/pages/Portfolio";
import Trade from "@/pages/Trade";
import WatchlistPage from "@/pages/WatchlistPage";
import FAQ from "@/pages/FAQ";
import NotFound from "@/pages/not-found";
import SimpleTest from "@/pages/SimpleTest";

function Router() {
  const { isAuthenticated, isLoading, user, error } = useAuth();

  console.log("Router state:", { isAuthenticated, isLoading, user: !!user, error });

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-foreground text-xl">Loading Crypto Dashboard...</div>
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  // Show error state if authentication fails
  if (error) {
    console.error("Authentication error:", error);
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-foreground text-xl mb-4">Welcome to Crypto Dashboard</div>
          <div className="text-muted-foreground">Initializing demo environment...</div>
        </div>
      </div>
    );
  }

  // Temporarily use simple test page to diagnose issues
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/test" component={SimpleTest} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/portfolio" component={Portfolio} />
      <Route path="/trade" component={Trade} />
      <Route path="/watchlist" component={WatchlistPage} />
      <Route path="/faq" component={FAQ} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <WouterRouter>
            <Toaster />
            <Router />
          </WouterRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
