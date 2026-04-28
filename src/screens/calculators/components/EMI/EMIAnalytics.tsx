import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { BarChart, LineChart, PieChart, StackedBarChart } from 'react-native-chart-kit';

interface EMIAnalyticsProps {
  data?: {
    monthlyEMI?: number;
    monthlyRent?: number;
    loanAmount?: number;
    totalInterest?: number;
    interestRate?: string;
    loanTenure?: string;
    rentEscalationPercent?: number;
  };
}

const EMIAnalytics: React.FC<EMIAnalyticsProps> = ({ data }) => {
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;
  const chartPadding = 32;
  const desktopWidth = (width - 64) / 2 - chartPadding;
  const chartWidth = isDesktop ? desktopWidth : width - 64;

  const monthlyEMI = data?.monthlyEMI || 0;
  const monthlyRent = data?.monthlyRent || 0;
  const loanAmount = data?.loanAmount || 0;
  const totalInterest = data?.totalInterest || 0;
  const annualRate = (parseFloat(data?.interestRate || '0') || 0) / 100;
  const monthlyRate = annualRate / 12;
  const loanYears = Math.min(parseFloat(data?.loanTenure || '10') || 10, 10);
  const rentEscalationPct = (data?.rentEscalationPercent || 8) / 100;

  // Build year-by-year amortization + rent data
  const buildYearlyData = () => {
    const rows = [];
    let currentRent = monthlyRent;
    let balance = loanAmount;
    let cumulative = 0;
    for (let year = 1; year <= loanYears; year++) {
      if (year > 1) currentRent = currentRent * (1 + rentEscalationPct);
      let yearInterest = 0;
      let yearPrincipal = 0;
      for (let m = 0; m < 12; m++) {
        const interest = balance * monthlyRate;
        const principal = Math.min(balance, Math.max(0, monthlyEMI - interest));
        yearInterest += interest;
        yearPrincipal += principal;
        balance -= principal;
      }
      balance = Math.max(0, balance);
      const annualRent = currentRent * 12;
      const annualEMI = monthlyEMI * 12;
      const netCashFlow = annualRent - annualEMI;
      cumulative += netCashFlow;
      const repaidPct = loanAmount > 0 ? Math.round(((loanAmount - balance) / loanAmount) * 100) : 0;
      const outstandingPct = 100 - repaidPct;
      rows.push({
        label: year.toString(),
        annualRentL: parseFloat((annualRent / 100000).toFixed(2)),
        annualEMIL: parseFloat((annualEMI / 100000).toFixed(2)),
        netCashFlowL: parseFloat((netCashFlow / 100000).toFixed(2)),
        cumulativeL: parseFloat((cumulative / 100000).toFixed(2)),
        outstandingPct,
        repaidPct,
      });
    }
    return rows;
  };

  const yearlyData = buildYearlyData();
  const labels = yearlyData.map(d => d.label);

  const emiRentData = {
    labels,
    datasets: [
      { data: yearlyData.map(d => d.annualRentL) },
      { data: yearlyData.map(d => d.annualEMIL) },
    ],
  };

  const loanCostData = [
    { name: 'Principal', population: parseFloat((loanAmount / 100000).toFixed(2)) || 0.01, color: '#22d3ee', legendFontColor: '#333', legendFontSize: 12 },
    { name: 'Interest', population: parseFloat((totalInterest / 100000).toFixed(2)) || 0.01, color: '#ef4444', legendFontColor: '#333', legendFontSize: 12 },
  ];

  const loanBalanceData = {
    labels,
    legend: ['Outstanding', 'Repaid'],
    data: yearlyData.map(d => [d.outstandingPct, d.repaidPct]),
    barColors: ['#fbbf24', '#22d3ee'],
  };

  const cashFlowData = {
    labels,
    datasets: [{ data: yearlyData.map(d => d.netCashFlowL) }],
  };

  const cumulativeData = {
    labels,
    datasets: [{ data: yearlyData.map(d => d.cumulativeL) }],
  };

  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(34,211,238, ${opacity})`,
    labelColor: () => '#555',
    style: { borderRadius: 16 },
    propsForLabels: { fontFamily: 'Montserrat' },
  };

  if (!data?.monthlyEMI && !data?.monthlyRent) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>EMI Analytics</Text>
        <Text style={{ textAlign: 'center', color: '#999', marginVertical: 40, fontFamily: 'Montserrat' }}>
          Enter loan details to see analytics
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>EMI Analytics</Text>

      <View style={isDesktop ? styles.grid : styles.stack}>
        {/* EMI vs Rent Coverage */}
        <View style={isDesktop ? styles.cardDesktop : styles.card}>
          <Text style={styles.cardTitle}>EMI vs Rent Coverage</Text>
          <Text style={styles.cardSubtitle}>Annual rent income vs EMI payments (₹ Lakhs)</Text>
          <BarChart
            data={emiRentData}
            width={chartWidth}
            height={300}
            chartConfig={chartConfig}
            fromZero
            yAxisLabel=""
            yAxisSuffix="L"
          />
        </View>

        {/* Total Loan Cost Breakdown */}
        <View style={isDesktop ? styles.cardDesktop : styles.card}>
          <Text style={styles.cardTitle}>Total Loan Cost Breakdown</Text>
          <Text style={styles.cardSubtitle}>Principal vs total interest payable (₹ Lakhs)</Text>
          <PieChart
            data={loanCostData}
            width={chartWidth}
            height={250}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </View>

        {/* Loan Balance Reduction */}
        <View style={isDesktop ? styles.cardDesktop : styles.card}>
          <Text style={styles.cardTitle}>Loan Balance Reduction</Text>
          <Text style={styles.cardSubtitle}>Outstanding balance vs equity built (%)</Text>
          <StackedBarChart
            data={loanBalanceData}
            width={chartWidth}
            height={300}
            chartConfig={chartConfig}
            yAxisLabel=""
            yAxisSuffix="%"
            hideLegend={false}
          />
        </View>

        {/* Cash Flow Analysis */}
        <View style={isDesktop ? styles.cardDesktop : styles.card}>
          <Text style={styles.cardTitle}>Cash Flow Analysis</Text>
          <Text style={styles.cardSubtitle}>Net annual cash flow after EMI (₹ Lakhs)</Text>
          <View>
            <BarChart
              data={cashFlowData}
              width={chartWidth}
              height={250}
              chartConfig={chartConfig}
              fromZero={false}
              yAxisLabel=""
              yAxisSuffix="L"
              style={{ paddingRight: 0 }}
            />
            <View style={{ marginTop: -50 }}>
              <LineChart
                data={cumulativeData}
                width={chartWidth}
                height={220}
                yAxisLabel=""
                yAxisSuffix="L"
                chartConfig={{ ...chartConfig, color: () => '#ef4444' }}
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
    fontFamily: 'Montserrat',
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
    fontFamily: 'Montserrat',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
    textAlign: 'center',
    fontFamily: 'Montserrat',
  },
});
