import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  userId: string;
  name: string;
  role: string;
  email: string;
  accessToken: string;
  refreshToken: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (userData: any) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const userStr = await AsyncStorage.getItem('user');
        if (userStr !== null) {
          const userData = JSON.parse(userStr);
          setIsLoggedIn(true);
          setUser(userData);
        }
      } catch (e) {
        console.error('Error reading auth state:', e);
      } finally {
        setIsLoading(false);
      }
    };
    checkLogin();
  }, []);

  const login = async (userData: any): Promise<boolean> => {
    try {
      // Map token to 'token' for headers.ts compatibility if needed,
      // but we'll also update headers.ts or just rely on storing the whole object
      const userToStore = {
        ...userData,
        token: userData.accessToken, // for backward compatibility with headers.ts
      };
      await AsyncStorage.setItem('user', JSON.stringify(userToStore));
      setIsLoggedIn(true);
      setUser(userToStore);
      return true;
    } catch (e) {
      console.error('Error saving auth state:', e);
      return false;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setIsLoggedIn(false);
      setUser(null);
    } catch (e) {
      console.error('Error clearing auth state:', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, user, login, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
