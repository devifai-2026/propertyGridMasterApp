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
import { COLORS } from '../constants/theme';

// --- Components ---

interface SideMenuProps {
  visible: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
  user: any;
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
  User as UserIcon,
  LogIn,
  Building2,
  TrendingUp,
  LifeBuoy,
  HelpCircle,
  Mail,
  LayoutDashboard,
  Bell,
  MessageSquare,
} from 'lucide-react-native';

const SideMenu: React.FC<SideMenuProps> = ({
  visible,
  onClose,
  isLoggedIn,
  user,
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
              {isLoggedIn ? (
                <TouchableOpacity
                  style={styles.menuUserInfo}
                  onPress={() => {
                    navigate('/my-profile');
                    onClose();
                  }}
                >
                  <View style={[styles.profileCircle, styles.menuAvatar]}>
                    <Text style={styles.menuAvatarText}>
                      {user?.name
                        ? user.name
                            .split(' ')
                            .map((n: string) => n[0])
                            .join('')
                            .toUpperCase()
                            .slice(0, 2)
                        : 'U'}
                    </Text>
                  </View>
                  <View style={styles.menuUserDetails}>
                    <Text style={styles.menuUserName}>
                      {user?.name || 'User'}
                    </Text>
                    <Text style={styles.menuUserRole}>
                      {user?.role || 'Investor'}
                    </Text>
                  </View>
                </TouchableOpacity>
              ) : (
                <Image
                  source={require('../assets/Navbar/Preleasegrid logo 1.png')}
                  style={{ width: 150, height: 45 }}
                  resizeMode="contain"
                />
              )}
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <X size={24} color={COLORS.textDark} />
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
                <Building2
                  size={20}
                  color={COLORS.textSecondary}
                  style={styles.menuItemIcon}
                />
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
                  color={COLORS.textSecondary}
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
                <Users
                  size={20}
                  color={COLORS.textSecondary}
                  style={styles.menuItemIcon}
                />
                <Text style={styles.menuItemText}>Explore Brokers</Text>
              </TouchableOpacity>
              {user?.role && 
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  navigate('/investors');
                  onClose();
                }}
              >
                <TrendingUp
                  size={20}
                  color={COLORS.textSecondary}
                  style={styles.menuItemIcon}
                />
                <Text style={styles.menuItemText}>
                  {user?.role || 'Investors'}
                </Text>
              </TouchableOpacity>
              }
              {/* {isLoggedIn && user?.role === 'Owner' && (
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    navigate('/my-notes');
                    onClose();
                  }}
                >
                  <MessageSquare
                    size={20}
                    color={COLORS.textSecondary}
                    style={styles.menuItemIcon}
                  />
                  <Text style={styles.menuItemText}>My Notes</Text>
                </TouchableOpacity>
              )} */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  navigate('/support');
                  onClose();
                }}
              >
                <LifeBuoy
                  size={20}
                  color={COLORS.textSecondary}
                  style={styles.menuItemIcon}
                />
                <Text style={styles.menuItemText}>Contact Support</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  navigate('/how-it-works');
                  onClose();
                }}
              >
                <HelpCircle
                  size={20}
                  color={COLORS.textSecondary}
                  style={styles.menuItemIcon}
                />
                <Text style={styles.menuItemText}>How It Works</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  navigate('/contact-us');
                  onClose();
                }}
              >
                <Mail
                  size={20}
                  color={COLORS.textSecondary}
                  style={styles.menuItemIcon}
                />
                <Text style={styles.menuItemText}>Contact Us</Text>
              </TouchableOpacity>
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
                    color={COLORS.primary}
                    style={styles.menuItemIcon}
                  />
                  <Text
                    style={[styles.menuItemText, { color: COLORS.primary }]}
                  >
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
                    color={COLORS.primary}
                    style={styles.menuItemIcon}
                  />
                  <Text
                    style={[styles.menuItemText, { color: COLORS.primary }]}
                  >
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
  const { isLoggedIn, user } = useAuth();
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
            style={styles.logoImage}
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
            {user?.role && 
              <TouchableOpacity onPress={() => navigate('/investors')}>
                <Text style={styles.navLinkText}>{user?.role || 'Investors'}</Text>
              </TouchableOpacity>
            }
          </View>
        )}

        <View style={styles.headerActions}>
          {/* {isLoggedIn && user?.role === 'Owner' && (
            <TouchableOpacity
              style={styles.notificationBtn}
              onPress={() => navigate('/my-notes')}
            >
              <MessageSquare size={22} color={COLORS.primary} />
            </TouchableOpacity>
          )} */}

          {isLoggedIn && (
            <TouchableOpacity
              style={[styles.profileBtn, isMobile && styles.profileBtnMobile]}
              onPress={() => navigate('/my-profile')}
            >
              <View style={styles.profileCircle}>
                <Text style={styles.profileInitials}>
                  {user?.name
                    ? user.name
                        .split(' ')
                        .map((n: string) => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)
                    : 'U'}
                </Text>
              </View>
              {!isMobile && (
                <Text style={styles.profileName}>
                  {user?.name?.split(' ')[0]}
                </Text>
              )}
            </TouchableOpacity>
          )}

          {isLoggedIn ? (
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
          ) : (
            <TouchableOpacity
              style={styles.signInBtn}
              onPress={() => navigate('/login')}
            >
              <Text style={styles.signInText}>Sign In</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.menuBtn} onPress={onMenuPress}>
            <Menu size={24} color={COLORS.primary} />
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
  const { isLoggedIn, user, logout } = useAuth();
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
        user={user}
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
    backgroundColor: COLORS.white,
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
  logoImage: {
    height: 48,
    width: 200,
  },
  navLinks: {
    flexDirection: 'row',
    gap: 30,
  },
  navLinkText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textSecondary,
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
    color: COLORS.textDark,
  },
  listPropertyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.textDark,
    borderRadius: 25,
    paddingLeft: 4,
    paddingRight: 16,
    paddingVertical: 6,
  },
  plusIconBg: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  plusIcon: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  listPropertyText: {
    fontWeight: '600',
    color: COLORS.textDark,
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
    backgroundColor: COLORS.white,
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
    color: COLORS.textDark,
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: COLORS.divider,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: COLORS.textDark,
  },
  dummyInfo: {
    backgroundColor: COLORS.background,
    padding: 15,
    borderRadius: 8,
    marginBottom: 30,
  },
  dummyTitle: {
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 8,
    fontSize: 14,
  },
  dummyText: {
    fontSize: 13,
    color: COLORS.textSecondary,
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
    borderColor: COLORS.divider,
    alignItems: 'center',
  },
  btnOutlineText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  btnFilled: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  btnFilledText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
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
    backgroundColor: COLORS.white,
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
    color: COLORS.textDark,
  },
  closeBtn: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: COLORS.background,
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
    backgroundColor: COLORS.white,
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
    backgroundColor: COLORS.divider,
    marginVertical: 16,
  },
  dashboardButton: {
    backgroundColor: COLORS.lightRed,
    marginTop: 10,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  profileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 4,
    paddingRight: 10,
    borderRadius: 20,
    backgroundColor: COLORS.lightRed,
    borderWidth: 1,
    borderColor: 'rgba(211, 47, 47, 0.1)',
  },
  profileBtnMobile: {
    paddingRight: 4,
  },
  profileCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  profileName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
  },
  profileInitials: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.white,
  },
  profileMenuBtn: {
    backgroundColor: COLORS.lightRed,
    marginTop: 12,
  },
  notificationBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.lightRed,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 8,
    fontWeight: '800',
  },
  menuUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  menuAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  menuAvatarText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.white,
  },
  menuUserDetails: {
    flex: 1,
  },
  menuUserName: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  menuUserRole: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
    textTransform: 'uppercase',
  },
});

export default Layout;
