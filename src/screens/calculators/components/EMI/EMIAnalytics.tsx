import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import {
  BarChart,
  LineChart,
  PieChart,
  StackedBarChart,
} from 'react-native-chart-kit';

const EMIAnalytics: React.FC = () => {
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;
  const chartPadding = 32;
  const desktopWidth = (width - 64) / 2 - chartPadding;
  const chartWidth = isDesktop ? desktopWidth : width - 64;

  /* -------------------- DATA -------------------- */

  const emiRentData = {
    labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    datasets: [
      { data: [9.5, 9.8, 10, 10.2, 10.5, 10.8, 11, 11.3, 11.5, 11.8] },
      { data: [9.5, 9.6, 9.7, 9.8, 9.9, 10, 10.1, 10.2, 10.3, 10.4] },
    ],
  };

  const loanCostData = [
    {
      name: 'Principal',
      population: 31.5,
      color: '#22d3ee',
      legendFontColor: '#333',
      legendFontSize: 12,
    },
    {
      name: 'Interest',
      population: 17.4,
      color: '#ef4444',
      legendFontColor: '#333',
      legendFontSize: 12,
    },
  ];

  const loanBalanceData = {
    labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    legend: ['Outstanding', 'Principal'],
    data: [
      [2, 98],
      [5, 95],
      [10, 90],
      [18, 82],
      [28, 72],
      [40, 60],
      [54, 46],
      [70, 30],
      [85, 15],
      [100, 0],
    ],
    barColors: ['#fbbf24', '#22d3ee'],
  };

  const cashFlowData = {
    labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    datasets: [
      {
        data: [0.5, 1.2, 2, 2.8, 3.5, 4.5, 5.5, 6.8, 8.5, 10.5],
      },
    ],
  };

  const cumulativeData = {
    labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    datasets: [
      {
        data: [0, 10, 30, 50, 75, 100, 125, 155, 190, 230],
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(34,211,238, ${opacity})`,
    labelColor: () => '#555',
    style: { borderRadius: 16 },
  };

  /* -------------------- UI -------------------- */

  return (
    <View style={styles.container}>
      <Text style={styles.title}>EMI Analytics</Text>

      <View style={isDesktop ? styles.grid : styles.stack}>
        {/* EMI vs Rent Coverage */}
        <View style={isDesktop ? styles.cardDesktop : styles.card}>
          <Text style={styles.cardTitle}>EMI vs Rent Coverage</Text>
          <Text style={styles.cardSubtitle}>
            Monthly EMI compared to rental income over time
          </Text>
          <BarChart
            data={emiRentData}
            width={chartWidth}
            height={300}
            chartConfig={chartConfig}
            fromZero
            yAxisLabel=""
            yAxisSuffix=""
          />
        </View>

        {/* Total Loan Cost Breakdown */}
        <View style={isDesktop ? styles.cardDesktop : styles.card}>
          <Text style={styles.cardTitle}>Total Loan Cost Breakdown</Text>
          <Text style={styles.cardSubtitle}>
            Principal amount vs total interest payable
          </Text>
          <PieChart
            data={loanCostData}
            width={chartWidth}
            height={250}
            chartConfig={chartConfig}
            accessor={'population'}
            backgroundColor={'transparent'}
            paddingLeft={'15'}
            absolute
          />
        </View>

        {/* Loan Balance Reduction */}
        <View style={isDesktop ? styles.cardDesktop : styles.card}>
          <Text style={styles.cardTitle}>Loan Balance Reduction</Text>
          <Text style={styles.cardSubtitle}>
            Outstanding loan balance and equity building over time
          </Text>
          <StackedBarChart
            data={loanBalanceData}
            width={chartWidth}
            height={300}
            chartConfig={chartConfig}
            yAxisLabel=""
            yAxisSuffix=""
            hideLegend={false}
          />
        </View>

        {/* Cash Flow Analysis */}
        <View style={isDesktop ? styles.cardDesktop : styles.card}>
          <Text style={styles.cardTitle}>Cash Flow Analysis</Text>
          <Text style={styles.cardSubtitle}>
            Monthly and cumulative cash flow after EMI payments
          </Text>
          <View>
            <BarChart
              data={cashFlowData}
              width={chartWidth}
              height={250}
              chartConfig={chartConfig}
              fromZero
              yAxisLabel=""
              yAxisSuffix=""
              style={{ paddingRight: 0 }}
            />
            <View style={{ marginTop: -50 }}>
              <LineChart
                data={cumulativeData}
                width={chartWidth}
                height={220}
                yAxisLabel=""
                yAxisSuffix=""
                chartConfig={{
                  ...chartConfig,
                  color: () => '#ef4444',
                }}
                withInnerLines={false}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default EMIAnalytics;

/* -------------------- STYLES -------------------- */

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    width: '100%',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    color: '#dc2626',
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  stack: {
    flexDirection: 'column',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardDesktop: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    width: '49%',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'center',
    color: '#1f2937',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
    textAlign: 'center',
  },
});
