import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  StyleSheet,
} from 'react-native';
import { COLORS } from '../../../constants/theme';

export interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  rent: string;
  tenure: string;
  roi: string;
  type: string;
  image: string;
  badges: string[];
  verified: boolean;
}

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

const PropertyCard = ({ item, width }: { item: Property; width: number }) => (
  <View style={[styles.propertyCard, { width }]}>
    <View style={styles.propImageContainer}>
      <Image source={{ uri: item.image }} style={styles.propImage} />
      {item.verified && (
        <View style={styles.verifiedBadge}>
          <Text style={styles.verifiedText}>Verified</Text>
        </View>
      )}
      <View style={styles.badgeContainer}>
        {item.badges.map((badge, idx) => (
          <View key={idx} style={styles.mncBadge}>
            <Text style={styles.mncBadgeText}>{badge}</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity style={styles.compareBtn}>
        <Text style={styles.compareText}>+ Compare</Text>
      </TouchableOpacity>
    </View>

    <View style={styles.propContent}>
      <Text style={[styles.propCategory, { fontSize: 18 }]}>{item.title}</Text>
      <Text style={styles.propLocation}>📍 {item.location}</Text>

      <View style={styles.propDetailsRow}>
        <View style={styles.propDetailItem}>
          <Text style={styles.detailLabel}>
            Cost: <Text style={styles.detailValue}>{item.price}</Text>
          </Text>
          <Text style={styles.detailLabel}>
            Annual Rent: <Text style={styles.detailValue}>{item.rent}</Text>
          </Text>
          <Text style={styles.detailLabel}>
            Tenure Left: <Text style={styles.detailValue}>{item.tenure}</Text>
          </Text>
        </View>
        <View style={styles.roiBadge}>
          <Text style={styles.roiLabel}>ROI</Text>
          <Text style={styles.roiValue}>{item.roi}</Text>
        </View>
      </View>

      <View style={styles.propActions}>
        <TouchableOpacity style={styles.viewBtn}>
          <Text style={styles.viewBtnText}>View</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.enquireBtn}>
          <Text style={styles.enquireBtnText}>Enquire</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

const FeaturedSection = () => {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const containerPadding = isMobile ? 20 : 60;
  const availableWidth = width - containerPadding * 2;
  const gap = 20;

  let cols = 3;
  if (width < 768) cols = 1;
  else if (width < 1100) cols = 2;

  const cardWidth = (availableWidth - gap * (cols - 1)) / cols;

  return (
    <View
      style={[styles.featuredSection, { paddingHorizontal: containerPadding }]}
    >
      <Text style={[styles.sectionTitle, { fontSize: isMobile ? 28 : 42 }]}>
        Featured Properties
      </Text>
      <View style={[styles.gridContainer, { gap }]}>
        {FEATURED_PROPERTIES.map(prop => (
          <PropertyCard key={prop.id} item={prop} width={cardWidth} />
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
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    maxWidth: 1440,
    justifyContent: 'center',
  },
  propertyCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  propImageContainer: {
    height: 250,
    width: '100%',
    position: 'relative',
  },
  propImage: {
    width: '100%',
    height: '100%',
  },
  verifiedBadge: {
    position: 'absolute',
    top: 15,
    right: 0,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  },
  verifiedText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
  },
  badgeContainer: {
    position: 'absolute',
    bottom: 50,
    left: 15,
  },
  mncBadge: {
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  mncBadgeText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  compareBtn: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
  },
  compareText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 13,
  },
  propContent: {
    padding: 20,
  },
  propCategory: {
    fontSize: 22,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 4,
  },
  propLocation: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  propDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  propDetailItem: {
    justifyContent: 'center',
    gap: 6,
  },
  detailLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  detailValue: {
    color: COLORS.textDark,
    fontWeight: '700',
  },
  roiBadge: {
    backgroundColor: COLORS.background,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
  },
  roiLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginBottom: 2,
  },
  roiValue: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '800',
  },
  propActions: {
    flexDirection: 'row',
    gap: 15,
  },
  viewBtn: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: COLORS.divider,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewBtnText: {
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  enquireBtn: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    alignItems: 'center',
  },
  enquireBtnText: {
    color: COLORS.white,
    fontWeight: '600',
  },
});

export default FeaturedSection;
