import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';


interface CashFlowProjectionsProps {
  data?: {
    annualGrossRent?: number;
    totalAnnualExpenses?: number;
    totalInvestment?: number;
    rentEscalationEvery?: number;
    rentEscalationPercent?: number;
  };
}

const CashflowProjections = ({ data }: CashFlowProjectionsProps) => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  const chartWidth = isDesktop ? width - 40 : width - 75;

  const calculateProjections = () => {
    const projections = [];
    let currentRent = data?.annualGrossRent || 0;
    // Default values if data was from results state which might not have every key yet
    const escalationEvery = 3; 
    const escalationPercent = 8;
    const annualExpenses = data?.totalAnnualExpenses || 0;
    const totalInvestment = data?.totalInvestment || 1; // avoid div by zero
    
    let cumulative = -(totalInvestment / 100000); 
    
    for (let year = 1; year <= 10; year++) {
      if (year > 1 && (year - 1) % escalationEvery === 0) {
        currentRent = currentRent * (1 + escalationPercent / 100);
      }
      const annualCashFlowLakhs = (currentRent - annualExpenses) / 100000;
      cumulative += annualCashFlowLakhs;
      
      projections.push({
        year: `Y${year}`,
        annualCashFlow: parseFloat(annualCashFlowLakhs.toFixed(2)),
        annualRent: parseFloat((currentRent / 100000).toFixed(2)),
        cumulativeCashFlow: parseFloat(cumulative.toFixed(2)),
      });
    }
    return projections;
  };

  const cashFlowData = calculateProjections();
  const labels = cashFlowData.map(item => item.year);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>10-Year Cash Flow Projections</Text>

        <LineChart
          data={{
            labels,
            datasets: [
              {
                data: cashFlowData.map(d => d.annualCashFlow),
                color: () => '#20B2AA',
                strokeWidth: 3,
              },
              {
                data: cashFlowData.map(d => d.annualRent),
                color: () => '#C73834',
                strokeWidth: 3,
              },
              {
                data: cashFlowData.map(d => d.cumulativeCashFlow),
                color: () => '#F7C952',
                strokeWidth: 3,
              },
            ],
            legend: isDesktop ? ['Annual Cash Flow', 'Annual Rent', 'Cumulative Cash Flow'] : ['Cash Flow', 'Rent', 'Cum. Flow'],
          }}
          width={chartWidth}
          height={isDesktop ? 450 : 350}
          yAxisLabel=""
          yAxisSuffix="L"
          yAxisInterval={1}
          fromZero={false}
          bezier
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
            labelColor: () => '#767676',
            propsForLabels: {
              fontSize: isDesktop ? 12 : 10,
            },
            propsForDots: {
              r: isDesktop ? '6' : '4',
              strokeWidth: '2',
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

        {/* Example Button with visible border */}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Download Projections</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.buttonOutline]}>
          <Text style={styles.buttonOutlineText}>View Detailed Report</Text>
        </TouchableOpacity>
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
    marginBottom: 20,
  },
  // Solid button
  button: {
    backgroundColor: '#20B2AA',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#20B2AA',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  // Outline button with visible border
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#20B2AA',
  },
  buttonOutlineText: {
    color: '#20B2AA',
    fontSize: 16,
    fontWeight: '600',
  },
});