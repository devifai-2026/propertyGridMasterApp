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
  name: string;
  role: string;
  email: string;
  mobile: string;
  joined: string;
  lastLogin: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (phone: string) => Promise<boolean>;
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
        const phone = await AsyncStorage.getItem('userPhone');
        if (phone !== null) {
          setIsLoggedIn(true);
          // Restore mock user
          setUser({
            name: 'Rohit Sharma',
            role: 'Investor',
            email: 'rohit.sharma@example.com',
            mobile: phone,
            joined: '26 Aug 2025',
            lastLogin: '13 Aug 2025',
          });
        }
      } catch (e) {
        // error reading value
      } finally {
        setIsLoading(false);
      }
    };
    checkLogin();
  }, []);

  const login = async (phone: string): Promise<boolean> => {
    if (['9999999991', '9999999992', '9999999993'].includes(phone)) {
      try {
        await AsyncStorage.setItem('userPhone', phone);
        setIsLoggedIn(true);
        setUser({
          name: 'Rohit Sharma',
          role: 'Investor',
          email: 'rohit.sharma@example.com',
          mobile: phone,
          joined: '26 Aug 2025',
          lastLogin: new Date().toDateString(),
        });
        return true;
      } catch (e) {
        // saving error
        return false;
      }
    } else {
      Alert.alert(
        'Error',
        'Invalid dummy credential. Use 9999999991, 9999999992, or 9999999993',
      );
      return false;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userPhone');
      setIsLoggedIn(false);
      setUser(null);
    } catch (e) {
      // remove error
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
