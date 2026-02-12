import React, { useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  TextInput,
  Platform,
} from 'react-native';

interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  rating: string;
  type: string;
  image: string;
}

const DATA: Property[] = [
  {
    id: '1',
    title: 'Modern Villa',
    location: 'Beverly Hills, CA',
    price: '$4,500,000',
    rating: '4.9',
    type: 'Villa',
    image:
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1000',
  },
  {
    id: '2',
    title: 'Luxury Apartment',
    location: 'New York, NY',
    price: '$2,100,000',
    rating: '4.8',
    type: 'Apartment',
    image:
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1000',
  },
  {
    id: '3',
    title: 'Cozy Cottage',
    location: 'Aspen, CO',
    price: '$1,200,000',
    rating: '4.7',
    type: 'House',
    image:
      'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=1000',
  },
  {
    id: '4',
    title: 'Ocean View Penthouse',
    location: 'Miami, FL',
    price: '$3,800,000',
    rating: '5.0',
    type: 'Penthouse',
    image:
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1000',
  },
  {
    id: '5',
    title: 'Contemporary House',
    location: 'Seattle, WA',
    price: '$1,500,000',
    rating: '4.6',
    type: 'House',
    image:
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=1000',
  },
  {
    id: '6',
    title: 'Mountain Retreat',
    location: 'Lake Tahoe, CA',
    price: '$2,900,000',
    rating: '4.9',
    type: 'Villa',
    image:
      'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=1000',
  },
];

interface FilterChipProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

const FilterChip: React.FC<FilterChipProps> = ({ label, active, onPress }) => (
  <TouchableOpacity
    style={[styles.chip, active && styles.chipActive]}
    onPress={onPress}
  >
    <Text style={[styles.chipText, active && styles.chipTextActive]}>
      {label}
    </Text>
  </TouchableOpacity>
);

interface PropertyCardProps {
  item: Property;
  cardWidth: number;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ item, cardWidth }) => (
  <TouchableOpacity style={[styles.card, { width: cardWidth }]}>
    <View style={styles.imageContainer}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{item.type}</Text>
      </View>
    </View>
    <View style={styles.cardContent}>
      <Text style={styles.propertyTitle} numberOfLines={1}>
        {item.title}
      </Text>
      <Text style={styles.propertyLocation} numberOfLines={1}>
        {item.location}
      </Text>
      <View style={styles.priceContainer}>
        <Text style={styles.propertyPrice}>{item.price}</Text>
        <Text style={styles.propertyRating}>⭐ {item.rating}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const { width } = useWindowDimensions();
  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch] = useState('');

  const isWeb = Platform.OS === 'web';
  const numColumns = isWeb ? (width > 1024 ? 4 : width > 768 ? 3 : 2) : 2;
  const cardWidth = (width - (isWeb ? 80 : 40)) / numColumns;

  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#121212' : '#F8F9FA',
    flex: 1,
  };

  const filteredData = DATA.filter(item => {
    const matchesFilter = activeFilter === 'All' || item.type === activeFilter;
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.location.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>PropertyGrid</Text>
          <Text style={styles.headerSubtitle}>Find your master space</Text>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search properties..."
            placeholderTextColor="#999"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <View style={styles.filtersContainer}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={['All', 'House', 'Apartment', 'Villa', 'Penthouse']}
            renderItem={({ item }) => (
              <FilterChip
                label={item}
                active={activeFilter === item}
                onPress={() => setActiveFilter(item)}
              />
            )}
            keyExtractor={item => item}
            contentContainerStyle={styles.filtersList}
          />
        </View>

        <FlatList
          data={filteredData}
          renderItem={({ item }) => (
            <PropertyCard item={item} cardWidth={cardWidth} />
          )}
          keyExtractor={item => item.id}
          numColumns={numColumns}
          key={numColumns} // Force re-render on column change
          contentContainerStyle={styles.listContainer}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  searchContainer: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === 'ios' ? 12 : 5,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  searchInput: {
    fontSize: 16,
    color: '#333',
  },
  filtersContainer: {
    marginBottom: 20,
  },
  filtersList: {
    paddingRight: 20,
  },
  chip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: '#E9ECEF',
    marginRight: 10,
  },
  chipActive: {
    backgroundColor: '#1A1A1A',
  },
  chipText: {
    color: '#666',
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#FFF',
  },
  listContainer: {
    paddingBottom: 40,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  imageContainer: {
    height: 150,
    width: '100%',
  },
  image: {
    height: '100%',
    width: '100%',
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  cardContent: {
    padding: 15,
  },
  propertyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  propertyLocation: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  propertyPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  propertyRating: {
    fontSize: 13,
    fontWeight: '600',
    color: '#444',
  },
});

export default App;
