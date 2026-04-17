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
  useWindowDimensions,
  Share,
} from 'react-native';
import {
  MapPin,
  Check,
  Plus,
  XCircle,
  Image as LucideImage,
  ChevronLeft,
  ChevronRight,
  Heart,
} from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, FONTS } from '../constants/theme';
import { useNavigation } from '../context/NavigationContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import VerifiedSvg from './VerifiedSvg';
import ShareIcon from './ShareIcon';
import { usePropertyAPIs } from '../../helpers/hooks/propertyAPIs/usePropertyApis';
declare const window: any;

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
  width,
  isCompare = false,
  isSelected = false,
  noView = false,
  onToggleCompare,
  onRemove,
  onView,
  onEnquire,
  style,
}) => {
  const { width: screenWidth } = useWindowDimensions();
  const isMobile = screenWidth < 768;
  const { navigate, openLoginModal } = useNavigation();
  const { user } = useAuth();
  const { toggleLike, likedPropertyIds } = useWishlist();
  const { toggleLikeProperty } = usePropertyAPIs();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLocationExpanded, setIsLocationExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    setIsLiked(likedPropertyIds.has(item.id));
  }, [likedPropertyIds, item.id]);

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

  const handleToggleLike = () => {
    if (!user) {
      openLoginModal();
      return;
    }
    toggleLike(item.id);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this property: ${item.title} at ${item.location}. Price: ${item.price}, ROI: ${item.roi}%`,
        url: Platform.OS === 'web' ? window.location.href : undefined,
      });
    } catch (error) {
      console.error('Error sharing property:', error);
    }
  };

  // if (!user) {
  //   return (
  //     <TouchableOpacity
  //       activeOpacity={0.95}
  //       onPress={() => navigate('/login')}
  //       style={[styles.propertyCard, styles.lockedCard, { width }, style]}
  //     >
  //       <LinearGradient
  //         colors={['#F9FAFB', '#FFFFFF']}
  //         style={styles.lockedGradient}
  //       >
  //         <View style={styles.lockedIconCircle}>
  //           <MapPin size={24} color="#ccc" style={{ marginBottom: 8 }} />
  //         </View>
  //         <Text style={styles.lockedTitle}>Exclusive Property Listing</Text>
  //         <Text style={styles.lockedSub}>
  //           Please sign in to view location, pricing, and ROI details of this premium space.
  //         </Text>
  //         <View style={styles.lockedLoginBtn}>
  //           <Text style={styles.lockedLoginBtnText}>Sign In to Unlock</Text>
  //         </View>
  //       </LinearGradient>
  //     </TouchableOpacity>
  //   );
  // }

  return (
    <View style={[styles.propertyCard, { width }, style]}>
      {/* Header Section */}
      <View style={styles.propHeader}>
        <View style={styles.headerTextGroup}>
          <Text style={[styles.propCategory, isMobile && { fontSize: 18 }]} numberOfLines={1}>
            {item.title}
          </Text>
          <TouchableOpacity
            style={styles.locationRow}
            onPress={() => setIsLocationExpanded(!isLocationExpanded)}
            activeOpacity={0.7}
          >
            <MapPin size={16} color="#EF4444" style={{ marginRight: 4 }} />
            <Text
              style={[styles.propLocationText, isMobile && { fontSize: 14 }]}
              numberOfLines={isLocationExpanded ? undefined : 1}
              ellipsizeMode="tail"
            >
              {item.location}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Verified Badge */}
        {(item.isVerified === 'partial' || item.isVerified === 'completed') && (
          <View style={styles.verifiedBadgeContainer}>
            <VerifiedSvg width={100} height={28} />
            <View style={styles.verifiedTextOverlay}>
              <Text style={styles.verifiedText}>
                {item.isVerified === 'completed' ? 'Verified' : 'Partial'}
              </Text>
            </View>
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
            {imageCount >= 1 && (
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
          <TouchableOpacity style={styles.iconButton} onPress={handleShare}>
            <ShareIcon width={19.35} height={16.67} color={COLORS.white} />
          </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleToggleLike}
            >
              <Heart
                width={19.35}
                height={16.67}
                color={isLiked ? COLORS.primary : COLORS.white}
                fill={isLiked ? COLORS.primary : 'transparent'}
              />
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
                <Plus size={14} color={isSelected ? COLORS.white : '#EF4444'} />
                <Text
                  style={[
                    styles.compareText,
                    isSelected && { color: COLORS.white },
                  ]}
                >
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
              Cost:{' '}
              <Text style={styles.detailValue}>
                {item.price !== 'null' && item?.price ? item?.price : '0'}
              </Text>
            </Text>
            <Text style={styles.detailLabel}>
              Annual Rent : <Text style={styles.detailValue}>{item.rent}</Text>
            </Text>
            <Text style={styles.detailLabel}>
              Tenure Left :{' '}
              <Text style={styles.detailValue}>{item.tenure}</Text>
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
          <TouchableOpacity
            onPress={() => {
              if (user) {
                handleEnquire();
              } else {
                openLoginModal();
              }
            }}
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
    borderRadius: 15, // Increased rounding
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    width: 420,
    maxWidth: '100%',
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
    paddingRight: 110,
  },
  propCategory: {
    fontFamily: 'Montserrat',
    fontSize: 24,
    fontWeight: '400',
    color: '#262626',
    marginBottom: 2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  propLocationText: {
    fontSize: 16,
    color: '#262626',
    fontWeight: '400',
    fontFamily:'Montserrat',
  },
  verifiedBadgeContainer: {
    position: 'absolute',
    bottom: 15,
    right: 0,
    zIndex: 10,
  },
  verifiedTextOverlay: {
    position: 'absolute',
    paddingLeft: 2,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifiedText: {
    fontFamily: "Montserrat",
    color: '#F2F2F2',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 16,
    letterSpacing: 0,
  },
  propImageContainer: {
    height: 277,
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
    fontFamily: FONTS.main,
    marginTop: 6,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 74,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    zIndex: 10,
  },
  dot: {
    width: 7.91,
    height: 7.91,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  activeDot: {
    width: 11.42,
    height: 11.42,
    backgroundColor: '#EE2529',
  },
  actionButtons: {
    position: 'absolute',
    top: 20,
    right: 20,
    gap: 12,
    zIndex: 2,
  },
  iconButton: {
    backgroundColor: '#2626268A',
    borderRadius: 100,
    width: 32,
    height: 32,
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
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(2px)',
      },
    }),
  } as ViewStyle,
  badgeWrapper: {
    flexDirection: 'row',
    gap: 8,
  },
  mncBadge: {
    backgroundColor: '#FFF9C4',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 100,
  },
  mncBadgeText: {
    fontFamily: FONTS.main,
    color: '#767676', // User specified color
    fontSize: 16,
    fontWeight: '400',
  },
  compareBtnInternal: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    // shadowOffset: { width: 0, height: 2 },
    // height: 30,

    // elevation: 3,
    // paddingTop: 10,
    // paddingBottom: 8
  },
  compareBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  compareText: {
    fontFamily: FONTS.main,
    color: '#ED2B2B',
    fontWeight: '600',
    fontSize: 12,
  },
  propContent: {
    paddingHorizontal: 26,
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
    gap: 8,
  },
  detailLabel: {
    fontFamily: 'Montserrat',
    fontSize: 16,
    color: '#767676',
    fontWeight: '400',
    lineHeight: 22,
    paddingBottom: 4
  },
  detailValue: {
    fontFamily: 'Montserrat',
    color: '#262626',
    fontWeight: '600',
    fontSize: 18,
    textAlign: 'center',
  },
  roiCardContainer: {
  borderRadius: 15,
  shadowColor: '#000',
  shadowOffset: { width: 2, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 2,
  elevation: 2, // Lower elevation for Android
  width: 97,
  height: 78,
  overflow: 'hidden',
  borderWidth: 0,
},
  roiCardGradient: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
  },
  roiLabel: {
    fontFamily: 'Montserrat',
    fontSize: 24,
    color: '#262626',
    fontWeight: '600',
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  roiValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  roiValueText: {
    fontFamily: 'Montserrat',
    fontSize: 22,
    color: '#EE2529',
    fontWeight: '600',
  },
  percentageSymbol: {
    fontFamily: 'Montserrat',
    fontSize: 16,
    color: '#EE2529',
    fontWeight: '600',
    marginLeft: 1,
  },
  propActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    marginTop: 16,
  },
  viewBtn: {
    flex: 1,
    maxWidth: 80,
    paddingVertical: 12,
    borderWidth: 1.2,
    borderColor: '#888',
    borderRadius: 5,
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  viewBtnText: {
    fontFamily: 'Montserrat',
    color: '#767676',
    fontWeight: '500',
    fontSize: 14,
  },
  enquireBtnWrapper: {
    flex: 1,
    maxWidth: 100,
    borderRadius: 5,
    overflow: 'hidden',
  },
 enquireBtnGradient : {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  enquireBtnText: {
    fontFamily: FONTS.main,
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 15,
  },
  removeBtn: {
    position: 'absolute',
    top: 5,
    left: 5,
    zIndex: 10,
  },
  lockedCard: {
    height: 380,
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
  },
  lockedGradient: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  lockedIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  lockedTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
    textAlign: 'center',
  },
  lockedSub: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  lockedLoginBtn: {
    backgroundColor: '#EE2529',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  lockedLoginBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default PropertyCard;
