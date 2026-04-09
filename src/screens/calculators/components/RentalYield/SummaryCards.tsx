import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface SummaryCardsProps {
  data?: {
    totalInvestment?: number;
    annualGrossRent?: number;
    totalAnnualExpenses?: number;
    annualNetIncome?: number;
    securityDepositInterest?: number;
    totalAnnualReturn?: number;
  };
}

import { useWindowDimensions } from 'react-native';

const SummaryCards = ({ data }: SummaryCardsProps) => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  const formatCurrency = (val?: number) => {
    if (val === undefined) return '0';
    return val.toLocaleString('en-IN');
  };

  const cardStyle = [
    styles.card,
    !isDesktop && { minWidth: '100%', maxWidth: '100%', marginBottom: 20 },
  ];

  return (
    <View style={styles.container}>
      <View style={[styles.grid, !isDesktop && { flexDirection: 'column', gap: 0 }]}>
        {/* 1 - Investment Summary */}
        <View style={cardStyle}>
          <Text style={[styles.cardTitle, !isDesktop && { fontSize: 20 }]}>Investment Summary</Text>
          <View style={styles.spaceY}>
            <View style={styles.rowBetween}>
              <Text style={[styles.label, !isDesktop && { fontSize: 14 }]}>Total Initial Investment (₹)</Text>
              <Text style={[styles.value, !isDesktop && { fontSize: 14 }]}>{formatCurrency(data?.totalInvestment)}</Text>
            </View>
            <View style={styles.rowBetween}>
              <Text style={[styles.label, !isDesktop && { fontSize: 14 }]}>Gross Annual Rent (₹)</Text>
              <Text style={[styles.value, !isDesktop && { fontSize: 14 }]}>{formatCurrency(data?.annualGrossRent)}</Text>
            </View>
            <View style={styles.rowBetween}>
              <Text style={[styles.label, !isDesktop && { fontSize: 14 }]}>Total Annual Expenses (₹)</Text>
              <Text style={[styles.value, !isDesktop && { fontSize: 14 }]}>{formatCurrency(data?.totalAnnualExpenses)}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.rowBetween}>
            <Text style={[styles.labelBold, !isDesktop && { fontSize: 16 }]}>Net Annual Income (₹)</Text>
            <Text style={[styles.valueGreen, !isDesktop && { fontSize: 18 }]}>{formatCurrency(data?.annualNetIncome)}</Text>
          </View>
        </View>

        {/* 2 - Additional Income */}
        <View style={cardStyle}>
          <Text style={[styles.cardTitle, !isDesktop && { fontSize: 20 }]}>Additional Income</Text>
          <View style={styles.spaceY}>
            <View style={styles.rowBetween}>
              <Text style={[styles.label, !isDesktop && { fontSize: 14 }]}>
                Annual Interest on Security Deposit (₹)
              </Text>
              <Text style={[styles.valueGreen, !isDesktop && { fontSize: 16 }]}>{formatCurrency(data?.securityDepositInterest)}</Text>
            </View>
            <View style={styles.rowBetween}>
              <Text style={[styles.labelDark, !isDesktop && { fontSize: 16 }]}>Total Annual Return (₹)</Text>
              <Text style={[styles.valueGreen, !isDesktop && { fontSize: 18 }]}>{formatCurrency(data?.totalAnnualReturn)}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default SummaryCards;

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 20,
  },
  card: {
    flex: 1,
    minWidth: '48%',
    maxWidth: '48%',
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#EE2529',
    marginBottom: 20,
  },
  spaceY: {
    gap: 15,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    color: '#767676',
    marginRight: 10,
    flexShrink: 1,
  },
  labelBold: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
  },
  labelDark: {
    fontSize: 18,
    color: '#000',
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  valueGreen: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#429482',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 20,
  },
});
