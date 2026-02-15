import React, { useState } from 'react';
import {
  View,
  Text,
  useWindowDimensions,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation } from '../../../context/NavigationContext';
import { COLORS } from '../../../constants/theme';
import PropertyCard, { Property } from '../../../components/PropertyCard';
import CompareBanner from './CompareBanner';

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
    image:
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1000',
    badges: ['MNC Client'],
    verified: true,
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
    image:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1000',
    badges: ['MNC Client'],
    verified: true,
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
    image:
      'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&q=80&w=1000',
    badges: ['MNC Client'],
    verified: true,
  },
];

const FeaturedSection = ({ properties }: { properties: any[] }) => {
  const { width } = useWindowDimensions();
  const { navigate } = useNavigation();
  const [selectedProperties, setSelectedProperties] = useState<Property[]>([]);
  const isMobile = width < 768;

  const containerPadding = isMobile ? 20 : 60;
  const availableWidth = width - containerPadding * 2;
  const gap = 20;

  let cols = 3;
  if (width < 768) cols = 1;
  else if (width < 1100) cols = 2;

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
          image:
            p.media && p.media.length > 0
              ? p.media[0].fileUrl
              : 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1000',
          badges: p.tenantType ? [p.tenantType] : [],
          verified: true,
        }))
      : FEATURED_PROPERTIES;

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
        {displayProperties.map(prop => (
          <PropertyCard
            key={prop.id}
            item={prop}
            width={cardWidth}
            isCompare={true} // Enable compare button
            isSelected={selectedProperties.some(p => p.id === prop.id)}
            onToggleCompare={handleToggleCompare}
            onView={id => navigate(`/propertyDetails/${id}`)}
            onEnquire={id => navigate(`/enquiry/${id}`)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  featuredSection: {
    backgroundColor: COLORS.background,
    paddingVertical: 60,
    alignItems: 'center',
    marginTop: 60,
  },
  sectionTitle: {
    fontWeight: '400',
    color: COLORS.textDark,
    marginBottom: 40,
    textAlign: 'center',
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
    maxWidth: 1440,
    justifyContent: 'center',
  },
});

export default FeaturedSection;
