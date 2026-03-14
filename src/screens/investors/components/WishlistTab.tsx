import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import PropertyCard, { Property } from '../../../components/PropertyCard';
import { usePropertyAPIs } from '../../../../helpers/hooks/propertyAPIs/usePropertyApis';
import { ActivityIndicator } from 'react-native';
import { COLORS } from '../../../constants/theme';

const WishlistTab = () => {
  const [wishlistProperties, setWishlistProperties] = useState<Property[]>([]);
  const { getWishlist, toggleLikeProperty, loading } = usePropertyAPIs();

  const fetchWishlist = () => {
    getWishlist((data: any) => {
      if (data && Array.isArray(data)) {
        const mapped: Property[] = data.map((item: any) => ({
          id: item.propertyId,
          title: `${item.propertyType} Space`,
          location: `${item.city}, ${item.state}`,
          price: `₹${item.sellingPrice} Cr`,
          rent: item.annualGrossRent ? `₹${item.annualGrossRent} L` : 'N/A',
          tenure: `${item.tenureLeftYears || 0} Yrs`,
          roi: item.netRentalYield ? `${item.netRentalYield}%` : 'N/A',
          type: item.propertyType,
          images:
            item.media && item.media.length > 0
              ? item.media.map((m: any) => m.fileUrl)
              : null,
          badges: [item.tenantType, item.buildingGrade].filter(Boolean),
          isVerified: item.isVerified,
          verified:
            item.isVerified === 'partial' || item.isVerified === 'completed',
          raw: item,
        }));
        setWishlistProperties(mapped);
      }
    });
  };

  React.useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = (id: string) => {
    toggleLikeProperty(id, () => {
      // Remove from local state
      setWishlistProperties(prev => prev.filter(p => p.id !== id));
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Properties liked</Text>
      </View>

      <View style={styles.propertiesGrid}>
        {loading && wishlistProperties.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : wishlistProperties.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No properties in your wishlist.
            </Text>
          </View>
        ) : (
          wishlistProperties.map(property => (
            <PropertyCard
              key={property.id}
              item={property}
              width={isDesktop ? '48%' : '100%'}
              onRemove={handleRemove}
            />
          ))
        )}
      </View>
    </View>
  );
};

const { width } = Dimensions.get('window');
const isDesktop = width > 1024;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#EE2529',
    marginBottom: 20,
  },
  filtersRow: {
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  filterText: {
    fontSize: 13,
    color: '#666',
  },
  filterGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filterLabel: {
    fontSize: 13,
    color: '#666',
  },
  propertiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  loadingContainer: {
    flex: 1,
    padding: 40,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
  },
});

export default WishlistTab;
