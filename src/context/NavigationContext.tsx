import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import { Platform } from 'react-native';

declare const window: any;

interface NavigationContextType {
  currentPath: string;
  navigate: (path: string) => void;
  goBack: () => void;
  showLoginModal: boolean;
  showSignupModal: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  openSignupModal: () => void;
  closeSignupModal: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(
  undefined,
);

export const NavigationProvider = ({ children }: { children: ReactNode }) => {
  const isWeb = Platform.OS === 'web';

  const [currentPath, setCurrentPath] = useState(() => {
    if (isWeb && typeof window !== 'undefined') {
      return window.location.pathname === '/'
        ? '/dashboard'
        : window.location.pathname;
    }
    return '/dashboard';
  });

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  const openLoginModal = () => setShowLoginModal(true);
  const closeLoginModal = () => setShowLoginModal(false);
  const openSignupModal = () => setShowSignupModal(true);
  const closeSignupModal = () => setShowSignupModal(false);

  const navigate = (path: string) => {
    setCurrentPath(path);
    if (isWeb && typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
    }
  };

  const goBack = () => {
    if (isWeb && typeof window !== 'undefined') {
      window.history.back();
    }
    // For mobile/simple implementation, we might need a history stack, but for now focus on web behavior or no-op
  };

  useEffect(() => {
    if (isWeb && typeof window !== 'undefined') {
      const handlePopState = () => {
        setCurrentPath(window.location.pathname);
      };

      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
    }
  }, [isWeb]);

  return (
    <NavigationContext.Provider value={{ currentPath, navigate, goBack, showLoginModal, showSignupModal, openLoginModal, closeLoginModal, openSignupModal, closeSignupModal }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};
