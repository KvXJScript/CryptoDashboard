import { useState, useEffect } from "react";
import type { User } from "@shared/schema";

// Mock user for demo purposes
const mockUser: User = {
  id: "demo-user-1",
  email: "demo@cryptotracker.com",
  firstName: "Demo",
  lastName: "User",
  profileImageUrl: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(mockUser);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    // Initialize demo data for static deployment immediately
    const initAuth = async () => {
      try {
        const { StaticStorageService } = await import("../lib/staticStorage");
        StaticStorageService.initializeDemoData(mockUser.id);
        StaticStorageService.generatePortfolioHistory(mockUser.id);
        console.log("Authentication initialized successfully");
      } catch (error) {
        console.error("Auth initialization error:", error);
      }
    };

    initAuth();
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated,
    error: null,
  };
}
