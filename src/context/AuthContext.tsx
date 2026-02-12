import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  isLoggedIn: boolean;
  login: (phone: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const value = await AsyncStorage.getItem('userPhone');
        if (value !== null) {
          setIsLoggedIn(true);
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
    } catch (e) {
      // remove error
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, isLoading }}>
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
