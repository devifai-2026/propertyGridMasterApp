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
import { X, AlertCircle, Image as LucideImage } from 'lucide-react-native';
import { COLORS } from '../../../constants/theme';
import { Property } from '../../../components/PropertyCard';

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
        </View>
        <TouchableOpacity onPress={onClear} style={styles.clearBtn}>
          <Text style={styles.clearText}>Clear all</Text>
          <X size={16} color="#666" />
        </TouchableOpacity>
      </View>

      {selectedProperties.length === 1 && (
        <View style={styles.warningContainer}>
          <AlertCircle size={14} color="#D32F2F" />
          <Text style={styles.warningText}>Add 2 properties to compare</Text>
        </View>
      )}

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
                  <Text numberOfLines={1} style={styles.selectedLoc}>
                    {prop.location}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={() => onRemove(prop.id)}
                >
                  <X size={12} color="#999" />
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
          style={[
            styles.compareActionBtn,
            selectedProperties.length < 2 && styles.compareActionDisabled,
          ]}
          onPress={onCompare}
          disabled={selectedProperties.length < 2}
        >
          <Text style={styles.compareActionText}>
            Compare ({selectedProperties.length})
          </Text>
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
    maxWidth: 800,
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
  },
  selectedItem: {
    width: 200,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderRadius: 8,
    padding: 6,
    borderWidth: 1,
    borderColor: '#EEE',
    position: 'relative',
  },
  selectedThumb: {
    width: 50,
    height: 40,
    borderRadius: 4,
    backgroundColor: '#DDD',
  },
  selectedInfo: {
    flex: 1,
    marginLeft: 8,
  },
  selectedTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  selectedLoc: {
    fontSize: 11,
    color: '#888',
  },
  removeBtn: {
    padding: 4,
  },
  emptySlot: {
    width: 120,
    height: 52,
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
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  compareActionDisabled: {
    backgroundColor: '#CCC',
  },
  compareActionText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 14,
  },
});

export default CompareBanner;
