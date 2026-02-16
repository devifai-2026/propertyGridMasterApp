import React from 'react';
import { View, Text } from 'react-native';
import Dashboard from './src/screens/dashboard/Dashboard';
import LoginScreen from './src/screens/auth/LoginScreen';
import ExplorePropertiesScreen from './src/screens/properties/ExplorePropertiesScreen';
import CalculatorsScreen from './src/screens/calculators/CalculatorsScreen';
import ExploreBrokersScreen from './src/screens/brokers/ExploreBrokersScreen';
import InvestorsScreen from './src/screens/investors/InvestorsScreen';
import ListPropertyScreen from './src/screens/list-property/ListPropertyScreen';
import ContactUsScreen from './src/screens/contact-us/ContactUsScreen';
import SupportScreen from './src/screens/support/SupportScreen';
import HowItWorksScreen from './src/screens/how-it-works/HowItWorksScreen';
import {
  NavigationProvider,
  useNavigation,
} from './src/context/NavigationContext';
import { AuthProvider } from './src/context/AuthContext';
import SignupScreen from './src/screens/auth/SignupScreen';
import ProfileScreen from './src/screens/profile/ProfileScreen';
import NotificationsScreen from './src/screens/notifications/NotificationsScreen';
import PropertyComparisonScreen from './src/screens/property-comparison/PropertyComparisonScreen';
import PropertyDetailsScreen from './src/screens/properties/PropertyDetailsScreen';
import EnquiriesScreen from './src/screens/enquiries/EnquiriesScreen';
import BlogsScreen from './src/screens/blogs/BlogsScreen';
import PrivacyPolicyScreen from './src/screens/legal/PrivacyPolicyScreen';
import TermsOfServiceScreen from './src/screens/legal/TermsOfServiceScreen';

const AppContent = () => {
  const { currentPath } = useNavigation();

  // Simple Router Switch
  const renderScreen = () => {
    switch (true) {
      case currentPath === '/dashboard':
      case currentPath === '/':
        return <Dashboard />;
      case currentPath === '/login':
        return <LoginScreen />;
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
      case currentPath.startsWith('/contact-brokers'):
        return <ExploreBrokersScreen />;
      case currentPath === '/investors':
        return <InvestorsScreen />;
      case currentPath === '/list-property':
        return <ListPropertyScreen />;
      case currentPath === '/contact-us':
        return <ContactUsScreen />;
      case currentPath === '/support':
        return <SupportScreen />;
      case currentPath === '/how-it-works':
        return <HowItWorksScreen />;
      case currentPath === '/signup':
        return <SignupScreen />;
      case currentPath === '/my-profile':
        return <ProfileScreen />;
      case currentPath === '/notifications':
        return <NotificationsScreen />;
      case currentPath === '/enquiry':
      case currentPath.startsWith('/enquiry/'):
        return <EnquiriesScreen />;
      case currentPath === '/blogs':
        return <BlogsScreen />;
      case currentPath === '/privacy-policy':
        return <PrivacyPolicyScreen />;
      case currentPath === '/terms-of-service':
        return <TermsOfServiceScreen />;
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
