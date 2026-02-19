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
  firstName?: string;
  lastName?: string;
  role: string;
  email: string;
  mobileNumber?: string;
  mobile?: string;
  joined?: string;
  lastLogin?: string;
  accessToken: string;
  refreshToken: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (userData: any) => Promise<boolean>;
  logout: () => void;
  switchUserRole: (role: string) => Promise<boolean>;
  isLoading: boolean;
}

import { useAuthAPIs } from '../../helpers/hooks/authAPIs/useAuthAPIs';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { switchRole: switchRoleApi, logout: logoutApi } = useAuthAPIs();

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
      let refreshToken = user?.refreshToken;

      if (!refreshToken) {
        const userStr = await AsyncStorage.getItem('user');
        if (userStr) {
          const userData = JSON.parse(userStr);
          refreshToken = userData.refreshToken;
        }
      }

      if (refreshToken) {
        await new Promise<void>(resolve => {
          logoutApi(
            refreshToken!,
            () => resolve(),
            err => {
              console.error('Logout API failed', err);
              resolve();
            },
          );
        });
      }

      await AsyncStorage.removeItem('user');
      setIsLoggedIn(false);
      setUser(null);
    } catch (e) {
      console.error('Error clearing auth state:', e);
      // Ensure cleanup happens even if error
      await AsyncStorage.removeItem('user');
      setIsLoggedIn(false);
      setUser(null);
    }
  };
  const switchUserRole = async (role: string): Promise<boolean> => {
    return new Promise(resolve => {
      switchRoleApi(
        { roleName: role },
        async response => {
          if (response.success) {
            const updatedUser = {
              ...user,
              ...response.data,
              token: response.data.accessToken, // matching headers.ts requirement
              role: response.data.activeRole,
            };
            await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser as User);
            resolve(true);
          } else {
            Alert.alert('Error', response.message || 'Failed to switch role');
            resolve(false);
          }
        },
        error => {
          Alert.alert(
            'Error',
            error?.response?.data?.message || 'Something went wrong',
          );
          resolve(false);
        },
      );
    });
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        login,
        logout,
        switchUserRole,
        isLoading,
      }}
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
