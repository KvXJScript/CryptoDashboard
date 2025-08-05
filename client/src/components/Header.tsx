import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/hooks/useAuth";
import { Moon, Sun, ChartLine, Menu, ChevronDown, Plus, Minus, X } from "lucide-react";
import type { User } from "@shared/schema";

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  


  const navItems = [
    { href: "/", label: "Dashboard", active: location === "/" },
    { href: "/portfolio", label: "Portfolio", active: location === "/portfolio" },
    { href: "/trade", label: "Trade", active: location === "/trade" },
    { href: "/watchlist", label: "Watchlist", active: location === "/watchlist" },
    { href: "/faq", label: "FAQ", active: location === "/faq" },
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
                <span
                  className={`transition-colors font-medium cursor-pointer ${
                    item.active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-crypto-primary"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Deposit/Withdraw Buttons */}
            <div className="hidden sm:flex items-center space-x-2">
              <Link href="/deposit">
                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                  <Plus className="h-4 w-4 mr-1" />
                  Deposit
                </Button>
              </Link>
              <Link href="/withdraw">
                <Button size="sm" variant="outline" className="border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                  <Minus className="h-4 w-4 mr-1" />
                  Withdraw
                </Button>
              </Link>
            </div>

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
                      {user?.firstName?.[0] || "D"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:block text-sm font-medium">
                    {user?.firstName || "Demo"}
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

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-background border-border">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 gradient-animation rounded-lg flex items-center justify-center">
                        <ChartLine className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-lg font-bold">CryptoTracker</span>
                    </div>
                  </div>
                  
                  {/* Mobile Navigation */}
                  <nav className="flex flex-col space-y-4 mb-8">
                    {navItems.map((item) => (
                      <Link key={item.href} href={item.href}>
                        <div
                          onClick={() => setMobileMenuOpen(false)}
                          className={`block py-3 px-4 rounded-lg transition-all duration-200 ${
                            item.active
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted"
                          }`}
                        >
                          {item.label}
                        </div>
                      </Link>
                    ))}
                  </nav>

                  {/* Mobile Deposit/Withdraw */}
                  <div className="space-y-3 mb-8">
                    <Link href="/deposit">
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Deposit
                      </Button>
                    </Link>
                    <Link href="/withdraw">
                      <Button 
                        variant="outline" 
                        className="w-full border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Minus className="h-4 w-4 mr-2" />
                        Withdraw
                      </Button>
                    </Link>
                  </div>

                  {/* Mobile Theme Toggle */}
                  <div className="mt-auto pt-6 border-t border-border">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Theme</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleTheme}
                        className="rounded-lg"
                      >
                        {theme === "dark" ? (
                          <Sun className="h-4 w-4" />
                        ) : (
                          <Moon className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
