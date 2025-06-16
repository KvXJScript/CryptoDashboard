import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/hooks/useAuth";
import { Moon, Sun, ChartLine, Menu, ChevronDown } from "lucide-react";
import type { User } from "@shared/schema";

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [location] = useLocation();
  


  const navItems = [
    { href: "/", label: "Dashboard", active: location === "/" },
    { href: "/portfolio", label: "Portfolio", active: location === "/portfolio" },
    { href: "/trade", label: "Trade", active: location === "/trade" },
    { href: "/watchlist", label: "Watchlist", active: location === "/watchlist" },
  ];

  return (
    <header className="sticky top-0 z-50 glass-card border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 gradient-animation rounded-lg flex items-center justify-center">
              <ChartLine className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">CryptoTracker</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <a
                  className={`transition-colors font-medium ${
                    item.active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-crypto-primary"
                  }`}
                >
                  {item.label}
                </a>
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-lg hover:bg-muted transition-all duration-300"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 text-crypto-warning" />
              ) : (
                <Moon className="h-4 w-4 text-crypto-primary" />
              )}
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage
                      src={user?.profileImageUrl || undefined}
                      alt="User avatar"
                      className="object-cover"
                    />
                    <AvatarFallback>
                      {user?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:block text-sm font-medium">
                    {user?.firstName || user?.email?.split("@")[0] || "User"}
                  </span>
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => (window.location.href = "/api/logout")}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
