import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  useWindowDimensions,
} from 'react-native';
import {
  User,
  Mail,
  Shield,
  LogOut,
  ChevronRight,
  Settings,
  Bell,
  Fingerprint,
  Calendar,
  Phone,
} from 'lucide-react-native';
import Layout from '../../layout/Layout';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '../../context/NavigationContext';
import { useEffect } from 'react';
import { COLORS } from '../../constants/theme';

const ProfileScreen = () => {
  const { user, logout, isLoggedIn, isLoading } = useAuth();
  const { navigate } = useNavigation();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, isLoading, navigate]);

  if (isLoading || !isLoggedIn) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const ProfileItem = ({
    Icon,
    label,
    value,
    onPress,
  }: {
    Icon: any;
    label: string;
    value?: string;
    onPress?: () => void;
  }) => (
    <TouchableOpacity
      style={styles.profileItem}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.itemLeft}>
        <View style={styles.iconContainer}>
          <Icon size={20} color="#666" />
        </View>
        <View>
          <Text style={styles.itemLabel}>{label}</Text>
          {value && <Text style={styles.itemValue}>{value}</Text>}
        </View>
      </View>
      {onPress && <ChevronRight size={20} color="#CCC" />}
    </TouchableOpacity>
  );

  return (
    <Layout>
      <View style={styles.container}>
        <View style={[styles.content, isDesktop && styles.desktopContent]}>
          {/* Header Card */}
          <View style={styles.headerCard}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user?.name?.charAt(0) || 'U'}
                </Text>
              </View>
              <TouchableOpacity style={styles.editAvatarBtn}>
                <Settings size={16} color="#FFF" />
              </TouchableOpacity>
            </View>
            <Text style={styles.userName}>{user?.name || 'User'}</Text>
            <View style={styles.roleBadge}>
              <Shield
                size={14}
                color={COLORS.primary}
                style={{ marginRight: 4 }}
              />
              <Text style={styles.roleText}>{user?.role || 'Investor'}</Text>
            </View>
          </View>

          {/* Details Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account Information</Text>
            <View style={styles.card}>
              <ProfileItem
                Icon={User}
                label="Full Name"
                value={user?.name || 'N/A'}
              />
              <View style={styles.divider} />
              <ProfileItem
                Icon={Mail}
                label="Email Address"
                value={user?.email || 'N/A'}
              />
              <View style={styles.divider} />
              <ProfileItem
                Icon={Phone}
                label="Phone Number"
                value={user?.mobileNumber || 'N/A'}
              />
            </View>
          </View>

          {/* Settings Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Settings & Security</Text>
            <View style={styles.card}>
              <ProfileItem
                Icon={Bell}
                label="Notifications"
                onPress={() => navigate('/notifications')}
              />
              <View style={styles.divider} />
              <ProfileItem
                Icon={Fingerprint}
                label="Privacy Policy"
                onPress={() => navigate('/support')}
              />
            </View>
          </View>

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <LogOut
              size={20}
              color={COLORS.primary}
              style={{ marginRight: 10 }}
            />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
    alignItems: 'center',
  },
  content: {
    width: '100%',
    maxWidth: 600,
  },
  desktopContent: {
    paddingVertical: 40,
  },
  headerCard: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 5,
    marginBottom: 30,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.lightRed,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: COLORS.white,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: '800',
    color: COLORS.primary,
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textDark,
    marginBottom: 8,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightRed,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  roleText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
    textTransform: 'uppercase',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: 12,
    marginLeft: 4,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  itemLabel: {
    fontSize: 12,
    color: '#999',
    fontWeight: '600',
    marginBottom: 2,
  },
  itemValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginHorizontal: 16,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.lightRed,
    marginBottom: 40,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
});

export default ProfileScreen;
