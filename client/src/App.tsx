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
import Deposit from "@/pages/Deposit";
import Withdraw from "@/pages/Withdraw";

function Router() {
  const { isAuthenticated, user, error } = useAuth();

  console.log("Router state:", { isAuthenticated, user: !!user, error });

  // Temporarily use simple test page to diagnose issues
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/test" component={SimpleTest} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/portfolio" component={Portfolio} />
      <Route path="/trade" component={Trade} />
      <Route path="/watchlist" component={WatchlistPage} />
      <Route path="/deposit" component={Deposit} />
      <Route path="/withdraw" component={Withdraw} />
      <Route path="/faq" component={FAQ} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Fix GitHub Pages routing by detecting the base path
  const isGitHubPages = window.location.hostname === 'kvxjscript.github.io';
  const basePath = isGitHubPages ? '/CryptoDashboard' : '';
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <WouterRouter base={basePath}>
            <Toaster />
            <Router />
          </WouterRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
