import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import Layout from '../../layout/Layout';
import { Mail, Phone, Edit, ArrowRight, User } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../constants/theme';
import PortfolioTab from './components/PortfolioTab';
import EnquiriesTab from './components/EnquiriesTab';
import WishlistTab from './components/WishlistTab';
import { useAuthAPIs } from '../../../helpers/hooks/authAPIs/useAuthAPIs';

const InvestorsScreen = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<
    'portfolio' | 'enquiries' | 'wishlist'
  >('portfolio');
  // Mock User if not available
  const userData = user || {
    name: 'Rohit Sharma',
    role: 'Investor',
    email: 'rohit.sharma@example.com',
    mobileNumber: '+91 98765 43210',
    joined: '26 Aug 2025',
    lastLogin: '13 Aug 2025',
  };

  const summaryData = [
    {
      label: 'TOTAL INVESTMENT',
      inr: '(INR)',
      value: '₹3,660,000',
      color: '#EE2529',
    },
    {
      label: 'Total Net Cash Flow',
      inr: '(INR)',
      value: '₹2,90,000',
      color: '#EE2529',
    },
    { label: 'INVESTED PROPERTIES', inr: '', value: '4', color: '#767676' },
  ];
  console.log(user)

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
                    source={{ uri: (user.profilePhoto || user.profileImage) as string }}
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
                      {userData.mobileNumber || 'N/A'}
                    </Text>
                  </View>
                </View>
              </View>

              {/* <TouchableOpacity style={styles.editBtn}>
                <Text style={styles.editBtnText}>Edit</Text>
              </TouchableOpacity>

              <Text style={styles.metaText}>
                Joined on: {userData.joined || 'N/A'} {'\n'} Last log in:{' '}
                {userData.lastLogin || 'N/A'}
              </Text> */}
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
              <TouchableOpacity
                style={styles.tabItem}
                onPress={() => setActiveTab('portfolio')}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === 'portfolio' && styles.activeTabText,
                  ]}
                >
                  My Portfolio
                </Text>
                {activeTab === 'portfolio' && (
                  <View style={styles.activeIndicator} />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.tabItem}
                onPress={() => setActiveTab('enquiries')}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === 'enquiries' && styles.activeTabText,
                  ]}
                >
                  Enquiries
                </Text>
                {activeTab === 'enquiries' && (
                  <View style={styles.activeIndicator} />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.tabItem}
                onPress={() => setActiveTab('wishlist')}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === 'wishlist' && styles.activeTabText,
                  ]}
                >
                  Wishlist
                </Text>
                {activeTab === 'wishlist' && (
                  <View style={styles.activeIndicator} />
                )}
              </TouchableOpacity>
            </View>


            {/* Tab Content */}
            <View style={styles.tabContent}>
              {activeTab === 'portfolio' && <PortfolioTab />}
              {activeTab === 'enquiries' && <EnquiriesTab />}
              {activeTab === 'wishlist' && <WishlistTab />}
            </View>
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
  editBtn: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
    marginTop: 10,
  },
  editBtnText: {
    color: '#767676',
    fontSize: 14,
  },
  metaText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 15,
    lineHeight: 18,
  },
  switchSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  accountCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  accountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  smallAvatar: {
    width: 40,
    height: 40,
    borderRadius: 5,
  },
  smallAvatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 5,
    backgroundColor: '#FDF2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#EE2529',
  },
  roleBadgeSmall: {
    backgroundColor: '#FFF3CA',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 2,
    alignSelf: 'flex-start',
  },
  roleTextSmall: {
    fontSize: 10,
    color: '#EE2529',
    fontWeight: 'bold',
  },
  switchBtn: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  switchBtnText: {
    fontSize: 12,
    color: '#767676',
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
  },
  tabText: {
    fontSize: 16,
    color: '#767676',
  },
  activeTabText: {
    color: '#EE2529',
    fontWeight: 'bold',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 3,
    backgroundColor: '#EE2529',
  },
  summaryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    marginBottom: 20,
  },
  summaryCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    flex: 1,
    minWidth: 150,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    justifyContent: 'center',
  },
  summaryLabelContainer: {
    marginBottom: 5,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#767676',
    textAlign: 'center',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tabContent: {
    borderRadius: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
  emptyText: {
    color: '#999',
  },
});

export default InvestorsScreen;
