// apps/web/src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Create a default context value to avoid undefined errors
const defaultContextValue: AuthContextType = {
  user: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  isAuthenticated: false,
  isLoading: true,
};

const AuthContext = createContext<AuthContextType>(defaultContextValue);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  console.log('AuthProvider initializing');
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider useEffect running');
    // Check if user is already logged in
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        console.log('Found stored user');
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error parsing stored user:', error);
    }
    setIsLoading(false);
  }, []);

  const isPreviewMode = () => {
    return (
      typeof window !== 'undefined' &&
      (window.location.hostname === 'localhost' || window.location.hostname.includes('vercel.app'))
    );
  };

  const login = async (email: string, password: string) => {
    console.log('Login function called');
    setIsLoading(true);
    try {
      if (isPreviewMode()) {
        console.log('Using preview mode login');
        // Simulate login delay
        await new Promise((resolve) => setTimeout(resolve, 800));
        
        const mockUser = {
          id: 'user123',
          firstName: 'Demo',
          lastName: 'User',
          email,
        };
        
        setUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
        return;
      }
      
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Login failed');
      }
      
      const data = await response.json();
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
    } catch (error) {
      console.error('Login error:', error);
      
      // If in preview mode, create a mock user anyway
      if (isPreviewMode()) {
        console.log('Falling back to preview mode login');
        const mockUser = {
          id: 'user123',
          firstName: 'Demo',
          lastName: 'User',
          email,
        };
        
        setUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
        return;
      }
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any) => {
    console.log('Register function called');
    setIsLoading(true);
    try {
      if (isPreviewMode()) {
        // Simulate registration delay
        await new Promise((resolve) => setTimeout(resolve, 800));
        return;
      }
      
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        throw new Error('Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      
      // If in preview mode, just return success
      if (isPreviewMode()) {
        return;
      }
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    console.log('Logout function called');
    setUser(null);
    localStorage.removeItem('user');
  };

  const contextValue = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isLoading,
  };

  console.log('AuthProvider rendering with context:', contextValue);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};