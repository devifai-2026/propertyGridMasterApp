import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  ViewStyle,
} from 'react-native';
import { X, Image as LucideImage, MapPin, GitCompare, ChevronUp } from 'lucide-react-native';
import { COLORS } from '../../../constants/theme';
import LinearGradient from 'react-native-linear-gradient';
import { useCompare } from '../../../context/CompareContext';
import { useNavigation } from '../../../context/NavigationContext';
import warning from '../../../assets/ExploreProperties/warning.png';

const CompareBanner: React.FC = () => {
  const { selectedProperties, clearCompare, removeFromCompare } = useCompare();
  const { navigate, currentPath } = useNavigation();
  const [expanded, setExpanded] = useState(false);
  const prevCountRef = useRef(0);

  // Auto-expand when first property is added
  useEffect(() => {
    if (selectedProperties.length > 0 && prevCountRef.current === 0) {
      setExpanded(true);
    }
    prevCountRef.current = selectedProperties.length;
  }, [selectedProperties.length]);

  // Collapse to FAB on navigation
  useEffect(() => {
    if (selectedProperties.length > 0) {
      setExpanded(false);
    }
  }, [currentPath]);

  if (selectedProperties.length === 0) return null;

  const handleCompare = () => {
    if (selectedProperties.length < 2) return;
    const ids = selectedProperties.map(p => p.id).join(',');
    navigate(`/compare/${ids}`);
  };

  if (!expanded) {
    return (
      <View style={styles.fabWrapper}>
        <TouchableOpacity onPress={() => setExpanded(true)} activeOpacity={0.85}>
          <LinearGradient
            colors={['#EE2529', '#C73834']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.fab}
          >
            <GitCompare size={22} color="#fff" />
            <View style={styles.fabBadge}>
              <Text style={styles.fabBadgeText}>{selectedProperties.length}</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.panelWrapper}>
      <View style={styles.panel}>
        {/* Header */}
        <View style={styles.panelHeader}>
          <View style={styles.panelTitleRow}>
            <Text style={styles.panelTitle}>Compare Properties</Text>
            <Text style={styles.panelDivider}>|</Text>
            <Text style={styles.panelCount}>{selectedProperties.length} of 3 added</Text>
            {selectedProperties.length === 1 && (
              <View style={styles.headerWarning}>
                <Image source={warning} style={{ width: 14, height: 14 }} />
                <Text style={styles.headerWarningText}>Add 2 properties to compare</Text>
              </View>
            )}
          </View>
          <View style={styles.panelActions}>
            <TouchableOpacity onPress={() => setExpanded(false)} style={styles.collapseBtn}>
              <ChevronUp size={16} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity onPress={clearCompare} style={styles.clearBtn}>
              <X size={16} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <View style={styles.panelContent}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.selectedList}>
              {selectedProperties.map(prop => (
                <View key={prop.id} style={styles.selectedItem}>
                  {prop.images && prop.images.length > 0 ? (
                    <Image source={{ uri: prop.images[0] }} style={styles.selectedThumb} />
                  ) : (
                    <View style={[styles.selectedThumb, { alignItems: 'center', justifyContent: 'center' }]}>
                      <LucideImage size={20} color={COLORS.textSecondary} />
                    </View>
                  )}
                  <View style={styles.selectedInfo}>
                    <Text numberOfLines={1} style={styles.selectedTitle}>{prop.title}</Text>
                    <View style={styles.locationContainer}>
                      <MapPin size={10} color="#EF4444" style={{ marginRight: 2 }} />
                      <Text numberOfLines={1} style={styles.selectedLoc}>{prop.location}</Text>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.removeBtn} onPress={() => removeFromCompare(prop.id)}>
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

          <TouchableOpacity onPress={handleCompare} disabled={selectedProperties.length < 2} activeOpacity={0.8}>
            {selectedProperties.length < 2 ? (
              <View style={[styles.compareBtn, styles.compareBtnDisabled]}>
                <Text style={styles.compareBtnText}>Compare ({selectedProperties.length})</Text>
              </View>
            ) : (
              <LinearGradient
                colors={['#EE2529', '#C73834']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.compareBtn}
              >
                <Text style={styles.compareBtnText}>Compare ({selectedProperties.length})</Text>
              </LinearGradient>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const floatingBase: ViewStyle = {
  position: 'absolute',
  zIndex: 9999,
  ...Platform.select({
    web: { position: 'fixed' } as any,
  }),
};

const styles = StyleSheet.create({
  fabWrapper: {
    ...floatingBase,
    bottom: 32,
    right: 32,
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#EE2529',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
  },
  fabBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#fff',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#EE2529',
  },
  fabBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#EE2529',
    fontFamily: 'Montserrat',
  },
  panelWrapper: {
    ...floatingBase,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  panel: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    width: '100%',
    maxWidth: 1300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  panelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  panelTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  panelTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
    fontFamily: 'Montserrat',
  },
  panelDivider: {
    color: '#CCC',
    fontSize: 16,
  },
  panelCount: {
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
    marginLeft: 4,
  },
  headerWarningText: {
    color: '#D32F2F',
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Montserrat',
  },
  panelActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  collapseBtn: {
    padding: 4,
  },
  clearBtn: {
    padding: 4,
  },
  panelContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  selectedList: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 4,
  },
  selectedItem: {
    width: 300,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    height: 80,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  selectedThumb: {
    width: 70,
    height: 55,
    borderRadius: 6,
    backgroundColor: '#DDD',
  },
  selectedInfo: {
    flex: 1,
    marginLeft: 10,
    gap: 6,
  },
  selectedTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#262626',
    fontFamily: 'Montserrat',
  },
  selectedLoc: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'Montserrat',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  removeBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#767676',
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  emptySlot: {
    width: 300,
    height: 80,
    borderWidth: 1.5,
    borderColor: '#DDD',
    borderStyle: 'dashed',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptySlotText: {
    fontSize: 13,
    color: '#AAA',
    fontFamily: 'Montserrat',
  },
  compareBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 130,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compareBtnDisabled: {
    backgroundColor: '#CCC',
  },
  compareBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
    fontFamily: 'Montserrat',
  },
});

export default CompareBanner;
