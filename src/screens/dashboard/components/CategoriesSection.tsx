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
          <Text style={styles.countText}>{count} Property Listed</Text>
        </View>
        <TouchableOpacity
          style={styles.exploreBtn}
          onPress={() =>
            navigate(`/explore-properties?propertyTypes=${item.value}`)
          }
        >
          <Text style={styles.exploreBtnText}>Explore</Text>
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

  const containerPadding = isMobile ? 20 : 60;
  const availableWidth = Math.min(width, 1440) - containerPadding * 2;
  const gap = 20;

  // Responsive columns
  let cols = 5;
  if (width < 600) cols = 1;
  else if (width < 900) cols = 2;
  else if (width < 1200) cols = 3;
  else cols = 5;

  const cardWidth = (availableWidth - gap * (cols - 1)) / cols;

  return (
    <View style={styles.outerContainer}>
      <View style={[styles.container, { paddingHorizontal: containerPadding }]}>
        <View style={styles.headerRow}>
          <Text style={[styles.sectionTitle, { fontSize: isMobile ? 24 : 34 }]}>
            Explore all <Text style={styles.highlightText}>Categories</Text>
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
    maxWidth: 1440,
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
    color: COLORS.textDark,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  highlightText: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
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
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  categoryTitle: {
    position: 'absolute',
    bottom: 18,
    left: 20,
    color: COLORS.white,
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.2,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  cardFooter: {
    padding: 15,
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: COLORS.white,
  },
  countBadge: {
    backgroundColor: 'rgba(255, 107, 107, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  countText: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  exploreBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  exploreBtnText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '600',
  },
});

export default CategoriesSection;
