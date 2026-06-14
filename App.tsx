import React from 'react';
import { View, Text, Platform } from 'react-native';
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
import BlogDetailScreen from './src/screens/blogs/BlogDetailScreen';
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
    if (Platform.OS === 'web' && typeof window !== 'undefined' && 'navigator' in window) {
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);

      if (typeof window.addEventListener === 'function') {
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        setIsOnline(window.navigator.onLine);

        return () => {
          window.removeEventListener('online', handleOnline);
          window.removeEventListener('offline', handleOffline);
        };
      }
    }
  }, []);

  // Redirect to login if accessing private pages while not logged in
  const privatePages = ['/my-dashboard', '/my-profile'];
  const isPrivate = privatePages.some(page => currentPath.startsWith(page));

  React.useEffect(() => {
    if (!isLoading && isPrivate && !isLoggedIn) {
      navigate('/dashboard');
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

    // Match on the path only — strip any ?query (e.g. /my-dashboard?tab=Broker)
    // so route matching still works while screens can still read the query.
    const path = currentPath.split('?')[0];

    switch (true) {
      case path === '/dashboard':
      case path === '/':
        return <Dashboard />;
      case path.startsWith('/compare/'):
        const ids = path.split('/compare/')[1];
        return <PropertyComparisonScreen propertyIds={ids} />;
      case path === '/explore-properties':
      case path.startsWith('/explore-properties'):
        return <ExplorePropertiesScreen />;
      case path.startsWith('/propertyDetails'):
        return <PropertyDetailsScreen />;
      case path === '/calculators':
        return <CalculatorsScreen />;
      case path === '/explore-brokers':
        return <ExploreBrokersScreen />;
      case path.startsWith('/contact-broker/'):
        return <ContactBrokerScreen />;
      case path === '/my-dashboard':
        return isLoggedIn ? <InvestorsScreen /> : <Dashboard />;
      case path === '/login':
        return <LoginScreen />;
      case path === '/list-property':
      case path.startsWith('/list-property/'):
        return <ListPropertyScreen />;
      case path === '/contact-us':
        return <ContactUsScreen />;
      case path === '/support':
        return <SupportScreen />;
      case path === '/how-it-works':
        return <HowItWorksScreen />;
      case path === '/my-profile':
        return isLoggedIn ? <ProfileScreen /> : <Dashboard />;
      case path === '/notifications':
        return <NotificationsScreen />;
      case path === '/my-notes':
        return <NotesScreen />;
      case path === '/enquiry':
      case path.startsWith('/enquiry/'):
        return <EnquiriesScreen />;
      case path.startsWith('/enquiry-details/'):
        return <EnquiryDetailsScreen />;
      case path.startsWith('/blog/'):
        return <BlogDetailScreen />;
      case path === '/blogs':
        return <BlogsScreen />;
      case path === '/privacy-policy':
        return <PrivacyPolicyScreen />;
      case path === '/terms-of-service':
        return <TermsOfServiceScreen />;
      case path === '/offline':
        return <OfflineScreen />;
      case path === '/error':
        return <ErrorScreen />;
      case path === '/server-error':
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
