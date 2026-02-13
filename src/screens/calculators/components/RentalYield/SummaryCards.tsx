import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { Calendar, TrendingUp } from 'lucide-react-native';

const SummaryCards = () => {
  const { width } = useWindowDimensions();

  const isDesktop = width >= 1024;
  const isTablet = width >= 768 && width < 1024;

  const summaryCardWidth = isDesktop ? '48%' : '100%';

  const topCardWidth = isDesktop ? '23%' : isTablet ? '48%' : '100%';

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* TOP 4 CARDS */}
      <View style={styles.topGrid}>
        {/* Monthly EMI */}
        <View style={[styles.card, styles.emiCard, { width: topCardWidth }]}>
          <Text style={styles.cardTitle}>Monthly EMI</Text>
          <Text style={[styles.valueRed]}>₹40,760.231</Text>
          <Text style={styles.subText}>Fixed monthly payment</Text>
          <Text style={styles.subText}>Fixed loan payment.</Text>
          <Text style={styles.subText}>Tracks monthly liability.</Text>
        </View>

        {/* Rent Coverage */}
        <View
          style={[styles.card, styles.coverageCard, { width: topCardWidth }]}
        >
          <Text style={styles.cardTitle}>Rent Coverage</Text>
          <Text style={styles.valueBlue}>122.7%</Text>
          <Text style={styles.subText}>% Rent vs EMI ratio</Text>
          <Text style={styles.subText}>Rent ÷ EMI.</Text>
          <Text style={styles.subText}>Higher = safer cash flow</Text>
        </View>

        {/* Monthly Cash Flow */}
        <View
          style={[styles.card, styles.cashFlowCard, { width: topCardWidth }]}
        >
          <View style={styles.rowBetween}>
            <Text style={styles.cardTitle}>Monthly Cash Flow</Text>
            <TrendingUp size={20} color="#429482" />
          </View>
          <Text style={styles.valueGreen}>₹9,239.769</Text>
          <Text style={styles.subText}>Rent minus EMI</Text>
          <Text style={styles.subText}>Net income after EMI.</Text>
          <Text style={styles.subText}>Shows monthly profit</Text>
        </View>

        {/* Payback Period */}
        <View
          style={[styles.card, styles.paybackCard, { width: topCardWidth }]}
        >
          <View style={styles.rowBetween}>
            <Text style={styles.cardTitle}>Payback Period</Text>
            <Calendar size={20} color="#F7C952" />
          </View>
          <Text style={styles.valueYellow}>9.1 years</Text>
          <Text style={styles.subText}>Time to break even</Text>
          <Text style={styles.subText}>Years to recover cost.</Text>
          <Text style={styles.subText}>Shorter = quicker returns.</Text>
        </View>
      </View>

      {/* SUMMARY SECTION */}
      <View style={styles.summaryGrid}>
        {/* Loan Summary */}
        <View style={[styles.summaryCard, { width: summaryCardWidth }]}>
          <Text style={styles.summaryTitle}>Loan Summary</Text>

          <SummaryRow label="Loan Amount (₹)" value="31,50,000" />
          <SummaryRow label="Monthly EMI (₹)" value="40,760.231" />
          <SummaryRow
            label="Total Interest Payable (₹)"
            value="17,41,227.676"
          />

          <View style={styles.divider} />

          <SummaryRow
            label="Total Repayment (₹)"
            value="48,91,227.676"
            highlight
          />
        </View>

        {/* Investment Summary */}
        <View style={[styles.summaryCard, { width: summaryCardWidth }]}>
          <Text style={styles.summaryTitle}>Investment Summary</Text>

          <SummaryRow label="Total Initial Cost (₹)" value="17,25,000" />
          <SummaryRow label="Monthly Rental Income (₹)" value="50,000" />

          <View style={styles.divider} />

          <SummaryRow
            label="Net Monthly Cash Flow (₹)"
            value="9,239.769"
            highlight
          />
        </View>
      </View>
    </ScrollView>
  );
};

const SummaryRow = ({ label, value, highlight }: any) => (
  <View style={styles.rowBetween}>
    <Text style={styles.summaryLabel}>{label}</Text>
    <Text style={[styles.summaryValue, highlight && { color: '#429482' }]}>
      {value}
    </Text>
  </View>
);

export default SummaryCards;

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },

  /* --- TOP GRID --- */
  topGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 20,
  },

  card: {
    padding: 18,
    borderRadius: 12,
    marginBottom: 20,
  },

  emiCard: {
    backgroundColor: '#FDEDEE',
    borderWidth: 1,
    borderColor: '#C73834',
  },

  coverageCard: {
    backgroundColor: '#D7EFF7',
    borderWidth: 1,
    borderColor: '#26BFCC',
  },

  cashFlowCard: {
    backgroundColor: '#D7EFF7',
    borderWidth: 1,
    borderColor: '#26BFCC',
  },

  paybackCard: {
    backgroundColor: '#FFFCF4',
    borderWidth: 1,
    borderColor: '#F7C952',
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
  },

  subText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  valueRed: {
    fontSize: 20,
    fontWeight: '700',
    color: '#C73834',
    marginVertical: 6,
  },

  valueBlue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#26BFCC',
    marginVertical: 6,
  },

  valueGreen: {
    fontSize: 20,
    fontWeight: '700',
    color: '#429482',
    marginVertical: 6,
  },

  valueYellow: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F7C952',
    marginVertical: 6,
  },

  /* --- SUMMARY GRID --- */
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 20,
  },

  summaryCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    elevation: 3,
    marginBottom: 20,
  },

  summaryTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#EE2529',
    marginBottom: 20,
  },

  summaryLabel: {
    fontSize: 16,
    color: '#767676',
    marginBottom: 12,
  },

  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },

  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 16,
  },
});
