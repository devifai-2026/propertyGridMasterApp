import React, { ReactNode, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
  Alert,
  Image,
} from 'react-native';
import { useNavigation } from '../context/NavigationContext';
import { useAuth } from '../context/AuthContext';
import Footer from './Footer';

// --- Components ---

interface SideMenuProps {
  visible: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
  onLoginClick: () => void;
  onLogoutClick: () => void;
}

import {
  X,
  Menu,
  Home,
  Calculator,
  Users,
  LogOut,
  LogIn,
  Building2,
  TrendingUp,
} from 'lucide-react-native';

const SideMenu: React.FC<SideMenuProps> = ({
  visible,
  onClose,
  isLoggedIn,
  onLoginClick,
  onLogoutClick,
}) => {
  const { height } = useWindowDimensions();
  const { navigate } = useNavigation();

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none" // Custom animation could be added here
      onRequestClose={onClose}
    >
      <View style={styles.menuOverlay}>
        <TouchableOpacity
          style={styles.menuBackdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={[styles.menuContainer, { height }]}>
          <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.menuHeader}>
              <Image
                source={require('../assets/Navbar/Preleasegrid logo 1.png')}
                style={{ width: 150, height: 45 }}
                resizeMode="contain"
              />
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <X size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.menuItems}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  navigate('/explore-properties');
                  onClose();
                }}
              >
                <Building2 size={20} color="#666" style={styles.menuItemIcon} />
                <Text style={styles.menuItemText}>Explore Properties</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  navigate('/calculators');
                  onClose();
                }}
              >
                <Calculator
                  size={20}
                  color="#666"
                  style={styles.menuItemIcon}
                />
                <Text style={styles.menuItemText}>Calculators</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  navigate('/explore-brokers');
                  onClose();
                }}
              >
                <Users size={20} color="#666" style={styles.menuItemIcon} />
                <Text style={styles.menuItemText}>Explore Brokers</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  navigate('/investors');
                  onClose();
                }}
              >
                <TrendingUp
                  size={20}
                  color="#666"
                  style={styles.menuItemIcon}
                />
                <Text style={styles.menuItemText}>Investors</Text>
              </TouchableOpacity>
              {isLoggedIn && (
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    navigate('/investors');
                    onClose();
                  }}
                >
                  <TrendingUp
                    size={20}
                    color="#666"
                    style={styles.menuItemIcon}
                  />
                  <Text style={styles.menuItemText}>My Investment</Text>
                </TouchableOpacity>
              )}
            </ScrollView>

            <View>
              <View style={styles.divider} />
              {isLoggedIn ? (
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    onLogoutClick();
                    onClose();
                  }}
                >
                  <LogOut
                    size={20}
                    color="#D32F2F"
                    style={styles.menuItemIcon}
                  />
                  <Text style={[styles.menuItemText, { color: '#D32F2F' }]}>
                    Log Out
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    onLoginClick();
                    onClose();
                  }}
                >
                  <LogIn
                    size={20}
                    color="#D32F2F"
                    style={styles.menuItemIcon}
                  />
                  <Text style={[styles.menuItemText, { color: '#D32F2F' }]}>
                    Sign In
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </SafeAreaView>
        </View>
      </View>
    </Modal>
  );
};

const Header = ({ onMenuPress }: { onMenuPress: () => void }) => {
  const { width } = useWindowDimensions();
  const { navigate } = useNavigation();
  const isMobile = width < 768;
  return (
    <View style={styles.headerContainer}>
      <View
        style={[
          styles.headerContent,
          { paddingHorizontal: isMobile ? 20 : 60 },
        ]}
      >
        <TouchableOpacity
          style={styles.logoContainer}
          onPress={() => navigate('/dashboard')}
        >
          <Image
            source={require('../assets/Navbar/Preleasegrid logo 1.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {!isMobile && (
          <View style={styles.navLinks}>
            <TouchableOpacity onPress={() => navigate('/explore-properties')}>
              <Text style={styles.navLinkText}>Explore Properties</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigate('/calculators')}>
              <Text style={styles.navLinkText}>Calculators</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigate('/explore-brokers')}>
              <Text style={styles.navLinkText}>Explore Brokers</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigate('/investors')}>
              <Text style={styles.navLinkText}>Investors</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[
              styles.listPropertyBtn,
              isMobile && {
                borderWidth: 0,
                paddingRight: 0,
                paddingLeft: 0,
                paddingVertical: 0,
              },
            ]}
            onPress={() => navigate('/list-property')}
          >
            <View style={[styles.plusIconBg, isMobile && { marginRight: 0 }]}>
              <Text style={styles.plusIcon}>+</Text>
            </View>
            {!isMobile && (
              <Text style={styles.listPropertyText}>List Property</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuBtn} onPress={onMenuPress}>
            <Menu size={24} color="#D32F2F" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLoggedIn, logout } = useAuth();
  const { navigate } = useNavigation();

  const handleLoginClick = () => {
    setIsMenuOpen(false);
    navigate('/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Header onMenuPress={() => setIsMenuOpen(true)} />

      <SideMenu
        visible={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        isLoggedIn={isLoggedIn}
        onLoginClick={handleLoginClick}
        onLogoutClick={logout}
      />

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: 100 }]}
      >
        {children}
        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
  },
  // Header Styles
  headerContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    borderWidth: 1,
    borderColor: 'rgba(230, 230, 230, 0.4)',
    height: 70,
    justifyContent: 'center',
    zIndex: 1000,
    position: 'absolute',
    top: 15,
    left: '4%',
    right: '4%',
    borderRadius: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      },
    }),
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 1440,
    alignSelf: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    height: 48,
    width: 140,
  },
  navLinks: {
    flexDirection: 'row',
    gap: 30,
  },
  navLinkText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  signInBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  signInText: {
    fontWeight: '600',
    color: '#333',
  },
  listPropertyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 25,
    paddingLeft: 4,
    paddingRight: 16,
    paddingVertical: 6,
  },
  plusIconBg: {
    backgroundColor: '#D32F2F',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  plusIcon: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  listPropertyText: {
    fontWeight: '600',
    color: '#333',
  },
  menuBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    borderWidth: 1,
    borderColor: 'rgba(238, 37, 41, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  menuIcon: {
    color: '#D32F2F',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  modalHeader: {
    marginBottom: 30,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  dummyInfo: {
    backgroundColor: '#F8F9FA',
    padding: 15,
    borderRadius: 8,
    marginBottom: 30,
  },
  dummyTitle: {
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
    fontSize: 14,
  },
  dummyText: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 15,
  },
  btnOutline: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  btnOutlineText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  btnFilled: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#D32F2F',
    alignItems: 'center',
  },
  btnFilledText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  // Side Menu Styles
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
      },
    }),
  },
  menuBackdrop: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  menuContainer: {
    width: '85%',
    maxWidth: 320,
    backgroundColor: '#fff',
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: -5, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
    marginTop: Platform.OS === 'ios' ? 20 : 10,
  },
  menuTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  closeBtn: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  menuItems: {
    gap: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  menuItemIcon: {
    marginRight: 16,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 16,
  },
});

export default Layout;
