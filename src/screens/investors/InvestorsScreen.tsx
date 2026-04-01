import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import Layout from '../../layout/Layout';
import { Mail, Phone, Edit, ArrowRight, User, Lock } from 'lucide-react-native';
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
  const { getProperties, getBrokerStats, loading: propertyLoading } = usePropertyAPIs();
  const [brokerProperties, setBrokerProperties] = useState<Property[]>([]);
  const [stats, setStats] = useState<any>({
    activeDeals: 0,
    conversionRate: '0%',
    activeListings: 0,
  });

  useEffect(() => {
    if (user?.userId) {
      getBrokerStats((data: any) => {
        if (data) setStats(data);
      });

      getProperties((data: any[]) => {
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
            images: item.media && item.media.length > 0 
              ? item.media.map((m: any) => m.fileUrl) 
              : null,
            isVerified: item.isVerified,
            verified: item.isVerified === 'completed',
            badges: item.ownershipType ? [item.ownershipType] : [],
            raw: item
          }));
          setBrokerProperties(formattedProps);
        }
      }, undefined, `brokerId=${user.userId}`);
    }
  }, [user?.userId]);

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
      </View>

      {propertyLoading ? (
        <ActivityIndicator color={COLORS.primary} size="large" />
      ) : brokerProperties.length > 0 ? (
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
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No properties listed as a broker.</Text>
        </View>
      )}
    </View>
  );
};

const OwnerTabView = () => {
  return <PortfolioTab />; 
};

const InvestorsScreen = () => {
  const { user } = useAuth();
  const { getAvailableRoles } = useAuthAPIs();
  const [activeTab, setActiveTab] = useState<
    'Broker' | 'Investor' | 'Owner' | 'Wishlist'
  >('Broker');
  const [roleStatuses, setRoleStatuses] = useState<any[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(true);

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
            {activeTab === 'Broker' && ' Complete your broker profile to start listing!'}
            {activeTab === 'Investor' && ' Make an inquiry to become an investor!'}
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
             <EnquiriesTab />
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
              <View style={styles.profileHeader}>
                {user?.profilePhoto || user?.profileImage ? (
                  <Image
                    source={{
                      uri: (user.profilePhoto || user.profileImage) as string,
                    }}
                    style={styles.avatar}
                    resizeMode="cover"
                  />
                ) : (
                  <Image
                    source={require('../../assets/Dashboard/img.jpg')}
                    style={styles.avatar}
                    resizeMode="cover"
                  />
                )}
                <View style={styles.profileInfo}>
                  <Text style={styles.userName}>{userData.name}</Text>
                </View>
              </View>

              <View style={styles.statsDivider}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>PROPERTIES INVESTED</Text>
                  <Text style={styles.statNumber}>4</Text>
                </View>
                <View style={styles.verticalLine} />
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>PROPERTIES ENQUIRED</Text>
                  <Text style={styles.statNumber}>2</Text>
                </View>
              </View>

              <View style={styles.contactInfo}>
                <View style={styles.contactRow}>
                  <Mail size={16} color="#EE2529" />
                  <View>
                    <Text style={styles.contactLabel}>EMAIL</Text>
                    <Text style={styles.contactValue}>{userData.email}</Text>
                  </View>
                </View>
                <View style={styles.contactRow}>
                  <Phone size={16} color="#EE2529" />
                  <View>
                    <Text style={styles.contactLabel}>MOBILE NO.</Text>
                    <Text style={styles.contactValue}>
                      {userData.mobileNumber || userData.mobile || 'N/A'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            {/* Assistance */}
            <View style={styles.assistanceCard}>
              <Text style={styles.assistanceTitle}>Need Assistance?</Text>
              <Text style={styles.assistanceText}>
                Have questions about returns, tenants, or documents? Our team is
                here to guide you each step.
              </Text>
              <TouchableOpacity style={styles.supportBtn}>
                <Text style={styles.supportBtnText}>Get Support</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Right Column (Tabs & Content) */}
          <View style={styles.rightColumn}>
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
    </Layout>
  );
};

const { width } = Dimensions.get('window');
const isDesktop = width > 1024;

const styles = StyleSheet.create({
  container: {
    minHeight: '100%',
    backgroundColor: '#F9F9F9',
    padding: 20,
  },
  grid: {
    flexDirection: isDesktop ? 'row' : 'column',
    gap: 20,
  },
  leftColumn: {
    flex: isDesktop ? 1 : undefined,
    maxWidth: isDesktop ? 400 : '100%',
  },
  rightColumn: {
    flex: isDesktop ? 2 : undefined,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  profileInfo: {
    justifyContent: 'center',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#EE2529',
    marginBottom: 5,
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
    paddingVertical: 15,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
    marginTop: 15,
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
    fontSize: 12,
    color: '#767676',
    marginBottom: 5,
    textAlign: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#EE2529',
  },
  contactInfo: {
    marginVertical: 15,
    gap: 15,
  },
  contactRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  contactLabel: {
    fontSize: 12,
    color: '#767676',
    fontWeight: '600',
  },
  contactValue: {
    fontSize: 14,
    color: '#333',
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
    gap: 15,
    marginBottom: 25,
  },
  brokerStatCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  brokerStatLabel: {
    fontSize: 14,
    color: '#767676',
    marginBottom: 10,
  },
  brokerStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#EE2529',
  },
  listHeader: {
    marginBottom: 20,
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
});

export default InvestorsScreen;
