import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { X, AlertCircle, Image as LucideImage, MapPin } from 'lucide-react-native';
import { COLORS } from '../../../constants/theme';
import LinearGradient from 'react-native-linear-gradient';
import { Property } from '../../../components/PropertyCard';
import warning from "../../../assets/ExploreProperties/warning.png"

interface CompareBannerProps {
  selectedProperties: Property[];
  onClear: () => void;
  onRemove: (id: string) => void;
  onCompare: () => void;
}

const CompareBanner: React.FC<CompareBannerProps> = ({
  selectedProperties,
  onClear,
  onRemove,
  onCompare,
}) => {
  return (
    <View style={styles.bannerContainer}>
      <View style={styles.bannerHeader}>
        <View style={styles.bannerTitleRow}>
          <Text style={styles.bannerTitle}>Compare Properties</Text>
          <Text style={styles.bannerDivider}>|</Text>
          <Text style={styles.bannerCount}>
            {selectedProperties.length} of 3 added
          </Text>
          {selectedProperties.length === 1 && (
            <View style={styles.headerWarning}>
              <Image source={warning} style={{ width: 14, height: 14 }} />
              <Text style={styles.headerWarningText}>Add 2 properties to compare</Text>
            </View>
          )}
        </View>
        <TouchableOpacity onPress={onClear} style={styles.clearBtn}>
          <X size={16} color="#666" />
        </TouchableOpacity>
      </View>



      <View style={styles.bannerContent}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.selectedList}>
            {selectedProperties.map(prop => (
              <View key={prop.id} style={styles.selectedItem}>
                {prop.images && prop.images.length > 0 ? (
                  <Image
                    source={{ uri: prop.images[0] }}
                    style={styles.selectedThumb}
                  />
                ) : (
                  <View
                    style={[
                      styles.selectedThumb,
                      { alignItems: 'center', justifyContent: 'center' },
                    ]}
                  >
                    <LucideImage size={20} color={COLORS.textSecondary} />
                  </View>
                )}
                <View style={styles.selectedInfo}>
                  <Text numberOfLines={1} style={styles.selectedTitle}>
                    {prop.title}
                  </Text>
                  <View style={styles.locationContainer}>
                    <MapPin size={10} color="#EF4444" style={{ marginRight: 2 }} />
                    <Text numberOfLines={1} style={styles.selectedLoc}>
                      {prop.location}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={() => onRemove(prop.id)}
                >
                  <X size={10} color="#FFF" />
                </TouchableOpacity>
              </View>
            ))}
            {selectedProperties.length < 3 && (
              <View style={styles.emptySlot}>
                <Text style={styles.emptySlotText}>Add Property</Text>
              </View>
            )}
          </View>
        </ScrollView>

        <TouchableOpacity
          onPress={onCompare}
          disabled={selectedProperties.length < 2}
          activeOpacity={0.8}
        >
          {selectedProperties.length < 2 ? (
            <View style={[styles.compareActionBtn, styles.compareActionDisabled]}>
              <Text style={styles.compareActionText}>
                Compare ({selectedProperties.length})
              </Text>
            </View>
          ) : (
            <LinearGradient
              colors={['#EE2529', '#C73834']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.compareActionBtn}
            >
              <Text style={styles.compareActionText}>
                Compare ({selectedProperties.length})
              </Text>
            </LinearGradient>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    width: '100%',
    maxWidth: 1300,
    height: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  bannerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  bannerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
  bannerDivider: {
    color: '#CCC',
    fontSize: 16,
  },
  bannerCount: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'Montserrat',
  },
  headerWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0F0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 6,
    marginLeft: 8,
  },
  headerWarningText: {
    color: '#D32F2F',
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Montserrat',
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  clearText: {
    fontSize: 13,
    color: '#666',
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0F0',
    padding: 8,
    borderRadius: 8,
    marginBottom: 12,
    gap: 6,
  },
  warningText: {
    fontSize: 12,
    color: COLORS.textDark,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  selectedList: {
    flexDirection: 'row',
    gap: 12,
    padding: 10,
  },
  selectedItem: {
    width: 350,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 10,
    height: 90,
    
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.20,
    shadowRadius: 8,
    elevation: 3,
  },
  selectedThumb: {
    width: 85,
    height: 60,
    
    backgroundColor: '#DDD',
  },
  selectedInfo: {
    flex: 1,
    marginLeft: 8,
  },
  selectedTitle: {
    fontSize: 18,
    fontWeight: '400',
    color: '#262626',
    fontFamily: 'Montserrat',
    marginBottom:12,
  },
  selectedLoc: {
    fontSize: 14,
    color: '#262626',
    fontWeight: '400',
    fontFamily: 'Montserrat',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  removeBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#767676',
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  emptySlot: {
    width: 350,
    height: 90,
    borderWidth: 1,
    borderColor: '#DDD',
    borderStyle: 'dashed',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptySlotText: {
    fontSize: 12,
    color: '#AAA',
  },
  compareActionBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compareActionDisabled: {
    backgroundColor: '#CCC',
  },
  compareActionText: {
    color: '#F2F2F2',
    fontWeight: '600',
    fontSize: 18,
     fontFamily: 'Montserrat',
  },
});

export default CompareBanner;
