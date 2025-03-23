import { createContext, useState, useContext, ReactNode, useEffect } from 'react';

// User type
export interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
}

// Auth context type
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data (in a real app, this would come from a backend)
const MOCK_USERS = [
  {
    id: '1',
    email: 'user@example.com',
    username: 'testuser',
    password: 'password123',
    avatar: 'https://same-assets.com/vi-assets/static/avatar.jpg',
  },
];

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is logged in from localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('steamshop_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored user data');
        localStorage.removeItem('steamshop_user');
      }
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Find user with matching credentials (mock auth)
      const foundUser = MOCK_USERS.find(
        (u) => u.email === email && u.password === password
      );

      if (foundUser) {
        // Create user object without password
        const { password, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        localStorage.setItem('steamshop_user', JSON.stringify(userWithoutPassword));
        setLoading(false);
        return true;
      } else {
        setError('Invalid email or password');
        setLoading(false);
        return false;
      }
    } catch (err) {
      setError('An error occurred during login');
      setLoading(false);
      return false;
    }
  };

  // Register function
  const register = async (
    username: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Check if email already exists (mock validation)
      if (MOCK_USERS.some((u) => u.email === email)) {
        setError('Email already exists');
        setLoading(false);
        return false;
      }

      // In a real app, we would send this data to a backend
      // Here we'll just simulate a successful registration
      const newUser = {
        id: String(Math.floor(Math.random() * 1000)),
        email,
        username,
        avatar: 'https://same-assets.com/vi-assets/static/avatar.jpg',
      };

      // Add to mock users (this would be done by the backend in reality)
      MOCK_USERS.push({ ...newUser, password });

      // Set the user in state and localStorage
      setUser(newUser);
      localStorage.setItem('steamshop_user', JSON.stringify(newUser));
      setLoading(false);
      return true;
    } catch (err) {
      setError('An error occurred during registration');
      setLoading(false);
      return false;
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('steamshop_user');
  };

  // Context value
  const value = {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    loading,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
