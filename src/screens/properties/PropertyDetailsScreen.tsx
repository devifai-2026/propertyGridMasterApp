import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {
  ChevronLeft,
  MapPin,
  Share2,
  Building,
  FileText,
  BarChart2,
  HelpCircle,
  Download,
  Plane,
  Train,
  ChevronDown,
} from 'lucide-react-native';
import Layout from '../../layout/Layout';
import { useNavigation } from '../../context/NavigationContext';
import { COLORS } from '../../constants/theme';
import PropertyCard, { Property } from '../../components/PropertyCard';
import {
  DiversificationCard,
  IncomeTrackerCard,
  LeaseRenewalsCard,
} from '../investors/components/PortfolioTab';
import RentalCards from '../calculators/components/RentalYield/RentalCards';
import { usePropertyAPIs } from '../../../helpers/hooks/propertyAPIs/usePropertyApis';

const { width } = Dimensions.get('window');

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const PropertyDetailsCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <Text style={styles.cardTitle}>{title}</Text>
    </View>
    <View style={styles.cardContent}>{children}</View>
  </View>
);

const PropertyDetailsScreen = () => {
  const { currentPath, goBack } = useNavigation();
  const propertyId = currentPath.split('/propertyDetails/')[1];
  const [property, setProperty] = useState<Property | null>(null);
  const { getPropertyById, loading } = usePropertyAPIs();
  useEffect(() => {
    if (propertyId) {
      getPropertyById(propertyId, (data: any) => {
        const mappedProperty: Property = {
          id: data.propertyId,
          title: `${data.propertyType} Space`,
          location: `${data.city}, ${data.state}`,
          price: `₹${data.sellingPrice} Cr`,
          rent: data.annualGrossRent ? `₹${data.annualGrossRent} L` : 'N/A',
          tenure: `${data.tenureLeftYears || 0} Yrs`,
          roi: data.netRentalYield ? `${data.netRentalYield}%` : 'N/A',
          type: data.propertyType,
          images:
            data.media && data.media.length > 0
              ? data.media.map((m: any) => m.fileUrl)
              : null,
          badges: [data.tenantType, data.buildingGrade].filter(Boolean),
          verified: data.isActive,
          raw: data,
        };
        setProperty(mappedProperty);
      });
    }
  }, [propertyId]);

  const [activeTab, setActiveTab] = useState('property');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const tabs = [
    { id: 'property', label: 'Property Details', icon: Building },
    { id: 'lease', label: 'Lease Details', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'location', label: 'Location Details', icon: MapPin },
    { id: 'faqs', label: 'FAQs', icon: HelpCircle },
  ];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading property details...</Text>
      </View>
    );
  }

  if (!property) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Property not found.</Text>
        <TouchableOpacity onPress={goBack}>
          <Text style={{ color: COLORS.primary, marginTop: 10 }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderPropertyContent = () => (
    <View style={styles.tabContent}>
      {/* Description Section */}
      <View style={styles.detailsHeader}>
        <View style={styles.badgeRow}>
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumText}>Premium Location</Text>
          </View>
          <View style={styles.actionButtonsRow}>
            <TouchableOpacity style={styles.actionOutlineBtn}>
              <Download size={14} color={COLORS.textSecondary} />
              <Text style={styles.actionOutlineText}>Download</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionOutlineBtn}>
              <Share2 size={14} color={COLORS.textSecondary} />
              <Text style={styles.actionOutlineText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.descriptionTitle}>{property.title}</Text>
        <Text style={styles.descriptionText}>
          {property.title} located at {property.location}. This {property.type}{' '}
          property offers a great investment opportunity with an ROI of{' '}
          {property.roi}. The tenure left is {property.tenure}.
        </Text>
      </View>

      {/* Details Grid */}
      <View style={styles.gridContainer}>
        {/* Basic Information */}
        <PropertyDetailsCard title="Basic Information">
          <View style={styles.row}>
            <View style={styles.col}>
              <InfoRow
                label="Property Type"
                value={property.raw.propertyType}
              />
              <InfoRow
                label="Price"
                value={`₹${property.raw.sellingPrice} Cr`}
              />
              <InfoRow
                label="Building Grade"
                value={property.raw.buildingGrade}
              />
            </View>
            <View style={styles.col}>
              <InfoRow
                label="Carpet Area"
                value={`${property.raw.carpetArea} ${property.raw.carpetAreaUnit}`}
              />
              <InfoRow label="Built Year" value={property.raw.completionYear} />
              <InfoRow label="Ownership" value={property.raw.ownershipType} />
            </View>
          </View>
        </PropertyDetailsCard>

        {/* Legal & Title Status */}
        <PropertyDetailsCard title="Legal & Title Status">
          <InfoRow
            label="Lease Registration"
            value={property.raw.leaseRegistration}
          />
          <InfoRow
            label="Occupancy Certificate (OC)"
            value={property.raw.occupancyCertificate}
          />
          <InfoRow label="Litigation Status" value={property.raw.titleStatus} />
        </PropertyDetailsCard>

        {/* Building Amenities */}
        <PropertyDetailsCard title="Building Amenities">
          <View style={styles.row}>
            <View style={styles.col}>
              <InfoRow
                label="Number of lifts"
                value={`${property.raw.numberOfLifts} lifts`}
              />
              <InfoRow
                label="Amenities"
                value={property.raw.amenities
                  ?.map((a: any) => a.amenityName)
                  .slice(0, 2)
                  .join(', ')}
              />
              <InfoRow label="Power Backup" value={property.raw.powerBackup} />
            </View>
            <View style={styles.col}>
              <InfoRow
                label="Furnishing Status"
                value={property.raw.furnishingStatus}
              />
              <InfoRow
                label="Caretaker"
                value={property.raw.caretaker?.caretakerName}
              />
            </View>
          </View>
        </PropertyDetailsCard>

        {/* Parking Details */}
        <PropertyDetailsCard title="Parking Details">
          <View style={styles.row}>
            <View style={styles.col}>
              <InfoRow
                label="Two Wheeler"
                value={`${property.raw.parkingTwoWheeler} slots`}
              />
            </View>
            <View style={styles.col}>
              <InfoRow
                label="Four Wheeler"
                value={`${property.raw.parkingFourWheeler} slots`}
              />
            </View>
          </View>
        </PropertyDetailsCard>

        {/* Building Infrastructure */}
        <PropertyDetailsCard title="Building Infrastructure">
          <View style={styles.row}>
            <View style={styles.col}>
              <InfoRow label="Power Backup" value={property.raw.powerBackup} />
            </View>
            <View style={styles.col}>
              <InfoRow
                label="Maintained By"
                value={
                  property.raw.caretaker?.caretakerName ||
                  'Professional Facility'
                }
              />
            </View>
          </View>
          <View style={styles.hvacContainer}>
            <InfoRow label="HVAC Type" value={property.raw.hvacType} />
          </View>
        </PropertyDetailsCard>
      </View>
    </View>
  );

  const diversificationData = [
    { type: 'Commercial', percentage: 55, color: '#EE2529' },
    { type: 'Residential', percentage: 30, color: '#767676' },
    { type: 'Industrial', percentage: 15, color: '#5DADE2' },
  ];

  const incomeData = {
    labels: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'],
    expected: [45, 50, 52, 55, 55],
    received: [45, 52, 50, 55, 58],
  };

  const leaseRenewals = [
    {
      id: '1',
      property: 'Residential Space',
      location: 'Pune',
      tenant: 'AP Realtors',
      expiryDate: '15/12/2025',
      annualRent: '₹2,65,00,000',
    },
    {
      id: '2',
      property: 'Commercial Space',
      location: 'Mumbai',
      tenant: 'Global Innovations',
      expiryDate: '20/12/2025',
      annualRent: '₹2,55,00,000',
    },
  ];

  const renderLeaseContent = () => (
    <View style={styles.tabContent}>
      <View style={styles.detailsHeader}>
        <Text style={styles.descriptionTitle}>Lease & Tenant Details</Text>
      </View>

      <View style={styles.gridContainer}>
        <PropertyDetailsCard title="Tenant Information">
          <InfoRow label="Tenant Type" value={property.raw.tenantType} />
          <InfoRow
            label="Current Status"
            value={property.raw.isActive ? 'Occupied' : 'Vacant'}
          />
        </PropertyDetailsCard>

        <PropertyDetailsCard title="Rental & Deposit Details">
          <View style={styles.row}>
            <View style={styles.col}>
              <InfoRow
                label="Total Monthly Rent"
                value={`₹${property.raw.totalMonthlyRent}`}
              />
              <InfoRow
                label="Rent per sq ft"
                value={`₹${property.raw.rentPerSqftMonthly}`}
              />
            </View>
            <View style={styles.col}>
              <InfoRow
                label="Security Deposit"
                value={`${property.raw.securityDepositMonths} months`}
              />
              <InfoRow
                label="Deposit Amount"
                value={`₹${property.raw.securityDepositAmount}`}
              />
            </View>
          </View>
        </PropertyDetailsCard>

        <PropertyDetailsCard title="Lease Duration & Terms">
          <View style={styles.row}>
            <View style={styles.col}>
              <InfoRow
                label="Lease Start Date"
                value={property.raw.leaseStartDate}
              />
              <InfoRow
                label="Lock-in Period"
                value={`${property.raw.lockInPeriodYears} Yrs ${property.raw.lockInPeriodMonths} Months`}
              />
            </View>
            <View style={styles.col}>
              <InfoRow
                label="Lease Expiry Date"
                value={property.raw.leaseEndDate}
              />
              <InfoRow
                label="Lease Duration"
                value={`${property.raw.leaseDurationYears} Yrs`}
              />
            </View>
          </View>
        </PropertyDetailsCard>

        <PropertyDetailsCard title="Escalation & Maintenance">
          <View style={styles.row}>
            <View style={styles.col}>
              <InfoRow
                label="Escalation Rate"
                value={`${property.raw.annualEscalationPercent}%`}
              />
              <InfoRow
                label="Maintenance Included"
                value={property.raw.maintenanceCostsIncluded}
              />
            </View>
            <View style={styles.col}>
              <InfoRow
                label="Escalation Frequency"
                value={`Every ${property.raw.escalationFrequencyYears} Yrs`}
              />
            </View>
          </View>
        </PropertyDetailsCard>
      </View>
    </View>
  );

  const renderAnalyticsContent = () => (
    <View style={styles.tabContent}>
      <View style={styles.detailsHeader}>
        <Text style={styles.descriptionTitle}>Investment ROI Analytics</Text>
      </View>

      <View style={styles.gridContainer}>
        <RentalCards
          containerStyle={styles.noVerticalPadding}
          data={{
            grossYield: property.raw.grossRentalYield
              ? `${property.raw.grossRentalYield}%`
              : 'N/A',
            netYield: property.raw.netRentalYield
              ? `${property.raw.netRentalYield}%`
              : 'N/A',
            cashFlow: property.raw.annualGrossRent
              ? `₹${property.raw.annualGrossRent} L`
              : 'N/A',
            paybackPeriod: property.raw.paybackPeriodYears
              ? `${property.raw.paybackPeriodYears} Yrs`
              : 'N/A',
          }}
        />

        <PropertyDetailsCard title="Investment Summary">
          <InfoRow
            label="Total Initial Investment"
            value={`₹${property.raw.sellingPrice} Cr`}
          />
          <InfoRow
            label="Gross Annual Rent"
            value={
              property.raw.annualGrossRent
                ? `₹${property.raw.annualGrossRent} L`
                : 'N/A'
            }
          />
          <InfoRow
            label="Total Annual Expenses"
            value={`₹${property.raw.totalOperatingAnnualCosts} L`}
          />
          <View style={styles.divider} />
          <InfoRow
            label="Net Annual Income"
            value={
              property.raw.netAnnualIncome
                ? `₹${property.raw.netAnnualIncome} L`
                : 'N/A'
            }
          />
        </PropertyDetailsCard>

        <PropertyDetailsCard title="Expense Breakdown">
          <View style={styles.row}>
            <View style={styles.col}>
              <InfoRow
                label="Property Tax (Annual)"
                value={`₹${property.raw.propertyTaxAnnual} L`}
              />
              <InfoRow
                label="Insurance (Annual)"
                value={`₹${property.raw.insuranceAnnual} L`}
              />
            </View>
            <View style={styles.col}>
              <InfoRow
                label="Maintenance (Annual)"
                value={`₹${property.raw.maintenanceAmount} L`}
              />
            </View>
          </View>
        </PropertyDetailsCard>

        {/* Portfolio Insights */}
        <DiversificationCard data={diversificationData} />
        <IncomeTrackerCard data={incomeData} />
        <LeaseRenewalsCard renewals={leaseRenewals} />
      </View>
    </View>
  );

  const renderLocationContent = () => (
    <View style={styles.tabContent}>
      <View style={styles.detailsHeader}>
        <Text style={styles.descriptionTitle}>Location & Market Overview</Text>
      </View>

      <View style={styles.gridContainer}>
        <PropertyDetailsCard title="Location Details">
          <View style={styles.row}>
            <View style={styles.col}>
              <InfoRow label="Micro-Market" value={property.raw.microMarket} />
              <InfoRow label="State" value={property.raw.state} />
            </View>
            <View style={styles.col}>
              <InfoRow label="City" value={property.raw.city} />
            </View>
          </View>
        </PropertyDetailsCard>

        <PropertyDetailsCard title="Proximity">
          <View style={styles.proximityItem}>
            <View style={styles.proximityIconLabel}>
              <Plane size={18} color="#F7C952" />
              <Text style={styles.infoValue}>Airport</Text>
            </View>
            <View style={styles.distanceBadge}>
              <Text style={styles.distanceText}>12 km</Text>
            </View>
          </View>
          <View style={styles.proximityItem}>
            <View style={styles.proximityIconLabel}>
              <Train size={18} color="#F7C952" />
              <Text style={styles.infoValue}>Metro Station</Text>
            </View>
            <View style={styles.distanceBadge}>
              <Text style={styles.distanceText}>1.2 km</Text>
            </View>
          </View>
        </PropertyDetailsCard>

        <PropertyDetailsCard title="Demand Drivers">
          <Text style={styles.descriptionText}>
            • Proximity to major IT campuses: Infosys, Wipro, TCS.
          </Text>
          <Text style={styles.descriptionText}>
            • High demand for Grade A office spaces.
          </Text>
          <Text style={styles.descriptionText}>
            • Growing tech hub with multinational presence.
          </Text>
        </PropertyDetailsCard>

        <PropertyDetailsCard title="Market Benchmark">
          <View style={styles.row}>
            <View style={styles.col}>
              <InfoRow label="Market Avg Rent" value="₹55/sq.ft" />
            </View>
            <View style={styles.col}>
              <InfoRow label="Market Cap Rate" value="6.5%" />
            </View>
          </View>
          <View style={styles.benchmarkNote}>
            <Text style={styles.infoValue}>Competitive Advantage</Text>
            <Text style={styles.descriptionText}>
              This property's rent of ₹57/sq.ft is above market average with a
              yield exceeding cap rate.
            </Text>
          </View>
        </PropertyDetailsCard>
      </View>
    </View>
  );

  const renderFAQContent = () => {
    const faqs = [
      {
        id: 1,
        q: 'Can we schedule a virtual tour?',
        a: 'Yes, we offer virtual tours for all our listed properties. You can schedule one through our support team.',
      },
      {
        id: 2,
        q: 'What are the property tax rates?',
        a: 'For this property in Pune, the annual property tax is approximately 0.3% to 0.5% of the market value.',
      },
      {
        id: 3,
        q: 'Are there any association fees?',
        a: 'Yes, the monthly maintenance fee is ₹15,000 covering security and common area maintenance.',
      },
      {
        id: 4,
        q: 'What school district is it in?',
        a: 'Located in PMC area with access to reputed CBSE/ICSE schools.',
      },
    ];

    return (
      <View style={styles.tabContent}>
        <View style={styles.detailsHeader}>
          <Text style={styles.descriptionTitle}>
            Frequently Asked Questions
          </Text>
          <Text style={styles.descriptionText}>
            Get answers to common stakeholder questions
          </Text>
        </View>

        <View style={styles.faqList}>
          {faqs.map(faq => {
            const isOpen = activeFaq === faq.id;
            return (
              <View
                key={faq.id}
                style={[styles.faqItem, isOpen && styles.faqItemOpen]}
              >
                <TouchableOpacity
                  style={styles.faqHeader}
                  onPress={() => setActiveFaq(isOpen ? null : faq.id)}
                >
                  <Text
                    style={[styles.faqQuestion, isOpen && styles.faqTextActive]}
                  >
                    {faq.q}
                  </Text>
                  <ChevronDown
                    size={20}
                    color={isOpen ? COLORS.primary : COLORS.textDark}
                    style={{
                      transform: [{ rotate: isOpen ? '180deg' : '0deg' }],
                    }}
                  />
                </TouchableOpacity>
                {isOpen && (
                  <View style={styles.faqAnswerContainer}>
                    <Text style={styles.descriptionText}>{faq.a}</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <Layout>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Top Back Button */}
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <ChevronLeft size={24} color={COLORS.textDark} />
        </TouchableOpacity>

        <View
          style={{ flexDirection: width > 900 ? 'row' : 'column', gap: 24 }}
        >
          {/* Left Column (Card + Assistance) */}
          <View style={{ width: width > 900 ? 380 : '100%' }}>
            <View style={styles.cardContainer}>
              <PropertyCard item={property} noView />
            </View>

            {/* Assistance Card */}
            <View style={styles.assistanceCard}>
              <Text style={styles.assistanceTitle}>Need Assistance?</Text>
              <Text style={styles.assistanceText}>
                Have questions about returns, tenants, or documents? Our team is
                hired to guide you both with clear answers on certain topics,
                and compliance directly from our property advisers.
              </Text>
              <TouchableOpacity style={styles.supportButton}>
                <Text style={styles.supportButtonText}>Get Support</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Right Column (Tabs + Details) */}
          <View style={{ flex: 1 }}>
            {/* Tabs */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.tabsContainer}
              contentContainerStyle={styles.tabsContent}
            >
              {tabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <TouchableOpacity
                    key={tab.id}
                    style={styles.tab}
                    onPress={() => setActiveTab(tab.id)}
                  >
                    <Icon
                      size={20}
                      color={isActive ? COLORS.primary : COLORS.textSecondary}
                      style={styles.tabIcon}
                    />
                    <Text
                      style={[styles.tabText, isActive && styles.activeTabText]}
                    >
                      {tab.label}
                    </Text>
                    {isActive && <View style={styles.activeTabIndicator} />}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Dynamic Content */}
            {activeTab === 'property' && renderPropertyContent()}
            {activeTab === 'lease' && renderLeaseContent()}
            {activeTab === 'analytics' && renderAnalyticsContent()}
            {activeTab === 'location' && renderLocationContent()}
            {activeTab === 'faqs' && renderFAQContent()}
          </View>
        </View>

        <View style={styles.spacer} />
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  // Property Card Container
  cardContainer: {
    marginBottom: 24,
    paddingHorizontal: 2,
  },

  // Tabs Styles
  tabsContainer: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    height: 60, // Enforce a fixed height for the tab bar
    flexGrow: 0,
    flexShrink: 0,
  },
  tabsContent: {
    paddingRight: 16,
    gap: 24,
    alignItems: 'center',
    height: '100%',
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    minWidth: 80,
    position: 'relative',
    paddingBottom: 0,
  },
  activeTab: {},
  tabText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginTop: 4,
  },
  activeTabText: {
    color: COLORS.primary,
  },
  activeTabIndicator: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    width: '60%', // Relative width for better scaling
    backgroundColor: COLORS.primary,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },

  tabContent: {
    gap: 20,
  },
  detailsHeader: {
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  premiumBadge: {
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  premiumText: {
    color: '#B8860B', // Darker goldish
    fontSize: 12,
    fontWeight: '600',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionOutlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.divider,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 6,
    backgroundColor: COLORS.white,
  },
  actionOutlineText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  descriptionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  gridContainer: {
    gap: 16,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  cardHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    padding: 16,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.primary,
  },
  cardContent: {
    padding: 16,
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  col: {
    flex: 1,
    gap: 12,
  },
  infoRow: {
    gap: 4,
  },
  infoLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  infoValue: {
    fontSize: 13,
    color: COLORS.textDark,
    fontWeight: '600',
  },
  placeholderContent: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
  },
  placeholderText: {
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  assistanceCard: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  assistanceTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 8,
  },
  assistanceText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  supportButton: {
    borderWidth: 1,
    borderColor: COLORS.textSecondary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  supportButtonText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  hvacContainer: {
    marginTop: 12,
  },
  tabIcon: {
    marginBottom: 4,
  },
  spacer: {
    height: 40,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 12,
  },
  noVerticalPadding: {
    marginTop: 0,
    paddingHorizontal: 0,
    marginBottom: 20,
  },
  proximityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  proximityIconLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  distanceBadge: {
    backgroundColor: '#FFF3CA',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  distanceText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  benchmarkNote: {
    marginTop: 12,
    backgroundColor: '#F9F9F9',
    padding: 12,
    borderRadius: 8,
  },
  faqList: {
    gap: 12,
  },
  faqItem: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 5,
    elevation: 1,
  },
  faqItemOpen: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
    shadowOpacity: 0.05,
    elevation: 3,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  faqQuestion: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textDark,
    flex: 1,
    marginRight: 12,
  },
  faqTextActive: {
    color: COLORS.primary,
  },
  faqAnswerContainer: {
    padding: 20,
    paddingTop: 0,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.white,
  },
});

export default PropertyDetailsScreen;
