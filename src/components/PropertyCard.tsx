import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  DimensionValue,
  Platform,
} from 'react-native';
import {
  MapPin,
  Check,
  Plus,
  XCircle,
  Image as LucideImage,
  ChevronLeft,
  ChevronRight,
  Share2,
  Heart,
} from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS } from '../constants/theme';
import { useNavigation } from '../context/NavigationContext';
import { useAuth } from '../context/AuthContext';

export interface Property {
  id: string;
  title: string;
  location: string;
  price: string; // "Cost"
  rent: string; // "Annual Rent"
  tenure: string; // "Tenure Left"
  roi: string;
  type: string;
  images: string[] | null; // Changed from image: string
  badges?: string[];
  verified?: boolean;
  isVerified?: string;
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
  const { user } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const hasImages = item.images && item.images.length > 0;
  const imageCount = hasImages ? item.images!.length : 0;

  // Auto-slideshow effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (imageCount > 1) {
      interval = setInterval(() => {
        setCurrentImageIndex(prev => (prev + 1) % imageCount);
      }, 3000); // Change image every 3 seconds
    }
    return () => clearInterval(interval);
  }, [imageCount]);

  const handlePrevImage = () => {
    setCurrentImageIndex(prev => (prev - 1 + imageCount) % imageCount);
  };

  const handleNextImage = () => {
    setCurrentImageIndex(prev => (prev + 1) % imageCount);
  };

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
      {/* Header Section */}
      <View style={styles.propHeader}>
        <View style={styles.headerTextGroup}>
          <Text style={styles.propCategory}>{item.title}</Text>
          <View style={styles.locationRow}>
            <MapPin size={16} color="#EF4444" style={{ marginRight: 4 }} />
            <Text style={styles.propLocationText}>{item.location}</Text>
          </View>
        </View>

        {/* Verified Badge */}
        {(item.isVerified === 'partial' || item.isVerified === 'completed') && (
          <View style={styles.verifiedBadgeContainer}>
            <LinearGradient
              colors={['#EE2529', '#C73834']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.verifiedBadgeSlant}
            >
              <Text style={styles.verifiedText}>Verified</Text>
            </LinearGradient>
          </View>
        )}
      </View>

      {/* Image Section */}
      <View style={styles.propImageContainer}>
        {!hasImages ? (
          <View style={[styles.propImage, styles.noImageContainer]}>
            <LucideImage size={40} color={COLORS.textSecondary} />
            <Text style={styles.noImageText}>No Image Available</Text>
          </View>
        ) : (
          <>
            <Image
              source={{ uri: item.images![currentImageIndex] }}
              style={styles.propImage}
              resizeMode="cover"
            />
            {/* Slideshow Controls */}
            {imageCount > 1 && (
              <View style={styles.dotsContainer}>
                {item.images!.map((_, idx) => (
                  <View
                    key={idx}
                    style={[
                      styles.dot,
                      idx === currentImageIndex && styles.activeDot,
                    ]}
                  />
                ))}
              </View>
            )}
          </>
        )}

        {/* Share and Favorite Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.iconButton}>
            <Share2 size={20} color={COLORS.white} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Heart size={20} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        {/* Overlay Bar for MNC Client and Compare */}
        <View style={styles.blurContainer}>
          <View style={styles.badgeWrapper}>
            {item.badges?.map((badge, idx) => (
              <View key={idx} style={styles.mncBadge}>
                <Text style={styles.mncBadgeText}>{badge}</Text>
              </View>
            ))}
          </View>

          {isCompare && onToggleCompare && (
            <TouchableOpacity
              style={[
                styles.compareBtnInternal,
                isSelected && { backgroundColor: COLORS.primary },
              ]}
              onPress={() => onToggleCompare(item)}
            >
              <View style={styles.compareBtnContent}>
                <Plus size={16} color={isSelected ? COLORS.white : "#EF4444"} />
                <Text style={[styles.compareText, isSelected && { color: COLORS.white }]}>
                  {isSelected ? 'Selected' : 'Compare'}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Content Section */}
      <View style={styles.propContent}>
        <View style={styles.propDetailsRow}>
          <View style={styles.propDetailItem}>
            <Text style={styles.detailLabel}>
              Cost: <Text style={styles.detailValue}>
                {item.price !== 'null' && item?.price ? item?.price : '0'}
              </Text>
            </Text>
            <Text style={styles.detailLabel}>
              Annual Rent : <Text style={styles.detailValue}>{item.rent}</Text>
            </Text>
            <Text style={styles.detailLabel}>
              Tenure Left : <Text style={styles.detailValue}>{item.tenure}</Text>
            </Text>
          </View>

          <View style={styles.roiCardContainer}>
            <LinearGradient
              colors={['#F2F2F2', '#FFFFFF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              locations={[0.0761, 0.7484]}
              style={styles.roiCardGradient}
            >
              <Text style={styles.roiLabel}>ROI</Text>
              <View style={styles.roiValueContainer}>
                <Text style={styles.roiValueText}>{item.roi}</Text>
                <Text style={styles.percentageSymbol}>%</Text>
              </View>
            </LinearGradient>
          </View>
        </View>

        <View style={styles.propActions}>
          {!noView && (
            <TouchableOpacity style={styles.viewBtn} onPress={handleView}>
              <Text style={styles.viewBtnText}>View</Text>
            </TouchableOpacity>
          )}
          {user && (
            <TouchableOpacity
              onPress={handleEnquire}
              style={styles.enquireBtnWrapper}
            >
              <LinearGradient
                colors={['#EE2529', '#C73834']}
                start={{ x: 0.0159, y: 0.5 }}
                end={{ x: 0.972, y: 0.5 }}
                style={styles.enquireBtnGradient}
              >
                <Text style={styles.enquireBtnText}>Enquire</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {onRemove && (
        <TouchableOpacity
          style={styles.removeBtn}
          onPress={() => onRemove(item.id)}
        >
          <XCircle size={20} color={COLORS.white} fill={COLORS.textSecondary} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  propertyCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12, // Increased rounding
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  propHeader: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTextGroup: {
    flex: 1,
  },
  propCategory: {
    fontSize: 26,
    fontWeight: '400',
    color: '#333',
    marginBottom: 2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  propLocationText: {
    fontSize: 15,
    color: '#666',
    fontWeight: '400',
  },
  verifiedBadgeContainer: {
    position: 'absolute',
    top: 16,
    right: 0,
    zIndex: 10,
  },
  verifiedBadgeSlant: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    // Using simple skew for the angled effect
    transform: [{ skewX: '-15deg' }],
    marginRight: -10, // Pull it to the edge
  },
  verifiedText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    transform: [{ skewX: '15deg' }], // Counter-skew text
  },
  propImageContainer: {
    height: 280,
    width: '100%',
    position: 'relative',
    backgroundColor: '#f9f9f9',
  },
  propImage: {
    width: '100%',
    height: '100%',
  },
  noImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  noImageText: {
    marginTop: 6,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 15,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    zIndex: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  activeDot: {
    backgroundColor: '#ED2B2B',
  },
  actionButtons: {
    position: 'absolute',
    top: 20,
    right: 20,
    gap: 12,
    zIndex: 2,
  },
  iconButton: {
    backgroundColor: 'rgba(51, 51, 51, 0.6)', // Darker gray in ss
    borderRadius: 12,
    width: 45,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blurContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(10px)',
      },
    }),
  } as ViewStyle,
  badgeWrapper: {
    flexDirection: 'row',
    gap: 8,
  },
  mncBadge: {
    backgroundColor: '#FFF9C4',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  mncBadgeText: {
    color: '#938131',
    fontSize: 14,
    fontWeight: '600',
  },
  compareBtnInternal: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  compareBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  compareText: {
    color: '#ED2B2B',
    fontWeight: '600',
    fontSize: 14,
  },
  propContent: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  propDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  propDetailItem: {
    flex: 1,
    gap: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: '#999',
    fontWeight: '500',
  },
  detailValue: {
    color: '#000',
    fontWeight: '700',
    fontSize: 18,
  },
  roiCardContainer: {
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    minWidth: 70,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  roiCardGradient: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 110,
  },
  roiLabel: {
    fontSize: 18,
    color: '#111',
    fontWeight: '800',
    marginBottom: 4,
  },
  roiValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  roiValueText: {
    fontSize: 26,
    color: '#EE2529',
    fontWeight: '800',
  },
  percentageSymbol: {
    fontSize: 16,
    color: '#EE2529',
    fontWeight: '800',
    marginLeft: 1,
  },
  propActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
  },
  viewBtn: {
    flex: 1,
    maxWidth: 60,
    paddingVertical: 13,
    borderWidth: 1.2,
    borderColor: '#888',
    borderRadius: 5,
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  viewBtnText: {
    color: '#666',
    fontWeight: '500',
    fontSize: 13,
  },
  enquireBtnWrapper: {
    flex: 1,
    maxWidth: 80,
    borderRadius: 125,
    overflow: 'hidden',
  },
  enquireBtnGradient: {
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  enquireBtnText: {
    color: COLORS.white,
    fontWeight: '500',
    fontSize: 13,
  },
  removeBtn: {
    position: 'absolute',
    top: 5,
    left: 5,
    zIndex: 10,
  },
});

export default PropertyCard;
