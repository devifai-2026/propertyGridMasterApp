import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Alert,
  Image,
  useWindowDimensions,
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
  MessageSquare,
  Clock,
  User,
  Heart,
  ChartNoAxesColumnIncreasing,
} from 'lucide-react-native';
import Layout from '../../layout/Layout';
import { useNavigation } from '../../context/NavigationContext';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../constants/theme';
import PropertyCard, { Property } from '../../components/PropertyCard';
// Missing dashboard components will be defined locally below to prevent tab crash
import RentalCards from '../calculators/components/RentalYield/RentalCards';
import { usePropertyAPIs } from '../../../helpers/hooks/propertyAPIs/usePropertyApis';
import { formatINR } from '../../../helpers/formatPrice';
import { formatDate, formatDateTime, formatTenureYears } from '../../../helpers/formatDate';
import DownloadIcon from "../../assets/propertyDetails/download.svg"
import ShareIcon from "../../assets/propertyDetails/share.svg"
import bannerBg from "../../assets/Banner/bannerBg.png"
import propertDetails from "../../assets/propertyDetails/propertyDetails.png"
import leaseDetails from "../../assets/propertyDetails/leaseDetails.png"
import location from "../../assets/propertyDetails/locationDetails.png"
import squaresBg from "../../assets/propertyDetails/squaresbg.png"
 

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

const DiversificationCard = ({ data }: { data: any[] }) => (
  <PropertyDetailsCard title="Portfolio Diversification">
    {data.map((item, index) => (
      <View key={index} style={{ marginBottom: 12 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#444' }}>{item.type}</Text>
          <Text style={{ fontSize: 16, fontWeight: '700', color: item.color }}>{item.percentage}%</Text>
        </View>
        <View style={{ height: 8, backgroundColor: '#F0F0F0', borderRadius: 4, overflow: 'hidden' }}>
          <View style={{ width: `${item.percentage}%`, height: '100%', backgroundColor: item.color }} />
        </View>
      </View>
    ))}
  </PropertyDetailsCard>
);

const IncomeTrackerCard = ({ data }: { data: any }) => (
  <PropertyDetailsCard title="Annual Income Tracker">
    <View style={{ gap: 12 }}>
      {data.labels.map((label: string, index: number) => (
        <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: index === data.labels.length - 1 ? 0 : 1, borderBottomColor: '#F5F5F5' }}>
          <Text style={{ fontSize: 15, color: '#666' }}>{label}</Text>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: COLORS.textDark }}>{formatINR((data.received[index] ?? 0) * 100000)}</Text>
            <Text style={{ fontSize: 12, color: '#999' }}>Expected: {formatINR((data.expected[index] ?? 0) * 100000)}</Text>
          </View>
        </View>
      ))}
    </View>
  </PropertyDetailsCard>
);

const LeaseRenewalsCard = ({ renewals }: { renewals: any[] }) => (
  <PropertyDetailsCard title="Upcoming Lease Renewals">
    {renewals.map((item, index) => (
      <View key={item.id} style={{ marginBottom: index === renewals.length - 1 ? 0 : 16, paddingBottom: index === renewals.length - 1 ? 0 : 16, borderBottomWidth: index === renewals.length - 1 ? 0 : 1, borderBottomColor: '#F5F5F5' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: COLORS.textDark }}>{item.property}</Text>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#EE2529' }}>{item.expiryDate}</Text>
        </View>
        <Text style={{ fontSize: 14, color: '#666' }}>{item.tenant} • {item.location}</Text>
        <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.textSecondary, marginTop: 4 }}>Annual Rent: {item.annualRent}</Text>
      </View>
    ))}
  </PropertyDetailsCard>
);

const PropertyDetailsScreen = () => {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const { currentPath, navigate, goBack } = useNavigation();
  const { user } = useAuth();
  const propertyId = currentPath.split('/propertyDetails/')[1];
  const [property, setProperty] = useState<Property | null>(null);
  const [notesData, setNotesData] = useState<any[]>([]);
  const [notesCount, setNotesCount] = useState(0);
  const [isNotesLoading, setIsNotesLoading] = useState(false);
  const {
    getPropertyById,
    getPropertyNotesForOwner,
    addOwnerNote,
    toggleLikeProperty,
    checkIfLiked,
    loading,
  } = usePropertyAPIs();

  const [newNote, setNewNote] = useState('');
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const isOwner = user?.role === 'Owner';
  useEffect(() => {
    if (propertyId) {
      getPropertyById(propertyId, (data: any) => {
        const mappedProperty: Property = {
          id: data.propertyId,
          title: `${data.propertyType} Space`,
          location: `${data.city}, ${data.state}`,
          price: formatINR(data.sellingPrice),
          rent: formatINR(data.annualGrossRent),
          tenure: formatTenureYears(data.tenureLeftYears, data.leaseEndDate),
          roi: data.netRentalYield ? `${data.netRentalYield}%` : 'N/A',
          type: data.propertyType,
          images:
            data.media && data.media.length > 0
              ? data.media.map((m: any) => m.fileUrl)
              : null,
          badges: [data.tenantType].filter(Boolean),
          isVerified: data.isVerified,
          verified:
            data.isVerified === 'partial' || data.isVerified === 'completed',
          raw: data,
        };
        setProperty(mappedProperty);
      });
      if (user) {
        checkIfLiked(propertyId, (data: any) => {
          setIsLiked(!!data?.isLiked);
        });
      }
    }
  }, [propertyId, user]);

  const isAddedByUser =
    property?.raw?.ownerId === user?.userId ||
    property?.raw?.brokerId === user?.userId ||
    property?.raw?.salesId === user?.userId;

  // Pre-fetch notes count so the badge is visible before the tab is opened
  useEffect(() => {
    if (propertyId && isAddedByUser) {
      getPropertyNotesForOwner(
        propertyId,
        (data: any) => {
          if (data && Array.isArray(data)) {
            setNotesCount(data.length);
          }
        },
        () => {},
      );
    }
  }, [propertyId, isAddedByUser]);

  const [activeTab, setActiveTab] = useState('property');

  useEffect(() => {
    if (activeTab === 'notes' && propertyId) {
      setIsNotesLoading(true);
      getPropertyNotesForOwner(
        propertyId,
        (data: any) => {
          setIsNotesLoading(false);
          // Backend now returns the array of formatted notes directly
          if (data && Array.isArray(data)) {
            const allNotes = data.map((record: any) => {
              // Show admin-edited note if available, otherwise the original
              const noteText = record.adminNote || record.originalNote || '';
              const isOwnerNote = record.salesExecutiveId === user?.userId;
              return {
                note: noteText,
                createdAt: record.createdAt,
                isEdited: !!record.isEdited,
                addedBy: isOwnerNote
                  ? 'You'
                  : record.salesExecutive
                    ? `${record.salesExecutive.firstName} ${record.salesExecutive.lastName}`
                    : 'Property Team',
                isOwnerNote,
              };
            });
            allNotes.sort(
              (a: any, b: any) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
            );
            setNotesData(allNotes);
            setNotesCount(allNotes.length);
          } else {
            console.warn('Property notes response is not an array:', data);
            setNotesData([]);
          }
        },
        () => setIsNotesLoading(false),
      );
    }
  }, [activeTab, propertyId]);


  const tabs = [
    { id: 'property', label: 'Property Details', icon: propertDetails },
    { id: 'lease', label: 'Lease Details', icon: leaseDetails },
    { id: 'analytics', label: 'Analytics', icon: <ChartNoAxesColumnIncreasing />},
    { id: 'location', label: 'Location Details', icon: location },
    ...(isAddedByUser
      ? [{ id: 'notes', label: 'Notes', icon: <MessageSquare /> }]
      : []),
  ];

  // Only show full screen loading if we don't have property data yet
  if (loading && !property) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={{ marginTop: 12 }}>Loading property details...</Text>
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
    <View style={[styles.tabContent, isMobile && styles.tabContentMobile]}>
      {/* Description Section */}
      <View style={styles.detailsHeader}>
        <View style={[styles.badgeRow, isMobile && { flexDirection: 'column', alignItems: 'flex-start', gap: 12 }]}>
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumText}>Premium Location</Text>
          </View>
          <View style={[styles.actionButtonsRow, isMobile && { width: '100%', flexDirection: 'column', gap: 12 }]}>
            {user?.userId === property.raw.added_by && (
              <TouchableOpacity
                style={[
                  styles.actionOutlineBtn,
                  { borderColor: COLORS.primary },
                ]}
                onPress={() => navigate(`/list-property/${propertyId}`)}
              >
                <FileText size={18} color={COLORS.primary} />
                <Text
                  style={[styles.actionOutlineText, { color: COLORS.primary }]}
                >
                  Edit
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={[styles.actionOutlineBtn, isMobile && styles.actionOutlineBtnMobile]}>
              <Image source={DownloadIcon} style={{ width: 16, height: 16 }} />
              <Text style={styles.actionOutlineText} numberOfLines={1}>Download Report</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionOutlineBtn, isMobile && styles.actionOutlineBtnMobile]}>
              <Image source={ShareIcon} style={{ width: 16, height: 16 }} />
              <Text style={styles.actionOutlineText} numberOfLines={1}>Share Report</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={[styles.descriptionTitle, isMobile && styles.descriptionTitleMobile]}>{property.title}</Text>
        <Text style={[styles.descriptionText, isMobile && styles.descriptionTextMobile]}>
          {property.title} located at {property.location}. This {property.type}{' '}
          property offers a great investment opportunity with an ROI of{' '}
          {property.roi}. The tenure left is {property.tenure}.
        </Text>
      </View>

      {/* Details Grid */}
      <View style={styles.gridContainer}>
        <View style={[styles.row, isMobile && { flexDirection: 'column', gap: 12, justifyContent: 'flex-start' }]}>
          {/* Left Side */}
          <View style={styles.col}>
            {/* Basic Information */}
            <PropertyDetailsCard title="Basic Information">
              <View style={[styles.row, isMobile && { flexDirection: 'column', gap: 12 }]}>
                <View style={styles.col}>
                  <InfoRow
                    label="Property Type"
                    value={property.raw.propertyType}
                  />
                  <InfoRow
                    label="Price"
                    value={formatINR(property.raw.sellingPrice)}
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
                  <InfoRow
                    label="Built Year"
                    value={property.raw.completionYear}
                  />
                  <InfoRow
                    label="Ownership"
                    value={property.raw.ownershipType}
                  />
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
              <InfoRow
                label="Litigation Status"
                value={property.raw.titleStatus}
              />
            </PropertyDetailsCard>

            {/* Building Amenities */}
            <PropertyDetailsCard title="Building Amenities">
              <View style={[styles.row, isMobile && { flexDirection: 'column', gap: 12 }]}>
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
                  <InfoRow
                    label="Power Backup"
                    value={property.raw.powerBackup}
                  />
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
          </View>

          {/* Right Side */}
          <View style={styles.col}>
            {/* Parking Details */}
            <PropertyDetailsCard title="Parking Details">
              <InfoRow
                label="Two Wheeler"
                value={`${property.raw.parkingTwoWheeler} slots`}
              />
              <InfoRow
                label="Four Wheeler"
                value={`${property.raw.parkingFourWheeler} slots`}
              />
            </PropertyDetailsCard>

            {/* Building Infrastructure */}
            <PropertyDetailsCard title="Building Infrastructure">
              <View style={[styles.row, isMobile && { flexDirection: 'column', gap: 12 }]}>
                <View style={styles.col}>
                  <InfoRow
                    label="Power Backup"
                    value={property.raw.powerBackup}
                  />
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
      annualRent: formatINR(26500000),
    },
    {
      id: '2',
      property: 'Commercial Space',
      location: 'Mumbai',
      tenant: 'Global Innovations',
      expiryDate: '20/12/2025',
      annualRent: formatINR(25500000),
    },
  ];

  const renderLeaseContent = () => (
    <View style={[styles.tabContent, isMobile && styles.tabContentMobile]}>
      <View style={styles.detailsHeader}>
        <Text style={[styles.descriptionTitle, isMobile && styles.descriptionTitleMobile]}>Lease & Tenant Details</Text>
      </View>

      <View style={styles.gridContainer}>
        <View style={[styles.row, isMobile && { flexDirection: 'column' }]}>
          {/* Left Column */}
          <View style={styles.col}>
            <PropertyDetailsCard title="Tenant Information">
              <InfoRow
                label="Tenant Type"
                value={property.raw.tenantType || 'N/A'}
              />
            </PropertyDetailsCard>

            <PropertyDetailsCard title="Rental & Deposit Details">
              <View style={[styles.row, isMobile && { flexDirection: 'column', gap: 12 }]}>
                <View style={styles.col}>
                  <InfoRow
                    label="Total Monthly Rent"
                    value={formatINR(property.raw.totalMonthlyRent)}
                  />
                  <InfoRow
                    label="Rent per sq ft (Monthly)"
                    value={formatINR(property.raw.rentPerSqftMonthly)}
                  />
                </View>
                <View style={styles.col}>
                  <InfoRow
                    label="Security Deposit"
                    value={
                      property.raw.securityDepositMonths != null
                        ? `${property.raw.securityDepositMonths} months`
                        : 'N/A'
                    }
                  />
                  <InfoRow
                    label="Security Deposit Amount"
                    value={formatINR(property.raw.securityDepositAmount)}
                  />
                </View>
              </View>
            </PropertyDetailsCard>

            <PropertyDetailsCard title="Maintenance Scope">
              <InfoRow
                label="Primary Maintenance Responsibility"
                value={property.raw.maintenanceCostsIncluded || 'N/A'}
              />
            </PropertyDetailsCard>
          </View>

          {/* Right Column */}
          <View style={styles.col}>
            <PropertyDetailsCard title="Lease Duration & Terms">
              <View style={[styles.row, isMobile && { flexDirection: 'column', gap: 12 }]}>
                <View style={styles.col}>
                  <InfoRow
                    label="Lease Start Date"
                    value={formatDate(property.raw.leaseStartDate)}
                  />
                  <InfoRow
                    label="Lock-in Period"
                    value={
                      property.raw.lockInPeriodYears != null ||
                      property.raw.lockInPeriodMonths != null
                        ? `${property.raw.lockInPeriodYears ?? 0} Yrs ${
                            property.raw.lockInPeriodMonths ?? 0
                          } Months`
                        : 'N/A'
                    }
                  />
                </View>
                <View style={styles.col}>
                  <InfoRow
                    label="Lease Expiry Date"
                    value={formatDate(property.raw.leaseEndDate)}
                  />
                  <InfoRow
                    label="Lease Duration"
                    value={formatTenureYears(property.raw.leaseDurationYears)}
                  />
                </View>
              </View>
            </PropertyDetailsCard>

            <PropertyDetailsCard title="Escalation Terms">
              <View style={[styles.row, isMobile && { flexDirection: 'column', gap: 12 }]}>
                <View style={styles.col}>
                  <InfoRow
                    label="Escalation Rate"
                    value={
                      property.raw.annualEscalationPercent != null
                        ? `${property.raw.annualEscalationPercent}%`
                        : 'N/A'
                    }
                  />
                </View>
                <View style={styles.col}>
                  <InfoRow
                    label="Escalation Frequency"
                    value={
                      property.raw.escalationFrequencyYears != null
                        ? `Every ${property.raw.escalationFrequencyYears} Yrs`
                        : 'N/A'
                    }
                  />
                </View>
              </View>
            </PropertyDetailsCard>
          </View>
        </View>
      </View>
    </View>
  );

  const renderAnalyticsContent = () => {
    const raw = property.raw || {};
    const plg = raw.plgMetrics || {};
    const plgDetail = plg.plgDetail || {};
    const plgSummary = plgDetail.summary || {};
    const plgExpenses = plgDetail.expenses || {};
    const plgCashFlows = plgDetail.cashFlows || {};

    const toNum = (v: any): number | null => {
      if (v === null || v === undefined || v === '') return null;
      const n = typeof v === 'string' ? parseFloat(v) : v;
      return typeof n === 'number' && isFinite(n) ? n : null;
    };

    // --- Real financial values (no fabricated literals) ---
    const totalInitialInvestment = toNum(plgSummary.totalInitialInvestment);
    const grossAnnualRent =
      toNum(raw.annualGrossRent) ?? toNum(plg.annualGrossRent);

    // Total annual expenses: prefer backend-computed totalExpenses, else compute
    // from the real recurring-expense fields. maintenanceAmount is treated as an
    // annual figure here; if absent we fall back to maintenance per sqft * area * 12.
    const propertyTaxAnnual = toNum(raw.propertyTaxAnnual);
    const insuranceAnnual = toNum(raw.insuranceAnnual);
    const maintenanceAmount = toNum(raw.maintenanceAmount);
    const computedRecurringExpenses = (() => {
      const parts = [propertyTaxAnnual, insuranceAnnual, maintenanceAmount].filter(
        (v): v is number => v !== null,
      );
      if (parts.length === 0) return null;
      return parts.reduce((a, b) => a + b, 0);
    })();
    const totalAnnualExpenses =
      toNum(plgExpenses.totalExpenses) ?? computedRecurringExpenses;

    // Net annual income: prefer backend NOI, else gross rent - expenses.
    const netAnnualIncome =
      toNum(plgSummary.netOperatingIncome) ??
      (grossAnnualRent !== null
        ? grossAnnualRent - (totalAnnualExpenses ?? 0)
        : null);

    // Interest on security deposit: prefer backend cashFlows, else 6.5% of deposit.
    const securityDepositAmount = toNum(raw.securityDepositAmount);
    const annualInterestOnDeposit =
      toNum(plgCashFlows.annualInterestOnDeposit) ??
      (securityDepositAmount !== null ? securityDepositAmount * 0.065 : null);

    // Total annual return = net income + deposit interest (only when we have data).
    const totalAnnualReturn =
      netAnnualIncome !== null
        ? netAnnualIncome + (annualInterestOnDeposit ?? 0)
        : null;

    const grossRentalYield =
      toNum(raw.grossRentalYield) ?? toNum(plg.grossRentalYield);
    const netRentalYield =
      toNum(raw.netRentalYield) ?? toNum(plg.netRentalYield);

    return (
    <View style={[styles.tabContent, isMobile && styles.tabContentMobile]}>
      <View style={styles.detailsHeader}>
        <Text style={[styles.descriptionTitle, isMobile && styles.descriptionTitleMobile]}>Property Investment ROI Analytics</Text>
      </View>

      <View style={styles.gridContainer}>
        <View style={[styles.row, isMobile && { flexDirection: 'column' }]}>
          {/* Left Column */}
          <View style={styles.col}>
            <PropertyDetailsCard title="Property Details">
              <View style={[styles.row, isMobile && { flexDirection: 'column', gap: 12 }]}>
                <View style={styles.col}>
                  <InfoRow
                    label="Property Type"
                    value={property.raw.propertyType || 'N/A'}
                  />
                  <InfoRow
                    label="Carpet Area (sq.ft)"
                    value={property.raw.carpetArea || 'N/A'}
                  />
                </View>
                <View style={styles.col}>
                  <InfoRow
                    label="Property cost (₹)"
                    value={formatINR(property.raw.sellingPrice)}
                  />
                </View>
              </View>
            </PropertyDetailsCard>

            <PropertyDetailsCard title="Recurring Expenses (Annual)">
              <View style={[styles.row, isMobile && { flexDirection: 'column', gap: 12 }]}>
                <View style={styles.col}>
                  <InfoRow
                    label="Property Tax (₹)"
                    value={formatINR(property.raw.propertyTaxAnnual)}
                  />
                  <InfoRow
                    label="Maintenance per sq.ft(₹)"
                    value={formatINR(property.raw.maintenancePerSqft)}
                  />
                </View>
                <View style={styles.col}>
                  <InfoRow
                    label="Insurance (₹)"
                    value={formatINR(property.raw.insuranceAnnual)}
                  />
                  <InfoRow
                    label="Maintenance Lump sum(₹)"
                    value={formatINR(property.raw.maintenanceLumpSum)}
                  />
                </View>
              </View>
            </PropertyDetailsCard>
          </View>

          {/* Right Column */}
          <View style={styles.col}>
            <PropertyDetailsCard title="Rental Details">
              <View style={[styles.row, isMobile && { flexDirection: 'column', gap: 12 }]}>
                <View style={styles.col}>
                  <InfoRow
                    label="Monthly Rent (₹)"
                    value={formatINR(property.raw.totalMonthlyRent)}
                  />
                  <InfoRow
                    label="Rent Escalation every(yrs)"
                    value={`${property.raw.escalationFrequencyYears || 0}`}
                  />
                  <InfoRow
                    label="Lease Start Date"
                    value={formatDate(property.raw.leaseStartDate)}
                  />
                </View>
                <View style={styles.col}>
                  <InfoRow
                    label="Security Deposit (₹)"
                    value={formatINR(property.raw.securityDepositAmount)}
                  />
                  <InfoRow
                    label="Rent Escalation(% per year)"
                    value={`${property.raw.annualEscalationPercent || 0}%`}
                  />
                  <InfoRow
                    label="Lease term (Yrs)"
                    value={`${property.raw.leaseDurationYears || 0}`}
                  />
                </View>
              </View>
            </PropertyDetailsCard>

            <PropertyDetailsCard title="One-time Costs">
              <View style={[styles.row, isMobile && { flexDirection: 'column', gap: 12 }]}>
                <View style={styles.col}>
                  <InfoRow
                    label="Legal Fees (₹)"
                    value={formatINR(property.raw.legalFees)}
                  />
                  <InfoRow
                    label="Stamp Duty (% of Price)"
                    value={`${property.raw.stampDutyPercent || 0}%`}
                  />
                </View>
                <View style={styles.col}>
                  <InfoRow
                    label="Brokerage (₹)"
                    value={formatINR(property.raw.brokerage)}
                  />
                  <InfoRow
                    label="Other One-time Costs (₹)"
                    value={formatINR(property.raw.otherOneTimeCosts)}
                  />
                </View>
              </View>
            </PropertyDetailsCard>
          </View>
        </View>

        {/* ROI Metrics Section - Moved BELOW main cards */}
        <View style={{ marginTop: 24, marginBottom: 24 }}>
          <View style={[styles.row, isMobile && { flexDirection: 'column' }]}>
            {/* Gross Rental Yield - Red Theme */}
            <View style={[styles.col, { flex: isMobile ? undefined : 1, backgroundColor: '#FEF2F2', padding: 20, borderRadius: 16, borderWidth: 2, borderColor: '#FCA5A5', minHeight: isMobile ? undefined : 180 }]}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Text style={{ fontSize: 16, color: '#111827', fontWeight: '800' }}>Gross Rental Yield</Text>
                <Text style={{ fontSize: 20, fontWeight: '900', color: '#B91C1C' }}>
                  {property.raw.grossRentalYield ? `${property.raw.grossRentalYield}%` : 'N/A'}
                </Text>
              </View>
              <Text style={{ fontSize: 13, color: '#9CA3AF', fontWeight: '700', marginBottom: 12 }}>% Before expenses</Text>
              <Text style={{ fontSize: 13, color: '#6B7280', lineHeight: 18, marginBottom: 4 }}>Return before expenses.</Text>
              <Text style={{ fontSize: 13, color: '#6B7280', lineHeight: 18 }}>Higher % = stronger rental income.</Text>
            </View>

            {!isMobile && <View style={{ width: 14 }} />}

            {/* Net Rental Yield - Blue Theme */}
            <View style={[styles.col, { flex: isMobile ? undefined : 1, backgroundColor: '#E0F2FE', padding: 20, borderRadius: 16, borderWidth: 2, borderColor: '#7DD3FC', minHeight: isMobile ? undefined : 180 }]}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Text style={{ fontSize: 16, color: '#111827', fontWeight: '800' }}>Net Rental Yield</Text>
                <Text style={{ fontSize: 20, fontWeight: '900', color: '#0369A1' }}>
                  {property.raw.netRentalYield ? `${property.raw.netRentalYield}%` : 'N/A'}
                </Text>
              </View>
              <Text style={{ fontSize: 13, color: '#7DD3FC', fontWeight: '700', marginBottom: 12 }}>% After all expenses</Text>
              <Text style={{ fontSize: 13, color: '#0369A1', lineHeight: 18, marginBottom: 4 }}>Return after all expenses.</Text>
              <Text style={{ fontSize: 13, color: '#0369A1', lineHeight: 18 }}>Shows your real profit.</Text>
            </View>
          </View>

          <View style={{ height: 14 }} />

          <View style={[styles.row, isMobile && { flexDirection: 'column' }]}>
            {/* Annual Cash Flow - Green Theme */}
            <View style={[styles.col, { flex: isMobile ? undefined : 1, backgroundColor: '#F0FDFA', padding: 20, borderRadius: 16, borderWidth: 2, borderColor: '#5EEAD4', minHeight: isMobile ? undefined : 180 }]}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Text style={{ fontSize: 16, color: '#111827', fontWeight: '800' }}>Annual Cash Flow</Text>
                <Text style={{ fontSize: 20, fontWeight: '900', color: '#0D9488' }}>
                  {formatINR(property.raw.annualGrossRent)}
                </Text>
              </View>
              <Text style={{ fontSize: 13, color: '#5EEAD4', fontWeight: '700', marginBottom: 12 }}>$ Net annual income</Text>
              <Text style={{ fontSize: 13, color: '#0D9488', lineHeight: 18, marginBottom: 4 }}>Net yearly income.</Text>
              <Text style={{ fontSize: 13, color: '#0D9488', lineHeight: 18 }}>Money you can use or reinvest.</Text>
            </View>

            {!isMobile && <View style={{ width: 14 }} />}

            {/* Payback Period - Yellow Theme */}
            <View style={[styles.col, { flex: isMobile ? undefined : 1, backgroundColor: '#FFFBEB', padding: 20, borderRadius: 16, borderWidth: 2, borderColor: '#FDE68A', minHeight: isMobile ? undefined : 180 }]}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Text style={{ fontSize: 16, color: '#111827', fontWeight: '800' }}>Payback Period</Text>
                <Text style={{ fontSize: 20, fontWeight: '900', color: '#B45309' }}>
                  {property.raw.paybackPeriodYears ? `${property.raw.paybackPeriodYears} Yrs` : 'N/A'}
                </Text>
              </View>
              <Text style={{ fontSize: 13, color: '#FDE68A', fontWeight: '700', marginBottom: 12 }}>Time to break even</Text>
              <Text style={{ fontSize: 13, color: '#B45309', lineHeight: 18, marginBottom: 4 }}>Years to recover cost.</Text>
              <Text style={{ fontSize: 13, color: '#B45309', lineHeight: 18 }}>Shorter = quicker returns.</Text>
            </View>
          </View>
        </View>

        {/* Investment Summary & Additional Income - 2 Column Grid */}
        <View style={[styles.row, { marginTop: 12 }, isMobile && { flexDirection: 'column' }]}>
          {/* Investment Summary */}
          <View style={[styles.col, { flex: isMobile ? undefined : 1 }]}>
            <PropertyDetailsCard title="Investment Summary">
              <View style={{ gap: 20, marginTop: 10 }}>
                <View style={{ flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', gap: isMobile ? 4 : 0 }}>
                  <Text style={{ fontSize: 14, color: '#999' }}>Total Initial Investment</Text>
                  <Text style={{ fontSize: 15, color: '#444', fontWeight: '700' }}>
                    {totalInitialInvestment !== null
                      ? formatINR(totalInitialInvestment)
                      : formatINR(raw.sellingPrice)}
                  </Text>
                </View>
                <View style={{ flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', gap: isMobile ? 4 : 0 }}>
                  <Text style={{ fontSize: 14, color: '#999' }}>Gross Annual Rent</Text>
                  <Text style={{ fontSize: 15, color: '#444', fontWeight: '700' }}>
                    {grossAnnualRent !== null ? formatINR(grossAnnualRent) : 'N/A'}
                  </Text>
                </View>
                {totalAnnualExpenses !== null && totalAnnualExpenses > 0 && (
                  <View style={{ flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', gap: isMobile ? 4 : 0 }}>
                    <Text style={{ fontSize: 14, color: '#999' }}>Total Annual Expenses</Text>
                    <Text style={{ fontSize: 15, color: '#444', fontWeight: '700' }}>
                      {formatINR(totalAnnualExpenses)}
                    </Text>
                  </View>
                )}
                <View style={{ height: 1, backgroundColor: '#EEE', marginVertical: 4 }} />
                <View style={{ flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', gap: isMobile ? 4 : 0 }}>
                  <Text style={{ fontSize: 15, color: '#444', fontWeight: '700' }}>Net Annual Income</Text>
                  <Text style={{ fontSize: 18, color: '#10B981', fontWeight: '800' }}>
                    {netAnnualIncome !== null ? formatINR(netAnnualIncome) : 'N/A'}
                  </Text>
                </View>
              </View>
            </PropertyDetailsCard>
          </View>

          {!isMobile && <View style={{ width: 14 }} />}

          {/* Additional Income - only render when we have real deposit interest data */}
          {annualInterestOnDeposit !== null && annualInterestOnDeposit > 0 && (
            <View style={[styles.col, { flex: isMobile ? undefined : 1 }]}>
              <PropertyDetailsCard title="Additional Income">
                <View style={{ gap: 20, marginTop: 10 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 14, color: '#999' }}>Annual Interest on Security Deposit</Text>
                    <Text style={{ fontSize: 15, color: '#10B981', fontWeight: '700' }}>
                      {formatINR(annualInterestOnDeposit)}
                    </Text>
                  </View>
                  {totalAnnualReturn !== null && (
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
                      <Text style={{ fontSize: 15, color: '#444', fontWeight: '700' }}>Total Annual Return</Text>
                      <Text style={{ fontSize: 18, color: '#10B981', fontWeight: '800' }}>
                        {formatINR(totalAnnualReturn)}
                      </Text>
                    </View>
                  )}
                </View>
              </PropertyDetailsCard>
            </View>
          )}
        </View>

        {/* Performance Analytics - only the Rental Yield Comparison is backed by
            real data (grossRentalYield / netRentalYield). The fabricated expense
            pie chart, fabricated cash-flow line chart, and fabricated 10-year
            projection table were removed: the API returns no per-year cashflow
            array or expense-category breakdown to render them truthfully. */}
        {(grossRentalYield !== null || netRentalYield !== null) && (
          <View style={{ marginTop: 24 }}>
            <Text style={{ fontSize: 20, color: '#EE2529', fontWeight: '800', marginBottom: 20 }}>Performance Analytics</Text>

            <View style={[styles.row, isMobile && { flexDirection: 'column' }]}>
              {/* Rental Yield Comparison - bar heights derived from REAL yields */}
              <View style={[styles.col, { flex: 1, backgroundColor: 'white', padding: 20, borderRadius: 16, elevation: 4 }]}>
                <Text style={{ fontSize: 18, color: '#444', fontWeight: '700', textAlign: 'center', marginBottom: 20 }}>Rental Yield Comparison</Text>
                {(() => {
                  const maxYield = Math.max(grossRentalYield ?? 0, netRentalYield ?? 0, 0.0001);
                  const maxBarHeight = 160;
                  const grossH = grossRentalYield !== null ? Math.max(4, (grossRentalYield / maxYield) * maxBarHeight) : 0;
                  const netH = netRentalYield !== null ? Math.max(4, (netRentalYield / maxYield) * maxBarHeight) : 0;
                  return (
                    <View style={{ height: 200, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', paddingBottom: 20, borderBottomWidth: 1, borderLeftWidth: 1, borderColor: '#CCC' }}>
                      <View style={{ alignItems: 'center' }}>
                        <Text style={{ fontSize: 13, color: '#B91C1C', fontWeight: '800', marginBottom: 6 }}>
                          {grossRentalYield !== null ? `${grossRentalYield}%` : 'N/A'}
                        </Text>
                        <View style={{ width: 60, height: grossH, backgroundColor: '#B91C1C', borderRadius: 4 }} />
                      </View>
                      <View style={{ alignItems: 'center' }}>
                        <Text style={{ fontSize: 13, color: '#06B6D4', fontWeight: '800', marginBottom: 6 }}>
                          {netRentalYield !== null ? `${netRentalYield}%` : 'N/A'}
                        </Text>
                        <View style={{ width: 60, height: netH, backgroundColor: '#06B6D4', borderRadius: 4 }} />
                      </View>
                    </View>
                  );
                })()}
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 }}>
                  <Text style={{ fontSize: 15, color: '#B91C1C', fontWeight: '800' }}>Gross Yield</Text>
                  <Text style={{ fontSize: 15, color: '#06B6D4', fontWeight: '800' }}>Net Yield</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Cash Flow (Remaining Lease) - aggregate figures from real plgDetail.cashFlows.
            The backend returns aggregate cash-flow totals for the remaining lease,
            NOT a year-by-year projection, so only the real totals are shown. */}
        {toNum(plgCashFlows.totalCashFlows) !== null && (
          <View style={{ marginTop: 24, backgroundColor: 'white', padding: 25, borderRadius: 16, elevation: 4 }}>
            <Text style={{ fontSize: 16, color: '#444', fontWeight: '700', textAlign: 'center', marginBottom: 20 }}>Cash Flow (Remaining Lease)</Text>
            <View style={{ gap: 16 }}>
              {toNum(plgCashFlows.balanceRentalCashFlowCurrentYear) !== null && (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 14, color: '#999' }}>Balance Rental Cash Flow (Current Year)</Text>
                  <Text style={{ fontSize: 15, color: '#444', fontWeight: '700' }}>{formatINR(plgCashFlows.balanceRentalCashFlowCurrentYear)}</Text>
                </View>
              )}
              {toNum(plgCashFlows.annualCashFlowFromRentNextYears) !== null && (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 14, color: '#999' }}>Annual Cash Flow From Rent (Next Years)</Text>
                  <Text style={{ fontSize: 15, color: '#444', fontWeight: '700' }}>{formatINR(plgCashFlows.annualCashFlowFromRentNextYears)}</Text>
                </View>
              )}
              <View style={{ height: 1, backgroundColor: '#EEE', marginVertical: 4 }} />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 15, color: '#444', fontWeight: '700' }}>Total Cash Flows</Text>
                <Text style={{ fontSize: 18, color: '#10B981', fontWeight: '800' }}>{formatINR(plgCashFlows.totalCashFlows)}</Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
    );
  };

  const renderLocationContent = () => (
    <View style={[styles.tabContent, isMobile && styles.tabContentMobile]}>
      <View style={styles.detailsHeader}>
        <Text style={[styles.descriptionTitle, isMobile && styles.descriptionTitleMobile]}>Location & Market Overview</Text>
      </View>

      <View style={styles.gridContainer}>
        <View style={[styles.row, isMobile && { flexDirection: 'column' }]}>
          {/* Left Column */}
          <View style={styles.col}>
            <PropertyDetailsCard title="Location Details">
              <View style={[styles.row, isMobile && { flexDirection: 'column', gap: 12 }]}>
                <View style={styles.col}>
                  <InfoRow label="Micro-Market" value={property.raw.microMarket || 'N/A'} />
                  <InfoRow label="State" value={property.raw.state || 'N/A'} />
                </View>
                <View style={styles.col}>
                  <InfoRow label="City" value={property.raw.city || 'N/A'} />
                </View>
              </View>
            </PropertyDetailsCard>

          </View>

          {/* Right Column - Connectivity bound to REAL property.connectivity data.
              Fabricated "Demand Drivers", "Market Benchmark Data" and
              "Future Infrastructure" sections were removed (no backend source). */}
          <View style={styles.col}>
            {Array.isArray(property.raw.connectivity) &&
              property.raw.connectivity.filter((c: any) => c && c.name).length > 0 && (
                <PropertyDetailsCard title="Connectivity">
                  {property.raw.connectivity
                    .filter((c: any) => c && c.name)
                    .map((c: any, idx: number) => {
                      const type = (c.connectivityType || '').toLowerCase();
                      const ConnIcon = type.includes('airport')
                        ? Plane
                        : type.includes('metro') || type.includes('train') || type.includes('station') || type.includes('rail')
                          ? Train
                          : MapPin;
                      const distance = c.distanceKm !== null && c.distanceKm !== undefined && c.distanceKm !== ''
                        ? `${c.distanceKm} km`
                        : 'N/A';
                      return (
                        <View
                          key={c.connectivityId ?? idx}
                          style={[styles.proximityItem, idx > 0 && { marginTop: 12 }]}
                        >
                          <View style={[styles.proximityIconLabel, { gap: 10 }]}>
                            <ConnIcon size={18} color="#F7C952" />
                            <Text style={{ fontSize: 13, color: '#444', fontWeight: '500' }}>
                              {c.name}
                              {c.connectivityType ? ` (${c.connectivityType})` : ''}
                            </Text>
                          </View>
                          <View style={[styles.distanceBadge, { backgroundColor: '#FEF9C3' }]}>
                            <Text style={{ fontSize: 11, color: '#854D0E', fontWeight: '600' }}>{distance}</Text>
                          </View>
                        </View>
                      );
                    })}
                </PropertyDetailsCard>
              )}
          </View>
        </View>
      </View>
    </View>
  );

  const handleAddNote = () => {
    if (!newNote.trim() || !propertyId) return;
    setIsSubmittingNote(true);
    addOwnerNote(
      propertyId,
      newNote.trim(),
      () => {
        setNewNote('');
        setIsSubmittingNote(false);
        // Optimistically update notesData
        const newNoteEntry = {
          note: newNote.trim(),
          createdAt: new Date().toISOString(),
          addedBy:
            `${user?.firstName || 'You'} ${user?.lastName || ''}`.trim() ||
            'You',
        };
        const updated = [newNoteEntry, ...notesData];
        setNotesData(updated);
        setNotesCount(updated.length);
      },
      (err: any) => {
        setIsSubmittingNote(false);
        Alert.alert('Error', err.message || 'Failed to add note');
      },
    );
  };

  const renderNotesContent = () => {
    if (!property) return null;
    return (
      <View style={[styles.tabContent, isMobile && styles.tabContentMobile]}>
        <View style={[styles.detailsHeader, { flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', gap: 16 }]}>
          <View style={{ flex: isMobile ? 0 : 1 }}>
              <Text style={styles.descriptionTitle}>Manager Notes</Text>
              <Text style={styles.descriptionText}>
                Updates and observations from our property management team
              </Text>
            </View>
            {user?.userId === property.raw.added_by && (
              <TouchableOpacity
                style={[
                  styles.actionOutlineBtn,
                  isMobile && styles.actionOutlineBtnMobile,
                  { borderColor: COLORS.primary },
                ]}
                onPress={() => navigate(`/list-property/${propertyId}`)}
              >
                <FileText size={14} color={COLORS.primary} />
                <Text
                  style={[styles.actionOutlineText, { color: COLORS.primary }]}
                >
                  Edit Property
                </Text>
              </TouchableOpacity>
            )}
        </View>

        {property.isVerified !== 'completed' && (
          <View style={styles.addNoteContainer}>
            <textarea
              value={newNote}
              onChange={(e: any) => setNewNote(e.target.value)}
              placeholder="Type your note here..."
              // Using basic web styles directly on the native-web textarea works since this is react-native-web primarily
              style={
                {
                  width: '100%',
                  backgroundColor: '#F9FAFB',
                  borderWidth: 1,
                  borderColor: '#E5E7EB',

                  resize: 'none',
                  minHeight: 120,
                } as any
              }
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginTop: 12,
              }}
            >
              <TouchableOpacity
                onPress={handleAddNote}
                disabled={!newNote.trim() || isSubmittingNote}
                style={[
                  styles.addNoteButton,
                  (!newNote.trim() || isSubmittingNote) &&
                    styles.addNoteButtonDisabled,
                ]}
              >
                {isSubmittingNote ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <>
                    <MessageSquare size={16} color="#FFF" />
                    <Text style={styles.addNoteButtonText}>Add Note</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}

        {isNotesLoading ? (
          <View style={styles.emptyNotesContainer}>
            <ActivityIndicator size="small" color={COLORS.primary} />
            <Text style={styles.emptyNotesText}>Loading notes...</Text>
          </View>
        ) : notesData.length === 0 ? (
          <View style={styles.emptyNotesContainer}>
            <MessageSquare size={40} color="#CCC" />
            <Text style={styles.emptyNotesText}>
              No notes added yet for this property.
            </Text>
          </View>
        ) : (
          <View style={styles.notesList}>
            {notesData.map((note, index) => (
              <View key={index} style={styles.noteCard}>
                <View style={styles.noteCardHeader}>
                  <View style={styles.noteAuthorInfo}>
                    <View style={styles.avatarMini}>
                      <User size={12} color={COLORS.primary} />
                    </View>
                    <Text style={styles.noteAuthor}>{note.addedBy}</Text>
                    {note.isOwnerNote && (
                      <View style={styles.youBadge}>
                        <Text style={styles.youBadgeText}>Owner</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.noteTimeContainer}>
                    <Clock size={12} color={COLORS.textSecondary} />
                    <Text style={styles.noteTime}>
                      {formatDateTime(note.createdAt)}
                    </Text>
                  </View>
                </View>

                <Text style={styles.noteText}>{note.note}</Text>

                {note.isEdited && (
                  <View style={styles.editedBadge}>
                    <Text style={styles.editedText}>Edited by Admin</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <Layout>
      <View style={{ flex: 1, backgroundColor: '#fff', position: 'relative' }}>
        <Image
          source={squaresBg}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: isMobile ? 300 : 480, // Approximate 40vh on standard screens, or use useWindowDimensions
            opacity: 0.8,
            zIndex: 0,
          }}
          resizeMode="cover"
        />
        <ScrollView
          style={[styles.container, { zIndex: 1, width: isMobile ? '100%' : '81%', paddingHorizontal: isMobile ? 16 : 0 }]}
          showsVerticalScrollIndicator={false}
        >
       

        <View
          style={{ flexDirection: !isMobile && width > 900 ? 'row' : 'column', gap: 24 }}
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
              contentContainerStyle={[styles.tabsContent, isMobile && { justifyContent: 'flex-start', gap: 20 }]}
            >
              {tabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                const isNotes = tab.id === 'notes';
                return (
                  <TouchableOpacity
                    key={tab.id}
                    style={[styles.tab, isActive && styles.activeTab]}
                    onPress={() => setActiveTab(tab.id)}
                  >
                    <View style={{ position: 'relative' }}>
                      {React.isValidElement(Icon) ? (
                        React.cloneElement(Icon as React.ReactElement<any>, {
                          size: 26,
                          color: isActive ? COLORS.primary : COLORS.textSecondary,
                          style: styles.tabIcon,
                        })
                      ) : typeof Icon === 'function' ? (
                        <Icon
                          size={26}
                          color={isActive ? COLORS.primary : COLORS.textSecondary}
                          style={styles.tabIcon}
                        />
                      ) : (
                        <Image
                          source={Icon}
                          style={[
                            styles.tabIcon,
                            {
                              width: 26,
                              height: 26,
                              tintColor: isActive
                                ? COLORS.primary
                                : COLORS.textSecondary,
                            },
                          ]}
                          resizeMode="contain"
                        />
                      )}
                      {isNotes && notesCount > 0 && (
                        <View style={styles.notesBadge}>
                          <Text style={styles.notesBadgeText}>
                            {notesCount > 99 ? '99+' : notesCount}
                          </Text>
                        </View>
                      )}
                    </View>
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
            {activeTab === 'notes' && renderNotesContent()}
          </View>
        </View>

        <View style={styles.spacer} />
      </ScrollView>
    </View>
  </Layout>
);
};

const styles = StyleSheet.create({
  container: {
 
    width: '81%',
    alignSelf: 'center',
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
    width: '100%',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    height: 90,
    flexGrow: 0,
    flexShrink: 0,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 10,
  },
  tabsContent: {
    width: '100%',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
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
  activeTab: {
    
  },
  tabText: {
    fontSize: 14,
    color: '#767676',
    fontWeight: 400,
    marginTop: 4,
  },
  activeTabText: {
    color:'#EE2529',
    fontWeight:700,
    fontSize:14,
  },
  activeTabIndicator: {
    position: 'absolute',
    
    bottom: -14,
    height: 3,
    width: '100%', // Relative width for better scaling
    backgroundColor: '#EE2529',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },

  tabContent: {
    gap: 20,
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    marginTop: 16,
    width: '90%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 8,
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
    backgroundColor: '#FFF3CA',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 15,
  },
  premiumText: {
    color: '#767676', 
    fontSize: 12,
    fontWeight: '500',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionOutlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2.5,
    borderColor: '#EEEEEE',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    backgroundColor: COLORS.white,
    minWidth: 160,
    justifyContent: 'center',
    flexShrink: 0,
  },
  actionOutlineBtnMobile: {
    width: '100%',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  actionOutlineText: {
    fontSize: 14,
    color: '#767676',
    fontWeight: 600,
    fontFamily:'Montserrat',
  },
  descriptionTitle: {
    fontSize: 28,
    fontWeight: '600',
    color: '#EE2529',
    marginBottom: 8,
  },
  descriptionTitleMobile: {
    fontSize: 20,
  },
  descriptionText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  descriptionTextMobile: {
    fontSize: 14,
    lineHeight: 20,
  },
  gridContainer: {
    gap: width < 768 ? 12 : 16,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
    shadowOffset: width < 768 ? { width: 0, height: 2 } : { width: 10, height: 10 },
    overflow: 'hidden',
  },
  cardHeader: {
    padding: 16,
    paddingBottom: 8,
  },
  cardTitle: {
    fontSize: width < 768 ? 16 : 20,
    fontWeight: '700',
    color: '#EE2529',
    fontFamily: 'Montserrat',
  },
  cardContent: {
    padding: 16,
    paddingTop: 8,
    gap: width < 768 ? 10 : 14,
  },
  tabContentMobile: {
    width: '100%',
    padding: 16,
    borderRadius: 0,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: width < 768 ? 12 : 24,
  },
  col: {
    flex: width < 768 ? undefined : 1,
    width: width < 768 ? '100%' : undefined,
    gap: width < 768 ? 12 : 16,
  },
  infoRow: {
    gap: 10,
  },
  infoLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontFamily: 'Montserrat',
  },
  infoValue: {
    fontSize: 15,
    color: COLORS.textDark,
    fontWeight: '600',
    fontFamily: 'Montserrat',
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
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    shadowOffset: { width: 0, height: 3 },
  },
  assistanceTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#EE2529',
    marginBottom: 12,
  },
  assistanceText: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 22,
    marginBottom: 24,
  },
  supportButton: {
    borderWidth: 1.5,
    borderColor: '#767676',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: 'center',
  },
  supportButtonText: {
    color: '#767676',
    fontSize: 13,
    fontWeight: '700',
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
    backgroundColor: '#F2F2F2',
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
    backgroundColor: '#F2F2F2',
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
    fontSize: 18,
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
    backgroundColor: '#F2F2F2',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.white,
  },
  // Notes Styles
  notesList: {
    gap: 12,
  },
  noteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  noteUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  noteUserIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(238, 37, 41, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noteUser: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  noteTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  noteTime: {
    fontSize: 11,
    color: '#999',
    fontWeight: '600',
  },
  noteText: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
    fontWeight: '500',
  },
  emptyNotesContainer: {
    padding: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: '#EEEEEE',
  },
  emptyNotesText: {
    marginTop: 12,
    fontSize: 14,
    color: '#999',
    fontWeight: '600',
    textAlign: 'center',
  },
  addNoteContainer: {
    marginBottom: 20,
  },
  addNoteButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addNoteButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  addNoteButtonText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 14,
  },
  noteCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  noteAuthorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatarMini: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(238, 37, 41, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noteAuthor: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  youBadge: {
    backgroundColor: '#000',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  youBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
  noteTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  editedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    gap: 4,
  },
  editedText: {
    fontSize: 10,
    color: '#6366f1',
    fontWeight: '600',
  },
  notesBadge: {
    position: 'absolute',
    top: -5,
    right: -7,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  notesBadgeText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '700',
    lineHeight: 12,
  },
});

export default PropertyDetailsScreen;
