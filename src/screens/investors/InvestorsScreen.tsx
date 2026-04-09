import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import Layout from '../../layout/Layout';
import { Mail, Smartphone, Edit, ArrowRight, User, Lock, ChevronDown, LayoutGrid, List } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../constants/theme';
import PortfolioTab from './components/PortfolioTab';
import EnquiriesTab from './components/EnquiriesTab';
import WishlistTab from './components/WishlistTab';
import { useAuthAPIs } from '../../../helpers/hooks/authAPIs/useAuthAPIs';
import { decodeResponseData } from '../../../helpers/api/decoder';
import { usePropertyAPIs } from '../../../helpers/hooks/propertyAPIs/usePropertyApis';
import PropertyCard, { Property } from '../../components/PropertyCard';

const BrokerTabView = () => {
  const { user } = useAuth();
  const {
    getProperties,
    getBrokerStats,
    loading: propertyLoading,
  } = usePropertyAPIs();
  const [brokerProperties, setBrokerProperties] = useState<Property[]>([]);
  const [stats, setStats] = useState<any>({
    activeDeals: 0,
    conversionRate: '0%',
    activeListings: 0,
  });
  const [dateFilter, setDateFilter] = useState('Last 30 Days');
  const [sortBy, setSortBy] = useState('Date');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const dateOptions = ['Last 7 Days', 'Last 30 Days', 'Last 3 Months', 'Last Year'];
  const [showDateDropdown, setShowDateDropdown] = useState(false);

  const getFromDate = (filter: string) => {
    const now = new Date();
    const days = filter === 'Last 7 Days' ? 7 : filter === 'Last 30 Days' ? 30 : filter === 'Last 3 Months' ? 90 : 365;
    now.setDate(now.getDate() - days);
    return now.toISOString().split('T')[0];
  };

  const fetchProperties = (filter: string, sort: string) => {
    if (!user?.userId) return;
    const fromDate = getFromDate(filter);
    const backendSortBy = sort === 'Price' ? 'sellingPrice' : 'createdAt';
    getProperties(
      (data: any[]) => {
        if (Array.isArray(data)) {
          const formattedProps: Property[] = data.map((item: any) => ({
            id: item.propertyId,
            title: item.propertyType || 'Property',
            location: `${item.microMarket || ''}, ${item.city || ''}`.trim() || 'N/A',
            price: item.sellingPrice ? `₹${item.sellingPrice}` : 'N/A',
            rent: item.annualGrossRent ? `₹${item.annualGrossRent}` : 'N/A',
            tenure: item.leaseEndDate ? `${new Date(item.leaseEndDate).toLocaleDateString()}` : 'N/A',
            roi: item.grossRentalYield ? `${item.grossRentalYield}%` : 'N/A',
            type: item.propertyType || 'N/A',
            images: item.media?.length > 0 ? item.media.map((m: any) => m.fileUrl) : null,
            isVerified: item.isVerified,
            verified: item.isVerified === 'completed',
            badges: item.ownershipType ? [item.ownershipType] : [],
            raw: item,
          }));
          setBrokerProperties(formattedProps);
        }
      },
      undefined,
      `brokerId=${user.userId}&fromDate=${fromDate}&sortBy=${backendSortBy}&sortOrder=DESC`,
    );
  };

  useEffect(() => {
    if (user?.userId) {
      getBrokerStats((data: any) => {
        if (data) setStats(data);
      });
      fetchProperties(dateFilter, sortBy);
    }
  }, [user?.userId]);

  const handleDateFilter = (opt: string) => {
    setDateFilter(opt);
    setShowDateDropdown(false);
    fetchProperties(opt, sortBy);
  };

  const handleSortBy = (next: string) => {
    setSortBy(next);
    fetchProperties(dateFilter, next);
  };

  return (
    <View style={styles.tabContentContainer}>
      <View style={styles.brokerStatsRow}>
        <View style={styles.brokerStatCard}>
          <Text style={styles.brokerStatLabel}>Active Deals</Text>
          <Text style={styles.brokerStatValue}>{stats.activeDeals}</Text>
        </View>
        <View style={styles.brokerStatCard}>
          <Text style={styles.brokerStatLabel}>Conversion Rate</Text>
          <Text style={styles.brokerStatValue}>{stats.conversionRate}</Text>
        </View>
        <View style={styles.brokerStatCard}>
          <Text style={styles.brokerStatLabel}>Active Listings</Text>
          <Text style={styles.brokerStatValue}>{stats.activeListings}</Text>
        </View>
      </View>

      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Properties Listed</Text>
        <View style={styles.filterRow}>
          {/* Date Filter Dropdown */}
          <View style={{ zIndex: 999, overflow: 'visible' }}>
            <TouchableOpacity
              style={styles.dateDropdownBtn}
              onPress={() => setShowDateDropdown(p => !p)}
            >
              <Text style={styles.dateDropdownText}>{dateFilter}</Text>
              <ChevronDown size={14} color="#555" />
            </TouchableOpacity>
            {showDateDropdown && (
              <View style={styles.dropdownMenu}>
                {dateOptions.map(opt => (
                  <TouchableOpacity
                    key={opt}
                    style={styles.dropdownItem}
                    onPress={() => handleDateFilter(opt)}
                  >
                    <Text style={[styles.dropdownItemText, dateFilter === opt && styles.dropdownItemActive]}>
                      {opt}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
          {/* Sort & View */}
          <View style={styles.sortRow}>
            <Text style={styles.sortLabel}>Sort by: </Text>
            <TouchableOpacity onPress={() => handleSortBy(sortBy === 'Date' ? 'Price' : 'Date')}>
              <Text style={styles.sortValue}>{sortBy}</Text>
            </TouchableOpacity>
            <Text style={styles.sortDivider}> | Show as: </Text>
            <TouchableOpacity onPress={() => setViewMode(v => v === 'grid' ? 'table' : 'grid')}>
              {viewMode === 'grid'
                ? <LayoutGrid size={18} color="#EE2529" />
                : <List size={18} color="#EE2529" />
              }
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {propertyLoading ? (
        <ActivityIndicator color={COLORS.primary} size="large" />
      ) : brokerProperties.length > 0 ? (
        viewMode === 'grid' ? (
          <View style={styles.propertiesGrid}>
            {brokerProperties.map(p => (
              <PropertyCard
                key={p.id}
                item={p}
                width={isDesktop ? '48%' : '100%'}
                noView={false}
              />
            ))}
          </View>
        ) : (
          <View style={styles.tableContainer}>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Property</Text>
              <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Location</Text>
              <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Price</Text>
              <Text style={[styles.tableHeaderCell, { flex: 1 }]}>ROI</Text>
              <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Type</Text>
            </View>
            {brokerProperties.map((p, i) => (
              <View key={p.id} style={[styles.tableRow, i % 2 === 1 && styles.tableRowAlt]}>
                <Text style={[styles.tableCell, { flex: 2 }]} numberOfLines={1}>{p.title}</Text>
                <Text style={[styles.tableCell, { flex: 2 }]} numberOfLines={1}>{p.location}</Text>
                <Text style={[styles.tableCell, { flex: 1 }]} numberOfLines={1}>{p.price}</Text>
                <Text style={[styles.tableCellRed, { flex: 1 }]} numberOfLines={1}>{p.roi}</Text>
                <Text style={[styles.tableCell, { flex: 1 }]} numberOfLines={1}>{p.type}</Text>
              </View>
            ))}
          </View>
        )
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>
            No properties listed as a broker.
          </Text>
        </View>
      )}
      <EnquiriesTab roleType="broker" />
    </View>
  );
};

const OwnerTabView = () => {
  return <PortfolioTab />;
};

const InvestorsScreen = () => {
  const { user, updateUser } = useAuth();
  const { getAvailableRoles } = useAuthAPIs();
  const [activeTab, setActiveTab] = useState<
    'Broker' | 'Investor' | 'Owner' | 'Wishlist'
  >('Broker');
  const [roleStatuses, setRoleStatuses] = useState<any[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const { sendOtp, changeMobile, loading: authLoading } = useAuthAPIs();

  // Change Mobile State
  const [isMobileModalVisible, setIsMobileModalVisible] = useState(false);
  const [newMobile, setNewMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [step, setStep] = useState<'request' | 'verify'>('request');

  const handleOpenMobileModal = () => {
    setNewMobile('');
    setOtp('');
    setVerificationId('');
    setStep('request');
    setIsMobileModalVisible(true);
  };

  const handleSendOtp = () => {
    if (!newMobile || newMobile.length < 10) {
      Alert.alert('Error', 'Please enter a valid mobile number');
      return;
    }

    sendOtp(
      { mobileNumber: newMobile },
      (res: any) => {
        if (res.success && res.data) {
          setVerificationId(res.data.verificationId);
          setStep('verify');
        } else {
          Alert.alert('Error', res.message || 'Failed to send OTP');
        }
      },
      (err: any) => {
        Alert.alert('Error', err?.message || 'Failed to send OTP');
      },
    );
  };

  const handleChangeMobile = () => {
    if (!otp || otp.length < 4) {
      Alert.alert('Error', 'Please enter a valid OTP');
      return;
    }

    changeMobile(
      {
        newMobileNumber: newMobile,
        otp,
        verificationId,
      },
      (res: any) => {
        if (res.success) {
          Alert.alert('Success', 'Mobile number updated successfully');
          setIsMobileModalVisible(false);
          // Update global auth state
          updateUser({ mobileNumber: newMobile, mobile: newMobile });
        } else {
          Alert.alert('Error', res.message || 'Failed to update mobile number');
        }
      },
      (err: any) => {
        Alert.alert('Error', err?.message || 'Failed to update mobile number');
      },
    );
  };

  useEffect(() => {
    getAvailableRoles(
      (res: any) => {
        if (res.success && res.data) {
          const decoded = decodeResponseData(res.data);
          setRoleStatuses(decoded || []);
        }
        setLoadingRoles(false);
      },
      () => {
        setLoadingRoles(false);
      },
    );
  }, []);

  // Mock User if not available
  const userData = user || {
    name: 'Rohit Sharma',
    role: 'Investor',
    email: 'rohit.sharma@example.com',
    mobileNumber: '+91 98765 43210',
    mobile: '+91 98765 43210',
    joined: '26 Aug 2025',
    lastLogin: '13 Aug 2025',
  };

  const isLocked = (roleName: string) => {
    if (roleName === 'Wishlist') return false;
    const status = roleStatuses.find(r => r.roleName === roleName);
    return status ? !status.isAcquired : false;
  };

  const renderTabContent = () => {
    if (isLocked(activeTab)) {
      return (
        <View style={styles.lockedContainer}>
          <Lock size={48} color="#EE2529" />
          <Text style={styles.lockedTitle}>{activeTab} Access Locked</Text>
          <Text style={styles.lockedText}>
            You haven't acquired the {activeTab} role yet.
            {activeTab === 'Owner' && ' List a property to become an owner!'}
            {activeTab === 'Broker' &&
              ' Complete your broker profile to start listing!'}
            {activeTab === 'Investor' &&
              ' Make an inquiry to become an investor!'}
          </Text>
        </View>
      );
    }

    switch (activeTab) {
      case 'Broker':
        return <BrokerTabView />;
      case 'Investor':
        return (
          <View>
            <EnquiriesTab roleType="investor" />
          </View>
        );
      case 'Owner':
        return <OwnerTabView />;
      case 'Wishlist':
        return <WishlistTab />;
      default:
        return <PortfolioTab />;
    }
  };
  return (
    <Layout>
      <View style={styles.container}>
        <View style={styles.grid}>
          {/* Left Column (Profile) */}
          <View style={styles.leftColumn}>
            {/* Profile Card */}
            <View style={styles.card}>
              {/* Avatar + Name Row */}
              <View style={styles.profileHeader}>
                {(userData as any).profilePhoto || (userData as any).avatar ? (
                  <Image
                    source={{ uri: (userData as any).profilePhoto || (userData as any).avatar }}
                    style={styles.avatar}
                  />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Text style={styles.avatarInitials}>
                      {userData.name
                        ? userData.name
                            .split(' ')
                            .slice(0, 2)
                            .map((n: string) => n[0])
                            .join('')
                            .toUpperCase()
                        : 'U'}
                    </Text>
                  </View>
                )}
                <Text style={styles.userName}>
                  {(userData.name || '')
                    .split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                    .join(' ')}
                </Text>
              </View>

              <View style={styles.statsDivider}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>{"PROPERTIES\nINVESTED"}</Text>
                  <Text style={styles.statNumber}>4</Text>
                </View>
                <View style={styles.verticalLine} />
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>{"PROPERTIES\nENQUIRED"}</Text>
                  <Text style={styles.statNumber}>2</Text>
                </View>
              </View>

              <View style={styles.contactInfo}>
                <View style={styles.contactRow}>
                  <Mail size={18} color="#EE2529" />
                  <View style={styles.contactDetails}>
                    <Text style={styles.contactLabel}>EMAIL</Text>
                    <Text style={styles.contactValue}>{userData.email}</Text>
                  </View>
                </View>
                <View style={styles.contactRow}>
                  <Smartphone size={18} color="#EE2529" />
                  <View style={styles.contactDetails}>
                    <Text style={styles.contactLabel}>MOBILE NO.</Text>
                    <Text style={styles.contactValue}>
                      {userData.mobileNumber || userData.mobile || 'N/A'}
                    </Text>
                    <TouchableOpacity
                      style={styles.editBtnSmall}
                      onPress={handleOpenMobileModal}
                    >
                      <Text style={styles.editBtnText}>Edit</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View style={styles.cardFooter}>
                <Text style={styles.footerText}>
                  Joined on: {userData.joined} Last log in: {userData.lastLogin}
                </Text>
              </View>
            </View>
            {/* Assistance */}
            <View style={styles.assistanceCard}>
              <Text style={styles.assistanceTitle}>Need Assistance?</Text>
              <Text style={styles.assistanceText}>
                Have questions about returns, tenants, or documents? Our team is
                here to guide you each step. Get clear answers on rental yields,
                ROI, and compliance directly from our property advisors.
              </Text>
              <TouchableOpacity style={styles.supportBtn}>
                <Text style={styles.supportBtnText}>Get Support</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Right Column (Tabs & Content) */}
          <View style={styles.rightColumn}>
            <ImageBackground
              source={require('../../assets/Banner/bannerBg.png')}
              style={styles.rightColumnBg}
              resizeMode="cover"
            />
            {/* Tabs */}
            <View style={styles.tabsContainer}>
              {['Broker', 'Investor', 'Owner', 'Wishlist'].map(tab => (
                <TouchableOpacity
                  key={tab}
                  style={styles.tabItem}
                  onPress={() => setActiveTab(tab as any)}
                >
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === tab && styles.activeTabText,
                      isLocked(tab) && styles.lockedTabText,
                    ]}
                  >
                    {tab}
                  </Text>
                  {isLocked(tab) && (
                    <View style={styles.lockIconContainer}>
                      <Lock size={12} color="#EE2529" />
                    </View>
                  )}
                  {activeTab === tab && <View style={styles.activeIndicator} />}
                </TouchableOpacity>
              ))}
            </View>

            {/* Tab Content */}
            <View style={styles.tabContent}>{renderTabContent()}</View>
          </View>
        </View>
      </View>

      {/* Change Mobile Modal */}
      <Modal
        visible={isMobileModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsMobileModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {step === 'request' ? 'Change Mobile Number' : 'Verify OTP'}
              </Text>
              <TouchableOpacity onPress={() => setIsMobileModalVisible(false)}>
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              {step === 'request' ? (
                <>
                  <Text style={styles.modalText}>
                    Enter your new mobile number to receive a verification code.
                  </Text>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Enter New Mobile Number"
                    keyboardType="phone-pad"
                    value={newMobile}
                    onChangeText={setNewMobile}
                    maxLength={10}
                  />
                  <TouchableOpacity
                    style={styles.modalActionBtn}
                    onPress={handleSendOtp}
                    disabled={authLoading}
                  >
                    {authLoading ? (
                      <ActivityIndicator color="#FFF" size="small" />
                    ) : (
                      <Text style={styles.modalActionBtnText}>Send OTP</Text>
                    )}
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={styles.modalText}>
                    Enter the OTP sent to +91 {newMobile}
                  </Text>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Enter OTP"
                    keyboardType="number-pad"
                    value={otp}
                    onChangeText={setOtp}
                    maxLength={6}
                  />
                  <TouchableOpacity
                    style={styles.modalActionBtn}
                    onPress={handleChangeMobile}
                    disabled={authLoading}
                  >
                    {authLoading ? (
                      <ActivityIndicator color="#FFF" size="small" />
                    ) : (
                      <Text style={styles.modalActionBtnText}>
                        Verify & Change
                      </Text>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.resendBtn}
                    onPress={() => setStep('request')}
                  >
                    <Text style={styles.resendBtnText}>
                      Try different number
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </Layout>
  );
};

const { width } = Dimensions.get('window');
const isDesktop = width > 1024;

const styles = StyleSheet.create({
  container: {
    minHeight: '100%',
    backgroundColor: '#F9F9F9',
    padding: 10,
  },
  grid: {
    flexDirection: isDesktop ? 'row' : 'column',
    gap: 20,
    width: '100%',
    maxWidth: '92%',
    alignSelf: 'center',
  },
  leftColumn: {
    flex: isDesktop ? 1 : undefined,
    maxWidth: isDesktop ? 400 : '100%',
  },
  rightColumn: {
    flex: isDesktop ? 2 : undefined,
    position: 'relative',
  },
  rightColumnBg: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '100%',
    height: 320,
    zIndex: 0,
    opacity: 2,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 40,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 20,
    alignItems: 'center',
  },
  profileHeader: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'flex-end',
    width: '100%',
    marginBottom: 2,
    paddingBottom: 4,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 16,
  },
  avatarPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 16,
    backgroundColor: '#C8C8C8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: 33,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileInfo: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#EE2529',
    flex: 1,
    // paddingBottom: 2
  },
  roleBadge: {
    backgroundColor: '#FFF3CA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 15,
    alignSelf: 'flex-start',
  },
  roleText: {
    fontSize: 12,
    color: '#EE2529',
    fontWeight: 'bold',
  },
  statsDivider: {
    flexDirection: 'row',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
    marginVertical: 15,
    width: '100%',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  verticalLine: {
    width: 1,
    backgroundColor: '#eee',
  },
  statLabel: {
    fontSize: 11,
    color: '#999',
    marginBottom: 8,
    textAlign: 'center',
    fontWeight: '600',
  },
  statNumber: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#EE2529',
  },
  contactInfo: {
    marginVertical: 15,
    gap: 20,
    width: '100%',
    alignItems: 'flex-start',
  },
  contactRow: {
    flexDirection: 'row',
    gap: 15,
    alignItems: 'flex-start',
    width: '100%',
  },
  contactDetails: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 11,
    color: '#999',
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  assistanceCard: {
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  assistanceTitle: {
    color: '#EE2529',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  assistanceText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    marginBottom: 15,
    lineHeight: 20,
  },
  supportBtn: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  supportBtnText: {
    color: '#767676',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    justifyContent: 'space-around',
  },
  tabItem: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    position: 'relative',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
  },
  tabText: {
    fontSize: 16,
    color: '#767676',
  },
  activeTabText: {
    color: '#EE2529',
    fontWeight: 'bold',
  },
  lockedTabText: {
    color: '#ccc',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 3,
    backgroundColor: '#EE2529',
  },
  tabContent: {
    borderRadius: 8,
  },
  tabContentContainer: {
    flex: 1,
  },
  brokerStatsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: isDesktop ? 16 : 10,
    marginBottom: 25,
  },
  brokerStatCard: {
    width: isDesktop ? '31%' : '48%',
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: isDesktop ? 22 : 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    alignItems: 'flex-start',
  },
  brokerStatLabel: {
    fontSize: isDesktop ? 13 : 11,
    color: '#999',
    marginBottom: 12,
    fontWeight: '500',
  },
  brokerStatValue: {
    fontSize: isDesktop ? 22 : 16,
    fontWeight: 'bold',
    color: '#EE2529',
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: 20,
    gap: 12,
    zIndex: 10,
    overflow: 'visible',
  },
  listTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#EE2529',
  },
  propertiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  lockedContainer: {
    backgroundColor: '#fff',
    padding: 60,
    minHeight: 350,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  lockedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
    marginBottom: 10,
  },
  lockedText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 300,
  },
  lockIconContainer: {
    marginLeft: 2,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#999',
  },
  mobileValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  editBtnSmall: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 30,
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    alignSelf: 'center',
  },
  editBtnText: {
    color: '#444',
    fontSize: 14,
    fontWeight: '500',
  },
  cardFooter: {
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    width: '100%',
  },
  footerText: {
    fontSize: 12,
    color: '#bbb',
    textAlign: 'center',
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
    backgroundColor: '#FFF',
    borderRadius: 16,
    width: isDesktop ? 400 : '100%',
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
  },
  closeBtn: {
    fontSize: 20,
    color: '#6b7280',
    fontWeight: '300',
  },
  modalBody: {
    gap: 16,
  },
  modalText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111827',
  },
  modalActionBtn: {
    backgroundColor: '#EE2529',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  modalActionBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  resendBtn: {
    alignItems: 'center',
    marginTop: 8,
  },
  resendBtnText: {
    color: '#6b7280',
    fontSize: 14,
  },
  tableContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tableHeaderCell: {
    fontSize: 12,
    fontWeight: '700',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'center',
  },
  tableRowAlt: {
    backgroundColor: '#fafafa',
  },
  tableCell: {
    fontSize: 13,
    color: '#333',
    paddingRight: 8,
  },
  tableCellRed: {
    fontSize: 13,
    color: '#EE2529',
    fontWeight: '600',
    paddingRight: 8,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
    zIndex: 10,
  },
  dateDropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f0f0f0',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  dateDropdownText: {
    fontSize: 13,
    color: '#444',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 38,
    left: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 999,
    zIndex: 999,
    minWidth: 160,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  dropdownItemText: {
    fontSize: 13,
    color: '#444',
  },
  dropdownItemActive: {
    color: '#EE2529',
    fontWeight: '600',
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortLabel: {
    fontSize: 13,
    color: '#555',
  },
  sortValue: {
    fontSize: 13,
    color: '#EE2529',
    fontWeight: '600',
  },
  sortDivider: {
    fontSize: 13,
    color: '#555',
  },
});

export default InvestorsScreen;
