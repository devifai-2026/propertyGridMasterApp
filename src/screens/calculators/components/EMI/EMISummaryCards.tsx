import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TrendingUp, Calendar } from 'lucide-react-native';

interface EMISummaryCardsProps {
  data?: {
    monthlyEMI?: number;
    totalInterest?: number;
    totalPayment?: number;
    loanAmount?: number;
    interestRate?: string;
    loanTenure?: string;
    propertyPrice?: number;
    monthlyRent?: number;
    downPayment?: number;
  };
}

import { useWindowDimensions } from 'react-native';

const EMISummaryCards = ({ data }: EMISummaryCardsProps) => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const isTablet = width >= 768 && width < 1024;

  const cardWidth = isDesktop ? '24%' : isTablet ? '48%' : '100%';

  const formatCurrency = (val?: number) => {
    if (val === undefined) return '0';
    return val.toLocaleString('en-IN', { maximumFractionDigits: 0 });
  };

  const monthlyRent = 50000; // Placeholder or from data if I add it to results
  const rentCoverage = data?.monthlyEMI ? ((monthlyRent / data.monthlyEMI) * 100).toFixed(1) : '0';
  const monthlyCashFlow = data?.monthlyEMI ? (monthlyRent - data.monthlyEMI) : 0;

  return (
    <View>
      {/* Main Result Cards - 4 Cards Grid */}
      <View style={styles.resultsGrid}>
        {/* Card 1 - Monthly EMI */}
        <View style={[styles.resultCard, styles.card1, { width: cardWidth }]}>
          <View style={styles.cardContent}>
            <Text style={styles.resultCardTitle}>Monthly EMI</Text>
            <Text style={[styles.resultCardValue, { color: '#C73834' }]}>₹{formatCurrency(data?.monthlyEMI)}</Text>
          </View>
          <Text style={styles.resultCardSubtitle}>Fixed monthly payment</Text>
          <View style={styles.descContainer}>
            <Text style={styles.resultCardDesc}>Fixed loan payment.</Text>
            <Text style={styles.resultCardDesc}>Tracks monthly liability.</Text>
          </View>
        </View>

        {/* Card 2 - Rent Coverage */}
        <View style={[styles.resultCard, styles.card2, { width: cardWidth }]}>
          <View style={styles.cardContent}>
            <Text style={styles.resultCardTitle}>Rent Coverage</Text>
            <Text style={[styles.resultCardValue, { color: '#26BFCC' }]}>{rentCoverage}%</Text>
          </View>
          <Text style={styles.resultCardSubtitle}>% Rent vs EMI ratio</Text>
          <View style={styles.descContainer}>
            <Text style={styles.resultCardDesc}>Rent ÷ EMI.</Text>
            <Text style={styles.resultCardDesc}>Higher = safer cash flow</Text>
          </View>
        </View>

        {/* Card 3 - Monthly Cash Flow */}
        <View style={[styles.resultCard, styles.card3, { width: cardWidth }]}>
          <View style={styles.cardHeader}>
            <Text style={styles.resultCardTitle}>Monthly Cash Flow</Text>
            <TrendingUp size={24} color="#429482" />
          </View>
          <Text style={[styles.resultCardValue, { color: '#429482' }]}>₹{formatCurrency(monthlyCashFlow)}</Text>
          <Text style={styles.resultCardSubtitle}>$ Rent minus EMI</Text>
          <View style={styles.descContainer}>
            <Text style={styles.resultCardDesc}>Net income after EMI.</Text>
            <Text style={styles.resultCardDesc}>Shows monthly profit</Text>
          </View>
        </View>

        {/* Card 4 - Payback Period */}
        <View style={[styles.resultCard, styles.card4, { width: cardWidth }]}>
          <View style={styles.cardHeader}>
            <Text style={styles.resultCardTitle}>Payback Period</Text>
            <Calendar size={24} color="#F7C952" />
          </View>
          <Text style={[styles.resultCardValue, { color: '#F7C952' }]}>9.1 years</Text>
          <Text style={styles.resultCardSubtitle}>Time to break even</Text>
          <View style={styles.descContainer}>
            <Text style={styles.resultCardDesc}>Years to recover cost.</Text>
            <Text style={styles.resultCardDesc}>Shorter = quicker returns.</Text>
          </View>
        </View>
      </View>

      {/* Summary Cards Section - 2 Cards */}
      <View style={[styles.summarySection, !isDesktop && { flexDirection: 'column' }]}>
        {/* Loan Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Loan Summary</Text>
          <View style={styles.summaryContent}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Loan Amount (₹)</Text>
              <Text style={styles.summaryValue}>{formatCurrency(data?.loanAmount)}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Monthly EMI (₹)</Text>
              <Text style={styles.summaryValue}>{formatCurrency(data?.monthlyEMI)}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Interest Payable (₹)</Text>
              <Text style={styles.summaryValue}>{formatCurrency(data?.totalInterest)}</Text>
            </View>
          </View>
          <View style={styles.dividerLine} />
          <View style={styles.summaryItemTotal}>
            <Text style={styles.summaryLabelBold}>Total Repayment (₹)</Text>
            <Text style={[styles.summaryValueTotal, { color: '#429482' }]}>{formatCurrency(data?.totalPayment)}</Text>
          </View>
        </View>

        {/* Investment Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Investment Summary</Text>
          <View style={styles.summaryContent}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Initial Cost (₹)</Text>
              <Text style={styles.summaryValue}>{formatCurrency(data?.downPayment)}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Monthly Rental Income (₹)</Text>
              <Text style={styles.summaryValue}>{formatCurrency(monthlyRent)}</Text>
            </View>
          </View>
          <View style={styles.dividerLine} />
          <View style={styles.summaryItemTotal}>
            <Text style={styles.summaryLabelBold}>Net Monthly Cash Flow (₹)</Text>
            <Text style={[styles.summaryValueTotal, { color: '#429482' }]}>{formatCurrency(monthlyCashFlow)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Top 4 Cards Grid
  resultsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 40,
  },
  resultCard: {
    width: '24%',
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    gap: 8,
  },
  card1: {
    borderColor: '#C73834',
    backgroundColor: '#FDEDEE',
  },
  card2: {
    borderColor: '#010202',
    backgroundColor: '#D7EFF7',
  },
  card3: {
    borderColor: '#26BFCC',
    backgroundColor: '#D7EFF7',
  },
  card4: {
    borderColor: '#F7C952CC',
    backgroundColor: '#FFFCF4',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardContent: {
    gap: 4,
  },
  resultCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'Montserrat',
  },
  resultCardValue: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Montserrat',
  },
  resultCardSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Montserrat',
  },
  descContainer: {
    gap: 8,
  },
  resultCardDesc: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 18,
    fontFamily: 'Montserrat',
  },

  // Bottom 2 Summary Cards
  summarySection: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 40,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    padding: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  summaryTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#EE2529',
    marginBottom: 12,
    fontFamily: 'Montserrat',
  },
  summaryContent: {
    gap: 20,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 18,
    color: '#767676',
    marginRight: 16,
    flexShrink: 1,
    fontFamily: 'Montserrat',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    fontFamily: 'Montserrat',
  },
  dividerLine: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginTop: 20,
    marginBottom: 20,
  },
  summaryItemTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabelBold: {
    fontSize: 18,
    color: '#000000',
    fontWeight: '600',
    fontFamily: 'Montserrat',
  },
  summaryValueTotal: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Montserrat',
  },
});

export default EMISummaryCards;
