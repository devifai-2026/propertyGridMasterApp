import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import PropertyCard, { Property } from '../../../components/PropertyCard';
import { useAuth } from '../../../context/AuthContext';
import { COLORS } from '../../../constants/theme';
import { usePropertyAPIs } from '../../../../helpers/hooks/propertyAPIs/usePropertyApis';


const PortfolioTab = () => {
  const { user } = useAuth();
  const { getProperties, loading: propertiesLoading } = usePropertyAPIs();
  const [propertiesOwned, setPropertiesOwned] = useState<Property[]>([]);

  useEffect(() => {
    if (user?.userId) {
      // Fetch properties added by the current user
      const query = `ownerId=${user.userId}`;

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
          setPropertiesOwned(formattedProps);
        }
      }, (err: any) => {
        console.error('Failed to fetch properties:', err);
      }, query);
    }
  }, [user?.userId, user?.role]); 

  const { width } = Dimensions.get('window');
  const isDesktop = width > 1024;

  return (
    <View style={styles.container}>
      <View style={styles.propertiesSection}>
        <Text style={styles.sectionTitle}>Properties Owned</Text>
        <View style={styles.propertiesGrid}>
          {propertiesLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color={COLORS.primary} size="large" />
              <Text style={styles.loadingText}>Loading properties...</Text>
            </View>
          ) : propertiesOwned.length > 0 ? (
            propertiesOwned.map(property => (
              <PropertyCard
                key={property.id}
                item={{ ...property, raw: { userId: user?.userId } }}
                width={isDesktop ? '48%' : '100%'}
                noView={false}
              />
            ))
          ) : (
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyText}>No properties found in your portfolio.</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F8F9FA',
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    marginBottom: 20,
  },
  summaryCard: {
    flex: 1,
    minWidth: 200,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  summaryLabel: {
    fontSize: 13,
    color: '#767676',
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  chartsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    marginBottom: 20,
  },
  chartCard: {
    flex: 1,
    minWidth: 350,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    justifyContent: 'center',
    marginTop: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendLine: {
    width: 20,
    height: 3,
    backgroundColor: '#5DADE2',
  },
  legendText: {
    fontSize: 13,
    color: '#666',
  },
  tableCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  tableTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  expiringBadge: {
    color: '#EE2529',
    fontSize: 14,
    fontWeight: '600',
  },
  table: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tableDataRow: {
    backgroundColor: '#fff',
  },
  tableHeaderText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
  },
  tableDataText: {
    fontSize: 13,
    color: '#666',
  },
  viewButton: {
    flex: 0.8,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  viewButtonText: {
    fontSize: 12,
    color: '#767676',
  },
  propertiesSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  propertiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
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
