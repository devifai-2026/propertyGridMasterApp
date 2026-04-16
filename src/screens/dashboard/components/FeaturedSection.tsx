import React, { useState } from 'react';
import {
  View,
  Text,
  useWindowDimensions,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { useNavigation } from '../../../context/NavigationContext';
import { COLORS, FONTS } from '../../../constants/theme';
import PropertyCard, { Property } from '../../../components/PropertyCard';
import CompareBanner from './CompareBanner';
import LinearGradient from 'react-native-linear-gradient';

const FEATURED_PROPERTIES: Property[] = [
  {
    id: '1',
    title: 'Residential Space',
    location: 'Pune, Mundhva',
    price: '₹36.8 Crore',
    rent: '₹22.87 Lakhs',
    tenure: '10 Yrs',
    roi: '90.21%',
    type: 'Residential',
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1000',
    ],
    badges: ['MNC Client'],
    isVerified: 'completed',
    verified: true,
    raw: { userId: 'mock-user' },
  },
  {
    id: '2',
    title: 'Commercial Space',
    location: 'Mumbai, Bandra',
    price: '₹42.5 Crore',
    rent: '₹28.50 Lakhs',
    tenure: '8 Yrs',
    roi: '90.21%',
    type: 'Commercial',
    images: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&q=80&w=1000',
    ],
    badges: ['MNC Client'],
    isVerified: 'completed',
    verified: true,
    raw: { userId: 'mock-user' },
  },
  {
    id: '3',
    title: 'Industrial Space',
    location: 'Delhi, Noida',
    price: '₹28.3 Crore',
    rent: '₹18.90 Lakhs',
    tenure: '12 Yrs',
    roi: '90.21%',
    type: 'Industrial',
    images: [
      'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1000',
    ],
    badges: ['MNC Client'],
    isVerified: 'completed',
    verified: true,
    raw: { userId: 'mock-user' },
  },
];

const PropertyCardSkeleton = ({ width }: { width: number }) => {
  const pulseAnim = React.useRef(new Animated.Value(0.3)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.7,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ]),
    ).start();
  }, [pulseAnim]);

  return (
    <View style={[styles.skeletonCard, { width }]}>
      <View style={styles.skeletonHeader}>
        <Animated.View style={[styles.skeletonText, { width: '60%', opacity: pulseAnim }]} />
        <Animated.View style={[styles.skeletonText, { width: '40%', height: 16, opacity: pulseAnim }]} />
      </View>
      <Animated.View style={[styles.skeletonImage, { opacity: pulseAnim }]} />
      <View style={styles.skeletonContent}>
        <View style={styles.skeletonRow}>
          <View style={{ flex: 1, gap: 10 }}>
            <Animated.View style={[styles.skeletonText, { width: '80%', height: 14, opacity: pulseAnim }]} />
            <Animated.View style={[styles.skeletonText, { width: '70%', height: 14, opacity: pulseAnim }]} />
            <Animated.View style={[styles.skeletonText, { width: '90%', height: 14, opacity: pulseAnim }]} />
          </View>
          <Animated.View style={[styles.skeletonRoi, { opacity: pulseAnim }]} />
        </View>
        <View style={styles.skeletonActions}>
          <Animated.View style={[styles.skeletonBtn, { width: 80, opacity: pulseAnim }]} />
          <Animated.View style={[styles.skeletonBtn, { width: 100, opacity: pulseAnim }]} />
        </View>
      </View>
    </View>
  );
};

const FeaturedSection = ({ properties, loading }: { properties: any[]; loading?: boolean }) => {
  const { width } = useWindowDimensions();
  const { navigate } = useNavigation();
  const [selectedProperties, setSelectedProperties] = useState<Property[]>([]);
  const isMobile = width < 768;

  const containerPadding = width < 768 ? 9 : 10;
  const availableWidth = width - containerPadding * 2;
  const gap = 20;

  let cols = 3;
  if (width < 768) cols = 1;
  else if (width < 900) cols = 2;

  const cardWidth = ((availableWidth - gap * (cols - 1)) / cols) as number;

  const displayProperties: Property[] =
    properties && properties.length > 0
      ? properties.slice(0, 3).map((p: any) => ({
        id: p.propertyId,
        title: p.propertyType || 'Property',
        location: `${p.city || ''}, ${p.state || ''}`,
        price: p.sellingPrice ? `₹${p.sellingPrice} Cr` : 'N/A',
        rent:
          parseFloat(p.totalMonthlyRent) > 0
            ? `₹${p.totalMonthlyRent}`
            : parseFloat(p.rentPerSqftMonthly) > 0
              ? `₹${p.rentPerSqftMonthly} / sq ft`
              : 'N/A',
        tenure: p.leaseDurationYears
          ? `${parseFloat(p.leaseDurationYears).toFixed(1)} Yrs`
          : 'N/A',
        roi: p.grossRentalYield ? `${p.grossRentalYield}%` : 'N/A',
        type: p.propertyType,
        images:
          p.media && p.media.length > 0
            ? p.media.map((m: any) => m.fileUrl)
            : null,
        badges: p.tenantType ? [p.tenantType] : [],
        isVerified: p.isVerified,
        verified: p.isVerified === 'partial' || p.isVerified === 'completed',
        raw: p,
      }))
      : [];

  const handleToggleCompare = (property: Property) => {
    setSelectedProperties(prev => {
      const isSelected = prev.some(p => p.id === property.id);
      if (isSelected) {
        return prev.filter(p => p.id !== property.id);
      } else {
        if (prev.length >= 3) {
          Alert.alert('Limit Reached', 'You can compare up to 3 properties.');
          return prev;
        }
        return [...prev, property];
      }
    });
  };

  const handleClear = () => setSelectedProperties([]);
  const handleRemove = (id: string) =>
    setSelectedProperties(prev => prev.filter(p => p.id !== id));

  const handleCompare = () => {
    if (selectedProperties.length < 2) return;
    const ids = selectedProperties.map(p => p.id).join(',');
    // Navigate to compare screen with IDs
    navigate(`/compare/${ids}`);
  };

  const handleEnquire = () => {
    navigate('/explore-properties');
  };

  return (
    <View
      style={[styles.featuredSection, { paddingHorizontal: containerPadding }]}
    >
      {selectedProperties.length > 0 && (
        <View style={styles.stickyBannerWrapper}>
          <CompareBanner
            selectedProperties={selectedProperties}
            onClear={handleClear}
            onRemove={handleRemove}
            onCompare={handleCompare}
          />
        </View>
      )}

      <Text style={[styles.sectionTitle, { fontSize: isMobile ? 28 : 42 }]}>
        Featured Properties
      </Text>
      <View style={[styles.gridContainer, { gap }]}>
        {loading ? (
          // Show 3 skeletons during loading
          [1, 2, 3].map((_, i) => (
            <PropertyCardSkeleton key={`skeleton-${i}`} width={cardWidth > 420 ? 420 : cardWidth} />
          ))
        ) : (
          displayProperties.map(prop => (
            <PropertyCard
              key={prop.id}
              item={prop}
              isCompare={true} // Enable compare button
              isSelected={selectedProperties.some(p => p.id === prop.id)}
              onToggleCompare={handleToggleCompare}
              onView={id => navigate(`/propertyDetails/${id}`)}
              onEnquire={id => navigate(`/enquiry/${id}`)}
            />
          ))
        )}
      </View>
      <View style={styles.explorePropertyWrapper}>
        <TouchableOpacity
          onPress={handleEnquire}
          style={styles.explorePropertyBtn}
        >
          <LinearGradient
            colors={['#EE2529', '#C73834']}
            start={{ x: 0.0159, y: 0.5 }}
            end={{ x: 0.972, y: 0.5 }}
            style={styles.explorePropertyGradient}
          >
            <Text style={styles.explorePropertyText}>Explore Properties</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  featuredSection: {
    backgroundColor: '#F2F2F2',
    paddingVertical: 60,
    alignItems: 'center',
    marginTop: 60,
  },
  sectionTitle: {
    fontWeight: '400',
    color: '#262626',
    marginBottom: 40,
    textAlign: 'center',
    fontSize: 42,
    fontFamily:FONTS.avenir,
    // fontStyle: 'normal',
  },
  stickyBannerWrapper: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    zIndex: 100,
    alignItems: 'center',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    maxWidth: '100%',
    justifyContent: 'center',
  },
  explorePropertyWrapper: {
    marginTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  explorePropertyBtn: {
    borderRadius: 5,
    overflow: 'hidden',
  },
  explorePropertyGradient: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  explorePropertyText: {
    fontFamily: 'Montserrat',
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 15,
  },
  skeletonCard: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    maxWidth: '100%',
  },
  skeletonHeader: {
    padding: 20,
    gap: 8,
  },
  skeletonText: {
    height: 24,
    backgroundColor: '#E1E1E1',
    borderRadius: 4,
  },
  skeletonImage: {
    height: 277,
    width: '100%',
    backgroundColor: '#F0F0F0',
  },
  skeletonContent: {
    padding: 20,
  },
  skeletonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  skeletonRoi: {
    width: 97,
    height: 78,
    backgroundColor: '#F0F0F0',
    borderRadius: 15,
  },
  skeletonActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  skeletonBtn: {
    height: 40,
    backgroundColor: '#F0F0F0',
    borderRadius: 5,
  },
});

export default FeaturedSection;
