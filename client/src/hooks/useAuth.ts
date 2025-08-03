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
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Add timeout to ensure DOM is ready
    const initAuth = () => {
      try {
        // Initialize demo data for static deployment
        import("../lib/staticStorage").then(({ StaticStorageService }) => {
          StaticStorageService.initializeDemoData(mockUser.id);
        }).catch(console.error);

        // Set mock user for frontend-only deployment
        setUser(mockUser);
        setIsAuthenticated(true);
        setIsLoading(false);
        
        console.log("Authentication initialized successfully");
      } catch (error) {
        console.error("Auth initialization error:", error);
        // Still set authenticated for demo purposes
        setUser(mockUser);
        setIsAuthenticated(true);
        setIsLoading(false);
      }
    };

    // Small delay to ensure proper initialization
    const timer = setTimeout(initAuth, 100);
    return () => clearTimeout(timer);
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated,
    error: null,
  };
}
