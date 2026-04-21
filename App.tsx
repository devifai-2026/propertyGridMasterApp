import React from 'react';
import { View, Text } from 'react-native';
import Dashboard from './src/screens/dashboard/Dashboard';
import LoginScreen from './src/screens/auth/LoginScreen';
import ExplorePropertiesScreen from './src/screens/properties/ExplorePropertiesScreen';
import CalculatorsScreen from './src/screens/calculators/CalculatorsScreen';
import ExploreBrokersScreen from './src/screens/brokers/ExploreBrokersScreen';
import ContactBrokerScreen from './src/screens/brokers/ContactBrokerScreen';
import InvestorsScreen from './src/screens/investors/InvestorsScreen';
import ListPropertyScreen from './src/screens/list-property/ListPropertyScreen';
import ContactUsScreen from './src/screens/contact-us/ContactUsScreen';
import SupportScreen from './src/screens/support/SupportScreen';
import HowItWorksScreen from './src/screens/how-it-works/HowItWorksScreen';
import {
  NavigationProvider,
  useNavigation,
} from './src/context/NavigationContext';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { WishlistProvider } from './src/context/WishlistContext';
import { CompareProvider } from './src/context/CompareContext';
import CompareBanner from './src/screens/dashboard/components/CompareBanner';
import { ActivityIndicator } from 'react-native';
import SignupScreen from './src/screens/auth/SignupScreen';
import ProfileScreen from './src/screens/profile/ProfileScreen';
import NotificationsScreen from './src/screens/notifications/NotificationsScreen';
import PropertyComparisonScreen from './src/screens/property-comparison/PropertyComparisonScreen';
import PropertyDetailsScreen from './src/screens/properties/PropertyDetailsScreen';
import EnquiriesScreen from './src/screens/enquiries/EnquiriesScreen';
import BlogsScreen from './src/screens/blogs/BlogsScreen';
import PrivacyPolicyScreen from './src/screens/legal/PrivacyPolicyScreen';
import TermsOfServiceScreen from './src/screens/legal/TermsOfServiceScreen';
import NotesScreen from './src/screens/notes/NotesScreen';
import EnquiryDetailsScreen from './src/screens/enquiries/EnquiryDetailsScreen';
import NotFoundScreen from './src/screens/not-found/NotFoundScreen';
import OfflineScreen from './src/screens/offline/OfflineScreen';
import ErrorScreen from './src/screens/error/ErrorScreen';
import ServerErrorScreen from './src/screens/error/ServerErrorScreen';

declare const window: any;

const AppContent = () => {
  const {
    currentPath,
    navigate,
    showLoginModal,
    showSignupModal,
    closeLoginModal,
    closeSignupModal,
  } = useNavigation();
  const { isLoggedIn, isLoading } = useAuth();
  const [isOnline, setIsOnline] = React.useState(true);

  React.useEffect(() => {
    // Basic network status detection for Web
    if (typeof window !== 'undefined' && 'navigator' in window) {
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      setIsOnline(window.navigator.onLine);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  // Redirect to login if accessing private pages while not logged in
  const privatePages = ['/my-prifile', '/my-profile'];
  const isPrivate = privatePages.some(page => currentPath.startsWith(page));

  React.useEffect(() => {
    if (!isLoading && isPrivate && !isLoggedIn) {
      navigate('/login');
    }
  }, [currentPath, isLoggedIn, isLoading, isPrivate]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#EE2529" />
      </View>
    );
  }

  // Simple Router Switch
  const renderScreen = () => {
    if (!isOnline) {
      return <OfflineScreen />;
    }

    switch (true) {
      case currentPath === '/dashboard':
      case currentPath === '/':
        return <Dashboard />;
      case currentPath.startsWith('/compare/'):
        const ids = currentPath.split('/compare/')[1];
        return <PropertyComparisonScreen propertyIds={ids} />;
      case currentPath === '/explore-properties':
      case currentPath.startsWith('/explore-properties'):
        return <ExplorePropertiesScreen />;
      case currentPath.startsWith('/propertyDetails'):
        return <PropertyDetailsScreen />;
      case currentPath === '/calculators':
        return <CalculatorsScreen />;
      case currentPath === '/explore-brokers':
        return <ExploreBrokersScreen />;
      case currentPath.startsWith('/contact-broker/'):
        return <ContactBrokerScreen />;
      case currentPath === '/my-prifile':
        return isLoggedIn ? <InvestorsScreen /> : <LoginScreen />;
      case currentPath === '/list-property':
      case currentPath.startsWith('/list-property/'):
        return <ListPropertyScreen />;
      case currentPath === '/contact-us':
        return <ContactUsScreen />;
      case currentPath === '/support':
        return <SupportScreen />;
      case currentPath === '/how-it-works':
        return <HowItWorksScreen />;
      case currentPath === '/my-profile':
        return isLoggedIn ? <ProfileScreen /> : <Dashboard />;
      case currentPath === '/notifications':
        return <NotificationsScreen />;
      case currentPath === '/my-notes':
        return <NotesScreen />;
      case currentPath === '/enquiry':
      case currentPath.startsWith('/enquiry/'):
        return <EnquiriesScreen />;
      case currentPath.startsWith('/enquiry-details/'):
        return <EnquiryDetailsScreen />;
      case currentPath === '/blogs':
        return <BlogsScreen />;
      case currentPath === '/privacy-policy':
        return <PrivacyPolicyScreen />;
      case currentPath === '/terms-of-service':
        return <TermsOfServiceScreen />;
      case currentPath === '/offline':
        return <OfflineScreen />;
      case currentPath === '/error':
        return <ErrorScreen />;
      case currentPath === '/server-error':
        return <ServerErrorScreen />;
      default:
        return <NotFoundScreen />;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {renderScreen()}
      {showLoginModal && <LoginScreen onClose={closeLoginModal} />}
      {showSignupModal && <SignupScreen onClose={closeSignupModal} />}
      <CompareBanner />
    </View>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <NavigationProvider>
        <WishlistProvider>
          <CompareProvider>
            <AppContent />
          </CompareProvider>
        </WishlistProvider>
      </NavigationProvider>
    </AuthProvider>
  );
};

export default App;
