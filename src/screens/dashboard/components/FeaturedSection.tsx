import React from 'react';
import {
  View,
  Text,
  useWindowDimensions,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { useNavigation } from '../../../context/NavigationContext';
import { COLORS, FONTS } from '../../../constants/theme';
import PropertyCard, { Property } from '../../../components/PropertyCard';
import { useCompare } from '../../../context/CompareContext';
import LinearGradient from 'react-native-linear-gradient';

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
  const { toggleCompare, isSelected: isCompareSelected } = useCompare();
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
              ? `₹${p.rentPerSqftMonthly}`
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

  const handleEnquire = () => {
    navigate('/explore-properties');
  };

  return (
    <View
      style={[styles.featuredSection, { paddingHorizontal: containerPadding }]}
    >
      <Text style={[styles.sectionTitle, { fontSize: isMobile ? 28 : 42 }]}>
        Featured Properties
      </Text>
      <View style={[styles.gridContainer, { gap }]}>
        {loading ? (
          [1, 2, 3].map((_, i) => (
            <PropertyCardSkeleton key={`skeleton-${i}`} width={cardWidth > 420 ? 420 : cardWidth} />
          ))
        ) : (
          displayProperties.map(prop => (
            <PropertyCard
              key={prop.id}
              item={prop}
              isCompare={true}
              isSelected={isCompareSelected(prop.id)}
              onToggleCompare={toggleCompare}
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
