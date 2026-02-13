import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TrendingUp, Calendar } from 'lucide-react-native';

const EMISummaryCards = () => {
  return (
    <View>
      {/* Main Result Cards - 4 Cards Grid */}
      <View style={styles.resultsGrid}>
        {/* Card 1 - Monthly EMI */}
        <View style={[styles.resultCard, styles.card1]}>
          <View style={styles.cardContent}>
            <Text style={styles.resultCardTitle}>Monthly EMI</Text>
            <Text style={[styles.resultCardValue, { color: '#C73834' }]}>₹40,760.231</Text>
          </View>
          <Text style={styles.resultCardSubtitle}>Fixed monthly payment</Text>
          <View style={styles.descContainer}>
            <Text style={styles.resultCardDesc}>Fixed loan payment.</Text>
            <Text style={styles.resultCardDesc}>Tracks monthly liability.</Text>
          </View>
        </View>

        {/* Card 2 - Rent Coverage */}
        <View style={[styles.resultCard, styles.card2]}>
          <View style={styles.cardContent}>
            <Text style={styles.resultCardTitle}>Rent Coverage</Text>
            <Text style={[styles.resultCardValue, { color: '#26BFCC' }]}>122.7%</Text>
          </View>
          <Text style={styles.resultCardSubtitle}>% Rent vs EMI ratio</Text>
          <View style={styles.descContainer}>
            <Text style={styles.resultCardDesc}>Rent ÷ EMI.</Text>
            <Text style={styles.resultCardDesc}>Higher = safer cash flow</Text>
          </View>
        </View>

        {/* Card 3 - Monthly Cash Flow */}
        <View style={[styles.resultCard, styles.card3]}>
          <View style={styles.cardHeader}>
            <Text style={styles.resultCardTitle}>Monthly Cash Flow</Text>
            <TrendingUp size={24} color="#429482" />
          </View>
          <Text style={[styles.resultCardValue, { color: '#429482' }]}>₹9,239.769</Text>
          <Text style={styles.resultCardSubtitle}>$ Rent minus EMI</Text>
          <View style={styles.descContainer}>
            <Text style={styles.resultCardDesc}>Net income after EMI.</Text>
            <Text style={styles.resultCardDesc}>Shows monthly profit</Text>
          </View>
        </View>

        {/* Card 4 - Payback Period */}
        <View style={[styles.resultCard, styles.card4]}>
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
      <View style={styles.summarySection}>
        {/* Loan Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Loan Summary</Text>
          <View style={styles.summaryContent}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Loan Amount (₹)</Text>
              <Text style={styles.summaryValue}>31,50,000</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Monthly EMI (₹)</Text>
              <Text style={styles.summaryValue}>40,760.231</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Interest Payable (₹)</Text>
              <Text style={styles.summaryValue}>17,41,227.676</Text>
            </View>
          </View>
          <View style={styles.dividerLine} />
          <View style={styles.summaryItemTotal}>
            <Text style={styles.summaryLabelBold}>Total Repayment (₹)</Text>
            <Text style={[styles.summaryValueTotal, { color: '#429482' }]}>48,91,227.676</Text>
          </View>
        </View>

        {/* Investment Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Investment Summary</Text>
          <View style={styles.summaryContent}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Initial Cost (₹)</Text>
              <Text style={styles.summaryValue}>17,25,000</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Monthly Rental Income (₹)</Text>
              <Text style={styles.summaryValue}>50,000</Text>
            </View>
          </View>
          <View style={styles.dividerLine} />
          <View style={styles.summaryItemTotal}>
            <Text style={styles.summaryLabelBold}>Net Monthly Cash Flow (₹)</Text>
            <Text style={[styles.summaryValueTotal, { color: '#429482' }]}>9,239.769</Text>
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
    gap: 16,
    marginTop: 40,
  },
  resultCard: {
    flex: 1,
    minWidth: '47%',
    maxWidth: '48%',
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
  },
  resultCardValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  resultCardSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  descContainer: {
    gap: 8,
  },
  resultCardDesc: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 18,
  },

  // Bottom 2 Summary Cards
  summarySection: {
    gap: 20,
    marginTop: 40,
  },
  summaryCard: {
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
    flex: 1,
    marginRight: 16,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
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
  },
  summaryValueTotal: {
    fontSize: 18,
    fontWeight: '600',
  },
});

export default EMISummaryCards;
