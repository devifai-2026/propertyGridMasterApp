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
                !isDesktop && { marginRight: 0, marginTop: 40 },
              ]}
            >
              <View style={isDesktop ? { flexDirection: 'row', gap: 20, alignItems: 'center', marginBottom: 20 } : {}}>
                <View style={styles.redIconBox}>
                  <Calculator size={isDesktop ? 62 : 30} color="#fff" />
                </View>
                <View>
                  <View style={styles.badgeContainer}>
                    <Text style={styles.badgeText}>
                      Professional Investment Tools
                    </Text>
                  </View>
                  <Text style={[styles.heroTitle, isDesktop && { fontSize: 36, marginBottom: 0 }]}>
                    Property Investment Platform
                  </Text>
                </View>
              </View>

              <Text style={styles.heroSubtitle}>
                Make data-driven decisions with comprehensive ROI analysis, loan
                coverage insights, and detailed cash flow projections for your
                real estate investments
              </Text>

              <View style={styles.heroStatsRow}>
                <View style={styles.heroStatCard}>
                  <Text style={styles.heroStatLabel}>Yield Analysis</Text>
                  <Text style={styles.heroStatValue}>Gross & Net<br /> Returns</Text>
                </View>
                <View style={styles.heroStatCard}>
                  <Text style={styles.heroStatLabel}>Loan Planning</Text>
                  <Text style={styles.heroStatValue}>EMI & Coverage<br /> Ratio</Text>
                </View>
                <View style={styles.heroStatCard}>
                  <Text style={styles.heroStatLabel}>Cash Flow</Text>
                  <Text style={styles.heroStatValue}>10-Year<br /> Projections</Text>
                </View>
              </View>
            </View>

            <Image
              source={require('../../assets/Calculator/bannerImg.png')}
              style={[
                styles.heroImage,
                isDesktop
                  ? {
                    width: '44%',       // ← slightly narrower
                    height: 688,        // ← reduced from 500
                    position: 'absolute',
                    right: -20,
                    top: -119,
                  }
                  : { width: 350, height: 250 },
              ]}
              resizeMode="fill"
            />
          </View>
        </View>

        <View
          style={[
            styles.tabsContainer,
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
                isDesktop && { fontSize: 16 },
              ]}
            >
              ROI & Rental Yield Calculator
            </Text>
            {activeTab === 'roi' && <View style={styles.activeIndicator} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setActiveTab('emi')}
          >
            <View style={[styles.tabIconBox, activeTab === 'emi' && styles.activeTabIconBox]}>
              <Calculator
                size={20}
                color={activeTab === 'emi' ? '#fff' : '#767676'}
              />
            </View>
            <Text
              style={[
                styles.tabText,
                activeTab === 'emi' && styles.activeTabText,
                isDesktop && { fontSize: 16 },
              ]}
            >
              EMI Calculator
            </Text>
            {activeTab === 'emi' && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.contentArea,
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
  const cards =
    type === 'roi'
      ? [
        'Get clarity on your\nmonthly or annual yield.',
        'Compare ROI across different properties or investments.',
        'Adjust variables like rent,\npurchase price, and taxes to see\nimpact in real time',
      ]
      : [
        'Understand your\nmonthly EMI with ease',
        'Compare EMIs across different\nloan structures or interest rates',
        'Adjust variables like loan\namount, tenure, and more to see\nimpacts in real time',
      ];

  return (
    <View style={styles.infoCardsGrid}>
      {cards.map((text, i) => (
        <View key={i} style={styles.infoSummaryCard}>
          <Text style={styles.infoSummaryText}>{text}</Text>
        </View>
      ))}
    </View>
  );
};

const CalculatorHeader = ({ type }: { type: 'roi' | 'emi' }) => {
  const headerData =
    type === 'roi'
      ? {
        icon: <Calculator size={32} color="#fff" />,
        title: 'Property Investment ROI Calculator',
        subtitle:
          'Get clarity on your monthly or annual yield using rent,\n purchase price, and taxes.',
      }
      : {
        icon: <Calculator size={32} color="#fff" />,
        title: 'Property EMI Calculator',
        subtitle:
          'Estimate your monthly loan repayment instantly based on loan amount,\n tenure, interest rate, and other key factors.',
      };

  return (
    <View style={styles.calcHeader}>
      <View style={styles.calcHeaderIconBox}>{headerData.icon}</View>
      <Text style={styles.calcTitle}>{headerData.title}</Text>
      <Text style={styles.calcSubtitle}>{headerData.subtitle}</Text>
    </View>
  );
};

const BalanceLeaseTenureAlert = () => (
  <View style={styles.alertBox}>
    <Text style={styles.alertTitle}>
      Balance Lease Tenure:{' '}
      <Text style={styles.alertValue}>10 years 9 months 2 days</Text>
    </Text>
    <Text style={styles.alertSubtitle}>
      Typically defined as the period from the expiry of the initial lease term
      to the end of the lease agreement, or the lease period or expiry date,
      whichever comes first.
    </Text>
  </View>
);

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

  return (
    <View
      style={[
        styles.dropdownContainer,
        row && styles.dropdownRow,
        { zIndex: isOpen ? 10000 : 1 }
      ]}
    >
      <Text style={[styles.label, row ? styles.dropdownLabel : { width: 'auto' }]}>
        {label}
      </Text>
      <View style={{ flex: 1, position: 'relative', zIndex: isOpen ? 10000 : 1 }}>
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
  };

  return (
    <ScrollView
      style={styles.calcContainer}
      showsVerticalScrollIndicator={false}
    >
      <CalculatorHeader type="roi" />

      <InfoCardsSummary type="roi" />

      {/* Property Details */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Property Details</Text>

        <View style={[styles.gridRow, { zIndex: 10 }]}>
          <View style={styles.inputCol}>
            <Dropdown
              row
              label="Property Type"
              options={['Residential Space', 'Commercial Space', 'Mixed Use']}
              selected={formData.propertyType}
              onSelect={val => handleInputChange('propertyType', val)}
            />
          </View>
          <View style={styles.inputCol}>
            <Text style={styles.label}>Carpet Area (sq ft)</Text>
            <TextInput
              style={styles.input}
              placeholder="5000"
              keyboardType="numeric" type={Platform.OS === 'web' ? 'number' : undefined}
              value={formData.carpetArea}
              onChangeText={v => handleInputChange('carpetArea', v)}
              placeholderTextColor="#999"
            />
          </View>
        </View>
        <View style={styles.gridRow}>
          <View style={styles.inputCol}>
            <Text style={styles.label}>Purchase Price (₹)</Text>
            <TextInput
              style={styles.input}
              placeholder="45,00,000"
              keyboardType="numeric" type={Platform.OS === 'web' ? 'number' : undefined}
              value={formData.purchasePrice}
              onChangeText={v => handleInputChange('purchasePrice', v)}
              placeholderTextColor="#999"
            />
          </View>
        </View>
      </View>

      {/* Financing Options */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Financing Options</Text>
          <View style={styles.toggleRow}>
            <Text style={[styles.label, { marginBottom: 0, fontSize: 12 }]}>
              Include Loan
            </Text>
            <Switch
              value={includeLoan}
              onValueChange={setIncludeLoan}
              trackColor={{ false: '#767577', true: '#EE2529' }}
              thumbColor={'#fff'}
            />
          </View>
        </View>
        <Text style={styles.sectionNote}>
          Note: Loan amount cannot exceed the property purchase price.
        </Text>

        {includeLoan && (
          <>
            <View style={styles.gridRow}>
              <View style={styles.inputCol}>
                <Text style={styles.label}>Loan Amount (₹)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="31,50,000"
                  keyboardType="numeric" type={Platform.OS === 'web' ? 'number' : undefined}
                  value={formData.loanAmount}
                  onChangeText={v => handleInputChange('loanAmount', v)}
                  placeholderTextColor="#999"
                />
              </View>
              <View style={styles.inputCol}>
                <Text style={styles.label}>Down Payment (₹)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="13,50,000"
                  keyboardType="numeric" type={Platform.OS === 'web' ? 'number' : undefined}
                  value={formData.downPayment}
                  onChangeText={v => handleInputChange('downPayment', v)}
                  placeholderTextColor="#999"
                />
              </View>
            </View>
            <View style={styles.gridRow}>
              <View style={styles.inputCol}>
                <Text style={styles.label}>Interest Rate (%)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="8.5"
                  keyboardType="numeric" type={Platform.OS === 'web' ? 'number' : undefined}
                  value={formData.interestRate}
                  onChangeText={v => handleInputChange('interestRate', v)}
                  placeholderTextColor="#999"
                />
              </View>
              <View style={styles.inputCol}>
                <Text style={styles.label}>Loan Tenure (Years)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="20"
                  keyboardType="numeric" type={Platform.OS === 'web' ? 'number' : undefined}
                  value={formData.loanTenure}
                  onChangeText={v => handleInputChange('loanTenure', v)}
                  placeholderTextColor="#999"
                />
              </View>
            </View>
          </>
        )}
      </View>

      {/* Rental Details */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Rental Details</Text>
        <View style={styles.gridRow}>
          <View style={styles.inputCol}>
            <Text style={styles.label}>Monthly Rent (₹)</Text>
            <TextInput
              style={styles.input}
              placeholder="50,000"
              keyboardType="numeric" type={Platform.OS === 'web' ? 'number' : undefined}
              value={formData.monthlyRent}
              onChangeText={v => handleInputChange('monthlyRent', v)}
              placeholderTextColor="#999"
            />
          </View>
          <View style={styles.inputCol}>
            <Text style={styles.label}>Security Deposit (₹)</Text>
            <TextInput
              style={styles.input}
              placeholder="3,00,000"
              keyboardType="numeric" type={Platform.OS === 'web' ? 'number' : undefined}
              value={formData.securityDeposit}
              onChangeText={v => handleInputChange('securityDeposit', v)}
              placeholderTextColor="#999"
            />
          </View>
        </View>
        <View style={styles.gridRow}>
          <View style={styles.inputCol}>
            <Text style={styles.label}>Rent Escalation every(yrs)</Text>
            <TextInput
              style={styles.input}
              placeholder="3"
              keyboardType="numeric" type={Platform.OS === 'web' ? 'number' : undefined}
              value={formData.rentEscalationEvery}
              onChangeText={v => handleInputChange('rentEscalationEvery', v)}
              placeholderTextColor="#999"
            />
          </View>
          <View style={styles.inputCol}>
            <Text style={styles.label}>Rent Escalation(% per year)</Text>
            <TextInput
              style={styles.input}
              placeholder="8"
              keyboardType="numeric" type={Platform.OS === 'web' ? 'number' : undefined}
              value={formData.rentEscalationPercent}
              onChangeText={v => handleInputChange('rentEscalationPercent', v)}
              placeholderTextColor="#999"
            />
          </View>
        </View>
        <View style={styles.gridRow}>
          <View style={styles.inputCol}>
            <Text style={styles.label}>Lease Start Date *</Text>
            <TextInput
              style={styles.input}
              placeholder="DD/MM/YYYY"
              value={formData.leaseStartDate}
              onChangeText={v => handleInputChange('leaseStartDate', v)}
              placeholderTextColor="#999"
            />
          </View>
          <View style={styles.inputCol}>
            <Text style={styles.label}>Lease Term (Months) *</Text>
            <TextInput
              style={styles.input}
              placeholder="10"
              keyboardType="numeric" type={Platform.OS === 'web' ? 'number' : undefined}
              value={formData.leaseTerm}
              onChangeText={v => handleInputChange('leaseTerm', v)}
              placeholderTextColor="#999"
            />
          </View>
        </View>

        <BalanceLeaseTenureAlert />
      </View>

      {/* Recurring Expenses (Annual) */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Recurring Expenses (Annual)</Text>
        <View style={styles.gridRow}>
          <View style={styles.inputCol}>
            <Text style={styles.label}>Property Tax (₹)</Text>
            <TextInput
              style={styles.input}
              placeholder="15,000"
              keyboardType="numeric" type={Platform.OS === 'web' ? 'number' : undefined}
              value={formData.propertyTax}
              onChangeText={v => handleInputChange('propertyTax', v)}
              placeholderTextColor="#999"
            />
          </View>
          <View style={styles.inputCol}>
            <Text style={styles.label}>Maintenance (₹/sqft)</Text>
            <TextInput
              style={styles.input}
              placeholder="30"
              keyboardType="numeric" type={Platform.OS === 'web' ? 'number' : undefined}
              value={formData.maintenancePerSqft}
              onChangeText={v => handleInputChange('maintenancePerSqft', v)}
              placeholderTextColor="#999"
            />
          </View>
        </View>
        <View style={styles.gridRow}>
          <View style={styles.inputCol}>
            <Text style={styles.label}>Insurance (₹)</Text>
            <TextInput
              style={styles.input}
              placeholder="8,000"
              keyboardType="numeric" type={Platform.OS === 'web' ? 'number' : undefined}
              value={formData.insurance}
              onChangeText={v => handleInputChange('insurance', v)}
              placeholderTextColor="#999"
            />
          </View>
          <View style={styles.inputCol}>
            <Text style={styles.label}>Maintenance Lumpsum (₹)</Text>
            <TextInput
              style={styles.input}
              placeholder="15,000"
              keyboardType="numeric" type={Platform.OS === 'web' ? 'number' : undefined}
              value={formData.maintenanceLumpSum}
              onChangeText={v => handleInputChange('maintenanceLumpSum', v)}
              placeholderTextColor="#999"
            />
          </View>
        </View>
      </View>

      {/* One-time Costs */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>One-time Costs</Text>
        <View style={styles.gridRow}>
          <View style={styles.inputCol}>
            <Text style={styles.label}>Stamp Duty (%)</Text>
            <TextInput
              style={styles.input}
              placeholder="12"
              keyboardType="numeric" type={Platform.OS === 'web' ? 'number' : undefined}
              value={formData.stampDuty}
              onChangeText={v => handleInputChange('stampDuty', v)}
              placeholderTextColor="#999"
            />
          </View>
          <View style={styles.inputCol}>
            <Text style={styles.label}>Legal Fees (₹)</Text>
            <TextInput
              style={styles.input}
              placeholder="30,000"
              keyboardType="numeric" type={Platform.OS === 'web' ? 'number' : undefined}
              value={formData.legalFees}
              onChangeText={v => handleInputChange('legalFees', v)}
              placeholderTextColor="#999"
            />
          </View>
        </View>
        <View style={styles.gridRow}>
          <View style={styles.inputCol}>
            <Text style={styles.label}>Brokerage (₹)</Text>
            <TextInput
              style={styles.input}
              placeholder="67,500"
              keyboardType="numeric" type={Platform.OS === 'web' ? 'number' : undefined}
              value={formData.brokerage}
              onChangeText={v => handleInputChange('brokerage', v)}
              placeholderTextColor="#999"
            />
          </View>
          <View style={styles.inputCol}>
            <Text style={styles.label}>Other Costs (₹)</Text>
            <TextInput
              style={styles.input}
              placeholder="25,000"
              keyboardType="numeric" type={Platform.OS === 'web' ? 'number' : undefined}
              value={formData.otherCosts}
              onChangeText={v => handleInputChange('otherCosts', v)}
              placeholderTextColor="#999"
            />
          </View>
        </View>
      </View>

      {/* Calculate Button */}
      <TouchableOpacity style={styles.calculateBtn} onPress={handleCalculate}>
        <Text style={styles.calculateBtnText}>
          Calculate ROI & Rental Yield
        </Text>
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
      style={styles.calcContainer}
      showsVerticalScrollIndicator={false}
    >
      <CalculatorHeader type="emi" />

      <InfoCardsSummary type="emi" />

      {/* Property Details */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Property Details</Text>
        <View style={[styles.gridRow, { zIndex: 10 }]}>
          <View style={styles.inputCol}>
            <Dropdown
              row
              label="Property Type"
              options={['Residential Space', 'Commercial Space']}
              selected={formData.propertyType}
              onSelect={val => handleInputChange('propertyType', val)}
            />
          </View>
          <View style={styles.inputCol}>
            <Text style={styles.label}>Carpet Area (sq ft)</Text>
            <TextInput
              style={styles.input}
              placeholder="5600"
              keyboardType="numeric" type={Platform.OS === 'web' ? 'number' : undefined}
              value={formData.carpetArea}
              onChangeText={v => handleInputChange('carpetArea', v)}
              placeholderTextColor="#999"
            />
          </View>
        </View>
        <View style={styles.gridRow}>
          <View style={styles.inputCol}>
            <Text style={styles.label}>Purchase Price (₹)</Text>
            <TextInput
              style={styles.input}
              placeholder="400000"
              keyboardType="numeric" type={Platform.OS === 'web' ? 'number' : undefined}
              value={formData.purchasePrice}
              onChangeText={v => handleInputChange('purchasePrice', v)}
              placeholderTextColor="#999"
            />
          </View>
        </View>
      </View>

      {/* EMI Options */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>EMI Options</Text>
          <View style={styles.toggleRow}>
            <Text style={[styles.label, { marginBottom: 0, fontSize: 12 }]}>
              Include Downpayment
            </Text>
            <Switch
              value={includeLoan}
              onValueChange={setIncludeLoan}
              trackColor={{ false: '#767577', true: '#EE2529' }}
              thumbColor={'#fff'}
            />
          </View>
        </View>
        <Text style={styles.sectionNote}>
          Note: Loan amount cannot exceed the property purchase price.
        </Text>
        <View style={styles.gridRow}>
          <View style={styles.inputCol}>
            <Text style={styles.label}>Loan Amount (₹)</Text>
            <TextInput
              style={[styles.input, !includeLoan && styles.inputDisabled]}
              placeholder="310000"
              keyboardType="numeric" type={Platform.OS === 'web' ? 'number' : undefined}
              value={formData.loanAmount}
              onChangeText={v => handleInputChange('loanAmount', v)}
              editable={includeLoan}
              placeholderTextColor="#999"
            />
          </View>
          <View style={styles.inputCol}>
            <Text style={styles.label}>Down Payment (₹)</Text>
            <TextInput
              style={[styles.input, !includeLoan && styles.inputDisabled]}
              placeholder="130000"
              keyboardType="numeric" type={Platform.OS === 'web' ? 'number' : undefined}
              value={formData.downPayment}
              onChangeText={v => handleInputChange('downPayment', v)}
              editable={includeLoan}
              placeholderTextColor="#999"
            />
          </View>
        </View>
        <View style={styles.gridRow}>
          <View style={styles.inputCol}>
            <Text style={styles.label}>Interest (% per annum)</Text>
            <TextInput
              style={[styles.input, !includeLoan && styles.inputDisabled]}
              placeholder="9.5"
              keyboardType="numeric" type={Platform.OS === 'web' ? 'number' : undefined}
              value={formData.interestRate}
              onChangeText={v => handleInputChange('interestRate', v)}
              editable={includeLoan}
              placeholderTextColor="#999"
            />
          </View>
          <View style={styles.inputCol}>
            <Text style={styles.label}>Loan Tenure (Years)</Text>
            <TextInput
              style={[styles.input, !includeLoan && styles.inputDisabled]}
              placeholder="20"
              keyboardType="numeric" type={Platform.OS === 'web' ? 'number' : undefined}
              value={formData.loanTenure}
              onChangeText={v => handleInputChange('loanTenure', v)}
              editable={includeLoan}
              placeholderTextColor="#999"
            />
          </View>
        </View>
      </View>

      {/* Rental Details */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Rental Details</Text>
        <View style={styles.gridRow}>
          <View style={styles.inputCol}>
            <Text style={styles.label}>Monthly Rent (₹)</Text>
            <TextInput
              style={styles.input}
              placeholder="30000"
              keyboardType="numeric" type={Platform.OS === 'web' ? 'number' : undefined}
              value={formData.monthlyRent}
              onChangeText={v => handleInputChange('monthlyRent', v)}
              placeholderTextColor="#999"
            />
          </View>
          <View style={styles.inputCol}>
            <Text style={styles.label}>Security Deposit (₹)</Text>
            <TextInput
              style={styles.input}
              placeholder="300000"
              keyboardType="numeric" type={Platform.OS === 'web' ? 'number' : undefined}
              value={formData.securityDeposit}
              onChangeText={v => handleInputChange('securityDeposit', v)}
              placeholderTextColor="#999"
            />
          </View>
        </View>
        <View style={styles.gridRow}>
          <View style={styles.inputCol}>
            <Text style={styles.label}>Days Calculation Gregorian</Text>
            <TextInput
              style={styles.input}
              placeholder="3"
              keyboardType="numeric" type={Platform.OS === 'web' ? 'number' : undefined}
              value={formData.daysCalculation}
              onChangeText={v => handleInputChange('daysCalculation', v)}
              placeholderTextColor="#999"
            />
          </View>
          <View style={styles.inputCol}>
            <Text style={styles.label}>Rent Escalation (% per year)</Text>
            <TextInput
              style={styles.input}
              placeholder="8"
              keyboardType="numeric" type={Platform.OS === 'web' ? 'number' : undefined}
              value={formData.rentEscalation}
              onChangeText={v => handleInputChange('rentEscalation', v)}
              placeholderTextColor="#999"
            />
          </View>
        </View>
        <View style={styles.gridRow}>
          <View style={styles.inputCol}>
            <Text style={styles.label}>Lease Start Date *</Text>
            <TextInput
              style={styles.input}
              placeholder="DD/MM/YYYY"
              value={formData.leaseStartDate}
              onChangeText={v => handleInputChange('leaseStartDate', v)}
              placeholderTextColor="#999"
            />
          </View>
          <View style={styles.inputCol}>
            <Text style={styles.label}>Lease Term (Yrs) *</Text>
            <TextInput
              style={styles.input}
              placeholder="10"
              keyboardType="numeric" type={Platform.OS === 'web' ? 'number' : undefined}
              value={formData.leaseTerm}
              onChangeText={v => handleInputChange('leaseTerm', v)}
              placeholderTextColor="#999"
            />
          </View>
        </View>

        <BalanceLeaseTenureAlert />
      </View>

      {/* Recurring Expenses */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Recurring Expenses (Annual)</Text>
        <View style={styles.gridRow}>
          <View style={styles.inputCol}>
            <Text style={styles.label}>Property Tax (₹)</Text>
            <TextInput
              style={styles.input}
              placeholder="12000"
              keyboardType="numeric" type={Platform.OS === 'web' ? 'number' : undefined}
              value={formData.propertyTax}
              onChangeText={v => handleInputChange('propertyTax', v)}
              placeholderTextColor="#999"
            />
          </View>
          <View style={styles.inputCol}>
            <Text style={styles.label}>Maintenance per sq ft (₹)</Text>
            <TextInput
              style={styles.input}
              placeholder="30000"
              keyboardType="numeric" type={Platform.OS === 'web' ? 'number' : undefined}
              value={formData.maintenance}
              onChangeText={v => handleInputChange('maintenance', v)}
              placeholderTextColor="#999"
            />
          </View>
        </View>
        <View style={styles.gridRow}>
          <View style={styles.inputCol}>
            <Text style={styles.label}>Insurance (₹)</Text>
            <TextInput
              style={styles.input}
              placeholder="8000"
              keyboardType="numeric" type={Platform.OS === 'web' ? 'number' : undefined}
              value={formData.insurance}
              onChangeText={v => handleInputChange('insurance', v)}
              placeholderTextColor="#999"
            />
          </View>
          <View style={styles.inputCol}>
            <Text style={styles.label}>Maintenance Lump sum (₹)</Text>
            <TextInput
              style={styles.input}
              placeholder="58000"
              keyboardType="numeric" type={Platform.OS === 'web' ? 'number' : undefined}
              value={formData.maintenanceLumpsum}
              onChangeText={v => handleInputChange('maintenanceLumpsum', v)}
              placeholderTextColor="#999"
            />
          </View>
        </View>
      </View>

      {/* One-time Costs */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>One-time Costs</Text>
        <View style={styles.gridRow}>
          <View style={styles.inputCol}>
            <Text style={styles.label}>Stamp Duty (%)</Text>
            <TextInput
              style={styles.input}
              placeholder="12"
              keyboardType="numeric" type={Platform.OS === 'web' ? 'number' : undefined}
              value={formData.stampDuty}
              onChangeText={v => handleInputChange('stampDuty', v)}
              placeholderTextColor="#999"
            />
          </View>
          <View style={styles.inputCol}>
            <Text style={styles.label}>Legal Fees (₹)</Text>
            <TextInput
              style={styles.input}
              placeholder="38000"
              keyboardType="numeric" type={Platform.OS === 'web' ? 'number' : undefined}
              value={formData.legalFees}
              onChangeText={v => handleInputChange('legalFees', v)}
              placeholderTextColor="#999"
            />
          </View>
        </View>
        <View style={styles.gridRow}>
          <View style={styles.inputCol}>
            <Text style={styles.label}>Brokerage (₹)</Text>
            <TextInput
              style={styles.input}
              placeholder="67500"
              keyboardType="numeric" type={Platform.OS === 'web' ? 'number' : undefined}
              value={formData.brokerage}
              onChangeText={v => handleInputChange('brokerage', v)}
              placeholderTextColor="#999"
            />
          </View>
          <View style={styles.inputCol}>
            <Text style={styles.label}>Other One-time Costs (₹)</Text>
            <TextInput
              style={styles.input}
              placeholder="25000"
              keyboardType="numeric" type={Platform.OS === 'web' ? 'number' : undefined}
              value={formData.otherCosts}
              onChangeText={v => handleInputChange('otherCosts', v)}
              placeholderTextColor="#999"
            />
          </View>
        </View>
      </View>

      {/* Calculate Button */}
      <TouchableOpacity style={styles.calculateBtn} onPress={handleCalculate}>
        <Text style={styles.calculateBtnText}>
          Calculate ROI & Rental Yield
        </Text>
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
    minHeight: '100%',
    paddingBottom: 40,  
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
    paddingLeft: '8%',
    paddingRight: 0,
    minHeight: 380,
  },
  heroTextContainer: {
    flex: 1,
    minWidth: 300,
    marginRight: 20,
    paddingTop: 20,
  },
  redIconBox: {
    backgroundColor: '#EE2529',
    padding: 4,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#EE2529',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    height: 70,
    width: 70,
  },
  heroStatsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 20,
  },
  heroStatCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    minWidth: 160,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 10,
    elevation: 3,
  },
  heroStatLabel: {
    fontSize: 15,
    color: '#767676',
    fontWeight: '600',
    marginBottom: 3,
    textAlign: 'center',
  },
  heroStatValue: {
    fontSize: 16,
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
    width: 400,
    height: 200,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 0,
    marginTop: 155,
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
    fontSize: 14,
    color: '#767676',
    fontWeight: '700',
  },
  activeTabText: {
    color: '#EE2529',
    fontWeight: 'bold',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    width: '50%',
    height: 6,
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
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 14,
    color: '#333',
    textAlign: 'center',
  },
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#EE2529',
    marginBottom: 8,
  },
  sectionNote: {
    color: '#6B7280',
    fontSize: 13,
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
    fontSize: 13,
    marginBottom: 0,
    color: '#555',
    fontWeight: '400',
    width: '35%',
    textAlign: 'left',
  },
  input: {
    flex: 1,
    backgroundColor: '#F6F6F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 13,
    color: '#111827',
    fontWeight: '600',
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
    backgroundColor: '#EE2529',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
    shadowColor: '#EE2529',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    maxWidth: 250,
    alignSelf: 'center',
  },
  calculateBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
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
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    minHeight: 40,
  },
  dropdownHeaderRow: {
    flex: 1,
  },
  dropdownHeaderText: {
    fontSize: 13,
    color: '#111827',
    fontWeight: '600',
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
    fontSize: 14,
    color: '#555',
  },
  activeDropdownItemText: {
    color: '#EE2529',
    fontWeight: 'bold',
  },
  infoCardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 30,
    marginTop: 8,
    width: '100%',
    maxWidth: '72%',
    alignSelf: 'center',
  },
  infoSummaryCard: {
    flex: 1,
    minWidth: 120,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderBottomWidth: 3,
    borderBottomColor: '#EE2529',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoSummaryText: {
    fontSize: 13,
    lineHeight: 18,
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
    fontSize: 16,
    color: '#767676',
    fontWeight: '600',
    marginBottom: 5,
  },
  alertValue: {
    color: '#EE2529',
    fontSize: 20,
    fontWeight: 'bold',
  },
  alertSubtitle: {
    fontSize: 14,
    color: '#767676',
    lineHeight: 18,
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
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
    color: '#6B7280',
    textAlign: 'center',
    maxWidth: '85%',
    marginBottom: 4,
  },
});

export default CalculatorsScreen;
