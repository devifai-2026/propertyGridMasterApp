import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { ChevronDown, LayoutGrid, List } from 'lucide-react-native';
import PropertyCard, { Property } from '../../../components/PropertyCard';
import { useAuth } from '../../../context/AuthContext';
import { COLORS } from '../../../constants/theme';
import { usePropertyAPIs } from '../../../../helpers/hooks/propertyAPIs/usePropertyApis';

const { width } = Dimensions.get('window');
const isDesktop = width > 1024;

const dateOptions = ['Last 7 Days', 'Last 30 Days', 'Last 3 Months', 'Last Year'];

const getFromDate = (filter: string) => {
  const now = new Date();
  const days = filter === 'Last 7 Days' ? 7 : filter === 'Last 30 Days' ? 30 : filter === 'Last 3 Months' ? 90 : 365;
  now.setDate(now.getDate() - days);
  return now.toISOString().split('T')[0];
};

const PortfolioTab = () => {
  const { user } = useAuth();
  const { getProperties, loading: propertiesLoading } = usePropertyAPIs();
  const [propertiesOwned, setPropertiesOwned] = useState<Property[]>([]);
  const [dateFilter, setDateFilter] = useState('Last 30 Days');
  const [sortBy, setSortBy] = useState('Date');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [showDateDropdown, setShowDateDropdown] = useState(false);

  const fetchProperties = (filter: string, sort: string) => {
    if (!user?.userId) return;
    const fromDate = getFromDate(filter);
    const backendSortBy = sort === 'Price' ? 'sellingPrice' : 'createdAt';
    const query = `ownerId=${user.userId}&fromDate=${fromDate}&sortBy=${backendSortBy}&sortOrder=DESC`;

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
          images: item.media?.length > 0 ? item.media.map((m: any) => m.fileUrl) : null,
          isVerified: item.isVerified,
          verified: item.isVerified === 'completed',
          badges: item.ownershipType ? [item.ownershipType] : [],
          raw: item,
        }));
        setPropertiesOwned(formattedProps);
      }
    }, (err: any) => {
      console.error('Failed to fetch properties:', err);
    }, query);
  };

  useEffect(() => {
    fetchProperties(dateFilter, sortBy);
  }, [user?.userId, user?.role]);

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
    <View style={styles.container}>
      <View style={styles.propertiesSection}>
        {/* Header row with filters */}
        <View style={styles.listHeader}>
          <Text style={styles.sectionTitle}>Properties Owned</Text>
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

        {/* Content */}
        {propertiesLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={COLORS.primary} size="large" />
            <Text style={styles.loadingText}>Loading properties...</Text>
          </View>
        ) : propertiesOwned.length > 0 ? (
          viewMode === 'grid' ? (
            <View style={styles.propertiesGrid}>
              {propertiesOwned.map(property => (
                <PropertyCard
                  key={property.id}
                  item={{ ...property, raw: { userId: user?.userId } }}
                  width={isDesktop ? '48%' : '100%'}
                  noView={false}
                />
              ))}
            </View>
          ) : (
            <View style={styles.tableContainer}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Property</Text>
                <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Location</Text>
                <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Price</Text>
                <Text style={[styles.tableHeaderCell, { flex: 1 }]}>ROI</Text>
                <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Type</Text>
              </View>
              {propertiesOwned.map((p, i) => (
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
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyText}>No properties found in your portfolio.</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
  },
  propertiesSection: {
    marginTop: 20,
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#EE2529',
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
  propertiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
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
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 14,
  },
  emptyStateContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  emptyText: {
    color: '#999',
    textAlign: 'center',
    fontSize: 14,
  },
});

export default PortfolioTab;
