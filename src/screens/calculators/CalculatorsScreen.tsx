import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Switch,
  useWindowDimensions,
  Platform,
} from 'react-native';
import Layout from '../../layout/Layout';
import { TrendingUp, Calculator, ChevronDown } from 'lucide-react-native';
import bg from "../../assets/Calculator/bg.png"
import Svg, { Path, Rect } from 'react-native-svg';
import { Dimensions } from 'react-native';

const { width: windowWidth } = Dimensions.get('window');
const isDesktop = windowWidth >= 1024;


// RentalYield Components
import RentalCards from './components/RentalYield/RentalCards';
import SummaryCards from './components/RentalYield/SummaryCards';
import FinancialDetails from './components/RentalYield/FinancialDetails';
import PerformanceAnalytics from './components/RentalYield/PerformanceAnalytics';
import CashflowProjections from './components/RentalYield/CashflowProjections';
import RentalDetailsCashflow from './components/RentalYield/RentalDetailsCashflow';

// EMI Components
import EMISummaryCards from './components/EMI/EMISummaryCards';
import EMIAnalytics from './components/EMI/EMIAnalytics';
import PrincipleChart from './components/EMI/PrincipleChart';
import CoverageAnalysis from './components/EMI/CoverageAnalysis';
import LinearGradient from 'react-native-linear-gradient';
import { usePropertyAPIs } from '../../../helpers/hooks/propertyAPIs/usePropertyApis';

  const EMICalculatorIcon = ({ size = 20, color = '#767676' }) => (
  <Svg width={size} height={size * (30/37)} viewBox="0 0 37 30" fill="none">
    <Path
      d="M30.9231 1.5H6.07692C3.54916 1.5 1.5 3.54916 1.5 6.07692V23.0769C1.5 25.6047 3.54916 27.6538 6.07692 27.6538H30.9231C33.4508 27.6538 35.5 25.6047 35.5 23.0769V6.07692C35.5 3.54916 33.4508 1.5 30.9231 1.5Z"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M1.5 9.34766H35.5"
      stroke={color}
      strokeWidth="3"
      strokeLinejoin="round"
    />
    <Path
      d="M11.9621 18.1758H8.03906V19.8104H11.9621V18.1758Z"
      stroke={color}
      strokeWidth="3"
      strokeLinejoin="round"
    />
  </Svg>
);

const RedCardIcon = ({ size = 30, color = '#fff' }) => {
  // Maintain aspect ratio (92x92 original)
  const width = size;
  const height = size;
  
  return (
    <Svg width={width} height={height} viewBox="0 0 92 92" fill="none">
      <Rect width="92" height="92" rx="15" fill="#EE2529" />
      <Path
        d="M63.0625 21.25C65.5039 21.25 67.75 23.4961 67.75 25.9375V66.5625C67.75 69.1016 65.5039 71.25 63.0625 71.25H28.6875C26.1484 71.25 24 69.1016 24 66.5625V25.9375C24 23.4961 26.1484 21.25 28.6875 21.25H63.0625ZM36.5 63.8281V60.0195C36.5 59.4336 35.8164 58.75 35.2305 58.75H31.4219C30.8359 58.75 30.25 59.4336 30.25 60.0195V63.8281C30.25 64.4141 30.8359 65 31.4219 65H35.2305C35.8164 65 36.5 64.4141 36.5 63.8281ZM36.5 51.3281V47.5195C36.5 46.9336 35.8164 46.25 35.2305 46.25H31.4219C30.8359 46.25 30.25 46.9336 30.25 47.5195V51.3281C30.25 51.9141 30.8359 52.5 31.4219 52.5H35.2305C35.8164 52.5 36.5 51.9141 36.5 51.3281ZM49 63.8281V60.0195C49 59.4336 48.3164 58.75 47.7305 58.75H43.9219C43.3359 58.75 42.75 59.4336 42.75 60.0195V63.8281C42.75 64.4141 43.3359 65 43.9219 65H47.7305C48.3164 65 49 64.4141 49 63.8281ZM49 51.3281V47.5195C49 46.9336 48.3164 46.25 47.7305 46.25H43.9219C43.3359 46.25 42.75 46.9336 42.75 47.5195V51.3281C42.75 51.9141 43.3359 52.5 43.9219 52.5H47.7305C48.3164 52.5 49 51.9141 49 51.3281ZM61.5 63.8281V47.5195C61.5 46.9336 60.8164 46.25 60.2305 46.25H56.4219C55.8359 46.25 55.25 46.9336 55.25 47.5195V63.8281C55.25 64.4141 55.8359 65 56.4219 65H60.2305C60.8164 65 61.5 64.4141 61.5 63.8281ZM61.5 38.8281V28.7695C61.5 28.1836 60.8164 27.5 60.2305 27.5H31.4219C30.8359 27.5 30.25 28.1836 30.25 28.7695V38.8281C30.25 39.4141 30.8359 40 31.4219 40H60.2305C60.8164 40 61.5 39.4141 61.5 38.8281Z"
        fill={color}
      />
    </Svg>
  );
};

const InfoIcon = ({ size = 15, color = '#909092' }) => (
  <Svg width={size} height={size} viewBox="0 0 15 15" fill="none">
    <Path
      d="M7.5 14.5C11.366 14.5 14.5 11.366 14.5 7.5C14.5 3.63401 11.366 0.5 7.5 0.5C3.63401 0.5 0.5 3.63401 0.5 7.5C0.5 11.366 3.63401 14.5 7.5 14.5Z"
      stroke={color}
    />
    <Path
      d="M5.5 5.375C5.5 4.33947 6.39547 3.5 7.5 3.5C8.60453 3.5 9.5 4.33947 9.5 5.375C9.5 6.06245 9.10533 6.6635 8.51696 6.9899C8.00987 7.2711 7.5 7.6977 7.5 8.25V9.5"
      stroke={color}
      strokeLinecap="round"
    />
    <Path
      d="M7.5 11.5C7.77614 11.5 8.00116 11.2761 8.00116 11C8.00116 10.7239 7.77536 10.5 7.49922 10.5C7.22308 10.5 7 10.7239 7 11C7 11.2761 7.22386 11.5 7.5 11.5Z"
      fill={color}
    />
  </Svg>
);


const LabelWithIcon = ({ label, style }: { label: string; style?: any }) => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  return (
    <View style={[styles.labelRow, !isDesktop && { width: '100%', alignItems: 'center' }, style]}>
      <Text style={[styles.label, { flexShrink: 1, flexWrap: 'wrap' }]}>{label}</Text>
      <InfoIcon />
    </View>
  );
};

const CalculatorsScreen = () => {
  const [activeTab, setActiveTab] = useState<'roi' | 'emi'>('roi');
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;


  return (
    <Layout>
      <View style={styles.container}>
        {/* Header/Hero Section */}
        <View style={styles.heroSection}>
          <Image
            source={bg}
            style={styles.heroBg}
            resizeMode="cover"
          />
          <View
            style={[
              styles.heroContent,
              !isDesktop && { flexDirection: 'column-reverse' },
            ]}
          >
            <View
              style={[
                styles.heroTextContainer,
                !isDesktop && { marginRight: 0, marginTop: 10 },
              ]}
            >
              <View style={isDesktop ? { flexDirection: 'row', gap: 20, alignItems: 'center', marginBottom: 20 } : { alignItems: 'center' }}>
               <View style={[styles.redIconBox, !isDesktop && { width: 60, height: 60, marginBottom: 20 }]}>
                 <RedCardIcon size={isDesktop ? 62 : 40} color="#fff" />
               </View>
                <View style={!isDesktop && { alignItems: 'center' }}>
                  <View style={[styles.badgeContainer, !isDesktop && { alignSelf: 'center' }]}>
                    <Text style={[styles.badgeText, !isDesktop && { textAlign: 'center' }]}>
                      Professional Investment Tools
                    </Text>
                  </View>
                  <Text style={[styles.heroTitle, isDesktop ? { fontSize: 36, marginBottom: 0 } : { textAlign: 'center' }]}>
                    Property Investment Platform
                  </Text>
                </View>
              </View>

              <Text style={[styles.heroSubtitle, !isDesktop && { fontSize: 16, lineHeight: 20, textAlign: 'center' }]}>
                Make data-driven decisions with comprehensive ROI analysis, loan
                coverage <br /> insights, and detailed cash flow projections for your
                real estate investments
              </Text>

              <View style={[styles.heroStatsRow, !isDesktop && { justifyContent: 'flex-start', gap: 12 }]}>
                <View style={[styles.heroStatCard, !isDesktop && { minWidth: '47%', flex: 1, maxWidth: '48%' }]}>
                  <LinearGradient
                    colors={['rgba(242, 242, 242, 0.1)', 'rgba(255, 255, 255, 0.1)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    locations={[0.0761, 0.7484]}
                    style={styles.heroStatCardGradient}
                  >
                    <Text style={styles.heroStatLabel}>Yield Analysis</Text>
                    <Text style={styles.heroStatValue}>Gross & Net{'\n'}Returns</Text>
                  </LinearGradient>
                </View>

                <View style={[styles.heroStatCard, !isDesktop && { minWidth: '47%', flex: 1, maxWidth: '48%' }]}>
                  <LinearGradient
                    colors={['rgba(242, 242, 242, 0.1)', 'rgba(255, 255, 255, 0.1)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    locations={[0.0761, 0.7484]}
                    style={styles.heroStatCardGradient}
                  >
                    <Text style={styles.heroStatLabel}>Loan Planning</Text>
                    <Text style={styles.heroStatValue}>EMI & Coverage{'\n'}Ratio</Text>
                  </LinearGradient>
                </View>

                <View style={[styles.heroStatCard, !isDesktop && { minWidth: '47%', flex: 1, maxWidth: '48%' }]}>
                  <LinearGradient
                    colors={['rgba(242, 242, 242, 0.1)', 'rgba(255, 255, 255, 0.1)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    locations={[0.0761, 0.7484]}
                    style={styles.heroStatCardGradient}
                  >
                    <Text style={styles.heroStatLabel}>Cash Flow</Text>
                    <Text style={styles.heroStatValue}>10-Year{'\n'}Projections</Text>
                  </LinearGradient>
                </View>
              </View>
            </View>

            {isDesktop && (
              <Image
                source={require('../../assets/Calculator/bannerImg.png')}
                style={[
                  styles.heroImage,
                  {
                    width: '39%',
                    height: 598,
                    position: 'absolute',
                    right: -20,
                    top: -119,
                  },
                ]}
                resizeMode="cover"
              />
            )}
          </View>
        </View>

        <View
          style={[
            styles.tabsContainer,
            !isDesktop && { width: '100%' },
            isDesktop && { width: '90%', maxWidth: 1600, alignSelf: 'center' },
          ]}
        >
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setActiveTab('roi')}
          >
            <View style={[styles.tabIconBox, activeTab === 'roi' && styles.activeTabIconBox]}>
              <TrendingUp
                size={20}
                color={activeTab === 'roi' ? '#fff' : '#767676'}
              />
            </View>
            <Text
              style={[
                styles.tabText,
                activeTab === 'roi' && styles.activeTabText,
                !isDesktop && { fontSize: 13, lineHeight: 18 }
              ]}
            >
              ROI & Rental Yield Calculator
            </Text>
            {activeTab === 'roi' && <View style={[styles.activeIndicator, !isDesktop && { width: '100%' }]} />}
          </TouchableOpacity>

         <TouchableOpacity
  style={styles.tabItem}
  onPress={() => setActiveTab('emi')}
>
  <View style={[styles.tabIconBox, activeTab === 'emi' && styles.activeTabIconBox]}>
    <EMICalculatorIcon
      size={20}
      color={activeTab === 'emi' ? '#fff' : '#767676'}
    />
  </View>
  <Text style={[styles.tabText, activeTab === 'emi' && styles.activeTabText, !isDesktop && { fontSize: 13, lineHeight: 18 }]}>
    EMI Calculator
  </Text>
  {activeTab === 'emi' && <View style={[styles.activeIndicator, !isDesktop && { width: '100%' }]} />}
</TouchableOpacity>
        </View>

        <View
          style={[
            styles.contentArea,
            !isDesktop && { paddingHorizontal: 0 },
            isDesktop && { maxWidth: '100%', alignSelf: 'center', width: '100%' },
          ]}
        >
          {activeTab === 'roi' ? (
            <RentalYieldCalculator activeTab={activeTab} />
          ) : (
            <EMICalculatorView />
          )}
        </View>
      </View>
    </Layout>
  );
};

// Helper Components
const InfoCardsSummary = ({ type }: { type: 'roi' | 'emi' }) => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const cards =
    type === 'roi'
      ? [
        'Get clarity on your\nmonthly or annual yield.',
        'Compare ROI across different\nproperties or investments.',
        'Adjust variables like rent,\npurchase price, and taxes to see\nimpact in real time',
      ]
      : [
        'Understand your\nmonthly EMI with ease',
        'Compare EMIs across different\nloan structures or interest rates',
        'Adjust variables like loan\namount, tenure, and more to see\nimpacts in real time',
      ];

  return (
    <View style={[styles.infoCardsGrid, !isDesktop && { maxWidth: '100%' }]}>
      {cards.map((text, i) => (
        <View key={i} style={[styles.infoSummaryCard, !isDesktop && { flex: undefined, width: '100%', minWidth: '100%' }]}>
          <Text style={styles.infoSummaryText}>{text}</Text>
        </View>
      ))}
    </View>
  );
};

const CalculatorHeader = ({ type }: { type: 'roi' | 'emi' }) => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const headerData =
    type === 'roi'
      ? {
         icon: (
          <View style={styles.redIconBox}>
            <RedCardIcon size={62} color="#fff" />
          </View>
        ),
        title: 'Property Investment ROI Calculator',
        subtitle:
          'Get clarity on your monthly or annual yield using rent,\n purchase price, and taxes.',
      }
      : {
         icon: (
          <View style={styles.redIconBox}>
            <RedCardIcon size={62} color="#fff" />
          </View>
        ),
        title: 'Property EMI Calculator',
        subtitle:
          'Estimate your monthly loan repayment instantly based on loan amount,\n tenure, interest rate, and other key factors.',
      };

  return (
    <View style={styles.calcHeader}>
      <View style={styles.calcHeaderIconBox}>{headerData.icon}</View>
      <Text style={[styles.calcTitle, !isDesktop && { fontSize: 24 }]}>{headerData.title}</Text>
      <Text style={[styles.calcSubtitle, !isDesktop && { fontSize: 14, height: 'auto' }]}>{headerData.subtitle}</Text>
    </View>
  );
};

const BalanceLeaseTenureAlert = () => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  return (
    <View style={styles.alertBox}>
      <Text style={[styles.alertTitle, !isDesktop && { fontSize: 16, lineHeight: 22 }]}>
        Balance Lease Tenure:{' '}
        <Text style={[styles.alertValue, !isDesktop && { fontSize: 18 }]}>10 years 9 months 2 days</Text>
      </Text>
      <Text style={[styles.alertSubtitle, !isDesktop && { fontSize: 13 }]}>
        Typically defined as the period from the expiry of the initial lease term
        to the end of the lease agreement, or the lease period or expiry date,
        whichever comes first.
      </Text>
    </View>
  );
};

// Custom Dropdown Component
const Dropdown = ({
  options,
  selected,
  onSelect,
  label,
  row = false,
}: {
  options: string[];
  selected: string;
  onSelect: (val: string) => void;
  label: string;
  row?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  return (
    <View
      style={[
        styles.dropdownContainer,
        row && styles.dropdownRow,
        !isDesktop && row && { flexDirection: 'column', alignItems: 'flex-start' },
        { zIndex: isOpen ? 10000 : 1 }
      ]}
    >
      <LabelWithIcon
        label={label}
        style={row ? [styles.dropdownLabel, !isDesktop && { width: '100%', marginBottom: 8, fontSize: 16 }] : { width: 'auto' }}
      />
      <View style={[{ flex: 1, position: 'relative' }, !isDesktop && { width: '100%', flex: undefined }, { zIndex: isOpen ? 10000 : 1 }]}>
        <TouchableOpacity
          style={[styles.dropdownHeader, row && styles.dropdownHeaderRow]}
          onPress={() => setIsOpen(!isOpen)}
          activeOpacity={0.7}
        >
          <Text style={styles.dropdownHeaderText}>{selected || 'Select'}</Text>
          <ChevronDown
            size={18}
            color="#EE2529"
            style={{ transform: [{ rotate: isOpen ? '180deg' : '0deg' }] }}
          />
        </TouchableOpacity>

        {isOpen && (
          <View style={styles.dropdownList}>
            {options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dropdownItem,
                  selected === option && styles.dropdownItemSelected,
                  index === options.length - 1 && { borderBottomWidth: 0 },
                ]}
                onPress={() => {
                  onSelect(option);
                  setIsOpen(false);
                }}
              >
                <Text
                  style={[
                    styles.dropdownItemText,
                    selected === option && styles.activeDropdownItemText,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

// ============= RENTAL YIELD CALCULATOR =============
const RentalYieldCalculator = ({ activeTab }: any) => {
  const [formData, setFormData] = useState({
    propertyType: 'Residential Space',
    carpetArea: '',
    purchasePrice: '',
    loanAmount: '',
    interestRate: '',
    loanTenure: '',
    downPayment: '',
    monthlyRent: '',
    securityDeposit: '',
    rentEscalationEvery: '',
    rentEscalationPercent: '',
    leaseStartDate: '',
    leaseTerm: '',
    propertyTax: '',
    insurance: '',
    maintenancePerSqft: '',
    maintenanceLumpSum: '',
    stampDuty: '',
    brokerage: '',
    legalFees: '',
    otherCosts: '',
  });

  const [includeLoan, setIncludeLoan] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const { calculatePLG, loading: plgLoading } = usePropertyAPIs();

  const calculateROIValues = () => {
    const purchasePrice = parseFloat(formData.purchasePrice.replace(/,/g, '')) || 0;
    const carpetArea = parseFloat(formData.carpetArea) || 0;
    const monthlyRent = parseFloat(formData.monthlyRent.replace(/,/g, '')) || 0;
    const securityDeposit = parseFloat(formData.securityDeposit.replace(/,/g, '')) || 0;

    // Recurring Annual Expenses
    const propertyTax = parseFloat(formData.propertyTax.replace(/,/g, '')) || 0;
    const insurance = parseFloat(formData.insurance.replace(/,/g, '')) || 0;
    const maintenancePerSqft = parseFloat(formData.maintenancePerSqft) || 0;
    const maintenanceLumpSum = parseFloat(formData.maintenanceLumpSum.replace(/,/g, '')) || 0;

    const annualMaintenance = (maintenancePerSqft * carpetArea * 12) + maintenanceLumpSum;
    const totalAnnualExpenses = propertyTax + insurance + annualMaintenance;

    // One-time Costs
    const stampDutyPct = parseFloat(formData.stampDuty) || 0;
    const stampDuty = (stampDutyPct * purchasePrice) / 100;
    const legalFees = parseFloat(formData.legalFees.replace(/,/g, '')) || 0;
    const brokerage = parseFloat(formData.brokerage.replace(/,/g, '')) || 0;
    const otherCosts = parseFloat(formData.otherCosts.replace(/,/g, '')) || 0;

    const totalAcquisitionCosts = stampDuty + legalFees + brokerage + otherCosts;
    const totalInvestment = purchasePrice + totalAcquisitionCosts;

    const annualGrossRent = monthlyRent * 12;
    const annualNetIncome = annualGrossRent - totalAnnualExpenses;

    const grossYield = purchasePrice > 0 ? (annualGrossRent / purchasePrice) * 100 : 0;
    const netYield = totalInvestment > 0 ? (annualNetIncome / totalInvestment) * 100 : 0;

    const paybackPeriod = annualNetIncome > 0 ? (totalInvestment / annualNetIncome) : 0;

    const securityDepositInterestPct = 5; // Assuming 5% annual interest on security deposit
    const annualSecurityDepositInterest = (securityDeposit * securityDepositInterestPct) / 100;
    const totalAnnualReturn = annualNetIncome + annualSecurityDepositInterest;

    // Financing if included
    let monthlyEMI = 0;
    let totalLoanInterest = 0;
    if (includeLoan) {
      const loanAmount = parseFloat(formData.loanAmount.replace(/,/g, '')) || 0;
      const rateMonth = (parseFloat(formData.interestRate) || 0) / 12 / 100;
      const months = (parseFloat(formData.loanTenure) || 0) * 12;
      if (rateMonth > 0 && months > 0) {
        monthlyEMI = (loanAmount * rateMonth * Math.pow(1 + rateMonth, months)) / (Math.pow(1 + rateMonth, months) - 1);
        totalLoanInterest = (monthlyEMI * months) - loanAmount;
      }
    }

    setResults({
      grossYield: grossYield.toFixed(2) + '%',
      netYield: netYield.toFixed(2) + '%',
      annualGrossRent: annualGrossRent,
      totalAnnualExpenses: totalAnnualExpenses,
      totalAcquisitionCosts: totalAcquisitionCosts,
      totalInvestment: totalInvestment,
      annualNetIncome: annualNetIncome,
      securityDepositInterest: annualSecurityDepositInterest,
      totalAnnualReturn: totalAnnualReturn,
      paybackPeriod: paybackPeriod.toFixed(1) + ' years',
      cashFlow: '₹' + (annualNetIncome / 100000).toFixed(2) + ' Lakhs',
      monthlyEMI: monthlyEMI,
      totalLoanInterest: totalLoanInterest,
      loanAmount: parseFloat(formData.loanAmount.replace(/,/g, '')) || 0,
      downPayment: parseFloat(formData.downPayment.replace(/,/g, '')) || 0,
      propertyPrice: purchasePrice,
      interestRate: formData.interestRate,
      loanTenure: formData.loanTenure,
      propertyTax,
      insurance,
      annualMaintenance,
      otherExpenses: 0,
    });
  };

  React.useEffect(() => {
    calculateROIValues();
  }, [formData, includeLoan]);

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCalculate = () => {
    calculateROIValues();

    const purchasePrice = parseFloat(formData.purchasePrice.replace(/,/g, '')) || 0;
    const monthlyRent = parseFloat(formData.monthlyRent.replace(/,/g, '')) || 0;
    const leaseTermYears = parseFloat(formData.leaseTerm) || 0;

    let leaseStartDate = formData.leaseStartDate;
    if (leaseStartDate && leaseStartDate.includes('/')) {
      const parts = leaseStartDate.split('/');
      if (parts.length === 3) {
        leaseStartDate = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
      }
    }
    if (!leaseStartDate) {
      const today = new Date();
      leaseStartDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    }

    const resolvedLeaseTermYears = leaseTermYears || 1;

    calculatePLG(
      {
        carpetArea: parseFloat(formData.carpetArea) || 0,
        purchasePrice,
        monthlyRent,
        securityDeposit: parseFloat(formData.securityDeposit.replace(/,/g, '')) || 0,
        rentEscalationPercent: (parseFloat(formData.rentEscalationPercent) || 0) / 100,
        rentEscalationEveryHowManyYears: parseFloat(formData.rentEscalationEvery) || 3,
        leaseStartDate,
        leaseTermYears: resolvedLeaseTermYears,
        propertyTax: parseFloat(formData.propertyTax.replace(/,/g, '')) || 0,
        maintenancePerSqFtPerMonth: parseFloat(formData.maintenancePerSqft) || 0,
        insurance: parseFloat(formData.insurance.replace(/,/g, '')) || 0,
        stampDutyPercent: (parseFloat(formData.stampDuty) || 0) / 100,
        legalFees: parseFloat(formData.legalFees.replace(/,/g, '')) || 0,
        brokerage: parseFloat(formData.brokerage.replace(/,/g, '')) || 0,
        otherOneTimeCosts: parseFloat(formData.otherCosts.replace(/,/g, '')) || 0,
        propertyType:
          formData.propertyType === 'Residential Space' ? 'Residential'
          : formData.propertyType === 'Commercial Space' ? 'Commercial'
          : formData.propertyType,
      },
      (data) => {
        const annualGrossRent = (data?.inputs?.monthlyRent ?? 0) * 12;
        const totalAnnualExpenses = data?.cashFlows?.totalExpenses ?? 0;
        const annualNetIncome = data?.summary?.netOperatingIncome ?? 0;
        const securityDepositInterest = data?.interimCalculations?.annualInterestOnDeposit ?? 0;
        const totalInitialInvestment = data?.summary?.totalInitialInvestment ?? 0;
        const roiPercent = data?.summary?.roiPercent ?? 0;
        const totalCashFlows = data?.cashFlows?.totalCashFlows ?? 0;
        const maintenanceCost = data?.interimCalculations?.maintenanceCost ?? 0;

        setResults((prev: any) =>
          prev
            ? {
                ...prev,
                netYield: `${roiPercent.toFixed(2)}%`,
                totalInvestment: totalInitialInvestment,
                cashFlow: `₹${(totalCashFlows / 100000).toFixed(2)} Lakhs`,
                annualGrossRent,
                totalAnnualExpenses,
                annualNetIncome,
                securityDepositInterest,
                totalAnnualReturn: annualNetIncome + securityDepositInterest,
                propertyPrice: data?.inputs?.purchasePrice ?? prev.propertyPrice,
                annualMaintenance: maintenanceCost,
                plgData: data,
              }
            : null,
        );
      },
      (error) => {
        console.error('PLG calculation error:', error);
      },
    );
  };

  return (
    <ScrollView
      style={[styles.calcContainer, !isDesktop && { maxWidth: '90%', paddingHorizontal: 0 }]}
      showsVerticalScrollIndicator={false}
    >
      <CalculatorHeader type="roi" />

      <InfoCardsSummary type="roi" />

      {/* Property Details */}
      <View style={[styles.sectionCard, { zIndex: 100 }]}>
        <Text style={[styles.sectionTitle, !isDesktop && { fontSize: 18, lineHeight: 22 }]}>Property Details</Text>

        <View style={[styles.gridRow, { zIndex: 50 }]}>
          <View style={[styles.inputCol, !isDesktop && { flexBasis: '100%', maxWidth: '100%', minWidth: '100%', flexDirection: 'column', alignItems: 'flex-start', gap: 8, marginBottom: 20 }, { zIndex: 1000 }]}>
            <Dropdown
              row
              label="Property Type"
              options={['Residential Space', 'Commercial Space', 'Mixed Use']}
              selected={formData.propertyType}
              onSelect={val => handleInputChange('propertyType', val)}
            />
          </View>
          <View style={[styles.inputCol, !isDesktop && { flexBasis: '100%', maxWidth: '100%', minWidth: '100%', flexDirection: 'column', alignItems: 'flex-start', gap: 8, marginBottom: 20 }]}>
            <LabelWithIcon label="Carpet Area (sq ft)" />
            <TextInput
              style={[styles.input, !isDesktop && { width: '100%', flex: undefined }]}
              placeholder="5000"
              keyboardType="numeric"
              value={formData.carpetArea}
              onChangeText={v => handleInputChange('carpetArea', v)}
              placeholderTextColor="#262626"
            />
          </View>
        </View>
        <View style={styles.gridRow}>
          <View style={[styles.inputCol, !isDesktop && { flexBasis: '100%', maxWidth: '100%', minWidth: '100%', flexDirection: 'column', alignItems: 'flex-start', gap: 8, marginBottom: 20 }]}>
            <LabelWithIcon label="Purchase Price (₹)" />
            <TextInput
              style={[styles.input, !isDesktop && { width: '100%', flex: undefined }]}
              placeholder="45,00,000"
              keyboardType="numeric"
              value={formData.purchasePrice}
              onChangeText={v => handleInputChange('purchasePrice', v)}
              placeholderTextColor="#262626"
            />
          </View>
        </View>
      </View>

      {/* Financing Options */}
      <View style={styles.sectionCard}>
        <View style={[styles.sectionHeaderRow, !isDesktop && { flexDirection: 'column', alignItems: 'flex-start', gap: 10 }]}>
          <Text style={[styles.sectionTitle, !isDesktop && { fontSize: 18, lineHeight: 22, marginBottom: 0 }]}>Financing Options</Text>
          <View style={[styles.toggleRow, !isDesktop && { width: '100%', justifyContent: 'space-between' }]}>
            <LabelWithIcon
              label="Include Loan"
              style={{ marginBottom: 0, fontSize: 14, width: 'auto' }}
            />
            <Switch
              value={includeLoan}
              onValueChange={setIncludeLoan}
              trackColor={{ false: '#767577', true: '#EE2529' }}
              thumbColor={'#fff'}
            />
          </View>
        </View>
        <Text style={[styles.sectionNote, !isDesktop && { fontSize: 13, lineHeight: 16 }]}>
          Note: Loan amount cannot exceed the property purchase price.
        </Text>

        {includeLoan && (
          <>
            <View style={styles.gridRow}>
              <View style={[styles.inputCol, !isDesktop && { flexBasis: '100%', maxWidth: '100%', minWidth: '100%', flexDirection: 'column', alignItems: 'flex-start', gap: 8, marginBottom: 20 }]}>
                <LabelWithIcon label="Loan Amount (₹)" />
                <TextInput
                  style={[styles.input, !isDesktop && { width: '100%', flex: undefined }]}
                  placeholder="31,50,000"
                  keyboardType="numeric"
                  value={formData.loanAmount}
                  onChangeText={v => handleInputChange('loanAmount', v)}
                  placeholderTextColor="#262626"
                />
              </View>
              <View style={[styles.inputCol, !isDesktop && { flexBasis: '100%', maxWidth: '100%', minWidth: '100%', flexDirection: 'column', alignItems: 'flex-start', gap: 8, marginBottom: 20 }]}>
                <LabelWithIcon label="Down Payment (₹)" />
                <TextInput
                  style={[styles.input, !isDesktop && { width: '100%', flex: undefined }]}
                  placeholder="13,50,000"
                  keyboardType="numeric"
                  value={formData.downPayment}
                  onChangeText={v => handleInputChange('downPayment', v)}
                  placeholderTextColor="#262626"
                />
              </View>
            </View>
            <View style={styles.gridRow}>
              <View style={[styles.inputCol, !isDesktop && { flexBasis: '100%', maxWidth: '100%', minWidth: '100%', flexDirection: 'column', alignItems: 'flex-start', gap: 8, marginBottom: 20 }]}>
                <LabelWithIcon label="Interest Rate (%)" />
                <TextInput
                  style={[styles.input, !isDesktop && { width: '100%', flex: undefined }]}
                  placeholder="8.5"
                  keyboardType="numeric"
                  value={formData.interestRate}
                  onChangeText={v => handleInputChange('interestRate', v)}
                  placeholderTextColor="#262626"
                />
              </View>
              <View style={[styles.inputCol, !isDesktop && { flexBasis: '100%', maxWidth: '100%', minWidth: '100%', flexDirection: 'column', alignItems: 'flex-start', gap: 8, marginBottom: 20 }]}>
                <LabelWithIcon label="Loan Tenure (Years)" />
                <TextInput
                  style={[styles.input, !isDesktop && { width: '100%', flex: undefined }]}
                  placeholder="20"
                  keyboardType="numeric"
                  value={formData.loanTenure}
                  onChangeText={v => handleInputChange('loanTenure', v)}
                  placeholderTextColor="#262626"
                />
              </View>
            </View>
          </>
        )}
      </View>

      {/* Rental Details */}
      <View style={styles.sectionCard}>
        <Text style={[styles.sectionTitle, !isDesktop && { fontSize: 18, lineHeight: 22 }]}>Rental Details</Text>
        <View style={styles.gridRow}>
          <View style={[styles.inputCol, !isDesktop && { flexBasis: '100%', maxWidth: '100%', minWidth: '100%', flexDirection: 'column', alignItems: 'flex-start', gap: 8, marginBottom: 20 }]}>
            <LabelWithIcon label="Monthly Rent (₹)" />
            <TextInput
              style={[styles.input, !isDesktop && { width: '100%', flex: undefined }]}
              placeholder="50,000"
              keyboardType="numeric"
              value={formData.monthlyRent}
              onChangeText={v => handleInputChange('monthlyRent', v)}
              placeholderTextColor="#262626"
            />
          </View>
          <View style={[styles.inputCol, !isDesktop && { flexBasis: '100%', maxWidth: '100%', minWidth: '100%', flexDirection: 'column', alignItems: 'flex-start', gap: 8, marginBottom: 20 }]}>
            <LabelWithIcon label="Security Deposit (₹)" />
            <TextInput
              style={[styles.input, !isDesktop && { width: '100%', flex: undefined }]}
              placeholder="3,00,000"
              keyboardType="numeric"
              value={formData.securityDeposit}
              onChangeText={v => handleInputChange('securityDeposit', v)}
              placeholderTextColor="#262626"
            />
          </View>
        </View>
        <View style={styles.gridRow}>
          <View style={[styles.inputCol, !isDesktop && { flexBasis: '100%', maxWidth: '100%', minWidth: '100%', flexDirection: 'column', alignItems: 'flex-start', gap: 8, marginBottom: 20 }]}>
            <LabelWithIcon label="Rent Escalation every(yrs)" />
            <TextInput
              style={[styles.input, !isDesktop && { width: '100%', flex: undefined }]}
              placeholder="3"
              keyboardType="numeric"
              value={formData.rentEscalationEvery}
              onChangeText={v => handleInputChange('rentEscalationEvery', v)}
              placeholderTextColor="#262626"
            />
          </View>
          <View style={[styles.inputCol, !isDesktop && { flexBasis: '100%', maxWidth: '100%', minWidth: '100%', flexDirection: 'column', alignItems: 'flex-start', gap: 8, marginBottom: 20 }]}>
            <LabelWithIcon label="Rent Escalation(% per year)" />
            <TextInput
              style={[styles.input, !isDesktop && { width: '100%', flex: undefined }]}
              placeholder="8"
              keyboardType="numeric"
              value={formData.rentEscalationPercent}
              onChangeText={v => handleInputChange('rentEscalationPercent', v)}
              placeholderTextColor="#262626"
            />
          </View>
        </View>
        <View style={styles.gridRow}>
          <View style={[styles.inputCol, !isDesktop && { flexBasis: '100%', maxWidth: '100%', minWidth: '100%', flexDirection: 'column', alignItems: 'flex-start', gap: 8, marginBottom: 20 }]}>
            <LabelWithIcon label="Lease Start Date *" />
            <TextInput
              style={[styles.input, !isDesktop && { width: '100%', flex: undefined }]}
              placeholder="DD/MM/YYYY"
              value={formData.leaseStartDate}
              onChangeText={v => handleInputChange('leaseStartDate', v)}
              placeholderTextColor="#262626"
            />
          </View>
          <View style={[styles.inputCol, !isDesktop && { flexBasis: '100%', maxWidth: '100%', minWidth: '100%', flexDirection: 'column', alignItems: 'flex-start', gap: 8, marginBottom: 20 }]}>
            <LabelWithIcon label="Lease Term (Years) *" />
            <TextInput
              style={[styles.input, !isDesktop && { width: '100%', flex: undefined }]}
              placeholder="10"
              keyboardType="numeric"
              value={formData.leaseTerm}
              onChangeText={v => handleInputChange('leaseTerm', v)}
              placeholderTextColor="#262626"
            />
          </View>
        </View>

        <BalanceLeaseTenureAlert />
      </View>

      {/* Recurring Expenses (Annual) */}
      <View style={styles.sectionCard}>
        <Text style={[styles.sectionTitle, !isDesktop && { fontSize: 18, lineHeight: 22 }]}>Recurring Expenses (Annual)</Text>
        <View style={styles.gridRow}>
          <View style={[styles.inputCol, !isDesktop && { flexBasis: '100%', maxWidth: '100%', minWidth: '100%', flexDirection: 'column', alignItems: 'flex-start', gap: 8, marginBottom: 20 }]}>
            <LabelWithIcon label="Property Tax (₹)" />
            <TextInput
              style={[styles.input, !isDesktop && { width: '100%', flex: undefined }]}
              placeholder="15,000"
              keyboardType="numeric"
              value={formData.propertyTax}
              onChangeText={v => handleInputChange('propertyTax', v)}
              placeholderTextColor="#262626"
            />
          </View>
          <View style={[styles.inputCol, !isDesktop && { flexBasis: '100%', maxWidth: '100%', minWidth: '100%', flexDirection: 'column', alignItems: 'flex-start', gap: 8, marginBottom: 20 }]}>
            <LabelWithIcon label="Maintenance (₹/sqft)" />
            <TextInput
              style={[styles.input, !isDesktop && { width: '100%', flex: undefined }]}
              placeholder="30"
              keyboardType="numeric"
              value={formData.maintenancePerSqft}
              onChangeText={v => handleInputChange('maintenancePerSqft', v)}
              placeholderTextColor="#262626"
            />
          </View>
        </View>
        <View style={styles.gridRow}>
          <View style={[styles.inputCol, !isDesktop && { flexBasis: '100%', maxWidth: '100%', minWidth: '100%', flexDirection: 'column', alignItems: 'flex-start', gap: 8, marginBottom: 20 }]}>
            <LabelWithIcon label="Insurance (₹)" />
            <TextInput
              style={[styles.input, !isDesktop && { width: '100%', flex: undefined }]}
              placeholder="8,000"
              keyboardType="numeric"
              value={formData.insurance}
              onChangeText={v => handleInputChange('insurance', v)}
              placeholderTextColor="#262626"
            />
          </View>
          <View style={[styles.inputCol, !isDesktop && { flexBasis: '100%', maxWidth: '100%', minWidth: '100%', flexDirection: 'column', alignItems: 'flex-start', gap: 8, marginBottom: 20 }]}>
            <LabelWithIcon label="Maintenance Lumpsum (₹)" />
            <TextInput
              style={[styles.input, !isDesktop && { width: '100%', flex: undefined }]}
              placeholder="15,000"
              keyboardType="numeric"
              value={formData.maintenanceLumpSum}
              onChangeText={v => handleInputChange('maintenanceLumpSum', v)}
              placeholderTextColor="#262626"
            />
          </View>
        </View>
      </View>

      {/* One-time Costs */}
      <View style={styles.sectionCard}>
        <Text style={[styles.sectionTitle, !isDesktop && { fontSize: 18, lineHeight: 22 }]}>One-time Costs</Text>
        <View style={styles.gridRow}>
          <View style={[styles.inputCol, !isDesktop && { flexBasis: '100%', maxWidth: '100%', minWidth: '100%', flexDirection: 'column', alignItems: 'flex-start', gap: 8, marginBottom: 20 }]}>
            <LabelWithIcon label="Stamp Duty (%)" />
            <TextInput
              style={[styles.input, !isDesktop && { width: '100%', flex: undefined }]}
              placeholder="12"
              keyboardType="numeric"
              value={formData.stampDuty}
              onChangeText={v => handleInputChange('stampDuty', v)}
              placeholderTextColor="#262626"
            />
          </View>
          <View style={[styles.inputCol, !isDesktop && { flexBasis: '100%', maxWidth: '100%', minWidth: '100%', flexDirection: 'column', alignItems: 'flex-start', gap: 8, marginBottom: 20 }]}>
            <LabelWithIcon label="Legal Fees (₹)" />
            <TextInput
              style={[styles.input, !isDesktop && { width: '100%', flex: undefined }]}
              placeholder="30,000"
              keyboardType="numeric"
              value={formData.legalFees}
              onChangeText={v => handleInputChange('legalFees', v)}
              placeholderTextColor="#262626"
            />
          </View>
        </View>
        <View style={styles.gridRow}>
          <View style={[styles.inputCol, !isDesktop && { flexBasis: '100%', maxWidth: '100%', minWidth: '100%', flexDirection: 'column', alignItems: 'flex-start', gap: 8, marginBottom: 20 }]}>
            <LabelWithIcon label="Brokerage (₹)" />
            <TextInput
              style={[styles.input, !isDesktop && { width: '100%', flex: undefined }]}
              placeholder="67,500"
              keyboardType="numeric"
              value={formData.brokerage}
              onChangeText={v => handleInputChange('brokerage', v)}
              placeholderTextColor="#262626"
            />
          </View>
          <View style={[styles.inputCol, !isDesktop && { flexBasis: '100%', maxWidth: '100%', minWidth: '100%', flexDirection: 'column', alignItems: 'flex-start', gap: 8, marginBottom: 20 }]}>
            <LabelWithIcon label="Other Costs (₹)" />
            <TextInput
              style={[styles.input, !isDesktop && { width: '100%', flex: undefined }]}
              placeholder="25,000"
              keyboardType="numeric"
              value={formData.otherCosts}
              onChangeText={v => handleInputChange('otherCosts', v)}
              placeholderTextColor="#262626"
            />
          </View>
        </View>
      </View>

      {/* Calculate Button */}
      <TouchableOpacity onPress={handleCalculate} style={{ alignSelf: 'center' }} disabled={plgLoading}>
        <LinearGradient
          colors={['#EE2529', '#C73834']}
          style={styles.calculateBtn}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.calculateBtnText}>
            {plgLoading ? 'Calculating...' : 'Calculate ROI & Rental Yield'}
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Result Components */}
      {results && (
        <>
          <RentalCards data={results} />
          <SummaryCards data={results} />
          <FinancialDetails data={results} />
          <PerformanceAnalytics data={results} />
          <CashflowProjections data={results} />
          <RentalDetailsCashflow data={results} />
        </>
      )}
    </ScrollView>
  );
};

// ============= EMI CALCULATOR =============
const EMICalculatorView = () => {
  const [formData, setFormData] = useState({
    propertyType: 'Residential Space',
    carpetArea: '',
    purchasePrice: '',
    loanAmount: '',
    downPayment: '',
    interestRate: '',
    loanTenure: '',
    monthlyRent: '',
    securityDeposit: '',
    daysCalculation: '',
    rentEscalation: '',
    leaseStartDate: '',
    leaseTerm: '',
    propertyTax: '',
    maintenance: '',
    insurance: '',
    maintenanceLumpsum: '',
    stampDuty: '',
    legalFees: '',
    brokerage: '',
    otherCosts: '',
  });

  const [includeLoan, setIncludeLoan] = useState(true);
  const [results, setResults] = useState<any>(null);
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  const calculateEMIValues = () => {
    const loanAmount = parseFloat(formData.loanAmount.replace(/,/g, '')) || 0;
    const rateMonth = (parseFloat(formData.interestRate) || 0) / 12 / 100;
    const months = (parseFloat(formData.loanTenure) || 0) * 12;

    let monthlyEMI = 0;
    if (rateMonth > 0 && months > 0) {
      monthlyEMI = (loanAmount * rateMonth * Math.pow(1 + rateMonth, months)) / (Math.pow(1 + rateMonth, months) - 1);
    }

    const totalPayment = monthlyEMI * months;
    const totalInterest = totalPayment - loanAmount;

    setResults({
      monthlyEMI,
      totalInterest,
      totalPayment,
      loanAmount,
      interestRate: formData.interestRate,
      loanTenure: formData.loanTenure,
      downPayment: parseFloat(formData.downPayment.replace(/,/g, '')) || 0,
      propertyPrice: parseFloat(formData.purchasePrice.replace(/,/g, '')) || 0,
      principalPaid: loanAmount, // For charts
      interestPaid: totalInterest,
    });
  };

  React.useEffect(() => {
    calculateEMIValues();
  }, [formData, includeLoan]);

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCalculate = () => {
    calculateEMIValues();
  };

  return (
    <ScrollView
      style={[styles.calcContainer, !isDesktop && { maxWidth: '90%', paddingHorizontal: 0 }]}
      showsVerticalScrollIndicator={false}
    >
      <CalculatorHeader type="emi" />

      <InfoCardsSummary type="emi" />

      {/* Property Details */}
      <View style={styles.sectionCard}>
        <Text style={[styles.sectionTitle, !isDesktop && { fontSize: 18, lineHeight: 22 }]}>Property Details</Text>
        <View style={[styles.gridRow, { zIndex: 10 }]}>
          <View style={[styles.inputCol, !isDesktop && { flexBasis: '100%', maxWidth: '100%', minWidth: '100%', flexDirection: 'column', alignItems: 'flex-start', gap: 8, marginBottom: 20 }, { zIndex: 1000 }]}>
            <Dropdown
              row
              label="Property Type"
              options={['Residential Space', 'Commercial Space']}
              selected={formData.propertyType}
              onSelect={val => handleInputChange('propertyType', val)}
            />
          </View>
          <View style={[styles.inputCol, !isDesktop && { flexBasis: '100%', maxWidth: '100%', minWidth: '100%', flexDirection: 'column', alignItems: 'flex-start', gap: 8, marginBottom: 20 }]}>
            <LabelWithIcon label="Carpet Area (sq ft)" />
            <TextInput
              style={[styles.input, !isDesktop && { width: '100%', flex: undefined }]}
              placeholder="5600"
              keyboardType="numeric"
              value={formData.carpetArea}
              onChangeText={v => handleInputChange('carpetArea', v)}
              placeholderTextColor="#262626"
            />
          </View>
        </View>
        <View style={styles.gridRow}>
          <View style={[styles.inputCol, !isDesktop && { flexBasis: '100%', maxWidth: '100%', minWidth: '100%', flexDirection: 'column', alignItems: 'flex-start', gap: 8, marginBottom: 20 }]}>
            <LabelWithIcon label="Purchase Price (₹)" />
            <TextInput
              style={[styles.input, !isDesktop && { width: '100%', flex: undefined }]}
              placeholder="400000"
              keyboardType="numeric"
              value={formData.purchasePrice}
              onChangeText={v => handleInputChange('purchasePrice', v)}
              placeholderTextColor="#262626"
            />
          </View>
        </View>
      </View>

      {/* EMI Options */}
      <View style={styles.sectionCard}>
        <View style={[styles.sectionHeaderRow, !isDesktop && { flexDirection: 'column', alignItems: 'flex-start', gap: 10 }]}>
          <Text style={[styles.sectionTitle, !isDesktop && { fontSize: 18, lineHeight: 22, marginBottom: 0 }]}>EMI Options</Text>
          <View style={[styles.toggleRow, !isDesktop && { width: '100%', justifyContent: 'space-between' }]}>
            <LabelWithIcon
              label="Include Downpayment"
              style={{ marginBottom: 0, fontSize: 12, width: 'auto' }}
            />
            <Switch
              value={includeLoan}
              onValueChange={setIncludeLoan}
              trackColor={{ false: '#767577', true: '#EE2529' }}
              thumbColor={'#fff'}
            />
          </View>
        </View>
        <Text style={[styles.sectionNote, !isDesktop && { fontSize: 13, lineHeight: 16 }]}>
          Note: Loan amount cannot exceed the property purchase price.
        </Text>
        <View style={styles.gridRow}>
          <View style={[styles.inputCol, !isDesktop && { flexBasis: '100%', maxWidth: '100%', minWidth: '100%', flexDirection: 'column', alignItems: 'flex-start', gap: 8, marginBottom: 20 }]}>
            <LabelWithIcon label="Loan Amount (₹)" />
            <TextInput
              style={[styles.input, !includeLoan && styles.inputDisabled]}
              placeholder="310000"
              keyboardType="numeric"
              value={formData.loanAmount}
              onChangeText={v => handleInputChange('loanAmount', v)}
              editable={includeLoan}
              placeholderTextColor="#262626"
            />
          </View>
          <View style={[styles.inputCol, !isDesktop && { flexBasis: '100%', maxWidth: '100%', minWidth: '100%', flexDirection: 'column', alignItems: 'flex-start', gap: 8, marginBottom: 20 }]}>
            <LabelWithIcon label="Down Payment (₹)" />
            <TextInput
              style={[styles.input, !includeLoan && styles.inputDisabled]}
              placeholder="130000"
              keyboardType="numeric"
              value={formData.downPayment}
              onChangeText={v => handleInputChange('downPayment', v)}
              editable={includeLoan}
              placeholderTextColor="#262626"
            />
          </View>
        </View>
        <View style={styles.gridRow}>
          <View style={[styles.inputCol, !isDesktop && { flexBasis: '100%', maxWidth: '100%', minWidth: '100%', flexDirection: 'column', alignItems: 'flex-start', gap: 8, marginBottom: 20 }]}>
            <LabelWithIcon label="Interest (% per annum)" />
            <TextInput
              style={[styles.input, !includeLoan && styles.inputDisabled]}
              placeholder="9.5"
              keyboardType="numeric"
              value={formData.interestRate}
              onChangeText={v => handleInputChange('interestRate', v)}
              editable={includeLoan}
              placeholderTextColor="#262626"
            />
          </View>
          <View style={[styles.inputCol, !isDesktop && { flexBasis: '100%', maxWidth: '100%', minWidth: '100%', flexDirection: 'column', alignItems: 'flex-start', gap: 8, marginBottom: 20 }]}>
            <LabelWithIcon label="Loan Tenure (Years)" />
            <TextInput
              style={[styles.input, !includeLoan && styles.inputDisabled]}
              placeholder="20"
              keyboardType="numeric"
              value={formData.loanTenure}
              onChangeText={v => handleInputChange('loanTenure', v)}
              editable={includeLoan}
              placeholderTextColor="#262626"
            />
          </View>
        </View>
      </View>

      {/* Rental Details */}
      <View style={styles.sectionCard}>
        <Text style={[styles.sectionTitle, !isDesktop && { fontSize: 18, lineHeight: 22 }]}>Rental Details</Text>
        <View style={styles.gridRow}>
          <View style={[styles.inputCol, !isDesktop && { flexBasis: '100%', maxWidth: '100%', minWidth: '100%', flexDirection: 'column', alignItems: 'flex-start', gap: 8, marginBottom: 20 }]}>
            <LabelWithIcon label="Monthly Rent (₹)" />
            <TextInput
              style={[styles.input, !isDesktop && { width: '100%', flex: undefined }]}
              placeholder="30000"
              keyboardType="numeric"
              value={formData.monthlyRent}
              onChangeText={v => handleInputChange('monthlyRent', v)}
              placeholderTextColor="#262626"
            />
          </View>
          <View style={[styles.inputCol, !isDesktop && { flexBasis: '100%', maxWidth: '100%', minWidth: '100%', flexDirection: 'column', alignItems: 'flex-start', gap: 8, marginBottom: 20 }]}>
            <LabelWithIcon label="Security Deposit (₹)" />
            <TextInput
              style={[styles.input, !isDesktop && { width: '100%', flex: undefined }]}
              placeholder="300000"
              keyboardType="numeric"
              value={formData.securityDeposit}
              onChangeText={v => handleInputChange('securityDeposit', v)}
              placeholderTextColor="#262626"
            />
          </View>
        </View>
        <View style={styles.gridRow}>
          <View style={[styles.inputCol, !isDesktop && { flexBasis: '100%', maxWidth: '100%', minWidth: '100%', flexDirection: 'column', alignItems: 'flex-start', gap: 8, marginBottom: 20 }]}>
            <LabelWithIcon label="Days Calculation Gregorian" />
            <TextInput
              style={[styles.input, !isDesktop && { width: '100%', flex: undefined }]}
              placeholder="3"
              keyboardType="numeric"
              value={formData.daysCalculation}
              onChangeText={v => handleInputChange('daysCalculation', v)}
              placeholderTextColor="#262626"
            />
          </View>
          <View style={[styles.inputCol, !isDesktop && { flexBasis: '100%', maxWidth: '100%', minWidth: '100%', flexDirection: 'column', alignItems: 'flex-start', gap: 8, marginBottom: 20 }]}>
            <LabelWithIcon label="Rent Escalation (% per year)" />
            <TextInput
              style={[styles.input, !isDesktop && { width: '100%', flex: undefined }]}
              placeholder="8"
              keyboardType="numeric"
              value={formData.rentEscalation}
              onChangeText={v => handleInputChange('rentEscalation', v)}
              placeholderTextColor="#262626"
            />
          </View>
        </View>
        <View style={styles.gridRow}>
          <View style={[styles.inputCol, !isDesktop && { flexBasis: '100%', maxWidth: '100%', minWidth: '100%', flexDirection: 'column', alignItems: 'flex-start', gap: 8, marginBottom: 20 }]}>
            <LabelWithIcon label="Lease Start Date *" />
            <TextInput
              style={[styles.input, !isDesktop && { width: '100%', flex: undefined }]}
              placeholder="DD/MM/YYYY"
              value={formData.leaseStartDate}
              onChangeText={v => handleInputChange('leaseStartDate', v)}
              placeholderTextColor="#262626"
            />
          </View>
          <View style={[styles.inputCol, !isDesktop && { flexBasis: '100%', maxWidth: '100%', minWidth: '100%', flexDirection: 'column', alignItems: 'flex-start', gap: 8, marginBottom: 20 }]}>
            <LabelWithIcon label="Lease Term (Yrs) *" />
            <TextInput
              style={[styles.input, !isDesktop && { width: '100%', flex: undefined }]}
              placeholder="10"
              keyboardType="numeric"
              value={formData.leaseTerm}
              onChangeText={v => handleInputChange('leaseTerm', v)}
              placeholderTextColor="#262626"
            />
          </View>
        </View>

        <BalanceLeaseTenureAlert />
      </View>

      {/* Recurring Expenses */}
      <View style={styles.sectionCard}>
        <Text style={[styles.sectionTitle, !isDesktop && { fontSize: 18, lineHeight: 22 }]}>Recurring Expenses (Annual)</Text>
        <View style={styles.gridRow}>
          <View style={[styles.inputCol, !isDesktop && { flexBasis: '100%', maxWidth: '100%', minWidth: '100%', flexDirection: 'column', alignItems: 'flex-start', gap: 8, marginBottom: 20 }]}>
            <LabelWithIcon label="Property Tax (₹)" />
            <TextInput
              style={[styles.input, !isDesktop && { width: '100%', flex: undefined }]}
              placeholder="12000"
              keyboardType="numeric"
              value={formData.propertyTax}
              onChangeText={v => handleInputChange('propertyTax', v)}
              placeholderTextColor="#262626"
            />
          </View>
          <View style={[styles.inputCol, !isDesktop && { flexBasis: '100%', maxWidth: '100%', minWidth: '100%', flexDirection: 'column', alignItems: 'flex-start', gap: 8, marginBottom: 20 }]}>
            <LabelWithIcon label="Maintenance per sq ft (₹)" />
            <TextInput
              style={[styles.input, !isDesktop && { width: '100%', flex: undefined }]}
              placeholder="30000"
              keyboardType="numeric"
              value={formData.maintenance}
              onChangeText={v => handleInputChange('maintenance', v)}
              placeholderTextColor="#262626"
            />
          </View>
        </View>
        <View style={styles.gridRow}>
          <View style={[styles.inputCol, !isDesktop && { flexBasis: '100%', maxWidth: '100%', minWidth: '100%', flexDirection: 'column', alignItems: 'flex-start', gap: 8, marginBottom: 20 }]}>
            <LabelWithIcon label="Insurance (₹)" />
            <TextInput
              style={[styles.input, !isDesktop && { width: '100%', flex: undefined }]}
              placeholder="8000"
              keyboardType="numeric"
              value={formData.insurance}
              onChangeText={v => handleInputChange('insurance', v)}
              placeholderTextColor="#262626"
            />
          </View>
          <View style={[styles.inputCol, !isDesktop && { flexBasis: '100%', maxWidth: '100%', minWidth: '100%', flexDirection: 'column', alignItems: 'flex-start', gap: 8, marginBottom: 20 }]}>
            <LabelWithIcon label="Maintenance Lump sum (₹)" />
            <TextInput
              style={[styles.input, !isDesktop && { width: '100%', flex: undefined }]}
              placeholder="58000"
              keyboardType="numeric"
              value={formData.maintenanceLumpsum}
              onChangeText={v => handleInputChange('maintenanceLumpsum', v)}
              placeholderTextColor="#262626"
            />
          </View>
        </View>
      </View>

      {/* One-time Costs */}
      <View style={styles.sectionCard}>
        <Text style={[styles.sectionTitle, !isDesktop && { fontSize: 18, lineHeight: 22 }]}>One-time Costs</Text>
        <View style={styles.gridRow}>
          <View style={[styles.inputCol, !isDesktop && { flexBasis: '100%', maxWidth: '100%', minWidth: '100%', flexDirection: 'column', alignItems: 'flex-start', gap: 8, marginBottom: 20 }]}>
            <LabelWithIcon label="Stamp Duty (%)" />
            <TextInput
              style={[styles.input, !isDesktop && { width: '100%', flex: undefined }]}
              placeholder="12"
              keyboardType="numeric"
              value={formData.stampDuty}
              onChangeText={v => handleInputChange('stampDuty', v)}
              placeholderTextColor="#262626"
            />
          </View>
          <View style={[styles.inputCol, !isDesktop && { flexBasis: '100%', maxWidth: '100%', minWidth: '100%', flexDirection: 'column', alignItems: 'flex-start', gap: 8, marginBottom: 20 }]}>
            <LabelWithIcon label="Legal Fees (₹)" />
            <TextInput
              style={[styles.input, !isDesktop && { width: '100%', flex: undefined }]}
              placeholder="38000"
              keyboardType="numeric"
              value={formData.legalFees}
              onChangeText={v => handleInputChange('legalFees', v)}
              placeholderTextColor="#262626"
            />
          </View>
        </View>
        <View style={styles.gridRow}>
          <View style={[styles.inputCol, !isDesktop && { flexBasis: '100%', maxWidth: '100%', minWidth: '100%', flexDirection: 'column', alignItems: 'flex-start', gap: 8, marginBottom: 20 }]}>
            <LabelWithIcon label="Brokerage (₹)" />
            <TextInput
              style={[styles.input, !isDesktop && { width: '100%', flex: undefined }]}
              placeholder="67500"
              keyboardType="numeric"
              value={formData.brokerage}
              onChangeText={v => handleInputChange('brokerage', v)}
              placeholderTextColor="#262626"
            />
          </View>
          <View style={[styles.inputCol, !isDesktop && { flexBasis: '100%', maxWidth: '100%', minWidth: '100%', flexDirection: 'column', alignItems: 'flex-start', gap: 8, marginBottom: 20 }]}>
            <LabelWithIcon label="Other One-time Costs (₹)" />
            <TextInput
              style={[styles.input, !isDesktop && { width: '100%', flex: undefined }]}
              placeholder="25000"
              keyboardType="numeric"
              value={formData.otherCosts}
              onChangeText={v => handleInputChange('otherCosts', v)}
              placeholderTextColor="#262626"
            />
          </View>
        </View>
      </View>

      {/* Calculate Button */}
      <TouchableOpacity onPress={handleCalculate} style={{ alignSelf: 'center' }}>
        <LinearGradient
          colors={['#EE2529', '#C73834']}
          style={styles.calculateBtn}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.calculateBtnText}>
            Calculate ROI & Rental Yield
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Result Components */}
      {results && (
        <>
          <EMISummaryCards data={results} />
          <EMIAnalytics data={results} />
          <PrincipleChart data={results} />
          <CoverageAnalysis data={results} />
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    // minHeight: '100%',
    // paddingBottom: 40,
  },
  heroSection: {
    padding: 20,
    position: 'relative',
    marginBottom: 20,
  },
  heroBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0, // Ensure full vertical coverage
    resizeMode: 'cover',
    opacity: 1,
    minHeight: 593
  },
  heroContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: isDesktop ? '8%' : 20,
    paddingRight: 0,
    minHeight: isDesktop ? 380 : 'auto',
  },
  heroTextContainer: {
    flex: 1,
    minWidth: 300,
    marginRight: 20,
    paddingTop: 20,
  },
  redIconBox: {
    backgroundColor: '#EE2529',
    padding: 2,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#EE2529',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    height: 72,
    width: 72,
    marginTop:10,
  },
  heroStatsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    marginTop: 20,
  },
  heroStatCard: {
   borderRadius: 12,
  minWidth: 173,
  overflow: 'hidden',      // ← critical for gradient to respect borderRadius
  shadowColor: '#000',
  shadowOpacity: 0.10,
  shadowRadius: 10,
  elevation: 3,
  // backgroundColor: '#fff'
   backgroundImage: 'linear-gradient(to right, #F2F2F2, rgba(255, 255, 255, 0.6))' as any,
  },
  heroStatCardGradient: {
  padding: 26,
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
},
  heroStatLabel: {
    fontSize: 16,
    color: '#767676',
    fontWeight: '600',
    marginBottom: 3,
    textAlign: 'center',
  },
  heroStatValue: {
    fontSize: 18,
    color: '#EE2529',
    fontWeight: 400,
    textAlign: 'center',
  },
  badgeContainer: {
    backgroundColor: '#FFF3CA',
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 15,
    color: '#767676',
    fontWeight: 400,
  },
  heroTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#262626',
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
    fontWeight: 400,
    maxWidth: 800,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#767676',
    marginBottom: 5,
    fontWeight: '600',
  },
  statValue: {
    fontSize: 12,
    color: '#EE2529',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  heroImage: {
    // width: 1000,
    // height: 500,
    // alignSelf: 'center',
    // resizeMode: 'contain',
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 0,
    marginTop: isDesktop ? 100 : 20,
    marginBottom: 30, 
    backgroundColor: '#fff',
    borderRadius: 25,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
    marginHorizontal: 20,
    padding: 0,
    overflow: 'hidden',
    position: 'relative',
    zIndex: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    position: 'relative',
    gap: 6,
  },
  tabIconBox: {
    width: 32,
    height: 32,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  activeTabIconBox: {
    backgroundColor: '#EE2529',
  },
  tabText: {
    fontSize: 24,
    color: '#767676',
    fontWeight: 400,
    lineHeight:24,
  },
  activeTabText: {
    fontSize: 24,
    color: '#EE2529',
    fontWeight: 700,
    lineHeight:24,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    width: '50%',
    height: 4,
    backgroundColor: '#EE2529',
  },
  divider: {
    width: 0, // Removed for modern pill look
  },
  contentArea: {
    paddingHorizontal: 20,
  },
  calcContainer: {
    padding: 10,
    maxWidth: '90%',
    alignSelf: 'center',
    width: '100%',
  },
  calcTitle: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 14,
    marginTop:10,
    color: '#333',
    textAlign: 'center',
  },
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 30,
    ...Platform.select({
      web: {
        '@media (max-width: 1024px)': {
          paddingHorizontal: 16,
        }
      } as any
    }),
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
   
   
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 24,
    lineHeight: 28,
    fontWeight: '600',
    color: '#EE2529',
    marginBottom: 8,
  },
  sectionNote: {
    color: '#6B7280',
    fontSize: 16,
    lineHeight: 18,
    marginBottom: 16,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 10,
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    
  },
  inputCol: {
    flexBasis: '48%',
    maxWidth: '48%',
    flexGrow: 1,
    flexShrink: 1,
    minWidth: 180,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  inputGroup: {
    marginBottom: 15,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  fieldLabel: {
    fontSize: 15,
    color: '#4B5563',
    fontWeight: '600',
    flex: 0.45,
  },
  inputRight: {
    flex: 0.55,
    textAlign: 'right',
  },
  label: {
    fontSize: 18,
    lineHeight: 20,
    marginBottom: 0,
    color: '#262626',
    fontWeight: '400',
    textAlign: 'left',
    fontFamily: 'Montserrat',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '35%',
    gap: 6,
  },
  input: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 18,
    color: '#262626',
    fontWeight: '600',
    lineHeight: 20,
    fontFamily: 'Montserrat',
    minHeight: 40,
    textAlign: 'right',
    ...Platform.select({
      web: {
        outlineStyle: 'none',
        appearance: 'auto',
      } as any,
    }),
  },
  inputDisabled: {
    opacity: 0.5,
  },
  typeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  typeBtn: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#eee',
  },
  activeTypeBtn: {
    backgroundColor: '#FFF3CA',
    borderColor: '#EE2529',
  },
  typeBtnText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  activeTypeBtnText: {
    color: '#d62d2d',
  },
  calculateBtn: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
    shadowColor: '#EE2529',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    minWidth: 280,
  },
  calculateBtnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 600,
    fontFamily:'Montserrat',
  },
  dropdownContainer: {
    marginBottom: 12,
    zIndex: 9999,
    width: '100%',
  },
  dropdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  dropdownLabel: {
    width: '35%',
    marginBottom: 0,
    fontSize: 18,
    fontWeight: '400',
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F6F6F6',
   
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    minHeight: 40,
  },
  dropdownHeaderRow: {
    flex: 1,
  },
  dropdownHeaderText: {
    fontSize: 18,
    color: '#262626',
    fontWeight: '600',
    fontFamily: 'Montserrat',
  },
  dropdownList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    width: '100%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    marginTop: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
    zIndex: 10000,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownItemSelected: {
    backgroundColor: '#FFF3CA',
  },
  dropdownItemText: {
    fontSize: 18,
    color: '#262626',
    fontWeight: '600',
    fontFamily: 'Montserrat',
  },
  activeDropdownItemText: {
    color: '#EE2529',
    fontWeight: 'bold',
  },
  infoCardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 30,
    marginTop: 20,
    width: '100%',
    maxWidth: '72%',
    alignSelf: 'center',
  },
  infoSummaryCard: {
    flex: 1,
    minWidth: 110,
     paddingVertical: 20,
     backgroundImage: 'linear-gradient(to bottom, #F2F2F2, rgba(255, 255, 255, 0.6))' as any,
    borderRadius: 8,
    borderBottomWidth: 3,
    borderBottomColor: '#EE2529',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
    maxHeight: 100,
  },
  infoSummaryText: {
    fontSize: 18,
    lineHeight: 28,
    color: '#767676',
    fontWeight: '600',
    textAlign: 'center',
    
  },
  alertBox: {
    marginTop: 15,
    backgroundColor: '#FFFCF4',
    borderWidth: 1,
    borderColor: '#EE2529',
    borderRadius: 8,
    padding: 15,
  },
  alertTitle: {
    fontSize: 20,
    color: '#262626',
    fontWeight: 600,
    marginBottom: 5,
    lineHeight:28,
    fontFamily:'Montserrat',
  },
  alertValue: {
    color: '#EE2529',
    fontSize: 24,
    fontWeight: 600,
     fontFamily:'Montserrat',
  },
  alertSubtitle: {
    fontSize: 14,
    color: '#262626',
    lineHeight: 18,
     fontFamily:'Montserrat',

  },
  calcHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  calcHeaderIconBox: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#EE2529',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  calcSubtitle: {
    fontSize: 18,
    fontWeight: '400',
    lineHeight: 18,
    color: '#767676',
    textAlign: 'center',
    maxWidth: '85%',
    marginBottom: 4,
    height:28,
  },
});

export default CalculatorsScreen;
