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
  onOpenLoginModal?: () => void;
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
  ChevronDown,
} from 'lucide-react-native';

import Svg, { Circle, Path } from 'react-native-svg';

const ListPropertyIcon = () => (
  <Svg width="32" height="32" viewBox="0 0 38 38" fill="none">
    <Circle cx="19" cy="19" r="19" fill="#EE2529" />
    <Path
      d="M18.9985 11V19.808M18.9985 28.41V19.808M18.9985 19.808H27.41M18.9985 19.808H10"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </Svg>
);

const SideMenu: React.FC<SideMenuProps> = ({
  visible,
  onClose,
  isLoggedIn,
  user,
  onLoginClick,
  onLogoutClick,
  onOpenLoginModal,
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
                    navigate('/my-prifile');
                    onClose();
                  }}
                >
                  <View style={[styles.profileCircle, styles.menuAvatar]}>
                    {user?.profilePhoto || user?.profileImage ? (
                      <Image
                        source={{
                          uri: (user.profilePhoto ||
                            user.profileImage) as string,
                        }}
                        style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: 22,
                        }}
                      />
                    ) : (
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
                    )}
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
              {/* {user?.role && 
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  navigate('/my-prifile');
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
              } */}
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
                    onOpenLoginModal?.();
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
  const { navigate, currentPath, openLoginModal } = useNavigation();
  const { isLoggedIn, user, logout } = useAuth();
  const [isLogoutMenuVisible, setIsLogoutMenuVisible] = useState(false);
  const isMobile = width < 768;

  return (
    <View style={styles.headerContainer}>
      <View
        style={[
          styles.headerContent,
          isMobile
            ? { paddingLeft: 0, paddingRight: 60 }
            : { paddingLeft: 60, paddingRight: 80 },
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
              <Text
                style={[
                  styles.navLinkText,
                  currentPath === '/explore-properties' && styles.navLinkActive,
                ]}
              >
                Explore Properties
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigate('/calculators')}>
              <Text
                style={[
                  styles.navLinkText,
                  currentPath === '/calculators' && styles.navLinkActive,
                ]}
              >
                Calculators
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigate('/explore-brokers')}>
              <Text
                style={[
                  styles.navLinkText,
                  currentPath === '/explore-brokers' && styles.navLinkActive,
                ]}
              >
                Explore Brokers
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={[styles.headerActions, isMobile && { gap: 8 }]}>
          {/* {isLoggedIn && user?.role === 'Owner' && (
            <TouchableOpacity
              style={styles.notificationBtn}
              onPress={() => navigate('/my-notes')}
            >
              <MessageSquare size={22} color={COLORS.primary} />
            </TouchableOpacity>
          )} */}

          {isLoggedIn ? (
            <TouchableOpacity
              style={[styles.profileBtn, isMobile && styles.profileBtnMobile]}
              onPress={() => setIsLogoutMenuVisible(!isLogoutMenuVisible)}
            >
              <View style={styles.profileCircle}>
                {user?.profilePhoto || user?.profileImage ? (
                  <Image
                    source={{
                      uri: (user.profilePhoto || user.profileImage) as string,
                    }}
                    style={{ width: '100%', height: '100%', borderRadius: 17 }}
                  />
                ) : (
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
                )}
              </View>
              <ChevronDown size={18} color={COLORS.primary} strokeWidth={3} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.signInBtn} onPress={openLoginModal}>
              <Text style={styles.signInText}>Sign In</Text>
            </TouchableOpacity>
          )}

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
            <ListPropertyIcon  />
            {!isMobile && (
              <Text style={styles.listPropertyText}>List Property</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuBtn} onPress={onMenuPress}>
            <Menu size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Logout Popover */}
      <Modal
        visible={isLogoutMenuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsLogoutMenuVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsLogoutMenuVisible(false)}>
          <View style={styles.popoverOverlay}>
            <TouchableWithoutFeedback>
              <View
                style={[
                  styles.logoutPopover,
                  { right: isMobile ? '5%' : '5%', top: 75 },
                ]}
              >
                <TouchableOpacity
                  style={styles.popoverItem}
                  onPress={() => {
                    setIsLogoutMenuVisible(false);
                    navigate('/my-prifile');
                  }}
                >
                  <UserIcon size={18} color="#666" />
                  <Text style={styles.popoverText}>My Profile</Text>
                </TouchableOpacity>

                <View style={styles.popoverDivider} />

                <TouchableOpacity
                  style={styles.popoverItem}
                  onPress={() => {
                    setIsLogoutMenuVisible(false);
                    logout();
                  }}
                >
                  <LogOut size={18} color={COLORS.primary} />
                  <Text style={[styles.popoverText, { color: COLORS.primary }]}>
                    Logout
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLoggedIn, user, logout } = useAuth();
  const { navigate, openLoginModal } = useNavigation();

  const handleLoginClick = () => {
    setIsMenuOpen(false);
    openLoginModal();
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
        onOpenLoginModal={openLoginModal}
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
    backgroundColor: 'rgba(255, 255, 255, 0.10)', // Reduced opacity from 0.75
    borderWidth: 1,
    borderColor: 'rgba(230, 230, 230, 0.2)',
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
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        transition: 'all 0.3s ease',
      } as any,
    }),
  },
  headerContainerHover: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)', // Reduced opacity from 0.35
    borderColor: 'rgba(230, 230, 230, 0.4)',
    shadowOpacity: 0.2,
    shadowRadius: 15,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(25px)',
        WebkitBackdropFilter: 'blur(25px)',
        transform: 'translateY(-2px)',
      } as any,
    }),
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 1800,
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
    gap: 50,
  },
  navLinkText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#262626',
  },
  navLinkActive: {
    color: '#EE2529',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#262626',
    borderRadius: 30,
    paddingHorizontal: 5,
    paddingVertical: 2.5,
    height: 40,
    paddingRight: 15
  },
  listPropertyText: {
    fontWeight: '400',
    color: '#262626',
    fontSize: 16,
    marginLeft: 8,
  },
  menuBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF0F0',
    alignItems: 'center',
    justifyContent: 'center',
    // marginLeft: 10,
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
    gap: 8,
    padding: 3,
    paddingRight: 10,
    borderRadius: 30,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#262626',
    height: 40,
  },
  profileBtnMobile: {
    paddingRight: 3,
  },
  profileCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#888',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  profileName: {
    fontSize: 14,
    fontWeight: '400',
    color: '#262626',
  },
  profileInitials: {
    fontSize: 14,
    fontWeight: '400',
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
  popoverOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  logoutPopover: {
    position: 'absolute',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    width: 180,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  popoverItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
    borderRadius: 8,
  },
  popoverText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
  },
  popoverDivider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 4,
  },
});

export default Layout;
