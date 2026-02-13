import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  ScrollView,
} from 'react-native';
import { PieChart, BarChart } from 'react-native-chart-kit';

type ExpenseItem = {
  name: string;
  value: number;
  color: string;
};

type YieldItem = {
  name: string;
  value: number;
  color: string;
};

const expenseData: ExpenseItem[] = [
  { name: 'Annual Loan EMI', value: 84, color: '#4A4A4A' },
  { name: 'Maintenance', value: 7, color: '#FFA500' },
  { name: 'Property Tax', value: 3, color: '#20B2AA' },
  { name: 'Insurance', value: 2, color: '#FF6B6B' },
  { name: 'Other Expenses', value: 4, color: '#87CEEB' },
];

const yieldData: YieldItem[] = [
  { name: 'Gross Yield', value: 13.33, color: '#C73834' },
  { name: 'Net Yield', value: 12.11, color: '#26BFCC' },
];

const PerformanceAnalytics: React.FC = () => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  const chartWidth = isDesktop ? width / 2.5 : width - 40;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Performance Analytics</Text>

      <View style={[styles.wrapper, isDesktop && styles.desktopRow]}>
        {/* Pie Chart */}
        <View style={[styles.card, isDesktop && styles.desktopCard]}>
          <Text style={styles.cardTitle}>Annual Expense Breakdown</Text>

          <PieChart
            data={expenseData.map(item => ({
              name: item.name,
              population: item.value,
              color: item.color,
              legendFontColor: '#333',
              legendFontSize: 12,
            }))}
            width={chartWidth}
            height={260}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="10"
            absolute
          />
        </View>

        {/* Bar Chart */}
        <View style={[styles.card, isDesktop && styles.desktopCard]}>
          <Text style={styles.cardTitle}>Rental Yield Comparison</Text>

          <BarChart
            data={{
              labels: yieldData.map(item => item.name),
              datasets: [
                {
                  data: yieldData.map(item => item.value),
                },
              ],
            }}
            width={chartWidth}
            height={260}
            yAxisLabel=""
            yAxisSuffix="%"
            fromZero
            chartConfig={{
              ...chartConfig,
              color: () => '#C73834',
            }}
            style={{ borderRadius: 12 }}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default PerformanceAnalytics;

const chartConfig = {
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  decimalPlaces: 2,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: () => '#333',
  style: {
    borderRadius: 16,
  },
  propsForBackgroundLines: {
    stroke: '#e3e3e3',
  },
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 22,
    fontWeight: '600',
    color: '#EE2529',
    marginBottom: 20,
  },
  wrapper: {
    flexDirection: 'column',
  },
  desktopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  desktopCard: {
    width: '48%',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
    color: '#262626',
  },
});
