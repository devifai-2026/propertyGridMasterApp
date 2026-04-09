import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  useWindowDimensions,
  Modal,
  TextInput,
  ActivityIndicator,
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
  CheckCircle2,
} from 'lucide-react-native';
import { Alert } from 'react-native';
import Layout from '../../layout/Layout';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '../../context/NavigationContext';
import { useAuthAPIs } from '../../../helpers/hooks/authAPIs/useAuthAPIs';
import { COLORS } from '../../constants/theme';

const ProfileScreen = () => {
  const { user, login, logout, switchUserRole, isLoggedIn, isLoading } =
    useAuth();
  const { navigate } = useNavigation();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  const [isMobileModalVisible, setMobileModalVisible] = useState(false);
  const [mobileStep, setMobileStep] = useState<'phone' | 'otp'>('phone');
  const [newMobile, setNewMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [switchingToRole, setSwitchingToRole] = useState<string | null>(null);
  const [verificationId, setVerificationId] = useState('');
  const [mobileApiError, setMobileApiError] = useState('');
  const [availableRoles, setAvailableRoles] = useState<string[]>([]);
  const {
    sendOtp,
    changeMobile,
    getAvailableRoles,
    loading: apiLoading,
  } = useAuthAPIs();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      navigate('/login');
    } else if (isLoggedIn) {
      // Fetch available roles for switching
      getAvailableRoles((res: any) => {
        if (res.success && Array.isArray(res.data)) {
          setAvailableRoles(res.data);
        }
      });
    }
  }, [isLoggedIn, isLoading, navigate]);

  if (isLoading || !isLoggedIn) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSwitchRole = async (role: string) => {
    if (role === user?.role || switchingToRole) return;

    setSwitchingToRole(role);
    const success = await switchUserRole(role);
    setSwitchingToRole(null);
    if (success) {
      Alert.alert('Success', `Switched to ${role} role`);
    }
  };

  const handleSendOtp = () => {
    setMobileApiError('');
    if (newMobile.length !== 10) {
      setMobileApiError('Please enter a valid 10-digit mobile number');
      return;
    }
    if (newMobile === user?.mobileNumber) {
      setMobileApiError('New number must be different from current number');
      return;
    }
    sendOtp(
      { mobileNumber: newMobile },
      (res: any) => {
        if (res.success && res.data?.verificationId) {
          setVerificationId(res.data.verificationId);
          setMobileStep('otp');
          setMobileApiError('');
        } else {
          setMobileApiError(res.message || 'Failed to send OTP');
        }
      },
      (err: any) => {
        setMobileApiError(err?.response?.data?.message || 'Failed to send OTP');
      },
    );
  };

  const handleChangeMobile = () => {
    setMobileApiError('');
    if (otp.length < 6) {
      setMobileApiError('Please enter a valid OTP');
      return;
    }
    changeMobile(
      { newMobileNumber: newMobile, otp, verificationId },
      async (res: any) => {
        if (res.success) {
          Alert.alert('Success', 'Mobile number updated successfully');
          setMobileModalVisible(false);
          setMobileStep('phone');
          setNewMobile('');
          setOtp('');
          setMobileApiError('');

          if (user && login) {
            const updatedUser = {
              ...user,
              mobileNumber: res.data.mobileNumber || newMobile,
              accessToken: res.data.accessToken || user.accessToken,
              refreshToken: res.data.refreshToken || user.refreshToken,
              token: res.data.accessToken || user.accessToken,
            };
            await login(updatedUser);
          }
        } else {
          setMobileApiError(res.message || 'Failed to update mobile number');
        }
      },
      (err: any) => {
        setMobileApiError(
          err?.response?.data?.message || 'Failed to update mobile number',
        );
      },
    );
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
            <Text style={styles.userName}>
              {(user?.name || '')
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ')}
            </Text>
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
                onPress={() => {
                  setMobileStep('phone');
                  setNewMobile('');
                  setOtp('');
                  setMobileApiError('');
                  setMobileModalVisible(true);
                }}
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

          {/* Role Switcher Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Switch Role</Text>
            <View style={styles.card}>
              {availableRoles.length > 0 ? (
                availableRoles.map((role, index) => (
                  <React.Fragment key={role}>
                    <TouchableOpacity
                      style={[
                        styles.profileItem,
                        user?.role === role && styles.activeRoleItem,
                        switchingToRole && { opacity: 0.7 }
                      ]}
                      onPress={() => handleSwitchRole(role)}
                      disabled={!!switchingToRole}
                    >
                      <View style={styles.itemLeft}>
                        <View
                          style={[
                            styles.iconContainer,
                            user?.role === role && {
                              backgroundColor: COLORS.lightRed,
                            },
                          ]}
                        >
                          <Shield
                            size={20}
                            color={user?.role === role ? COLORS.primary : '#666'}
                          />
                        </View>
                        <View>
                          <Text
                            style={[
                              styles.itemValue,
                              user?.role === role && { color: COLORS.primary },
                            ]}
                          >
                            {role}
                          </Text>
                          {user?.role === role && (
                            <Text style={styles.activeLabel}>Active</Text>
                          )}
                        </View>
                      </View>
                      {user?.role === role && !switchingToRole && (
                        <View style={styles.activeDot} />
                      )}
                      {switchingToRole === role && (
                        <ActivityIndicator size="small" color={COLORS.primary} />
                      )}
                    </TouchableOpacity>
                    {index < availableRoles.length - 1 && (
                      <View style={styles.divider} />
                    )}
                  </React.Fragment>
                ))
              ) : (
                <View style={{ padding: 20 }}>
                  <Text style={{ color: '#999', textAlign: 'center' }}>
                    No other roles available for this number
                  </Text>
                </View>
              )}
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

      {/* Change Mobile Modal */}
      <Modal
        visible={isMobileModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMobileModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Change Mobile Number</Text>

            {mobileStep === 'phone' ? (
              <>
                <Text style={styles.modalLabel}>New Mobile Number</Text>
                <TextInput
                  style={styles.modalInput}
                  value={newMobile}
                  onChangeText={setNewMobile}
                  keyboardType="phone-pad"
                  maxLength={10}
                  placeholder="Enter 10-digit number"
                />
                {mobileApiError ? (
                  <Text style={styles.errorText}>{mobileApiError}</Text>
                ) : null}
                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={[styles.modalBtn, styles.modalCancelBtn]}
                    onPress={() => setMobileModalVisible(false)}
                  >
                    <Text style={styles.modalCancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalBtn, styles.modalPrimaryBtn]}
                    onPress={handleSendOtp}
                    disabled={apiLoading}
                  >
                    {apiLoading ? (
                      <ActivityIndicator color="#FFF" size="small" />
                    ) : (
                      <Text style={styles.modalPrimaryText}>Send OTP</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <Text style={styles.modalLabel}>Enter OTP</Text>
                <TextInput
                  style={styles.modalInput}
                  value={otp}
                  onChangeText={setOtp}
                  keyboardType="number-pad"
                  maxLength={6}
                  placeholder="Enter 6-digit OTP"
                />
                {mobileApiError ? (
                  <Text style={styles.errorText}>{mobileApiError}</Text>
                ) : null}
                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={[styles.modalBtn, styles.modalCancelBtn]}
                    onPress={() => {
                      setMobileStep('phone');
                      setMobileApiError('');
                    }}
                  >
                    <Text style={styles.modalCancelText}>Back</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalBtn, styles.modalPrimaryBtn]}
                    onPress={handleChangeMobile}
                    disabled={apiLoading}
                  >
                    {apiLoading ? (
                      <ActivityIndicator color="#FFF" size="small" />
                    ) : (
                      <Text style={styles.modalPrimaryText}>
                        Verify & Update
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
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
    maxWidth: '80%',
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
  activeRoleItem: {
    backgroundColor: '#FDF2F2',
  },
  activeLabel: {
    fontSize: 10,
    color: COLORS.primary,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 20,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: COLORS.textDark,
    marginBottom: 24,
    backgroundColor: '#F9FAFB',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCancelBtn: {
    backgroundColor: '#F3F4F6',
  },
  modalPrimaryBtn: {
    backgroundColor: COLORS.primary,
    minWidth: 120,
  },
  modalCancelText: {
    color: '#4B5563',
    fontWeight: '600',
    fontSize: 15,
  },
  modalPrimaryText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 15,
  },
  errorText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default ProfileScreen;
