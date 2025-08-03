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
    // Simulate loading and auto-login for demo
    const timer = setTimeout(() => {
      setUser(mockUser);
      setIsAuthenticated(true);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated,
    error: null,
  };
}
