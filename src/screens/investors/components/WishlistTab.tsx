import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import PropertyCard, { Property } from '../../../components/PropertyCard';

const WishlistTab = () => {
  const [timeFilter, setTimeFilter] = useState('Last 30 Days');

  // Dummy data matching Property interface
  const properties: Property[] = [
    {
      id: '1',
      title: 'Commercial Space',
      location: 'Mumbai, Mundhva',
      price: '₹ 2.5 Cr',
      rent: '₹ 2.5 L',
      tenure: '5 Years',
      roi: '8.5%',
      type: 'Commercial',
      images: [
        'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=800&q=80',
      ],
      isVerified: 'completed',
      verified: true,
      badges: ['MNC Client'],
      raw: { userId: 'wishlist-owner-1' },
    },
    {
      id: '2',
      title: 'Office Complex',
      location: 'Pune, Kharadi',
      price: '₹ 4.2 Cr',
      rent: '₹ 3.8 L',
      tenure: '9 Years',
      roi: '9.2%',
      type: 'Commercial',
      images: [
        'https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=800&q=80',
      ],
      isVerified: 'completed',
      verified: true,
      badges: ['IT Park'],
      raw: { userId: 'wishlist-owner-2' },
    },
  ];

  const handleRemove = (id: string) => {
    console.log('Remove from wishlist:', id);
    // Add logic to remove from wishlist
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Properties liked</Text>

        <View style={styles.filtersRow}>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterText}>{timeFilter}</Text>
            <ChevronDown size={16} color="#666" />
          </TouchableOpacity>

          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Sort by: Date</Text>
            <ChevronDown size={16} color="#666" />
          </View>

          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Show as:</Text>
            <ChevronDown size={16} color="#666" />
          </View>
        </View>
      </View>

      <View style={styles.propertiesGrid}>
        {properties.map(property => (
          <PropertyCard
            key={property.id}
            item={property}
            width={isDesktop ? '48%' : '100%'}
          />
        ))}
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
});

export default WishlistTab;
