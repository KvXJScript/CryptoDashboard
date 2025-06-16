import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/hooks/useAuth";
import { Moon, Sun, ChartLine, Menu, ChevronDown } from "lucide-react";

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
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-crypto-card-dark/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-crypto-primary to-crypto-success rounded-lg flex items-center justify-center">
              <ChartLine className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold">CryptoTracker</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <a
                  className={`transition-colors ${
                    item.active
                      ? "text-gray-900 dark:text-white"
                      : "text-gray-500 hover:text-crypto-primary"
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
              className="rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
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
