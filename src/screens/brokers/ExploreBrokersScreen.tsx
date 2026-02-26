import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import Layout from '../../layout/Layout';
import { MapPin, ArrowDown } from 'lucide-react-native';
import { usePropertyAPIs } from '../../../helpers/hooks/propertyAPIs/usePropertyApis';
import { ActivityIndicator } from 'react-native';

// Redundant static data removed

const ExploreBrokersScreen = () => {
  const { width } = useWindowDimensions();
  const isMobile = width <= 600;
  const isDesktop = width > 1024;

  const { getBrokers, loading } = usePropertyAPIs();
  const [brokers, setBrokers] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState('name_asc');
  const [visibleContactId, setVisibleContactId] = useState<string | null>(null);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const fetchBrokers = (page: number = 1, sort: string = sortBy) => {
    getBrokers(
      (data: any[], meta?: any) => {
        setBrokers(data);
        if (meta && meta.pagination) {
          setPagination(meta.pagination);
        }
      },
      error => {
        console.error('Error fetching brokers:', error);
      },
      `page=${page}&limit=4&sortBy=${sort}`,
    );
  };

  React.useEffect(() => {
    fetchBrokers(1, sortBy);
  }, [sortBy]);

  const toggleSort = () => {
    const nextSort = sortBy === 'name_asc' ? 'properties_desc' : 'name_asc';
    setSortBy(nextSort);
  };

  return (
    <Layout>
      <View style={styles.container}>
        {/* Header Banner */}
        <View style={styles.header}>
          <Image
            source={require('../../assets/propertyDetails/squaresbg.png')}
            style={styles.headerBg}
            resizeMode="cover"
          />
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.headerTitle}>
                <Text style={{ color: '#EE2529', fontWeight: 'bold' }}>
                  {pagination.totalCount || 0}
                </Text>{' '}
                Agents
              </Text>
              <Text style={styles.headerSubtitle}>available for you</Text>
            </View>
            <TouchableOpacity style={styles.sortContainer} onPress={toggleSort}>
              <Text style={styles.sortLabel}>
                Sort by:{' '}
                <Text style={{ color: '#EE2529', fontWeight: 'bold' }}>
                  {sortBy === 'name_asc' ? 'A-Z' : 'Most Listed'}
                </Text>
              </Text>
              <ArrowDown
                size={14}
                color="#EE2529"
                style={{
                  transform: [
                    { rotate: sortBy === 'name_asc' ? '0deg' : '180deg' },
                  ],
                }}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Grid using Map to avoid nested FlatList inside Layout ScrollView */}
        {loading ? (
          <View style={{ padding: 50, alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#EE2529" />
            <Text style={{ marginTop: 10, color: '#666' }}>
              Finding the best agents for you...
            </Text>
          </View>
        ) : brokers.length === 0 ? (
          <View style={{ padding: 50, alignItems: 'center' }}>
            <Text style={{ color: '#666' }}>
              No brokers found at the moment.
            </Text>
          </View>
        ) : (
          <View
            style={[
              styles.gridContainer,
              {
                flexDirection: isDesktop ? 'row' : 'column',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
              },
            ]}
          >
            {brokers.map(item => (
              <View
                key={item.id}
                style={[styles.card, { width: isDesktop ? '48%' : '100%' }]}
              >
                <Image
                  source={require('../../assets/ExploreBrokers/top.png')}
                  style={styles.bgPatternTop}
                  resizeMode="cover"
                />
                <Image
                  source={require('../../assets/ExploreBrokers/bottom.png')}
                  style={styles.bgPatternBottom}
                  resizeMode="cover"
                />

                <View
                  style={[
                    styles.cardContent,
                    { flexDirection: !isMobile ? 'row' : 'column' },
                  ]}
                >
                  {/* Left Section */}
                  <View
                    style={[
                      styles.leftSection,
                      !isMobile
                        ? { flex: 1, alignItems: 'flex-start' }
                        : {
                            width: '100%',
                            alignItems: 'center',
                            marginBottom: 20,
                          },
                    ]}
                  >
                    <View
                      style={{ alignItems: isMobile ? 'center' : 'flex-start' }}
                    >
                      <Text style={styles.brokerCompany}>{item.name}</Text>
                      <Image
                        source={require('../../assets/ExploreBrokers/cardImg.png')}
                        style={styles.brokerImage}
                        resizeMode="contain"
                      />
                    </View>

                    {visibleContactId === item.id ? (
                      <View style={styles.contactInfoContainer}>
                        <Text style={styles.contactInfoLabel}>
                          Call: {item.mobileNumber}
                        </Text>
                        <Text style={styles.contactInfoLabel}>
                          Email: {item.email}
                        </Text>
                        <TouchableOpacity
                          onPress={() => setVisibleContactId(null)}
                          style={{ marginTop: 5 }}
                        >
                          <Text style={styles.hideContactText}>
                            Hide Details
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={styles.contactBtn}
                        onPress={() => setVisibleContactId(item.id)}
                      >
                        <Text style={styles.contactBtnText}>
                          Contact Broker
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  {/* Right Section */}
                  <View
                    style={[
                      styles.rightSection,
                      !isMobile ? { flex: 1.5 } : { width: '100%' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.agentName,
                        { textAlign: !isMobile ? 'left' : 'center' },
                      ]}
                    >
                      {item.agentName}
                    </Text>
                    <View
                      style={[
                        styles.locationRow,
                        { justifyContent: !isMobile ? 'flex-start' : 'center' },
                      ]}
                    >
                      <MapPin size={14} color="#EE2529" />
                      <Text style={styles.locationText}>{item.location}</Text>
                      <Text style={styles.reraText}>RERA: {item.rera}</Text>
                    </View>

                    <View
                      style={[
                        styles.divider,
                        { alignSelf: !isMobile ? 'flex-start' : 'center' },
                      ]}
                    />

                    <View style={styles.specializationContainer}>
                      <Text
                        style={[
                          styles.specLabel,
                          { textAlign: !isMobile ? 'left' : 'center' },
                        ]}
                      >
                        Expertise
                      </Text>
                      <View
                        style={[
                          styles.tagsRow,
                          {
                            justifyContent: !isMobile ? 'flex-start' : 'center',
                          },
                        ]}
                      >
                        {item.tags.map((tag: any, idx: number) => (
                          <View key={idx} style={styles.tag}>
                            <Text style={styles.tagText}>{tag}</Text>
                          </View>
                        ))}
                      </View>
                    </View>

                    <View
                      style={[
                        styles.statsRow,
                        {
                          flexDirection: 'row',
                          justifyContent: !isMobile ? 'flex-start' : 'center',
                          gap: 25,
                        },
                      ]}
                    >
                      <View style={styles.statGroup}>
                        <Text style={styles.statHighlight}>
                          {item.propertiesListed}
                        </Text>
                        <Text style={styles.statLabel}>Properties</Text>
                      </View>
                      <View style={styles.statDivider} />
                      <View style={styles.statGroup}>
                        <Text style={styles.statHighlight}>
                          {item.dealsClosed}
                        </Text>
                        <Text style={styles.statLabel}>Deals</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Pagination Controls */}
        {pagination.totalPages > 1 && (
          <View style={styles.paginationContainer}>
            <TouchableOpacity
              style={[
                styles.pageBtn,
                !pagination.hasPrevPage && styles.pageBtnDisabled,
              ]}
              disabled={!pagination.hasPrevPage}
              onPress={() => fetchBrokers(pagination.currentPage - 1)}
            >
              <Text
                style={[
                  styles.pageBtnText,
                  !pagination.hasPrevPage && styles.pageBtnTextDisabled,
                ]}
              >
                Previous
              </Text>
            </TouchableOpacity>

            <View style={styles.pageNumbers}>
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                .filter(p => {
                  const current = pagination.currentPage;
                  return (
                    p === 1 ||
                    p === pagination.totalPages ||
                    (p >= current - 1 && p <= current + 1)
                  );
                })
                .map((p, i, arr) => {
                  const isFirst = i === 0;
                  const prev = arr[i - 1];
                  const showEllipsis = !isFirst && p - prev > 1;

                  return (
                    <React.Fragment key={p}>
                      {showEllipsis && (
                        <Text style={styles.paginationEllipsis}>...</Text>
                      )}
                      <TouchableOpacity
                        style={[
                          styles.pageNumberBtn,
                          pagination.currentPage === p &&
                            styles.activePageNumberBtn,
                        ]}
                        onPress={() => fetchBrokers(p)}
                      >
                        <Text
                          style={[
                            styles.pageNumberText,
                            pagination.currentPage === p &&
                              styles.activePageNumberText,
                          ]}
                        >
                          {p}
                        </Text>
                      </TouchableOpacity>
                    </React.Fragment>
                  );
                })}
            </View>

            <TouchableOpacity
              style={[
                styles.pageBtn,
                !pagination.hasNextPage && styles.pageBtnDisabled,
              ]}
              disabled={!pagination.hasNextPage}
              onPress={() => fetchBrokers(pagination.currentPage + 1)}
            >
              <Text
                style={[
                  styles.pageBtnText,
                  !pagination.hasNextPage && styles.pageBtnTextDisabled,
                ]}
              >
                Next
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    minHeight: '100%',
    padding: 20,
  },
  header: {
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
    opacity: 0.1,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    color: '#1a1a1a',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  sortContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sortLabel: {
    fontSize: 14,
    color: '#333',
  },
  gridContainer: {
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 25,
    shadowColor: '#EE2529',
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 8,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  bgPatternTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 200,
    height: 200,
    opacity: 0.1,
  },
  bgPatternBottom: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 150,
    height: 150,
    opacity: 0.1,
  },
  cardContent: {
    padding: 20,
    gap: 20,
  },
  leftSection: {
    flex: 1,
    justifyContent: 'space-between',
  },
  brokerCompany: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#EE2529',
    marginBottom: 10,
  },
  brokerImage: {
    width: 120,
    height: 120,
    marginBottom: 15,
  },
  contactBtn: {
    backgroundColor: '#EE2529', // Gradient placeholder
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: 160,
    alignItems: 'center',
    marginTop: 10,
  },
  contactBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  contactInfoContainer: {
    backgroundColor: '#F9F9F9',
    padding: 12,
    borderRadius: 12,
    marginTop: 15,
    width: '100%',
    borderWidth: 1,
    borderColor: '#eee',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 5,
    elevation: 2,
  },
  contactInfoLabel: {
    fontSize: 13,
    color: '#1a1a1a',
    fontWeight: '600',
    marginBottom: 4,
  },
  hideContactText: {
    fontSize: 12,
    color: '#EE2529',
    fontWeight: '600',
    textDecorationLine: 'underline',
    marginTop: 4,
  },
  rightSection: {
    flex: 1.5,
  },
  agentName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#EE2529',
    marginBottom: 5,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
  },
  reraText: {
    fontSize: 14,
    color: '#666',
  },
  divider: {
    height: 1,
    backgroundColor: '#EE2529',
    marginVertical: 10,
    width: 50,
  },
  specializationContainer: {
    marginBottom: 15,
  },
  specLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EE252920',
  },
  tagText: {
    fontSize: 11,
    color: '#EE2529',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  statsRow: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#f5f5f5',
  },
  statGroup: {
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#f0f0f0',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  statHighlight: {
    color: '#1a1a1a',
    fontWeight: '800',
    fontSize: 20,
  },
  // Pagination Styles
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
    gap: 12,
  },
  pageBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  pageBtnDisabled: {
    backgroundColor: '#f9f9f9',
    borderColor: '#f0f0f0',
  },
  pageBtnText: {
    color: '#EE2529',
    fontWeight: 'bold',
    fontSize: 14,
  },
  pageBtnTextDisabled: {
    color: '#ccc',
  },
  pageNumbers: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pageNumberBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
  },
  activePageNumberBtn: {
    backgroundColor: '#EE2529',
    borderColor: '#EE2529',
  },
  pageNumberText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '600',
  },
  activePageNumberText: {
    color: '#fff',
  },
  paginationEllipsis: {
    color: '#666',
    fontSize: 16,
    paddingHorizontal: 4,
  },
});

export default ExploreBrokersScreen;
