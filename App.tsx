import React from 'react';
import { View, Text } from 'react-native';
import Dashboard from './src/screens/dashboard/Dashboard';
import LoginScreen from './src/screens/auth/LoginScreen';
import {
  NavigationProvider,
  useNavigation,
} from './src/context/NavigationContext';
import { AuthProvider } from './src/context/AuthContext';

const AppContent = () => {
  const { currentPath } = useNavigation();

  // Simple Router Switch
  const renderScreen = () => {
    switch (currentPath) {
      case '/dashboard':
        return <Dashboard />;
      case '/login':
        return <LoginScreen />;
      default:
        // Default redirection to /dashboard
        return <Dashboard />;
    }
  };

  return <>{renderScreen()}</>;
};

const App = () => {
  return (
    <AuthProvider>
      <NavigationProvider>
        <AppContent />
      </NavigationProvider>
    </AuthProvider>
  );
};

export default App;
