import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  ScrollView,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';

type CashFlowItem = {
  year: string;
  annualCashFlow: number;
  annualRent: number;
  cumulativeCashFlow: number;
};

const cashFlowData: CashFlowItem[] = [
  {
    year: 'Year 1',
    annualCashFlow: 5.35,
    annualRent: 6.0,
    cumulativeCashFlow: -44.17,
  },
  {
    year: 'Year 2',
    annualCashFlow: 5.35,
    annualRent: 6.0,
    cumulativeCashFlow: -38.82,
  },
  {
    year: 'Year 3',
    annualCashFlow: 5.35,
    annualRent: 6.0,
    cumulativeCashFlow: -33.47,
  },
  {
    year: 'Year 4',
    annualCashFlow: 5.35,
    annualRent: 6.48,
    cumulativeCashFlow: -28.12,
  },
  {
    year: 'Year 5',
    annualCashFlow: 5.83,
    annualRent: 6.48,
    cumulativeCashFlow: -22.29,
  },
  {
    year: 'Year 6',
    annualCashFlow: 5.83,
    annualRent: 6.48,
    cumulativeCashFlow: -16.46,
  },
  {
    year: 'Year 7',
    annualCashFlow: 5.83,
    annualRent: 6.48,
    cumulativeCashFlow: -10.63,
  },
  {
    year: 'Year 8',
    annualCashFlow: 6.31,
    annualRent: 6.99,
    cumulativeCashFlow: -4.32,
  },
  {
    year: 'Year 9',
    annualCashFlow: 6.31,
    annualRent: 6.99,
    cumulativeCashFlow: 1.99,
  },
  {
    year: 'Year 10',
    annualCashFlow: 6.31,
    annualRent: 6.99,
    cumulativeCashFlow: 8.3,
  },
];

const CashflowProjections: React.FC = () => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  const chartWidth = width - 32;

  const labels = cashFlowData.map(item => item.year);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Cash Flow Projections</Text>

        <LineChart
          data={{
            labels,
            datasets: [
              {
                data: cashFlowData.map(d => d.annualCashFlow),
                color: () => '#20B2AA',
                strokeWidth: 2,
              },
              {
                data: cashFlowData.map(d => d.annualRent),
                color: () => '#C73834',
                strokeWidth: 2,
              },
              {
                data: cashFlowData.map(d => d.cumulativeCashFlow),
                color: () => '#F7C952',
                strokeWidth: 2,
              },
            ],
            legend: ['Annual Cash Flow', 'Annual Rent', 'Cumulative Cash Flow'],
          }}
          width={chartWidth}
          height={isDesktop ? 420 : 320}
          yAxisLabel=""
          yAxisSuffix="L"
          yAxisInterval={1}
          fromZero={false}
          bezier
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
            labelColor: () => '#767676',
            propsForDots: {
              r: isDesktop ? '4' : '3',
              strokeWidth: '1',
              stroke: '#fff',
            },
            propsForBackgroundLines: {
              stroke: '#e3e3e3',
              strokeDasharray: '3 3',
            },
          }}
          style={styles.chart}
          formatYLabel={value => {
            const num = Number(value);
            if (num === 0) return '₹0L';
            return num > 0 ? `₹+${num}L` : `₹${num}L`;
          }}
        />
      </View>
    </ScrollView>
  );
};

export default CashflowProjections;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
    color: '#262626',
  },
  chart: {
    borderRadius: 16,
  },
});
