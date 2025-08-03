// Static authentication for GitHub Pages deployment
// Uses localStorage for demo purposes

export interface StaticUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImageUrl?: string;
}

const STORAGE_KEY = 'crypto-dashboard-user';
const DEFAULT_USER: StaticUser = {
  id: 'demo-user-1',
  email: 'demo@cryptodashboard.com',
  firstName: 'Demo',
  lastName: 'User',
  profileImageUrl: undefined,
};

export class StaticAuthService {
  static getCurrentUser(): StaticUser | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      
      // Initialize with default user for demo
      this.setCurrentUser(DEFAULT_USER);
      return DEFAULT_USER;
    } catch (error) {
      console.error('Error reading user from localStorage:', error);
      return DEFAULT_USER;
    }
  }

  static setCurrentUser(user: StaticUser): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user to localStorage:', error);
    }
  }

  static signOut(): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error removing user from localStorage:', error);
    }
  }

  static isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }
}

// Hook for React components
export function useStaticAuth() {
  const user = StaticAuthService.getCurrentUser();
  
  return {
    user,
    isAuthenticated: StaticAuthService.isAuthenticated(),
    signOut: StaticAuthService.signOut,
  };
}