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
    // Immediately set mock user for frontend-only deployment
    setUser(mockUser);
    setIsAuthenticated(true);
    setIsLoading(false);
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated,
    error: null,
  };
}
