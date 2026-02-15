import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  DimensionValue,
} from 'react-native';
import { MapPin, Check, Plus, XCircle } from 'lucide-react-native';
import { COLORS } from '../constants/theme';
import { useNavigation } from '../context/NavigationContext';

export interface Property {
  id: string;
  title: string;
  location: string;
  price: string; // "Cost"
  rent: string; // "Annual Rent"
  tenure: string; // "Tenure Left"
  roi: string;
  type: string;
  image: string;
  badges?: string[];
  verified: boolean;
  raw?: any;
}

interface PropertyCardProps {
  item: Property;
  width?: DimensionValue;
  isCompare?: boolean;
  isSelected?: boolean;
  noView?: boolean;
  onToggleCompare?: (prop: Property) => void;
  onRemove?: (id: string) => void;
  onView?: (id: string) => void;
  onEnquire?: (id: string) => void;
  style?: ViewStyle;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  item,
  width = '100%',
  isCompare = false,
  isSelected = false,
  noView = false,
  onToggleCompare,
  onRemove,
  onView,
  onEnquire,
  style,
}) => {
  const { navigate } = useNavigation();

  const handleView = () => {
    navigate(`/propertyDetails/${item.id}`);
    if (onView) onView(item.id);
  };

  const handleEnquire = () => {
    navigate(`/enquiry/${item.id}`);
    if (onEnquire) onEnquire(item.id);
  };

  return (
    <View style={[styles.propertyCard, { width }, style]}>
      <View style={styles.propImageContainer}>
        <Image source={{ uri: item.image }} style={styles.propImage} />

        {/* Verified Badge */}
        {item.verified && (
          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedText}>Verified</Text>
          </View>
        )}

        {/* Remove Button */}
        {onRemove && (
          <TouchableOpacity
            style={styles.removeBtn}
            onPress={() => onRemove(item.id)}
          >
            <XCircle
              size={24}
              color={COLORS.white}
              fill={COLORS.textSecondary}
            />
          </TouchableOpacity>
        )}

        {/* Badges (e.g., MNC Client) */}
        <View style={styles.badgeContainer}>
          {item.badges?.map((badge, idx) => (
            <View key={idx} style={styles.mncBadge}>
              <Text style={styles.mncBadgeText}>{badge}</Text>
            </View>
          ))}
        </View>

        {/* Compare Button - ONLY if isCompare is true */}
        {isCompare && onToggleCompare && (
          <TouchableOpacity
            style={[
              styles.compareBtn,
              isSelected && { backgroundColor: COLORS.primary },
            ]}
            onPress={() => onToggleCompare(item)}
          >
            {isSelected ? (
              <View
                style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
              >
                <Check size={14} color={COLORS.white} />
                <Text style={[styles.compareText, { color: COLORS.white }]}>
                  Selected
                </Text>
              </View>
            ) : (
              <View
                style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
              >
                <Plus size={14} color={COLORS.primary} />
                <Text style={styles.compareText}>Compare</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.propContent}>
        <Text style={styles.propCategory}>{item.title}</Text>
        <Text style={styles.propLocation}>
          <MapPin size={14} color={COLORS.primary} style={{ marginRight: 4 }} />{' '}
          {item.location}
        </Text>

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
          {!noView && (
            <TouchableOpacity style={styles.viewBtn} onPress={handleView}>
              <Text style={styles.viewBtnText}>View</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.enquireBtn} onPress={handleEnquire}>
            <Text style={styles.enquireBtnText}>Enquire</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
    height: 180, // Reduced slightly to fit comparison better
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
    zIndex: 1,
  },
  verifiedText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
  },
  removeBtn: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 2,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 20,
    padding: 2,
  },
  badgeContainer: {
    position: 'absolute',
    bottom: 50,
    left: 15,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
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
    elevation: 2,
  },
  compareText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 13,
  },
  propContent: {
    padding: 15, // Reduced padding
  },
  propCategory: {
    fontSize: 16, // Reduced font
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 4,
  },
  propLocation: {
    fontSize: 12, // Reduced font
    color: COLORS.textSecondary,
    marginBottom: 10,
  },
  propDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  propDetailItem: {
    justifyContent: 'center',
    gap: 4,
  },
  detailLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  detailValue: {
    color: COLORS.textDark,
    fontWeight: '700',
  },
  roiBadge: {
    backgroundColor: COLORS.background,
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
  },
  roiLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginBottom: 2,
  },
  roiValue: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '800',
  },
  propActions: {
    flexDirection: 'row',
    gap: 10,
  },
  viewBtn: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.divider,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewBtnText: {
    color: COLORS.textSecondary,
    fontWeight: '600',
    fontSize: 12,
  },
  enquireBtn: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    alignItems: 'center',
  },
  enquireBtnText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 12,
  },
});

export default PropertyCard;
