import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  StyleSheet,
} from 'react-native';

const CATEGORIES = [
  {
    id: '1',
    title: 'Residential',
    count: '26 Property Listed',
    image: 'https://images.unsplash.com/photo-1553456558-aff63285bdd1?auto=format&fit=crop&q=80&w=1000',
  },
  {
    id: '2',
    title: 'Industrial',
    count: '26 Property Listed',
    image:
      'https://images.unsplash.com/photo-1553456558-aff63285bdd1?auto=format&fit=crop&q=80&w=1000',
  },
  {
    id: '3',
    title: 'Commercial',
    count: '26 Property Listed',
    image:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000',
  },
  {
    id: '4',
    title: 'Others',
    count: '26 Property Listed',
    image:
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1000',
  },
];

const CategoryCard = ({
  item,
  width,
}: {
  item: (typeof CATEGORIES)[0];
  width: number;
}) => (
  <View style={[styles.card, { width }]}>
    <View style={styles.imageContainer}>
      <Image
        source={{ uri: item.image }}
        style={styles.image}
        resizeMode="cover"
      />
      <Text style={styles.categoryTitle}>{item.title}</Text>
    </View>
    <View style={styles.cardFooter}>
      <View style={styles.countBadge}>
        <Text style={styles.countText}>{item.count}</Text>
      </View>
      <TouchableOpacity style={styles.exploreBtn}>
        <Text style={styles.exploreBtnText}>Explore</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const CategoriesSection = () => {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const containerPadding = isMobile ? 20 : 60;
  const availableWidth = width - containerPadding * 2;
  const gap = 20;

  // Responsive columns
  let cols = 4;
  if (width < 600) cols = 1;
  else if (width < 900) cols = 2;
  else if (width < 1200) cols = 3;

  const cardWidth = (availableWidth - gap * (cols - 1)) / cols;

  return (
    <View style={[styles.container, { paddingHorizontal: containerPadding }]}>
      <Text style={[styles.sectionTitle, { fontSize: isMobile ? 28 : 42 }]}>
        Explore all Categories
      </Text>
      <View style={[styles.grid, { gap }]}>
        {CATEGORIES.map(cat => (
          <CategoryCard key={cat.id} item={cat} width={cardWidth} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 60,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  sectionTitle: {
    fontWeight: '400',
    color: '#1A1A1A',
    marginBottom: 40,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 1440,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 20,
  },
  imageContainer: {
    height: 200,
    width: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  categoryTitle: {
    position: 'absolute',
    top: 20,
    left: 20,
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  cardFooter: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  countBadge: {
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  countText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  exploreBtn: {
    backgroundColor: '#D32F2F',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  exploreBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default CategoriesSection;
