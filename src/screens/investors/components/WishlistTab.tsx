import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { ChevronDown, Heart, Share2 } from 'lucide-react-native';

interface WishlistProperty {
  id: string;
  title: string;
  location: string;
  image: any;
}

const WishlistTab = () => {
  const [timeFilter, setTimeFilter] = useState('Last 30 Days');
  const [sortBy, setSortBy] = useState('Date');

  const properties: WishlistProperty[] = [
    {
      id: '1',
      title: 'Commercial Space',
      location: 'Mumbai, Mundhva',
      image: require('../../../assets/FeaturedProperties/cardImg.png'),
    },
    {
      id: '2',
      title: 'Commercial Space',
      location: 'Mumbai, Mundhva',
      image: require('../../../assets/FeaturedProperties/cardImg.png'),
    },
  ];

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
          <View key={property.id} style={styles.propertyCard}>
            <View style={styles.imageContainer}>
              <Image
                source={property.image}
                style={styles.propertyImage}
                resizeMode="cover"
              />
              <TouchableOpacity style={styles.shareButton}>
                <Share2 size={18} color="#333" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.heartButton}>
                <Heart size={20} color="#EE2529" fill="#EE2529" />
              </TouchableOpacity>

              {/* Carousel dots */}
              <View style={styles.carouselDots}>
                <View style={[styles.dot, styles.activeDot]} />
                <View style={styles.dot} />
                <View style={styles.dot} />
              </View>
            </View>

            <View style={styles.propertyInfo}>
              <Text style={styles.propertyTitle}>{property.title}</Text>
              <Text style={styles.propertyLocation}>{property.location}</Text>
            </View>
          </View>
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
  propertyCard: {
    width: isDesktop ? '48%' : '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
    height: 250,
  },
  propertyImage: {
    width: '100%',
    height: '100%',
  },
  shareButton: {
    position: 'absolute',
    top: 15,
    right: 55,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  heartButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  carouselDots: {
    position: 'absolute',
    bottom: 15,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  activeDot: {
    backgroundColor: '#fff',
  },
  propertyInfo: {
    padding: 15,
  },
  propertyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  propertyLocation: {
    fontSize: 14,
    color: '#666',
  },
});

export default WishlistTab;
