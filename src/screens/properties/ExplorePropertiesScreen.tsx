import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  Platform,
  TextInput,
  Modal,
  useWindowDimensions,
} from 'react-native';
import { useNavigation } from '../../context/NavigationContext';
import {
  Heart,
  Share2,
  MapPin,
  Plus,
  Check,
  X,
  AlertTriangle,
  Filter,
  ChevronDown,
  Info,
  Sliders,
  CheckSquare,
} from 'lucide-react-native';

import Layout from '../../layout/Layout';
import PropertyCard, { Property } from '../../components/PropertyCard';
import CompareBanner from '../dashboard/components/CompareBanner';
import { usePropertyAPIs } from '../../../helpers/hooks/propertyAPIs/usePropertyApis';
import { COLORS } from '../../constants/theme';

// Property Interface is now imported from PropertyCard

const ExplorePropertiesScreen = () => {
  const { width } = useWindowDimensions();
  const { navigate } = useNavigation();
  const { getProperties, loading: apiLoading } = usePropertyAPIs();
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperties, setSelectedProperties] = useState<Property[]>([]);
  const [currentImageIndices, setCurrentImageIndices] = useState<{
    [key: string]: number;
  }>({});

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = () => {
    getProperties((data: any[]) => {
      const mapped: Property[] = data.map((item: any) => ({
        id: item.propertyId.toString(),
        title: `${item.propertyType} Space`,
        location: `${item.city}, ${item.state}`,
        price: `₹${item.sellingPrice} Cr`,
        rent: item.annualGrossRent ? `₹${item.annualGrossRent} L` : 'N/A',
        tenure: `${item.tenureLeftYears || 0} Yrs`,
        roi: item.netRentalYield ? `${item.netRentalYield}%` : 'N/A',
        type: item.propertyType,
        image:
          item.media?.[0]?.fileUrl ||
          'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&h=400&fit=crop',
        badges: [item.tenantType, item.buildingGrade].filter(Boolean),
        verified: item.isActive,
        raw: item,
      }));
      setProperties(mapped);
    });
  };

  const handleCompareToggle = (property: Property) => {
    setSelectedProperties(prev => {
      const isSelected = prev.some(p => p.id === property.id);
      if (isSelected) {
        return prev.filter(p => p.id !== property.id);
      } else {
        if (prev.length < 3) {
          return [...prev, property];
        } else {
          Alert.alert('Limit Reached', 'You can compare up to 3 properties.');
          return prev;
        }
      }
    });
  };

  const handleRemoveCompare = (id: string) => {
    setSelectedProperties(prev => prev.filter(p => p.id !== id));
  };

  const handleClearCompare = () => setSelectedProperties([]);

  const handleCompareAction = () => {
    if (selectedProperties.length < 2) return;
    const ids = selectedProperties.map(p => p.id).join(',');
    navigate(`/compare/${ids}`);
  };

  const [showFilters, setShowFilters] = useState(false);
  const [showDesktopFilters, setShowDesktopFilters] = useState(true);
  const [activeTab, setActiveTab] = useState<
    'pricing' | 'unit' | 'rent' | 'roi' | 'tenure'
  >('pricing');
  const [filters, setFilters] = useState({
    pricing: { min: '', max: '' },
    unit: [] as string[],
    rent: { min: '', max: '' },
    roi: '',
    tenure: '',
  });

  const toggleFilters = () => setShowFilters(!showFilters);
  const toggleDesktopFilters = () => setShowDesktopFilters(!showDesktopFilters);

  const handleApplyFilters = () => {
    setShowFilters(false);
    // Logic to apply filters would go here
  };

  const handleResetFilters = () => {
    setFilters({
      pricing: { min: '', max: '' },
      unit: [],
      rent: { min: '', max: '' },
      roi: '',
      tenure: '',
    });
  };

  const componentUnitTypes = [
    { id: 'residential', label: 'Residential' },
    { id: 'commercial', label: 'Commercial' },
    { id: 'industrial', label: 'Industrial' },
    { id: 'retail', label: 'Retail' },
    { id: 'office', label: 'Office Space' },
    { id: 'warehouse', label: 'Warehouse' },
    { id: 'mixed-use', label: 'Mixed-Use' },
  ];

  const handleUnitToggle = (id: string) => {
    setFilters(prev => {
      const units = prev.unit.includes(id)
        ? prev.unit.filter(u => u !== id)
        : [...prev.unit, id];
      return { ...prev, unit: units };
    });
  };

  const renderFilterContent = () => {
    switch (activeTab) {
      case 'pricing':
        return (
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Purchase Price (₹)</Text>
            <View style={styles.filterInputRow}>
              <TextInput
                style={styles.filterInput}
                placeholder="Min Price"
                value={filters.pricing.min}
                onChangeText={t =>
                  setFilters({
                    ...filters,
                    pricing: { ...filters.pricing, min: t },
                  })
                }
                keyboardType="numeric"
                placeholderTextColor="#999"
              />
              <Text style={styles.filterDash}>-</Text>
              <TextInput
                style={styles.filterInput}
                placeholder="Max Price"
                value={filters.pricing.max}
                onChangeText={t =>
                  setFilters({
                    ...filters,
                    pricing: { ...filters.pricing, max: t },
                  })
                }
                keyboardType="numeric"
                placeholderTextColor="#999"
              />
            </View>
          </View>
        );
      case 'unit':
        return (
          <View style={styles.filterGrid}>
            {componentUnitTypes.map(u => (
              <TouchableOpacity
                key={u.id}
                style={styles.checkboxItem}
                onPress={() => handleUnitToggle(u.id)}
              >
                <View
                  style={[
                    styles.checkbox,
                    filters.unit.includes(u.id) && styles.checkboxActive,
                  ]}
                >
                  {filters.unit.includes(u.id) && (
                    <Check size={12} color="#fff" />
                  )}
                </View>
                <Text style={styles.checkboxLabel}>{u.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        );
      case 'rent':
        return (
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Annual Rent (₹)</Text>
            <View style={styles.filterInputRow}>
              <TextInput
                style={styles.filterInput}
                placeholder="Min Rent"
                value={filters.rent.min}
                onChangeText={t =>
                  setFilters({ ...filters, rent: { ...filters.rent, min: t } })
                }
                keyboardType="numeric"
                placeholderTextColor="#999"
              />
              <Text style={styles.filterDash}>-</Text>
              <TextInput
                style={styles.filterInput}
                placeholder="Max Rent"
                value={filters.rent.max}
                onChangeText={t =>
                  setFilters({ ...filters, rent: { ...filters.rent, max: t } })
                }
                keyboardType="numeric"
                placeholderTextColor="#999"
              />
            </View>
          </View>
        );
      case 'roi':
        return (
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>ROI (%)</Text>
            <TextInput
              style={styles.filterInput}
              placeholder="Target ROI"
              value={filters.roi}
              onChangeText={t => setFilters({ ...filters, roi: t })}
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
          </View>
        );
      case 'tenure':
        return (
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Tenure Left (Years)</Text>
            <TextInput
              style={styles.filterInput}
              placeholder="Min Tenure"
              value={filters.tenure}
              onChangeText={t => setFilters({ ...filters, tenure: t })}
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
          </View>
        );
      default:
        return null;
    }
  };

  const handleScroll = (event: any, propertyId: number) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);

    setCurrentImageIndices(prev => ({
      ...prev,
      [propertyId]: roundIndex,
    }));
  };

  return (
    <Layout>
      <View style={styles.container}>
        {/* Main Content */}
        <View style={styles.contentContainer}>
          {/* Header & Filter Controls */}
          <View style={styles.filterHeader}>
            <Image
              source={require('../../assets/propertyDetails/squaresbg.png')}
              style={styles.filterBgImage}
              resizeMode="cover"
            />
            <View style={styles.filterOverlay} />

            <View
              style={[
                styles.filterControls,
                { flexDirection: width > 768 ? 'row' : 'column' },
              ]}
            >
              {/* Left Text */}
              <View>
                <Text style={styles.filterTitleText}>
                  <Text style={{ color: '#EE2529', fontWeight: 'bold' }}>
                    Properties
                  </Text>{' '}
                  found based on your above search criteria.
                </Text>
              </View>

              {/* Right Actions */}
              <View
                style={[
                  styles.filterActions,
                  { alignSelf: width > 768 ? 'auto' : 'flex-end' },
                ]}
              >
                <TouchableOpacity
                  onPress={() => {
                    if (width > 768) toggleDesktopFilters();
                    else toggleFilters();
                  }}
                  style={styles.filterToggleBtn}
                >
                  {(width > 768 ? showDesktopFilters : showFilters) ? (
                    <X size={16} color="#333" />
                  ) : (
                    <Filter size={16} color="#EE2529" />
                  )}
                  <Text style={styles.filterToggleText}>
                    {(width > 768 ? showDesktopFilters : showFilters)
                      ? 'Close Filters'
                      : 'Advance Filters'}
                  </Text>
                </TouchableOpacity>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <Text style={{ fontSize: 14, color: '#666' }}>Sort by:</Text>
                  <TouchableOpacity style={styles.sortBtn}>
                    <Text style={styles.sortBtnText}>A-Z</Text>
                    <ChevronDown size={14} color="#EE2529" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          {/* Desktop Filter Panel */}
          {showDesktopFilters && width > 768 && (
            <View style={styles.desktopFilterPanel}>
              <View style={styles.filterPanelHeader}>
                <Filter size={24} color="#EE2529" />
                <Text style={styles.filterPanelTitle}>Advanced Filters</Text>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.filterTabs}
              >
                {['pricing', 'unit', 'rent', 'roi', 'tenure'].map(tab => (
                  <TouchableOpacity
                    key={tab}
                    style={[
                      styles.filterTabItem,
                      activeTab === tab && styles.activeFilterTab,
                    ]}
                    onPress={() => setActiveTab(tab as any)}
                  >
                    <Text
                      style={[
                        styles.filterTabText,
                        activeTab === tab && styles.activeFilterTabText,
                      ]}
                    >
                      {tab === 'pricing'
                        ? 'Pricing'
                        : tab === 'unit'
                        ? 'Type of Unit'
                        : tab === 'rent'
                        ? 'Annual Rent\nAchieved'
                        : tab === 'roi'
                        ? 'ROI'
                        : 'Tenure Left'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <View style={styles.infoBox}>
                <Info size={16} color="#EE2529" />
                <Text style={styles.infoText}>
                  This information is certified from the person listing the
                  property
                </Text>
              </View>

              <View style={styles.filterContentArea}>
                {renderFilterContent()}
              </View>

              <View style={styles.filterFooter}>
                <TouchableOpacity
                  onPress={handleResetFilters}
                  style={styles.resetFilterBtn}
                >
                  <Text style={[styles.btnText, { color: '#666' }]}>
                    Reset Filters
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleApplyFilters}
                  style={styles.applyFilterBtn}
                >
                  <Text style={[styles.btnText, { color: '#fff' }]}>
                    Apply Filters
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Mobile Filter Modal */}
          <Modal
            visible={showFilters}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowFilters(false)}
          >
            <View style={styles.mobileFilterOverlay}>
              <View style={styles.mobileFilterPanel}>
                <View style={styles.mobileFilterHeader}>
                  <Filter size={20} color="#EE2529" />
                  <Text style={[styles.filterPanelTitle, { fontSize: 16 }]}>
                    Advanced Filters
                  </Text>
                  <TouchableOpacity
                    onPress={() => setShowFilters(false)}
                    style={{ marginLeft: 'auto' }}
                  >
                    <X size={24} color="#333" />
                  </TouchableOpacity>
                </View>

                <View style={styles.mobileFilterBody}>
                  {/* Sidebar Tabs */}
                  <ScrollView style={styles.mobileTabsSidebar}>
                    {['pricing', 'unit', 'rent', 'roi', 'tenure'].map(tab => (
                      <TouchableOpacity
                        key={tab}
                        style={[
                          styles.mobileTabItem,
                          activeTab === tab && styles.mobileActiveTab,
                        ]}
                        onPress={() => setActiveTab(tab as any)}
                      >
                        <Text
                          style={[
                            styles.mobileTabText,
                            activeTab === tab && styles.mobileActiveTabText,
                          ]}
                        >
                          {tab === 'pricing'
                            ? 'Pricing'
                            : tab === 'unit'
                            ? 'Type of Unit'
                            : tab === 'rent'
                            ? 'Annual Rent\nAchieved'
                            : tab === 'roi'
                            ? 'ROI'
                            : 'Tenure Left'}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>

                  {/* Content */}
                  <ScrollView style={styles.mobileFilterContent}>
                    <View
                      style={[styles.infoBox, { marginBottom: 10, padding: 5 }]}
                    >
                      <Info size={12} color="#EE2529" />
                      <Text style={[styles.infoText, { fontSize: 10 }]}>
                        Certified information
                      </Text>
                    </View>
                    {renderFilterContent()}
                  </ScrollView>
                </View>

                <View style={styles.mobileFooter}>
                  <TouchableOpacity
                    onPress={handleResetFilters}
                    style={[
                      styles.resetFilterBtn,
                      { flex: 1, paddingVertical: 8 },
                    ]}
                  >
                    <Text
                      style={[
                        styles.btnText,
                        { color: '#666', textAlign: 'center' },
                      ]}
                    >
                      Reset
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleApplyFilters}
                    style={[
                      styles.applyFilterBtn,
                      { flex: 1, paddingVertical: 8 },
                    ]}
                  >
                    <Text
                      style={[
                        styles.btnText,
                        { color: '#fff', textAlign: 'center' },
                      ]}
                    >
                      Apply
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {selectedProperties.length > 0 && (
            <View style={styles.compareBannerContainer}>
              <CompareBanner
                selectedProperties={selectedProperties}
                onClear={handleClearCompare}
                onRemove={handleRemoveCompare}
                onCompare={handleCompareAction}
              />
            </View>
          )}

          <View
            style={[
              styles.gridContainer,
              { justifyContent: width > 768 ? 'flex-start' : 'center' },
            ]}
          >
            {properties.map((property, index) => {
              // Special Card Logic (Index 7)
              if (index === 7) {
                return (
                  <View
                    key="special"
                    style={[
                      styles.card,
                      { width: width > 768 ? '31%' : '100%' },
                      styles.specialCard,
                    ]}
                  >
                    <Image
                      source={require('../../assets/PropertyCard/rounded.png')}
                      style={styles.specialIcon}
                      resizeMode="contain"
                    />
                    <Text style={styles.specialTextSmall}>
                      Need assistance with your Investment?
                    </Text>
                    <Text style={styles.specialTextLarge}>
                      Get in touch with our expert to find a customized
                      solution.
                    </Text>
                    <TouchableOpacity
                      style={styles.contactExpertBtn}
                      onPress={() => navigate('/explore-brokers')}
                    >
                      <Text style={styles.contactExpertText}>
                        Contact our Expert
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              }

              return (
                <PropertyCard
                  key={property.id}
                  item={property}
                  width={width > 768 ? '31%' : '100%'}
                  isSelected={selectedProperties.some(
                    p => p.id === property.id,
                  )}
                  onToggleCompare={handleCompareToggle}
                  isCompare={true}
                />
              );
            })}
          </View>
        </View>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
    backgroundColor: '#F9F9F9',
    minHeight: '100%',
  },
  stickyBanner: {
    backgroundColor: '#fff',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  bannerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  bannerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerTitle: {
    color: '#EE2529',
    fontWeight: 'bold',
    fontSize: 16,
  },
  bannerSubtitle: {
    color: '#666',
    fontSize: 14,
  },
  selectedItemsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  selectedItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    width: 180,
    position: 'relative',
  },
  selectedItemImage: {
    width: 40,
    height: 40,
    borderRadius: 4,
    marginRight: 8,
  },
  selectedItemInfo: {
    flex: 1,
  },
  selectedItemTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  selectedItemLocation: {
    fontSize: 10,
    color: '#666',
  },
  removeBtn: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#666',
    borderRadius: 10,
    padding: 2,
  },
  emptySlot: {
    width: 180,
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderStyle: 'dashed',
    borderRadius: 8,
    marginRight: 10,
  },
  compareBtn: {
    backgroundColor: '#EE2529',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  compareBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  contentContainer: {
    padding: 20,
    marginTop: 0, // Adjusted if banner is persistent
  },
  headerRow: {
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 18,
    color: '#333',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 20,
    overflow: 'hidden',
  },
  selectedCardBorder: {
    borderWidth: 2,
    borderColor: '#EE2529',
  },
  specialCard: {
    padding: 20,
    alignItems: 'flex-start',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  specialIcon: {
    width: 80,
    height: 80,
    marginBottom: 15,
  },
  specialTextSmall: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  specialTextLarge: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#262626',
    marginBottom: 20,
  },
  contactExpertBtn: {
    backgroundColor: '#EE2529',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  contactExpertText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  imageContainer: {
    height: 250,
    position: 'relative',
  },
  cardImage: {
    height: 250,
    resizeMode: 'cover',
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  activeDot: {
    backgroundColor: '#EE2529',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  verifiedBadgeContainer: {
    position: 'absolute',
    top: 190, // adjust position
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  verifiedTag: {
    width: 80,
    height: 30,
  },
  verifiedText: {
    position: 'absolute',
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    left: 20,
    top: 6,
  },
  imageOverlayTop: {
    position: 'absolute',
    top: 10,
    right: 10,
    gap: 10,
  },
  iconBtn: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
    borderRadius: 20,
  },
  imageOverlayBottom: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clientTypeBadge: {
    backgroundColor: '#FFF3CA',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  clientTypeText: {
    fontSize: 12,
    color: '#767676',
    fontWeight: '600',
  },
  compareActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    gap: 5,
  },
  compareActive: {
    backgroundColor: '#EE2529',
    borderColor: '#EE2529',
  },
  compareInactive: {
    backgroundColor: '#fff',
    borderColor: '#EE2529',
  },
  compareActionText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#EE2529',
  },
  cardContent: {
    padding: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 10,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  statLabel: {
    fontSize: 14,
    color: '#767676',
    marginBottom: 2,
  },
  statValue: {
    color: '#333',
    fontWeight: 'bold',
  },
  roiBadge: {
    backgroundColor: '#F8F9FA', // Gradient effect simulated
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  roiLabel: {
    fontSize: 12,
    color: '#333',
    fontWeight: 'bold',
  },
  roiValue: {
    fontSize: 16,
    color: '#EE2529',
    fontWeight: 'bold',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 10,
  },
  viewBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  viewBtnText: {
    color: '#666',
    fontWeight: 'bold',
  },
  enquireBtn: {
    flex: 1,
    backgroundColor: '#EE2529', // Gradient simulated separate
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  enquireBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  // Filter Styles
  filterHeader: {
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
    position: 'relative',
    minHeight: 80,
    justifyContent: 'center',
  },
  filterBgImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  filterOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  filterControls: {
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    gap: 15,
  },
  filterTitleText: {
    fontSize: 14,
    color: '#767676',
    fontWeight: '600',
  },
  filterActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  filterToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#767676',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  filterToggleText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  sortBtnText: {
    color: '#EE2529',
    fontWeight: 'bold',
    fontSize: 14,
  },
  // Desktop Filter Panel
  desktopFilterPanel: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  filterPanelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  filterPanelTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#EE2529',
  },
  filterTabs: {
    flexDirection: 'row',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterTabItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeFilterTab: {
    borderBottomColor: '#EE2529',
  },
  filterTabText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  activeFilterTabText: {
    color: '#EE2529',
  },
  infoBox: {
    backgroundColor: '#FDEDEE',
    padding: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 10,
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    flex: 1,
  },
  filterContentArea: {
    minHeight: 100,
  },
  filterSection: {
    padding: 10,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  filterInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  filterInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#fff',
  },
  filterDash: {
    fontSize: 20,
    color: '#999',
  },
  filterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  checkboxItem: {
    width: '30%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 5,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  checkboxActive: {
    backgroundColor: '#EE2529',
    borderColor: '#EE2529',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#333',
  },
  filterFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  resetFilterBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  applyFilterBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#EE2529',
    borderRadius: 8,
  },
  btnText: {
    fontWeight: '600',
    fontSize: 14,
  },
  // Mobile Filter Drawer
  mobileFilterOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  mobileFilterPanel: {
    backgroundColor: '#fff',
    width: '100%',
    height: '80%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  mobileFilterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  mobileFilterBody: {
    flex: 1,
    flexDirection: 'row',
  },
  mobileTabsSidebar: {
    width: '35%',
    backgroundColor: '#f5f5f5',
  },
  mobileFilterContent: {
    width: '65%',
    padding: 15,
  },
  mobileTabItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  mobileActiveTab: {
    backgroundColor: '#ffebeb',
    borderLeftWidth: 3,
    borderLeftColor: '#EE2529',
  },
  mobileTabText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  mobileActiveTabText: {
    color: '#EE2529',
  },
  mobileFooter: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    flexDirection: 'row',
    gap: 10,
  },
  compareBannerContainer: {
    marginVertical: 20,
    zIndex: 100,
    alignItems: 'center',
    width: '100%',
  },
});

export default ExplorePropertiesScreen;
