import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Share,
  Dimensions,
} from 'react-native';
import { useNavigation } from '../../context/NavigationContext';
import Layout from '../../layout/Layout';
import { COLORS } from '../../constants/theme';
import {
  MapPin,
  ChevronLeft,
  X,
  Heart,
  XCircle,
} from 'lucide-react-native';
import { request } from '../../../helpers/api/request';
import PropertyCard from '../../components/PropertyCard';
import download from "../../assets/Compare/download.png"
import share from "../../assets/Compare/share.png"

const { width } = Dimensions.get('window');

interface ComparisonProperty {
  propertyId: string;
  title: string;
  location: string;
  cost: string;
  rent: string;
  tenure: string;
  roi: string;
  images: string[] | null;
  clientType: string;
  carpetArea: string;
  floorPlate: string;
  furnishing: string;
  powerBackup: string;
  parking: string;
  buildingGrade?: string;
  leaseStartDate?: string;
  lockInPeriod?: string;
  securityDeposit?: string;
  escalation?: string;
  maintenance?: string;
  propertyTax?: string;
  insurance?: string;
  additionalIncome?: string;
  occupancyCertificate?: boolean;
  isVerified?: string;
  raw?: any;
}

const PropertyComparisonScreen = ({ propertyIds }: { propertyIds: string }) => {
  const { goBack, navigate } = useNavigation();
  const [properties, setProperties] = useState<ComparisonProperty[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await request('GET', {
          route: `/v1/properties/compare?propertyIds=${propertyIds}`,
        });

        const data = response?.data;
        const comparisonList = data?.properties || [];

        const propertyData = comparisonList.map((data: any) => {
          return {
            propertyId: data.propertyId,
            title: data.basicInfo?.propertyType || 'Property',
            location: `${data.location?.city}, ${data.location?.state}`,
            cost: data.financial?.sellingPrice
              ? `₹${data.financial.sellingPrice} Cr`
              : 'N/A',
            rent: data.rental?.totalMonthlyRent
              ? `₹${data.rental.totalMonthlyRent}`
              : 'N/A',
            tenure: data.leaseDetails?.leaseDurationYears
              ? `${data.leaseDetails.leaseDurationYears} Yrs`
              : 'N/A',
            roi: data.financial?.grossRentalYield
              ? `${data.financial.grossRentalYield}%`
              : 'N/A',
            images:
              data.media && data.media.length > 0
                ? data.media.map((m: any) => m.fileUrl)
                : null,
            clientType: data.leaseDetails?.tenantType || 'MNC Client',
            carpetArea: data.basicInfo?.carpetArea
              ? `${data.basicInfo.carpetArea} ${
                  data.basicInfo.carpetAreaUnit === 'Sq. Feet'
                    ? 'sq ft'
                    : data.basicInfo.carpetAreaUnit || 'sq ft'
                }`
              : 'N/A',
            floorPlate: 'N/A',
            furnishing: data.infrastructure?.furnishingStatus || 'N/A',
            powerBackup: data.infrastructure?.powerBackup || 'N/A',
            parking: `${data.parking?.fourWheeler || 0} Car`,
            buildingGrade: data.basicInfo?.buildingGrade || 'Grade A',
            lockInPeriod:
              data.leaseDetails?.lockInPeriod?.years &&
              data.leaseDetails.lockInPeriod.years > 0
                ? `${data.leaseDetails.lockInPeriod.years} Yrs`
                : 'N/A',
            securityDeposit: data.rental?.securityDeposit?.amount
              ? `₹${data.rental.securityDeposit.amount}`
              : '₹0.00',
            escalation:
              data.escalationAndMaintenance?.annualEscalationPercent &&
              data.escalationAndMaintenance.annualEscalationPercent !== 'N/A'
                ? `${data.escalationAndMaintenance.annualEscalationPercent}%`
                : 'N/A',
            maintenance: data.escalationAndMaintenance?.maintenanceAmount
              ? `₹${data.escalationAndMaintenance.maintenanceAmount}`
              : '₹0.00',
            additionalIncome:
              data.financial?.additionalIncomeAnnual === '0.00'
                ? '₹0.00'
                : data.financial?.additionalIncomeAnnual || 'Nil',
            occupancyCertificate:
              typeof data.legal?.occupancyCertificate === 'string'
                ? data.legal.occupancyCertificate.toLowerCase().includes('yes')
                : !!data.legal?.occupancyCertificate,
            isVerified: data.isVerified,
            raw: data,
          };
        });
        setProperties(propertyData);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };

    if (propertyIds) {
      fetchProperties();
    }
  }, [propertyIds]);

  useEffect(() => {
    if (!loading && properties.length < 2) {
      navigate('/');
    }
  }, [loading, properties.length]);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this property comparison: ${properties
          .map(p => p.title)
          .join(', ')}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveProperty = (id: string) => {
    setProperties(prev => prev.filter(p => p.propertyId !== id));
  };

  const ComparisonRow = ({
    label,
    keys,
    highlightIndex = -1,
    isAlternate = false,
  }: {
    label: string;
    keys: (keyof ComparisonProperty)[];
    highlightIndex?: number;
    isAlternate?: boolean;
  }) => (
    <View
      style={[
        styles.rowContainer,
        isAlternate && { backgroundColor: '#F2F2F2' },
      ]}
    >
      <View style={styles.rowLabelContainer}>
        <Text style={styles.rowLabelText}>{label}</Text>
      </View>
      {properties.map((prop, index) => (
        <View
          key={prop.propertyId}
          style={[
            styles.rowValueContainer,
            index === highlightIndex && styles.highlightCell,
          ]}
        >
          {keys.map(key => (
            <Text
              key={key as string}
              style={[
                styles.rowValueText,
                index === highlightIndex && styles.highlightText,
              ]}
            >
              {typeof prop[key] === 'boolean'
                ? prop[key]
                  ? '✓ Available'
                  : '✗ Unavailable'
                : prop[key]}
            </Text>
          ))}
        </View>
      ))}
      {[...Array(3 - properties.length)].map((_, i) => (
        <View key={`empty-${i}`} style={styles.rowValueContainer} />
      ))}
    </View>
  );

  const SectionTitle = ({
    title,
    subtitle,
  }: {
    title: string;
    subtitle: string;
  }) => (
    <View style={styles.sectionHeaderContainer}>
      <Text style={styles.sectionHeaderTitle}>{title}</Text>
      <Text style={styles.sectionHeaderSubtitle}>{subtitle}</Text>
    </View>
  );

  if (loading) {
    return (
      <Layout>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </Layout>
    );
  }

  return (
    <Layout>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header Title */}
        <View style={styles.pageHeader}>
          <TouchableOpacity onPress={goBack} style={styles.backButton}>
            <ChevronLeft size={24} color={COLORS.textDark} />
          </TouchableOpacity>
          <Text style={styles.pageTitle}>
            Property Comparison Dashboard
            <Text style={styles.pageSubtitle}>
              {' '}
              ({properties.length} properties selected)
            </Text>
          </Text>
        </View>

        {/* Comparison Header Bar */}
        <View style={styles.comparisonHeaderBar}>
          <View style={styles.headerBarItem}>
            <Text style={styles.headerBarTitle}>Property Comparison</Text>
            <Text style={styles.headerBarSubtitle}>Compare key metrics of properties</Text>
          </View>
          
          {properties.map((prop) => (
            <React.Fragment key={prop.propertyId}>
              <View style={styles.headerBarDivider} />
              <View style={[styles.headerBarItem, styles.centerAlign]}>
                <Text style={[styles.headerBarTitle, styles.textCenter]}>{prop.title}</Text>
                <Text style={[styles.headerBarSubtitle, styles.textCenter]}>{prop.clientType}</Text>
              </View>
            </React.Fragment>
          ))}

          {/* Fill empty slots if less than 3 properties */}
          {[...Array(3 - properties.length)].map((_, i) => (
            <React.Fragment key={`empty-bar-${i}`}>
              <View style={styles.headerBarDivider} />
              <View style={styles.headerBarItem} />
            </React.Fragment>
          ))}
        </View>

        {/* Property Cards Row */}
        <View style={styles.cardsRow}>
          <View style={styles.propertyHeaderLabel}>
            <Text style={styles.propertyHeaderTitle}>Property</Text>
          </View>
          {properties.map(prop => (
            <PropertyCard
              key={prop.propertyId}
              item={{
                id: prop.propertyId,
                title: prop.title,
                location: prop.location,
                price: prop.cost,
                rent: prop.rent,
                tenure: prop.tenure,
                roi: prop.roi,
                type: prop.title,
                images: prop.images,
                badges: [prop.clientType],
                isVerified: prop.isVerified,
                verified:
                  prop.isVerified === 'partial' ||
                  prop.isVerified === 'completed',
                raw: prop.raw,
              }}
              iscomparePage={true}
              width="25%"
              onRemove={handleRemoveProperty}
              onView={() => {}}
              onEnquire={() => {}}
              style={{ marginHorizontal: 5 }}
            />
          ))}
          {/* Fill empty slots */}
          {[...Array(3 - properties.length)].map((_, i) => (
            <View key={`empty-card-${i}`} style={styles.emptyCard} />
          ))}
        </View>

        {/* Overview Section */}
        <SectionTitle title="Overview" subtitle="Property details & location" />
        <View style={styles.tableContainer}>
          <View style={styles.headerRow}>
            <View style={styles.rowLabelContainer}>
              <Text style={styles.headerRowText}>Property Type</Text>
            </View>
            {properties.map(p => (
              <View key={p.propertyId} style={styles.rowValueContainer}>
                <Text style={styles.headerRowValue}>{p.title}</Text>
              </View>
            ))}
            {[...Array(3 - properties.length)].map((_, i) => (
              <View
                key={`empty-header-${i}`}
                style={styles.rowValueContainer}
              />
            ))}
          </View>
          <ComparisonRow label="Carpet Area" keys={['carpetArea']} />
          <ComparisonRow
            label="Location"
            keys={['location']}
            isAlternate={true}
          />
          <ComparisonRow label="Building Details" keys={['buildingGrade']} />
          <ComparisonRow
            label="Tenant Type"
            keys={['clientType']}
            isAlternate={true}
          />
        </View>

        {/* Productivity Section */}
        <SectionTitle
          title="Productivity (Financials)"
          subtitle="Rent, yield, ROI analysis"
        />
        <View style={styles.tableContainer}>
          <View style={styles.headerRow}>
            <View style={styles.rowLabelContainer}>
              <Text style={styles.headerRowText}>Property Value</Text>
            </View>
            {properties.map(p => (
              <View key={p.propertyId} style={styles.rowValueContainer}>
                <Text style={styles.headerRowValue}>{p.cost}</Text>
              </View>
            ))}
            {[...Array(3 - properties.length)].map((_, i) => (
              <View
                key={`empty-header-prod-${i}`}
                style={styles.rowValueContainer}
              />
            ))}
          </View>
          <ComparisonRow label="Rent per sq ft" keys={['rent']} />
          <ComparisonRow
            label="Monthly Rent"
            keys={['rent']}
            isAlternate={true}
            highlightIndex={1}
          />
          <ComparisonRow label="Maintenance Costs" keys={['maintenance']} />
          <ComparisonRow
            label="Gross Rental Yield"
            keys={['roi']}
            isAlternate={true}
            highlightIndex={2}
          />
        </View>

        {/* Lease Terms Section */}
        <SectionTitle title="Lease Terms" subtitle="Lease agreement details" />
        <View style={styles.tableContainer}>
          <ComparisonRow
            label="Balance Lease Tenure"
            keys={['tenure']}
            isAlternate={true}
          />
          <ComparisonRow label="Security Deposit" keys={['securityDeposit']} />
          <ComparisonRow
            label="Lock-in Period"
            keys={['lockInPeriod']}
            isAlternate={true}
            highlightIndex={1}
          />
          <ComparisonRow label="Annual Escalation" keys={['escalation']} />
        </View>

        {/* Facilities Section */}
        <SectionTitle
          title="Facilities & Features"
          subtitle="Amenities & specifications"
        />
        <View style={styles.tableContainer}>
          <ComparisonRow
            label="Parking Spaces"
            keys={['parking']}
            isAlternate={true}
          />
          <ComparisonRow
            label="Additional Income"
            keys={['additionalIncome']}
            isAlternate={true}
          />
          <ComparisonRow
            label="Furnishing Status"
            keys={['furnishing']}
            highlightIndex={2}
          />
        </View>

        {/* Documents Section */}
        <SectionTitle
          title="Documents & Compliance"
          subtitle="Legal documents & certificates"
        />
        <View style={styles.tableContainer}>
          <ComparisonRow
            label="Occupancy Certificate"
            keys={['occupancyCertificate']}
            isAlternate={true}
          />
        </View>

        {/* Footer Actions */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => {
              /* Download */
            }}
          >
            <Image source={download} style={{ width: 16, height: 16 }} />
            <Text style={styles.actionBtnText}>Download Report</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={handleShare}>
            <Image source={share} style={{ width: 16, height: 16 }} />
            <Text style={styles.actionBtnText}>Share Report</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingHorizontal: 120,
    backgroundColor: COLORS.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 400,
  },
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 10,
   
  },
  backButton: {
    marginRight: 10,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#EE2529',
  },
  pageSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.textSecondary,
  },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
    alignItems: 'flex-start',
  },
  propertyHeaderLabel: {
    width: '10%',
    paddingTop: 20,
    margin: 'auto',
    textAlign: 'center',
  },
  propertyHeaderTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#EE2529',
  },
  propertyCard: {
    width: '25%',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginHorizontal: 5,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  emptyCard: {
    width: '25%',
    marginHorizontal: 5,
  },
  cardImageContainer: {
    height: 150,
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  clientBadge: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: '#FFF3CA',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 12,
  },
  clientBadgeText: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  removeBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 2,
  },
  cardInfo: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    color: COLORS.textDark,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 4,
  },
  locationText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  cardStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  statValue: {
    fontWeight: '700',
    color: COLORS.textDark,
  },
  roiBox: {
    width: 50,
    height: 50,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  roiLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  roiValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#EE2529',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  viewBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.textSecondary,
    borderRadius: 6,
    paddingVertical: 6,
    alignItems: 'center',
  },
  viewBtnText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  enquireBtn: {
    flex: 1,
    backgroundColor: '#EE2529',
    borderRadius: 6,
    paddingVertical: 6,
    alignItems: 'center',
  },
  enquireBtnText: {
    fontSize: 10,
    fontWeight: '700',
    color: 'white',
  },
  sectionHeaderContainer: {
    marginTop: 30,
    marginBottom: 15, // Increased from 10
  },
  sectionHeaderTitle: {
    fontSize: 24, // Increased from 18
    fontWeight: '700',
    color: '#EE2529',
    marginBottom: 4, // Increased from 2
  },
  sectionHeaderSubtitle: {
    fontSize: 18, // Increased from 12
    color:'#767676',
    fontWeight: '500', // Added for better readability
  },
  tableContainer: {
    borderWidth: 0,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#F2F2F2',
    alignItems: 'stretch',
  },
  rowLabelContainer: {
    width: '25%',
    paddingLeft: 10,
    paddingVertical: 15,
    justifyContent: 'center',
  },
  rowLabelText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  headerRowText: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  rowValueContainer: {
    width: '25%',
    alignItems: 'center',
    paddingHorizontal: 5,
    justifyContent: 'center',
    paddingVertical: 12,
    borderLeftWidth: 2,
    borderLeftColor: '#EDECEC',
  },
  rowValueText: {
    fontSize: 20,
    color: COLORS.textDark,
    textAlign: 'center',
  },
  headerRowValue: {
    fontSize: 20,
    fontWeight: '500',
    color: COLORS.textDark,
    textAlign: 'center',
  },
  highlightCell: {
    backgroundColor: '#FFFCF4',
    borderLeftWidth: 4,
    borderLeftColor: '#EE2529',
  },
  highlightText: {
    color: '#EE2529',
    fontWeight: '700',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 40,
    marginBottom: 60,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.textSecondary,
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  actionBtnText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  // Comparison Header Bar Styles
  comparisonHeaderBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#EDECEC',
    paddingVertical: 20,
    marginBottom: 30,
    alignItems: 'center',
    // Top shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 8,
  },
  headerBarItem: {
    flex: 1,
    paddingHorizontal: 25,
    justifyContent: 'center',
  },
  centerAlign: {
    alignItems: 'center',
  },
  textCenter: {
    textAlign: 'center',
  },
  headerBarDivider: {
    width: 1,
    height: '70%',
    backgroundColor: '#EDECEC',
  },
  headerBarTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#262626',
    marginBottom: 4,
    fontFamily: 'Montserrat',
  },
  headerBarSubtitle: {
    fontSize: 14,
    color: '#767676',
    fontFamily: 'Montserrat',
  },
});

export default PropertyComparisonScreen;