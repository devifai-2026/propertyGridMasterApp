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
  PanResponder,
  ActivityIndicator,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
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
  ChevronUp,
  Info,
  Sliders,
  CheckSquare,
} from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';

import Layout from '../../layout/Layout';
import PropertyCard, { Property } from '../../components/PropertyCard';
import { usePropertyAPIs } from '../../../helpers/hooks/propertyAPIs/usePropertyApis';
import { useCompare } from '../../context/CompareContext';
import { COLORS } from '../../constants/theme';
import NoPropertiesFound from './components/NoPropertiesFound';
import ReachedTheEnd from './components/ReachedTheEnd';
import filter from "../../assets/ExploreProperties/filter.png"

declare const window: any;

const componentUnitTypes = [
  { id: 'Residential', label: 'Residential' },
  { id: 'Retail', label: 'Retail' },
  { id: 'Mixed-Use', label: 'Mixed-Use' },
  { id: 'Commercial', label: 'Commercial' },
  { id: 'Office Space', label: 'Office Space' },
  { id: 'Hospitality', label: 'Hospitality' },
  { id: 'Industrial', label: 'Industrial' },
  { id: 'Warehouse', label: 'Warehouse' },
];

const CrossIcon = ({ size = 18, color = "#EE2529" }: { size?: number, color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 18 18" fill="none">
    <Path d="M0.498101 0.498088C-0.166034 1.16222 -0.166034 2.23897 0.498101 2.90311L6.59498 8.99996L0.498101 15.0969C-0.166034 15.761 -0.166034 16.8379 0.498101 17.5019C1.16222 18.166 2.23899 18.166 2.9031 17.5019L8.99997 11.4049L15.097 17.5019C15.761 18.166 16.8379 18.166 17.5019 17.5019C18.166 16.8379 18.166 15.761 17.5019 15.0969L11.405 8.99996L17.5019 2.90313C18.166 2.23901 18.166 1.16224 17.5019 0.498123C16.8377 -0.166012 15.761 -0.166012 15.097 0.498123L8.99997 6.59497L2.9031 0.498088C2.23899 -0.166029 1.16222 -0.166029 0.498101 0.498088Z" fill={color}/>
  </Svg>
);

const ExplorePropertiesScreen = () => {
  const { width } = useWindowDimensions();
  const { navigate } = useNavigation();
  const { getProperties, loading: apiLoading } = usePropertyAPIs();
  const { toggleCompare, isSelected: isCompareSelected, selectedProperties } = useCompare();
  const [properties, setProperties] = useState<Property[]>([]);
  const [currentImageIndices, setCurrentImageIndices] = useState<{
    [key: string]: number;
  }>({});

  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    // Parse query params from window.location.search if on Web
    let initialFilters = {
      pricing: { min: '', max: '' },
      unit: [] as string[],
      rent: { min: '', max: '' },
      roi: '',
      tenure: '',
      city: '',
      proximity: [] as string[],
    };
    let hasParams = false;

    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);

      const city = params.get('city');
      const minPrice = params.get('minPrice');
      const maxPrice = params.get('maxPrice');
      const propertyTypes = params.get('propertyTypes');
      const minROI = params.get('minROI');
      const minTenure = params.get('minTenure');

      if (city) {
        initialFilters.city = city;
        hasParams = true;
      }
      if (minPrice || maxPrice) {
        initialFilters.pricing = { min: minPrice || '', max: maxPrice || '' };
        hasParams = true;
      }
      if (propertyTypes) {
        const types = propertyTypes.split(',');
        initialFilters.unit = types
          .map(t => componentUnitTypes.find(c => c.label === t)?.id)
          .filter(Boolean) as string[];
        hasParams = true;
      }
      if (minROI) {
        initialFilters.roi = minROI;
        hasParams = true;
      }
      if (minTenure) {
        initialFilters.tenure = minTenure;
        hasParams = true;
      }
    }

    if (hasParams) {
      setFilters(initialFilters as any);
      fetchProperties(initialFilters);
    } else {
      fetchProperties();
    }
  }, []);

  const fetchProperties = (overrideFilters?: any, page: number = 1) => {
    let queryParams = [];
    const activeFilters = overrideFilters || filters;

    queryParams.push(`page=${page}`);
    queryParams.push(`isVerified=completed`);
    queryParams.push(`limit=12`);

    // City
    if (activeFilters.city) queryParams.push(`city=${activeFilters.city}`);

    // Pricing
    if (activeFilters.pricing?.min)
      queryParams.push(`minPrice=${activeFilters.pricing.min}`);
    if (activeFilters.pricing?.max)
      queryParams.push(`maxPrice=${activeFilters.pricing.max}`);

    // Units
    if (activeFilters.unit?.length > 0) {
      // API expects propertyTypes comma separated. First map the keys to match the Capitalised labels if needed.
      const mappedTypes = activeFilters.unit
        .map((id: string) => componentUnitTypes.find(c => c.id === id)?.label)
        .filter(Boolean);
      if (mappedTypes.length > 0) {
        queryParams.push(`propertyTypes=${mappedTypes.join(',')}`);
      }
    }

    // Rent
    if (activeFilters.rent?.min)
      queryParams.push(`minRent=${activeFilters.rent.min}`);
    if (activeFilters.rent?.max)
      queryParams.push(`maxRent=${activeFilters.rent.max}`);

    // ROI
    if (activeFilters.roi) queryParams.push(`minROI=${activeFilters.roi}`);

    // Tenure
    if (activeFilters.tenure)
      queryParams.push(`minTenure=${activeFilters.tenure}`);

    const queryString = queryParams.join('&');

    getProperties(
      (data: any[], meta?: any) => {
        const mapped: Property[] = data.map((item: any) => ({
          id: item.propertyId.toString(),
          title: `${item.propertyType} Space`,
          location: `${item.city}, ${item.state}`,
          price: `₹${item.sellingPrice ?? 0} Cr`,
          rent: item.annualGrossRent ? `₹${item.annualGrossRent} L` : 'N/A',
          tenure: `${item.tenureLeftYears || 0} Yrs`,
          roi: item.netRentalYield ? `${item.netRentalYield}%` : 'N/A',
          type: item.propertyType,
          images:
            item.media && item.media.length > 0
              ? item.media.map((m: any) => m.fileUrl)
              : null,
          badges: [item.tenantType].filter(Boolean),
          isVerified: item.isVerified,
          verified:
            item.isVerified === 'partial' || item.isVerified === 'completed',
          raw: item,
        }));
        setProperties(mapped);
        console.log('Pagination Metadata received:', meta?.pagination);
        if (meta && meta.pagination) {
          setPagination(meta.pagination);
        }
      },
      (error: any) => {
        console.error('Error fetching properties automatically:', error);
      },
      queryString, // Passed here!
    );
  };

  const handleCompare = () => {
    if (selectedProperties.length < 2) return;
    const ids = selectedProperties.map(p => p.id).join(',');
    navigate(`/compare/${ids}`);
  };

  const [showFilters, setShowFilters] = useState(false);
  const [showDesktopFilters, setShowDesktopFilters] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'location' | 'pricing' | 'unit' | 'roi' | 'tenure' | 'rent'
  >('location');
  const [filters, setFilters] = useState({
    proximity: [] as string[],
    pricing: { min: '0', max: '5000000' },
    unit: [] as string[],
    rent: { min: '', max: '' },
    roi: '',
    tenure: '',
    city: '',
  });

  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);

  const [sliderWidth, setSliderWidth] = useState(0);
  const [sliderPercent, setSliderPercent] = useState(1);
  const sliderRef = useRef<View>(null);
  const sliderPageX = useRef(0);

  const updateSliderValue = (pageX: number) => {
    if (sliderWidth > 0) {
      const offsetX = Math.max(
        0,
        Math.min(pageX - sliderPageX.current, sliderWidth),
      );
      const percent = offsetX / sliderWidth;
      setSliderPercent(percent);

      if (activeTab === 'pricing' || activeTab === 'rent') {
        const maxValue = Math.round(percent * 50); // In Lakhs
        const filterKey = activeTab === 'pricing' ? 'pricing' : 'rent';
        setFilters(prev => ({
          ...prev,
          [filterKey]: {
            ...prev[filterKey],
            max: (maxValue * 100000).toString(),
          },
        }));
      } else if (activeTab === 'roi') {
        const val = 5 + Math.round(percent * 15); // 5% to 20%
        setFilters(prev => ({ ...prev, roi: val.toString() }));
      } else if (activeTab === 'tenure') {
        const val = 1 + Math.round(percent * 19); // 1 to 20 yrs
        setFilters(prev => ({ ...prev, tenure: val.toString() }));
      }
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: evt => {
        if (!isWeb) {
          sliderRef.current?.measure((x, y, width, height, pageX, pageY) => {
            sliderPageX.current = pageX;
            setSliderWidth(width);
            updateSliderValue(evt.nativeEvent.pageX);
          });
        }
      },
      onPanResponderMove: evt => {
        if (!isWeb) updateSliderValue(evt.nativeEvent.pageX);
      },
      onPanResponderRelease: () => {},
    }),
  ).current;

  const isWeb = Platform.OS === 'web';

  const onSliderLayout = () => {
    if (isWeb && sliderRef.current) {
      // @ts-ignore
      const rect =
        sliderRef.current.getBoundingClientRect?.() ||
        sliderRef.current.measure?.((x, y, w, h, px, py) => {
          setSliderWidth(w);
          sliderPageX.current = px;
        });
      if (rect) {
        setSliderWidth(rect.width);
        sliderPageX.current = rect.left;
      }
    }
  };

  const [hoverMin, setHoverMin] = useState(false);
  const [hoverMax, setHoverMax] = useState(false);

  const incrementValue = (
    category: 'pricing' | 'rent',
    key: 'min' | 'max',
    amount: number,
  ) => {
    setFilters(prev => {
      const current = parseInt(prev[category][key] || '0', 10);
      const next = Math.max(0, current + amount);
      return {
        ...prev,
        [category]: { ...prev[category], [key]: next.toString() },
      };
    });
  };

  const handleWebSliderChange = (e: any) => {
    const value = parseFloat(e.target.value);
    const filterKey = activeTab === 'pricing' ? 'pricing' : 'rent';

    if (activeTab === 'pricing' || activeTab === 'rent') {
      const percent = value / 50;
      setSliderPercent(percent);
      setFilters(prev => ({
        ...prev,
        [filterKey]: { ...prev[filterKey], max: (value * 100000).toString() },
      }));
    } else if (activeTab === 'roi') {
      const percent = (value - 5) / 15;
      setSliderPercent(percent);
      setFilters(prev => ({ ...prev, roi: value.toString() }));
    } else if (activeTab === 'tenure') {
      const percent = (value - 1) / 19;
      setSliderPercent(percent);
      setFilters(prev => ({ ...prev, tenure: value.toString() }));
    }
  };

  useEffect(() => {
    // Synchronize slider position when switching between range tabs
    if (activeTab === 'pricing' || activeTab === 'rent') {
      const currentMax =
        activeTab === 'pricing' ? filters.pricing.max : filters.rent.max;
      if (currentMax) {
        const val = parseInt(currentMax, 10);
        setSliderPercent(Math.min(Math.max(val / 5000000, 0), 1));
      } else {
        setSliderPercent(0);
      }
    } else if (activeTab === 'roi') {
      const val = parseInt(filters.roi || '5', 10);
      setSliderPercent(Math.min(Math.max((val - 5) / 15, 0), 1));
    } else if (activeTab === 'tenure') {
      const val = parseInt(filters.tenure || '1', 10);
      setSliderPercent(Math.min(Math.max((val - 1) / 19, 0), 1));
    }

    // Web measurement update
    if (isWeb) {
      setTimeout(onSliderLayout, 100);
    }
  }, [activeTab]);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const toggleFilters = () => setShowFilters(!showFilters);
  const toggleDesktopFilters = () => setShowDesktopFilters(!showDesktopFilters);

  const handleApplyFilters = () => {
    setShowFilters(false);
    fetchProperties();
  };

  const handleResetFilters = () => {
    const emptyFilters = {
      proximity: [],
      pricing: { min: '', max: '' },
      unit: [],
      rent: { min: '', max: '' },
      roi: '',
      tenure: '',
      city: '',
    };
    setFilters(emptyFilters);
    fetchProperties(emptyFilters);
  };

  const handleUnitToggle = (id: string) => {
    setFilters(prev => {
      const units = prev.unit.includes(id)
        ? prev.unit.filter(u => u !== id)
        : [...prev.unit, id];
      return { ...prev, unit: units };
    });
  };

  const handleProximityToggle = (id: string) => {
    setFilters(prev => {
      const proximity = prev.proximity.includes(id)
        ? prev.proximity.filter(p => p !== id)
        : [...prev.proximity, id];
      return { ...prev, proximity };
    });
  };

  const renderFilterContent = () => {
    switch (activeTab) {
      case 'location':
        const proximityOptions = [
          'Metro Station',
          'Business District',
          'Shopping Center',
          'Major Highway',
          'Industrial Zone',
          'University',
          'Airport',
          'Port/Harbor',
        ];

        return (
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Proximity to</Text>
            <View style={[styles.proximityGrid, width <= 768 && { flexDirection: 'column', gap: 10 }]}>
              <View style={styles.proximityColumn}>
                {proximityOptions.slice(0, 3).map(opt => (
                  <TouchableOpacity
                    key={opt}
                    style={styles.checkboxItemWide}
                    onPress={() => handleProximityToggle(opt)}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        filters.proximity.includes(opt) &&
                          styles.checkboxActive,
                      ]}
                    >
                      {filters.proximity.includes(opt) && (
                        <Check size={12} color="#fff" />
                      )}
                    </View>
                    <Text style={styles.checkboxLabel}>{opt}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.proximityColumn}>
                {proximityOptions.slice(3, 6).map(opt => (
                  <TouchableOpacity
                    key={opt}
                    style={styles.checkboxItemWide}
                    onPress={() => handleProximityToggle(opt)}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        filters.proximity.includes(opt) &&
                          styles.checkboxActive,
                      ]}
                    >
                      {filters.proximity.includes(opt) && (
                        <Check size={12} color="#fff" />
                      )}
                    </View>
                    <Text style={styles.checkboxLabel}>{opt}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.proximityColumn}>
                {proximityOptions.slice(6, 8).map(opt => (
                  <TouchableOpacity
                    key={opt}
                    style={styles.checkboxItemWide}
                    onPress={() => handleProximityToggle(opt)}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        filters.proximity.includes(opt) &&
                          styles.checkboxActive,
                      ]}
                    >
                      {filters.proximity.includes(opt) && (
                        <Check size={12} color="#fff" />
                      )}
                    </View>
                    <Text style={styles.checkboxLabel}>{opt}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        );
      case 'pricing':
        return (
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Purchase Price</Text>

            <View style={[styles.sliderContainer, width <= 768 ? { flexDirection: 'column', alignItems: 'stretch' } : { flexDirection: 'row', alignItems: 'center' }]}>
              {width <= 768 && (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, width: '100%' }}>
                  <Text style={styles.sliderEndpoint}>Min price</Text>
                  <Text style={styles.sliderEndpoint}>Max price</Text>
                </View>
              )}
              {width > 768 && <Text style={styles.sliderEndpoint}>₹0 Lakhs</Text>}
              <View
                ref={sliderRef}
                style={[styles.sliderTrackContainer, width <= 768 && { width: '100%', flex: 0, height: 20 }]}
                onLayout={onSliderLayout}
                {...panResponder.panHandlers}
              >
                {/* Background Track */}
                <View style={styles.sliderBackgroundTrack} />

                {/* Active Track Overlay */}
                <View
                  style={[
                    styles.sliderActiveTrack,
                    { width: `${sliderPercent * 100}%` },
                  ]}
                />

                {/* Thumb */}
                <View
                  style={[
                    styles.sliderThumb,
                    { left: `${sliderPercent * 100}%` },
                  ]}
                />

                {isWeb && (
                  <input
                    type="range"
                    min="0"
                    max="50"
                    step="1"
                    value={sliderPercent * 50}
                    onChange={handleWebSliderChange}
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: 40,
                      opacity: 0,
                      cursor: 'pointer',
                      zIndex: 1000,
                    }}
                  />
                )}
              </View>
              {width > 768 && <Text style={styles.sliderEndpoint}>₹50 Lakhs</Text>}
            </View>

            <Text style={styles.filterSeparator}>
              Or enter specific values:
            </Text>

            <View style={[styles.priceInputGrid, width <= 768 && { flexDirection: 'column', gap: 15 }]}>
              <View style={styles.priceInputCol}>
                <Text style={styles.priceInputLabel}>Minimum Price (₹)</Text>
                <View
                  style={styles.inputWrapper}
                  {...(isWeb
                    ? {
                        onMouseEnter: () => setHoverMin(true),
                        onMouseLeave: () => setHoverMin(false),
                      }
                    : {})}
                >
                  <TextInput
                    style={styles.priceInput}
                    placeholder="5000000"
                    value={filters.pricing.min}
                    onChangeText={t =>
                      setFilters({
                        ...filters,
                        pricing: { ...filters.pricing, min: t },
                      })
                    }
                    keyboardType="numeric"
                    placeholderTextColor="#333"
                  />
                  {(hoverMin || !isWeb) && (
                    <View style={styles.stepperIcons}>
                      <TouchableOpacity
                        style={styles.stepperBtn}
                        onPress={() => incrementValue('pricing', 'min', 500000)}
                      >
                        <ChevronUp size={12} color="#262626" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.stepperBtn}
                        onPress={() =>
                          incrementValue('pricing', 'min', -500000)
                        }
                      >
                        <ChevronDown size={12} color="#262626" />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>

              <View style={styles.priceInputCol}>
                <Text style={styles.priceInputLabel}>Maximum Price (₹)</Text>
                <View
                  style={styles.inputWrapper}
                  {...(isWeb
                    ? {
                        onMouseEnter: () => setHoverMax(true),
                        onMouseLeave: () => setHoverMax(false),
                      }
                    : {})}
                >
                  <TextInput
                    style={styles.priceInput}
                    placeholder="5000000"
                    value={filters.pricing.max}
                    onChangeText={t =>
                      setFilters({
                        ...filters,
                        pricing: { ...filters.pricing, max: t },
                      })
                    }
                    keyboardType="numeric"
                    placeholderTextColor="#333"
                  />
                  {(hoverMax || !isWeb) && (
                    <View style={styles.stepperIcons}>
                      <TouchableOpacity
                        style={styles.stepperBtn}
                        onPress={() => incrementValue('pricing', 'max', 500000)}
                      >
                        <ChevronUp size={12} color="#262626" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.stepperBtn}
                        onPress={() =>
                          incrementValue('pricing', 'max', -500000)
                        }
                      >
                        <ChevronDown size={12} color="#262626" />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </View>
        );
      case 'unit':
        return (
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Select Property Types</Text>
            <View style={[styles.proximityGrid, width <= 768 && { flexDirection: 'column', gap: 10 }]}>
              <View style={styles.proximityColumn}>
                {componentUnitTypes.slice(0, 3).map(u => (
                  <TouchableOpacity
                    key={u.id}
                    style={styles.checkboxItemWide}
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
              <View style={styles.proximityColumn}>
                {componentUnitTypes.slice(3, 6).map(u => (
                  <TouchableOpacity
                    key={u.id}
                    style={styles.checkboxItemWide}
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
              <View style={styles.proximityColumn}>
                {componentUnitTypes.slice(6, 8).map(u => (
                  <TouchableOpacity
                    key={u.id}
                    style={styles.checkboxItemWide}
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
            </View>
          </View>
        );
      case 'rent':
        return (
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Annual Rent Range</Text>

            <View style={[styles.sliderContainer, width <= 768 ? { flexDirection: 'column', alignItems: 'stretch' } : { flexDirection: 'row', alignItems: 'center' }]}>
              {width <= 768 && (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, width: '100%' }}>
                  <Text style={styles.sliderEndpoint}>Min price</Text>
                  <Text style={styles.sliderEndpoint}>Max price</Text>
                </View>
              )}
              {width > 768 && <Text style={styles.sliderEndpoint}>₹0 Lakhs</Text>}
              <View
                ref={sliderRef}
                style={[styles.sliderTrackContainer, width <= 768 && { width: '100%', flex: 0, height: 20 }]}
                onLayout={onSliderLayout}
                {...panResponder.panHandlers}
              >
                <View style={styles.sliderBackgroundTrack} />
                <View
                  style={[
                    styles.sliderActiveTrack,
                    { width: `${sliderPercent * 100}%` },
                  ]}
                />
                <View
                  style={[
                    styles.sliderThumb,
                    { left: `${sliderPercent * 100}%` },
                  ]}
                />
                {isWeb && (
                  <input
                    type="range"
                    min="0"
                    max="50"
                    step="1"
                    value={sliderPercent * 50}
                    onChange={handleWebSliderChange}
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: 40,
                      opacity: 0,
                      cursor: 'pointer',
                      zIndex: 1000,
                    }}
                  />
                )}
              </View>
              {width > 768 && <Text style={styles.sliderEndpoint}>₹50 Lakhs</Text>}
            </View>

            <Text style={styles.filterSeparator}>
              Or enter specific values:
            </Text>

            <View style={[styles.priceInputGrid, width <= 768 && { flexDirection: 'column', gap: 15 }]}>
              <View style={styles.priceInputCol}>
                <Text style={styles.priceInputLabel}>
                  Minimum Annual Rent (₹)
                </Text>
                <View
                  style={styles.inputWrapper}
                  {...(isWeb
                    ? {
                        onMouseEnter: () => setHoverMin(true),
                        onMouseLeave: () => setHoverMin(false),
                      }
                    : {})}
                >
                  <TextInput
                    style={styles.priceInput}
                    placeholder="5000000"
                    value={filters.rent.min}
                    onChangeText={t =>
                      setFilters({
                        ...filters,
                        rent: { ...filters.rent, min: t },
                      })
                    }
                    keyboardType="numeric"
                    placeholderTextColor="#333"
                  />
                  {(hoverMin || !isWeb) && (
                    <View style={styles.stepperIcons}>
                      <TouchableOpacity
                        style={styles.stepperBtn}
                        onPress={() => incrementValue('rent', 'min', 500000)}
                      >
                        <ChevronUp size={12} color="#262626" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.stepperBtn}
                        onPress={() => incrementValue('rent', 'min', -500000)}
                      >
                        <ChevronDown size={12} color="#262626" />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>

              <View style={styles.priceInputCol}>
                <Text style={styles.priceInputLabel}>
                  Maximum Annual Rent (₹)
                </Text>
                <View
                  style={styles.inputWrapper}
                  {...(isWeb
                    ? {
                        onMouseEnter: () => setHoverMax(true),
                        onMouseLeave: () => setHoverMax(false),
                      }
                    : {})}
                >
                  <TextInput
                    style={styles.priceInput}
                    placeholder="5000000"
                    value={filters.rent.max}
                    onChangeText={t =>
                      setFilters({
                        ...filters,
                        rent: { ...filters.rent, max: t },
                      })
                    }
                    keyboardType="numeric"
                    placeholderTextColor="#333"
                  />
                  {(hoverMax || !isWeb) && (
                    <View style={styles.stepperIcons}>
                      <TouchableOpacity
                        style={styles.stepperBtn}
                        onPress={() => incrementValue('rent', 'max', 500000)}
                      >
                        <ChevronUp size={12} color="#262626" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.stepperBtn}
                        onPress={() => incrementValue('rent', 'max', -500000)}
                      >
                        <ChevronDown size={12} color="#262626" />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </View>
        );
      case 'roi':
        return (
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>
              Return on Investment (ROI) Range
            </Text>

            <View style={[styles.sliderContainer, width <= 768 ? { flexDirection: 'column', alignItems: 'stretch' } : { flexDirection: 'row', alignItems: 'center' }]}>
              {width <= 768 && (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, width: '100%' }}>
                  <Text style={styles.sliderEndpoint}>Min ROI</Text>
                  <Text style={styles.sliderEndpoint}>Max ROI</Text>
                </View>
              )}
              {width > 768 && <Text style={styles.sliderEndpoint}>5%</Text>}
              <View
                ref={sliderRef}
                style={[styles.sliderTrackContainer, width <= 768 && { width: '100%', flex: 0, height: 20 }]}
                onLayout={onSliderLayout}
                {...panResponder.panHandlers}
              >
                <View style={styles.sliderBackgroundTrack} />
                <View
                  style={[
                    styles.sliderActiveTrack,
                    { width: `${sliderPercent * 100}%` },
                  ]}
                />
                <View
                  style={[
                    styles.sliderThumb,
                    { left: `${sliderPercent * 100}%` },
                  ]}
                />
                {isWeb && (
                  <input
                    type="range"
                    min="5"
                    max="20"
                    step="1"
                    value={5 + sliderPercent * 15}
                    onChange={handleWebSliderChange}
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: 40,
                      top: -15,
                      opacity: 0,
                      cursor: 'pointer',
                      zIndex: 1000,
                    }}
                  />
                )}
              </View>
              {width > 768 && <Text style={styles.sliderEndpoint}>20%</Text>}
            </View>

            <View style={styles.descInfoBox}>
              <Text style={styles.descInfoText}>
                Filter properties based on their expected return on investment.
                Higher ROI indicates better potential returns.
              </Text>
            </View>
          </View>
        );
      case 'tenure':
        return (
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Tenure Left (yrs)</Text>

            <View style={[styles.sliderContainer, width <= 768 ? { flexDirection: 'column', alignItems: 'stretch' } : { flexDirection: 'row', alignItems: 'center' }]}>
              {width <= 768 && (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, width: '100%' }}>
                  <Text style={styles.sliderEndpoint}>Min Tenure</Text>
                  <Text style={styles.sliderEndpoint}>Max Tenure</Text>
                </View>
              )}
              {width > 768 && <Text style={styles.sliderEndpoint}>1 yrs</Text>}
              <View
                ref={sliderRef}
                style={[styles.sliderTrackContainer, width <= 768 && { width: '100%', flex: 0, height: 20 }]}
                onLayout={onSliderLayout}
                {...panResponder.panHandlers}
              >
                <View style={styles.sliderBackgroundTrack} />
                <View
                  style={[
                    styles.sliderActiveTrack,
                    { width: `${sliderPercent * 100}%` },
                  ]}
                />
                <View
                  style={[
                    styles.sliderThumb,
                    { left: `${sliderPercent * 100}%` },
                  ]}
                />
                {isWeb && (
                  <input
                    type="range"
                    min="1"
                    max="20"
                    step="1"
                    value={1 + sliderPercent * 19}
                    onChange={handleWebSliderChange}
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: 40,
                      top: -15,
                      opacity: 0,
                      cursor: 'pointer',
                      zIndex: 1000,
                    }}
                  />
                )}
              </View>
              {width > 768 && <Text style={styles.sliderEndpoint}>20 yrs</Text>}
            </View>

            <View style={styles.descInfoBox}>
              <Text style={styles.descInfoText}>
                Remaining duration of the lease agreement. Longer tenure
                provides more stability and predictable income.
              </Text>
            </View>
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
    <Layout 
      onScroll={handleScroll} 
      scrollEventThrottle={16}
      scrollViewRef={scrollViewRef}
    >
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
                  <Text style={{ color: '#EE2529', fontWeight: 'bold', fontFamily: 'Montserrat' }}>
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
                  <Text style={styles.filterToggleText}>
                    {(width > 768 ? showDesktopFilters : showFilters)
                      ? 'Close Filters'
                      : 'Advance Filters'}
                  </Text>
                  {(width > 768 ? showDesktopFilters : showFilters) ? (
                    <CrossIcon size={10} color="#767676" />
                  ) : (
                    <Image source={filter} style={{ width: 15, height: 14 }} />
                  )}
                </TouchableOpacity>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <Text style={{ fontSize: 14, color: '#666', fontFamily: 'Montserrat' }}>Sort by:</Text>
                  <TouchableOpacity 
                    style={styles.sortBtn}
                    onPress={() => {
                      const newDir = sortDirection === 'asc' ? 'desc' : 'asc';
                      setSortDirection(newDir);
                      setProperties(prev => [...prev].sort((a, b) => {
                        return newDir === 'asc' 
                          ? a.title.localeCompare(b.title) 
                          : b.title.localeCompare(a.title);
                      }));
                    }}
                  >
                    <Text style={styles.sortBtnText}>
                      {sortDirection === 'asc' ? 'Z-A' : 'A-Z'}
                    </Text>
                    <ChevronDown size={14} color="#EE2529" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
          

          {/* Content Area: Either show the Loading Spinner, No Results, or the Filters + Results grid */}
          {apiLoading && properties.length === 0 ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#EE2529" />
              <Text style={styles.loadingText}>Fetching Properties...</Text>
            </View>
          ) : properties.length === 0 && !apiLoading ? (
            <NoPropertiesFound onReset={handleResetFilters} />
          ) : (
            <>
              {/* Desktop Filter Panel */}
              {showDesktopFilters && width > 768 && (
                <View style={styles.desktopFilterPanel}>
                  <View style={styles.filterPanelHeader}>
                    <Filter size={24} color="#EE2529" />
                    <Text style={styles.filterPanelTitle}>Advanced Filters</Text>
                  </View>

                  <View style={styles.filterTabs}>
                    {['location', 'pricing', 'unit', 'rent', 'roi', 'tenure'].map(
                      tab => (
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
                            {tab === 'location'
                              ? 'Location\nProximity'
                              : tab === 'pricing'
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
                      ),
                    )}
                  </View>

                  <View style={styles.infoBox}>
                    <Info size={12} color="#262626" />
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
                      activeOpacity={0.8}
                    >
                      <LinearGradient
                        colors={['#EE2529', '#C73834']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.applyFilterBtn}
                      >
                        <Text style={[styles.btnText, { color: '#fff' }]}>
                          Apply Filters
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              <View style={{ backgroundColor: apiLoading ? '#fff' : '#F2F2F2', paddingVertical: 40, width: '100%', minHeight: 400, justifyContent: 'center' }}>
                {apiLoading ? (
                   <View style={styles.loadingContainer}>
                     <ActivityIndicator size="large" color="#EE2529" />
                     <Text style={styles.loadingText}>Loading...</Text>
                   </View>
                ) : (
                  <>
                    <View style={[styles.gridContainer, { justifyContent: 'center' }]}>
                {properties.map((property, index) => {
                  // Special Card Logic (Index 7)
                  if (index === 7) {
                    return (
                      <View
                        key="special"
                        style={[
                          styles.card,
                          { width: width > 768 ? '31.8%' : '100%' },
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
                      width={width > 768 ? '31.8%' : '100%'}
                      isSelected={isCompareSelected(property.id)}
                      onToggleCompare={toggleCompare}
                      isCompare={true}
                    />
                  );
                })}
                  </View>

              {/* Pagination Controls */}
              {pagination.totalPages > 1 && (
                <View style={styles.paginationContainer}>
                  <TouchableOpacity
                    style={[
                      styles.pageBtn,
                      !pagination.hasPrevPage && styles.pageBtnDisabled,
                    ]}
                    disabled={!pagination.hasPrevPage}
                    onPress={() =>
                      fetchProperties(filters, pagination.currentPage - 1)
                    }
                  >
                    <Text
                      style={[
                        styles.pageBtnText,
                        !pagination.hasPrevPage && styles.pageBtnTextDisabled,
                      ]}
                    >
                      Previous
                    </Text>
                  </TouchableOpacity>

                  <View style={styles.pageNumbers}>
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                      .filter(p => {
                        // Show current page, and one page before/after
                        return (
                          p === 1 ||
                          p === pagination.totalPages ||
                          Math.abs(p - pagination.currentPage) <= 1
                        );
                      })
                      .map((p, i, arr) => {
                        return (
                          <React.Fragment key={p}>
                            {i > 0 && arr[i - 1] !== p - 1 && (
                              <Text style={styles.paginationEllipsis}>...</Text>
                            )}
                            <TouchableOpacity
                              style={[
                                styles.pageNumberBtn,
                                pagination.currentPage === p &&
                                  styles.activePageNumberBtn,
                              ]}
                              onPress={() => fetchProperties(filters, p)}
                            >
                              <Text
                                style={[
                                  styles.pageNumberText,
                                  pagination.currentPage === p &&
                                    styles.activePageNumberText,
                                ]}
                              >
                                {p}
                              </Text>
                            </TouchableOpacity>
                          </React.Fragment>
                        );
                      })}
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.pageBtn,
                      !pagination.hasNextPage && styles.pageBtnDisabled,
                    ]}
                    disabled={!pagination.hasNextPage}
                    onPress={() =>
                      fetchProperties(filters, pagination.currentPage + 1)
                    }
                  >
                    <Text
                      style={[
                        styles.pageBtnText,
                        !pagination.hasNextPage && styles.pageBtnTextDisabled,
                      ]}
                    >
                      Next
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* End of results footer */}
              {pagination.currentPage === pagination.totalPages && properties.length > 0 && (
                <ReachedTheEnd 
                  propertyCount={pagination.totalItems} 
                  onGoToTop={() => {
                    if (scrollViewRef.current) {
                      scrollViewRef.current.scrollTo({ y: 0, animated: true });
                    } else if (typeof window !== 'undefined') {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }} 
                  onContactSupport={() => navigate('/support')}
                />
              )}
                  </>
                )}
              </View>
            </>
          )}
        </View>

        {/* Mobile Filter Modal */}
        <Modal
          visible={showFilters && width <= 768}
          animationType="slide"
          transparent={true}
          onRequestClose={toggleFilters}
        >
          <View style={styles.mobileFilterOverlay}>
            <View style={styles.mobileFilterPanel}>
              <View style={styles.mobileFilterHeader}>
                <TouchableOpacity onPress={toggleFilters}>
                  <CrossIcon size={18} color="#333" />
                </TouchableOpacity>
                <Text style={styles.filterPanelTitle}>Advanced Filters</Text>
              </View>

              <View style={styles.mobileFilterBody}>
                {/* Tabs Sidebar */}
                <ScrollView style={styles.mobileTabsSidebar}>
                  {['location', 'pricing', 'unit', 'rent', 'roi', 'tenure'].map(
                    tab => (
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
                          {tab === 'location'
                            ? 'Location'
                            : tab === 'pricing'
                            ? 'Pricing'
                            : tab === 'unit'
                            ? 'Type'
                            : tab === 'rent'
                            ? 'Rent'
                            : tab === 'roi'
                            ? 'ROI'
                            : 'Tenure'}
                        </Text>
                      </TouchableOpacity>
                    ),
                  )}
                </ScrollView>

                {/* Content Area */}
                <ScrollView style={styles.mobileFilterContent}>
                  {renderFilterContent()}
                </ScrollView>
              </View>

              <View style={styles.mobileFooter}>
                <TouchableOpacity
                  onPress={handleResetFilters}
                  style={[styles.resetFilterBtn, { flex: 1 }]}
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
                  style={{ flex: 1 }}
                >
                  <LinearGradient
                    colors={['#EE2529', '#C73834']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.applyFilterBtn, { width: '100%' }]}
                  >
                    <Text style={[styles.btnText, { color: '#fff' }]}>
                      Apply
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    // paddingBottom: 40,
   
    // minHeight: '100%',
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
    fontFamily: 'Montserrat',
  },
  selectedItemLocation: {
    fontSize: 10,
    color: '#666',
    fontFamily: 'Montserrat',
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
    fontFamily: 'Montserrat',
  },
  contentContainer: {
    marginTop: 0, 
  },
  headerRow: {
    marginBottom: 20,
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
  },
  pageTitle: {
    fontSize: 18,
    color: '#333',
    fontFamily: 'Montserrat',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    justifyContent: 'center',
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
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
    fontFamily: 'Montserrat',
  },
  specialTextLarge: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#262626',
    marginBottom: 20,
    fontFamily: 'Montserrat',
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
    fontFamily: 'Montserrat',
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
    fontFamily: 'Montserrat',
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
    fontFamily: 'Montserrat',
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
    fontFamily: 'Montserrat',
  },
  cardContent: {
    padding: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
    fontFamily: 'Montserrat',
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
    fontFamily: 'Montserrat',
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
    fontFamily: 'Montserrat',
  },
  statValue: {
    color: '#333',
    fontWeight: 'bold',
    fontFamily: 'Montserrat',
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
    fontFamily: 'Montserrat',
  },
  roiValue: {
    fontSize: 16,
    color: '#EE2529',
    fontWeight: 'bold',
    fontFamily: 'Montserrat',
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
    fontFamily: 'Montserrat',
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
    fontFamily: 'Montserrat',
  },
  // Filter Styles
  filterHeader: {
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
    position: 'relative',
    minHeight: 80,
    justifyContent: 'center',
    width: '90%',
    maxWidth: 1540,
    alignSelf: 'center',
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
    fontSize: 18,
    color: '#767676',
    fontWeight: '700',
    fontFamily: 'Montserrat',
  },
  filterActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  filterToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 146,
    height: 32,
    gap: 14,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#767676',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 6,
  },
  filterToggleText: {
    fontSize: 12,
    color: '#767676',
    fontWeight: '400',
    lineHeight: 17,
    fontFamily: 'Montserrat',
  },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#fff',
    
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  sortBtnText: {
    color: '#EE2529',
    fontWeight: 'bold',
    fontSize: 14,
    fontFamily: 'Montserrat',
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
    width: '90%',
    maxWidth: 1540,
    alignSelf: 'center',
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
    fontFamily: 'Montserrat',
  },
  filterTabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    
    width: '100%',
  },
  filterTabItem: {
    paddingVertical: 10,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
    flex: 1,
    alignItems: 'center',
  },
  activeFilterTab: {
    borderBottomColor: '#EE2529',
   
  },
  filterTabText: {
    fontSize: 18,
    color: '#333',
    fontWeight: '700',
    textAlign: 'center',
    fontFamily: 'Montserrat',
  },
  activeFilterTabText: {
    color: '#EE2529',
  },
  infoBox: {
    backgroundColor: '#FDEDEE',
    padding: 10,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#262626',
    flex: 1,
    fontFamily: 'Montserrat',
  },
  filterContentArea: {
    minHeight: 100,
  },
  filterSection: {
    padding: 10,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#262626',
    marginBottom: 20,
    fontFamily: 'Montserrat',
  },
  sliderContainer: {
    paddingHorizontal: 10,
    marginBottom: 30,
    gap: 15,
    width: '100%',
  },
  sliderEndpoint: {
    fontSize: 14,
    fontWeight: '600',
    color: '#262626',
    fontFamily: 'Montserrat',
  },
  sliderTrackContainer: {
    flex: 1,
    height: 10,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    overflow: 'visible',
    ...Platform.select({
      web: {
        cursor: 'pointer',
        userSelect: 'none',
      } as any,
    }),
  },
  sliderBackgroundTrack: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: '#FDEDEE',
    borderRadius: 3,
  },
  sliderActiveTrack: {
    position: 'absolute',
    left: 0,
    height: 6,
    backgroundColor: '#EE2529',
    borderRadius: 3,
    zIndex: 1,
  },
  sliderThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#EE2529',
    position: 'absolute',
    left: '50%',
    marginLeft: -12,
    shadowColor: '#EE2529',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
    ...Platform.select({
      web: { cursor: 'pointer' } as any,
    }),
  },
  filterSeparator: {
    fontSize: 13,
    color: '#999',
    marginBottom: 15,
    paddingLeft: 5,
    fontFamily: 'Montserrat',
  },
  priceInputGrid: {
    flexDirection: 'row',
    gap: 30,
    width: '100%',
  },
  priceInputCol: {
    flex: 1,
    width: '100%',
  },
  priceInputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#262626',
    marginBottom: 8,
    fontFamily: 'Montserrat',
  },
  inputWrapper: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceInput: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: '#262626',
    fontWeight: '500',
    fontFamily: 'Montserrat',
  },
  stepperIcons: {
    position: 'absolute',
    right: 15,
    gap: 2,
    alignItems: 'center',
  },
  stepperBtn: {
    backgroundColor: '#E5E5E5',
    width: 24,
    height: 18,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible',
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
    fontFamily: 'Montserrat',
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
    marginBottom: 5,
    padding: 5,
    ...Platform.select({
      web: {
        '@media (max-width: 768px)': {
          width: '100%',
        }
      } as any
    }),
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#6E6E6E',
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEEEEE',
  },
  checkboxActive: {
    backgroundColor: '#6E6E6E',
    borderColor: '#6E6E6E',
  },
  checkboxLabel: {
    fontSize: 18,
    color: '#262626',
    fontWeight: '400',
    fontFamily: 'Montserrat',
    ...Platform.select({
      web: {
        '@media (max-width: 768px)': {
          fontSize: 14,
        }
      } as any
    }),
  },
  proximityGrid: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 10,
  },
  proximityColumn: {
    flex: 1,
    gap: 0,
  },
  checkboxItemWide: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    padding: 5,
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
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontWeight: '600',
    fontSize: 14,
    fontFamily: 'Montserrat',
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
    fontFamily: 'Montserrat',
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
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
    gap: 15,
  },
  pageBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  pageBtnDisabled: {
    backgroundColor: '#f5f5f5',
    borderColor: '#eee',
  },
  pageBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    fontFamily: 'Montserrat',
  },
  pageBtnTextDisabled: {
    color: '#ccc',
  },
  pageNumbers: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pageNumberBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  activePageNumberBtn: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  pageNumberText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    fontFamily: 'Montserrat',
  },
  activePageNumberText: {
    color: '#fff',
    fontWeight: '700',
    fontFamily: 'Montserrat',
  },
  paginationEllipsis: {
    color: '#666',
    fontSize: 16,
    paddingHorizontal: 5,
    fontFamily: 'Montserrat',
  },
  descInfoBox: {
    backgroundColor: '#F7F7F7',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  descInfoText: {
    fontSize: 13,
    color: '#6E6E6E',
    lineHeight: 18,
    fontFamily: 'Montserrat',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
    fontFamily: 'Montserrat',
  },
});

export default ExplorePropertiesScreen;
