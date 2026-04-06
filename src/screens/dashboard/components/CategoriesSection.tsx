import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { COLORS } from '../../../constants/theme';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '../../../context/NavigationContext';
import { usePropertyAPIs } from '../../../../helpers/hooks/propertyAPIs/usePropertyApis';

const INITIAL_CATEGORIES = [
  {
    id: '1',
    title: 'Residential',
    image: require('../../../assets/ExploreCategories/one.png'),
    value: 'Residential',
  },
  {
    id: '2',
    title: 'Retail',
    image: require('../../../assets/ExploreCategories/two.png'),
    value: 'Retail',
  },
  {
    id: '3',
    title: 'Offices',
    image: require('../../../assets/ExploreCategories/three.png'),
    value: 'Offices',
  },
  {
    id: '4',
    title: 'Industrial',
    image: require('../../../assets/ExploreCategories/four.png'),
    value: 'Industrial',
  },
  {
    id: '5',
    title: 'Others',
    image: require('../../../assets/ExploreCategories/others.png'),
    value: 'Others',
  },
];

const CategoryCard = ({
  item,
  width,
  count,
}: {
  item: (typeof INITIAL_CATEGORIES)[0];
  width: number;
  count: number;
}) => {
  const { navigate } = useNavigation();
  return (
    <View style={[styles.card, { width }]}>
      <View style={styles.imageContainer}>
        <Image source={item.image} style={styles.image} resizeMode="cover" />
        <View style={styles.overlay} />
        <Text style={styles.categoryTitle}>{item.title}</Text>
      </View>
      <View style={styles.cardFooter}>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{count} Properties Listed</Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            navigate(`/explore-properties?propertyTypes=${item.value}`)
          }
        >
          <LinearGradient
            colors={['#EE2529', '#C73834']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.exploreBtn}
          >
            <Text style={styles.exploreBtnText}>Explore</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const CategoriesSection = () => {
  const { width } = useWindowDimensions();
  const { getPropertyCounts, loading } = usePropertyAPIs();
  const [counts, setCounts] = useState<Record<string, number>>({});
  const isMobile = width < 768;

  useEffect(() => {
    getPropertyCounts(
      (data: any) => {
        setCounts(data);
      },
      (error: any) => {
        console.error('Failed to fetch category counts:', error);
      },
    );
  }, []);

  const containerPadding = isMobile ? 20 : 0;
  const availableWidth = (width * 0.9) - containerPadding * 2;
  const gap = 20;

  // Responsive columns
  let cols = 4;
  if (width < 600) cols = 1;
  else if (width < 800) cols = 2;
  else if (width < 1000) cols = 3;
  else cols = 4;

  const cardWidth = (availableWidth - gap * (cols - 1)) / cols;

  return (
    <View style={styles.outerContainer}>
      <View style={[styles.container, { paddingHorizontal: containerPadding }]}>
        <View style={styles.headerRow}>
          <Text style={[styles.sectionTitle, { fontSize: isMobile ? 28 : 42 }]}>
            Explore By <Text style={styles.highlightText}>Property Type</Text> 
          </Text>
          {loading && <ActivityIndicator color={COLORS.primary} size="small" />}
        </View>
        <View style={[styles.grid, { gap }]}>
          {INITIAL_CATEGORIES.map(cat => (
            <CategoryCard
              key={cat.id}
              item={cat}
              width={cardWidth}
              count={counts[cat.value] || 0}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: COLORS.white,
    width: '100%',
    alignItems: 'center',
  },
  container: {
    paddingVertical: 60,
    width: '100%',
    maxWidth: '90%',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 40,
  },
  sectionTitle: {
    fontWeight: '300',
    color: '#262626',
    textAlign: 'center',
  },
  highlightText: {
    fontWeight: '300',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    width: '100%',
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f5f5f5',
    marginBottom: 5,
    maxWidth: 370,
  },
  imageContainer: {
    height: 180,
    width: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  categoryTitle: {
    position: 'absolute',
    top: 20,
    left: 20,
    color: COLORS.white,
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  cardFooter: {
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
  },
  countBadge: {
    backgroundColor: '#FFF3CA',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 15,
  },
  countText: {
    fontSize: 12,
    color: '#262626',
    fontWeight: '500',
  },
  exploreBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exploreBtnText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '600',
  },
});

export default CategoriesSection;
