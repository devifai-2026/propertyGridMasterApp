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
  Dimensions,
} from 'react-native';
import Layout from '../../layout/Layout';
import { TrendingUp, Calculator } from 'lucide-react-native';
import Svg, {
  Circle,
  Rect,
  G,
  Text as SvgText,
  Path,
  Line as SvgLine,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';

const { width } = Dimensions.get('window');

const CalculatorsScreen = () => {
  const [activeTab, setActiveTab] = useState<'roi' | 'emi'>('roi');

  return (
    <Layout>
      <View style={styles.container}>
        {/* Header/Hero Section */}
        <View style={styles.heroSection}>
          <Image
            source={require('../../assets/propertyDetails/squaresbg.png')}
            style={styles.heroBg}
            resizeMode="cover"
          />
          <View style={styles.heroContent}>
            <View style={styles.heroTextContainer}>
              <View style={styles.badgeContainer}>
                <Text style={styles.badgeText}>
                  Professional Investment Tools
                </Text>
              </View>
              <Text style={styles.heroTitle}>Property Investment Platform</Text>
              <Text style={styles.heroSubtitle}>
                Make data-driven decisions with comprehensive ROI analysis, loan
                coverage insights, and detailed cash flow projections.
              </Text>

              <View style={styles.statsRow}>
                <View style={styles.statCard}>
                  <Text style={styles.statLabel}>Yield Analysis</Text>
                  <Text style={styles.statValue}>Gross & Net Returns</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statLabel}>Loan Planning</Text>
                  <Text style={styles.statValue}>EMI & Coverage Ratio</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statLabel}>Cash Flow</Text>
                  <Text style={styles.statValue}>10-Year Projections</Text>
                </View>
              </View>
            </View>

            <Image
              source={require('../../assets/Calculator/bannerImg.png')}
              style={styles.heroImage}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Calculator Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setActiveTab('roi')}
          >
            <TrendingUp
              size={24}
              color={activeTab === 'roi' ? '#EE2529' : '#767676'}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === 'roi' && styles.activeTabText,
              ]}
            >
              ROI & Rental Yield
            </Text>
            {activeTab === 'roi' && <View style={styles.activeIndicator} />}
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setActiveTab('emi')}
          >
            <Calculator
              size={24}
              color={activeTab === 'emi' ? '#EE2529' : '#767676'}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === 'emi' && styles.activeTabText,
              ]}
            >
              EMI Calculator
            </Text>
            {activeTab === 'emi' && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        </View>

        {/* Content Area */}
        <View style={styles.contentArea}>
          {activeTab === 'roi' ? (
            <RentalYieldCalculator />
          ) : (
            <EMICalculatorView />
          )}
        </View>
      </View>
    </Layout>
  );
};

const ExpensePieChart = () => {
  const data = [
    { name: 'Annual Loan EMI', value: 84, color: '#4A4A4A' },
    { name: 'Maintenance', value: 7, color: '#FFA500' },
    { name: 'Property Tax', value: 3, color: '#20B2AA' },
    { name: 'Insurance', value: 2, color: '#FF6B6B' },
    { name: 'Other', value: 4, color: '#87CEEB' },
  ];

  const total = 100;
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  let accumulatedOffset = 0;

  return (
    <View style={styles.chartWrapper}>
      <Text style={styles.chartTitle}>Annual Expense Breakdown</Text>
      <View style={styles.chartRow}>
        <Svg height="150" width="150" viewBox="0 0 150 150">
          <G rotation="-90" origin="75, 75">
            {data.map((item, index) => {
              const strokeDasharray = `${
                (item.value / total) * circumference
              } ${circumference}`;
              const strokeDashoffset = -accumulatedOffset;
              accumulatedOffset += (item.value / total) * circumference;

              return (
                <Circle
                  key={index}
                  cx="75"
                  cy="75"
                  r={radius}
                  stroke={item.color}
                  strokeWidth="20"
                  fill="transparent"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                />
              );
            })}
            {/* Inner White Circle to clean up edges if needed, or text in middle */}
            <SvgText
              x="75"
              y="80"
              textAnchor="middle"
              fontSize="18"
              fontWeight="bold"
              fill="#333"
            >
              Exp
            </SvgText>
          </G>
        </Svg>
        <View style={styles.legendContainer}>
          {data.map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View
                style={[styles.legendColor, { backgroundColor: item.color }]}
              />
              <Text style={styles.legendText}>
                {item.name} ({item.value}%)
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const YieldBarChart = () => {
  const data = [
    { name: 'Gross', value: 13.33, color: '#C73834' },
    { name: 'Net', value: 12.11, color: '#26BFCC' },
  ];
  const chartHeight = 150;
  const chartWidth = 200;
  const maxVal = 16;

  return (
    <View style={styles.chartWrapper}>
      <Text style={styles.chartTitle}>Rental Yield Comparison</Text>
      <View style={{ alignItems: 'center' }}>
        <Svg height={chartHeight + 30} width={chartWidth}>
          {/* Axis Line */}
          <SvgLine
            x1="10"
            y1={chartHeight}
            x2={chartWidth - 10}
            y2={chartHeight}
            stroke="#ddd"
            strokeWidth="2"
          />

          {data.map((item, index) => {
            const barHeight = (item.value / maxVal) * chartHeight;
            const x = 50 + index * 80;
            const y = chartHeight - barHeight;
            return (
              <G key={index}>
                <Rect
                  x={x}
                  y={y}
                  width="40"
                  height={barHeight}
                  fill={item.color}
                  rx="4"
                />
                <SvgText
                  x={x + 20}
                  y={y - 10}
                  fill={item.color}
                  fontSize="12"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {item.value}%
                </SvgText>
                <SvgText
                  x={x + 20}
                  y={chartHeight + 20}
                  fill="#555"
                  fontSize="12"
                  textAnchor="middle"
                >
                  {item.name}
                </SvgText>
              </G>
            );
          })}
        </Svg>
      </View>
    </View>
  );
};

const CashflowLineChart = () => {
  // Mock Data for Cashflow: Year 1 to 10
  const data = [
    { year: 1, flow: -44 },
    { year: 2, flow: -38 },
    { year: 3, flow: -33 },
    { year: 4, flow: -28 },
    { year: 5, flow: -22 },
    { year: 6, flow: -16 },
    { year: 7, flow: -10 },
    { year: 8, flow: -4 },
    { year: 9, flow: 2 },
    { year: 10, flow: 8 },
  ];

  const chartHeight = 200;
  const chartWidth = width - 60;
  const minVal = -50;
  const maxVal = 10;
  const range = maxVal - minVal;

  // Helper to map Value to Y coordinate
  const getY = (val: number) => {
    return chartHeight - ((val - minVal) / range) * chartHeight;
  };

  // Helper to map Year to X coordinate
  const getX = (index: number) => {
    return (index / (data.length - 1)) * chartWidth;
  };

  // Generate Path
  let pathD = `M ${getX(0)} ${getY(data[0].flow)}`;
  data.forEach((item, index) => {
    if (index === 0) return;
    pathD += ` L ${getX(index)} ${getY(item.flow)}`;
  });

  return (
    <View style={styles.chartWrapper}>
      <Text style={styles.chartTitle}>Cash Flow Projections (Cumulative)</Text>
      <Svg height={chartHeight + 40} width={chartWidth + 20}>
        {/* Zero Line */}
        <SvgLine
          x1="0"
          y1={getY(0)}
          x2={chartWidth}
          y2={getY(0)}
          stroke="#ccc"
          strokeWidth="1"
          strokeDasharray="5, 5"
        />

        {/* Y Axis Line */}
        <SvgLine
          x1="0"
          y1="0"
          x2="0"
          y2={chartHeight}
          stroke="#ddd"
          strokeWidth="1"
        />

        {/* Data Line */}
        <Path d={pathD} fill="none" stroke="#F7C952" strokeWidth="3" />

        {/* Dots */}
        {data.map((item, index) => (
          <Circle
            key={index}
            cx={getX(index)}
            cy={getY(item.flow)}
            r="3"
            fill="#F7C952"
          />
        ))}

        {/* X Axis Labels */}
        {data.map((item, index) => (
          <SvgText
            key={index}
            x={getX(index)}
            y={chartHeight + 20}
            fontSize="10"
            fill="#767676"
            textAnchor="middle"
          >
            Y{item.year}
          </SvgText>
        ))}
      </Svg>
      <Text style={[styles.legendText, { marginTop: 10 }]}>
        Cumulative Cash Flow (₹ Lakhs)
      </Text>
    </View>
  );
};

const PerformanceAnalytics = () => (
  <View style={styles.sectionCard}>
    <Text style={styles.sectionTitle}>Performance Analytics</Text>
    <ExpensePieChart />
    <YieldBarChart />
    <CashflowLineChart />
  </View>
);

const RentalYieldCalculator = () => {
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

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <ScrollView
      style={styles.calcContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <Text style={styles.calcTitle}>Rental Yield Calculator</Text>

      {/* Property Details */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Property Details</Text>

        {/* Type Selector */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Property Type</Text>
          <View style={styles.typeSelector}>
            {['Residential Space', 'Commercial Space', 'Mixed Use'].map(
              type => (
                <TouchableOpacity
                  key={type}
                  onPress={() => handleInputChange('propertyType', type)}
                  style={[
                    styles.typeBtn,
                    formData.propertyType === type && styles.activeTypeBtn,
                  ]}
                >
                  <Text
                    style={[
                      styles.typeBtnText,
                      formData.propertyType === type &&
                        styles.activeTypeBtnText,
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ),
            )}
          </View>
        </View>

        <View style={styles.gridRow}>
          <View style={styles.inputCol}>
            <Text style={styles.label}>Carpet Area (sq ft)</Text>
            <TextInput
              style={styles.input}
              placeholder="5000"
              keyboardType="numeric"
              value={formData.carpetArea}
              onChangeText={v => handleInputChange('carpetArea', v)}
              placeholderTextColor="#999"
            />
          </View>
          <View style={styles.inputCol}>
            <Text style={styles.label}>Purchase Price (₹)</Text>
            <TextInput
              style={styles.input}
              placeholder="45,00,000"
              keyboardType="numeric"
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

        {includeLoan && (
          <>
            <View style={styles.gridRow}>
              <View style={styles.inputCol}>
                <Text style={styles.label}>Loan Amount (₹)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="31,50,000"
                  keyboardType="numeric"
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
                  keyboardType="numeric"
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
                  keyboardType="numeric"
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
                  keyboardType="numeric"
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
              keyboardType="numeric"
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
              keyboardType="numeric"
              value={formData.securityDeposit}
              onChangeText={v => handleInputChange('securityDeposit', v)}
              placeholderTextColor="#999"
            />
          </View>
        </View>
        <View style={styles.gridRow}>
          <View style={styles.inputCol}>
            <Text style={styles.label}>Escalation Every (Yrs)</Text>
            <TextInput
              style={styles.input}
              placeholder="3"
              keyboardType="numeric"
              value={formData.rentEscalationEvery}
              onChangeText={v => handleInputChange('rentEscalationEvery', v)}
              placeholderTextColor="#999"
            />
          </View>
          <View style={styles.inputCol}>
            <Text style={styles.label}>Escalation (% / yr)</Text>
            <TextInput
              style={styles.input}
              placeholder="8"
              keyboardType="numeric"
              value={formData.rentEscalationPercent}
              onChangeText={v => handleInputChange('rentEscalationPercent', v)}
              placeholderTextColor="#999"
            />
          </View>
        </View>
        <View style={styles.gridRow}>
          <View style={styles.inputCol}>
            <Text style={styles.label}>Lease Term (Months)</Text>
            <TextInput
              style={styles.input}
              placeholder="10"
              keyboardType="numeric"
              value={formData.leaseTerm}
              onChangeText={v => handleInputChange('leaseTerm', v)}
              placeholderTextColor="#999"
            />
          </View>
        </View>
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
              keyboardType="numeric"
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
              keyboardType="numeric"
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
              keyboardType="numeric"
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
              keyboardType="numeric"
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
              keyboardType="numeric"
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
              keyboardType="numeric"
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
              keyboardType="numeric"
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
              keyboardType="numeric"
              value={formData.otherCosts}
              onChangeText={v => handleInputChange('otherCosts', v)}
              placeholderTextColor="#999"
            />
          </View>
        </View>
      </View>

      {/* Calculate Button */}
      <TouchableOpacity style={styles.calculateBtn}>
        <Text style={styles.calculateBtnText}>
          Calculate ROI & Rental Yield
        </Text>
      </TouchableOpacity>

      {/* Result Section (Placeholder for detailed cards) */}
      <View style={styles.resultBox}>
        <Text style={styles.resultLabel}>Projected Annual Yield</Text>
        <Text style={styles.resultValue}>0.0%</Text>
        <Text style={[styles.resultLabel, { marginTop: 10 }]}>
          Please fill in details to see comprehensive analysis
        </Text>
      </View>

      <PerformanceAnalytics />
    </ScrollView>
  );
};

const EMICalculatorView = () => (
  <ScrollView style={styles.calcContainer} showsVerticalScrollIndicator={false}>
    <Text style={styles.calcTitle}>EMI Calculator</Text>
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>Loan Details</Text>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Loan Amount (₹)</Text>
        <TextInput
          style={styles.input}
          placeholder="30,00,000"
          keyboardType="numeric"
          placeholderTextColor="#999"
        />
      </View>
      <View style={styles.gridRow}>
        <View style={styles.inputCol}>
          <Text style={styles.label}>Interest Rate (%)</Text>
          <TextInput
            style={styles.input}
            placeholder="8.5"
            keyboardType="numeric"
            placeholderTextColor="#999"
          />
        </View>
        <View style={styles.inputCol}>
          <Text style={styles.label}>Tenure (Years)</Text>
          <TextInput
            style={styles.input}
            placeholder="20"
            keyboardType="numeric"
            placeholderTextColor="#999"
          />
        </View>
      </View>
    </View>

    <TouchableOpacity style={styles.calculateBtn}>
      <Text style={styles.calculateBtnText}>Calculate EMI</Text>
    </TouchableOpacity>

    <View style={styles.resultBox}>
      <Text style={styles.resultLabel}>Monthly EMI</Text>
      <Text style={styles.resultValue}>₹ 26,035</Text>
    </View>
  </ScrollView>
);

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
    height: 400,
    resizeMode: 'cover',
    opacity: 0.1,
  },
  heroContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroTextContainer: {
    flex: 1,
    minWidth: 300,
    marginRight: 20,
  },
  badgeContainer: {
    backgroundColor: '#FFF3CA',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  badgeText: {
    fontSize: 12,
    color: '#767676',
    fontWeight: 'bold',
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#262626',
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    lineHeight: 20,
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
    width: 300,
    height: 200,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginHorizontal: 20,
    padding: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    position: 'relative',
  },
  tabText: {
    marginTop: 5,
    fontSize: 16,
    color: '#767676',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#EE2529',
    fontWeight: 'bold',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -10,
    width: '80%',
    height: 3,
    backgroundColor: '#EE2529',
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: '#EE2529',
    marginHorizontal: 10,
  },
  contentArea: {
    paddingHorizontal: 20,
  },
  calcContainer: {
    padding: 10,
  },
  calcTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#EE2529',
    marginBottom: 15,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 15,
  },
  inputCol: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: '#555',
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
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
    color: '#d62d2d', // Darker red for text
  },
  calculateBtn: {
    backgroundColor: '#EE2529',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
    shadowColor: '#EE2529',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  calculateBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultBox: {
    marginTop: 0,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EE2529',
    marginBottom: 40,
  },
  resultLabel: {
    fontSize: 14,
    color: '#767676',
    textAlign: 'center',
  },
  resultValue: {
    fontSize: 24,
    color: '#EE2529',
    fontWeight: 'bold',
    marginTop: 5,
    textAlign: 'center',
  },
  chartWrapper: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#eee',
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 20,
  },
  legendContainer: {
    marginLeft: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 2,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: '#333',
  },
});

export default CalculatorsScreen;
