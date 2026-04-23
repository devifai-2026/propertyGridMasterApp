import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  ScrollView,
} from 'react-native';
import { PieChart, BarChart } from 'react-native-chart-kit';

interface PerformanceAnalyticsProps {
  data?: {
    totalAnnualExpenses?: number;
    annualMaintenance?: number;
    propertyTax?: number;
    insurance?: number;
    otherExpenses?: number;
    grossYield?: string;
    netYield?: string;
    monthlyEMI?: number;
  };
}

const PerformanceAnalytics = ({ data }: PerformanceAnalyticsProps) => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  const chartWidth = isDesktop ? width / 2.5 : width - 64;

  const annualLoanEMI = (data?.monthlyEMI || 0) * 12;
  const totalExpenses = (data?.totalAnnualExpenses || 0) + annualLoanEMI;

  const expenseData = [
    { name: 'Annual Loan EMI', population: annualLoanEMI, color: '#4A4A4A' },
    { name: 'Maintenance', population: data?.annualMaintenance || 0, color: '#FFA500' },
    { name: 'Property Tax', population: data?.propertyTax || 0, color: '#20B2AA' },
    { name: 'Insurance', population: data?.insurance || 0, color: '#FF6B6B' },
    { name: 'Other Expenses', population: data?.otherExpenses || 0, color: '#87CEEB' },
  ].filter(item => item.population > 0);

  const yieldData = [
    { name: 'Gross Yield', value: parseFloat(data?.grossYield || '0'), color: '#C73834' },
    { name: 'Net Yield', value: parseFloat(data?.netYield || '0'), color: '#26BFCC' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Performance Analytics</Text>

      <View style={[styles.wrapper, isDesktop && styles.desktopRow]}>
        {/* Pie Chart */}
        <View style={[styles.card, isDesktop && styles.desktopCard]}>
          <Text style={styles.cardTitle}>Annual Expense Breakdown</Text>

          {expenseData.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <PieChart
                data={expenseData.map(item => ({
                  name: item.name,
                  population: item.population,
                  color: item.color,
                  legendFontColor: '#333',
                  legendFontSize: 14,
                }))}
                width={isDesktop ? chartWidth : Math.max(chartWidth, 300)}
                height={260}
                chartConfig={chartConfig}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="10"
                absolute
              />
            </ScrollView>
          ) : (
            <Text style={{ textAlign: 'center', color: '#999', marginVertical: 100 }}>No expense data available</Text>
          )}
        </View>

        {/* Bar Chart */}
        <View style={[styles.card, isDesktop && styles.desktopCard]}>
          <Text style={styles.cardTitle}>Rental Yield Comparison</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <BarChart
              data={{
                labels: yieldData.map(item => item.name),
                datasets: [
                  {
                    data: yieldData.map(item => item.value),
                  },
                ],
              }}
              width={isDesktop ? chartWidth : Math.max(chartWidth, 300)}
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
          </ScrollView>
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
    fontSize: 26,
    fontWeight: '600',
    color: '#EE2529',
    marginBottom: 20,
    fontFamily: 'Montserrat',
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
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
    color: '#262626',
    fontFamily: 'Montserrat',
  },
});
