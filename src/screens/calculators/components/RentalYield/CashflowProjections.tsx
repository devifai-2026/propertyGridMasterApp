import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  ScrollView,
  TouchableOpacity,
  Share,
  Platform,
  Alert,
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

  // Tap-to-show tooltip: react-native-chart-kit has no hover tooltip, so we
  // capture the clicked point and render a floating value box via `decorator`.
  // We also resolve which series/year was tapped so overlapping lines are
  // readable (the small rent/cash-flow lines sit close together).
  const [tooltip, setTooltip] = React.useState<
    { x: number; y: number; value: number; label: string; year: string; color: string } | null
  >(null);

  const SERIES = [
    { key: 'annualCashFlow', label: 'Annual Cash Flow', color: '#20B2AA' },
    { key: 'annualRent', label: 'Annual Rent', color: '#C73834' },
    { key: 'cumulativeCashFlow', label: 'Cumulative Cash Flow', color: '#F7C952' },
  ] as const;

  // chart-kit's onDataPointClick gives value + index but not which dataset, so
  // match the clicked value against the three series at that index.
  const resolveSeries = (index: number, value: number) => {
    const row: any = cashFlowData[index] || {};
    let best = SERIES[0];
    let bestDiff = Infinity;
    for (const s of SERIES) {
      const diff = Math.abs((row[s.key] ?? NaN) - value);
      if (diff < bestDiff) { bestDiff = diff; best = s; }
    }
    return best;
  };

  const calculateProjections = () => {
    const projections = [];
    let currentRent = data?.annualGrossRent || 0;
    // Respect user-provided escalation inputs, falling back to sensible defaults
    const escalationEvery = data?.rentEscalationEvery ?? 3;
    const escalationPercent = data?.rentEscalationPercent ?? 8;
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

  const handleDownloadProjections = () => {
    const headers = ['Year', 'Annual Cash Flow (L)', 'Annual Rent (L)', 'Cumulative Cash Flow (L)'];
    let csv = '10-Year Cash Flow Projections\n';
    csv += `Generated: ${new Date().toLocaleDateString('en-IN')}\n\n`;
    csv += headers.join(',') + '\n';
    cashFlowData.forEach(row => {
      csv += [row.year, row.annualCashFlow, row.annualRent, row.cumulativeCashFlow].join(',') + '\n';
    });

    if (Platform.OS === 'web') {
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'cashflow-projections.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      Share.share({ message: csv, title: '10-Year Cashflow Projections' });
    }
  };

  // "View Detailed Report" — a fuller, rupee-value report (Alert.alert is a
  // no-op on web, which is why the button appeared to do nothing before).
  const handleDownloadReport = () => {
    const annualExpenses = data?.totalAnnualExpenses || 0;
    const totalInvestment = data?.totalInvestment || 0;
    const inr = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;
    const headers = ['Year', 'Annual Rent', 'Annual Expenses', 'Net Cash Flow', 'Cumulative Cash Flow'];
    let csv = 'Property Investment — Detailed Cash Flow Report\n';
    csv += `Generated: ${new Date().toLocaleDateString('en-IN')}\n`;
    csv += `Total Initial Investment,${inr(totalInvestment)}\n\n`;
    csv += headers.join(',') + '\n';
    let cumulative = -totalInvestment;
    let rent = data?.annualGrossRent || 0;
    const every = data?.rentEscalationEvery ?? 3;
    const pct = data?.rentEscalationPercent ?? 8;
    for (let year = 1; year <= 10; year++) {
      if (year > 1 && (year - 1) % every === 0) rent = rent * (1 + pct / 100);
      const net = rent - annualExpenses;
      cumulative += net;
      csv += [`Y${year}`, inr(rent), inr(annualExpenses), inr(net), inr(cumulative)].join(',') + '\n';
    }

    if (Platform.OS === 'web') {
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'detailed-cashflow-report.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      Share.share({ message: csv, title: 'Detailed Cash Flow Report' });
    }
  };

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
              fontFamily: 'Montserrat',
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
          onDataPointClick={({ value, x, y, index }) => {
            const s = resolveSeries(index, value);
            setTooltip({ x, y, value, label: s.label, year: cashFlowData[index]?.year ?? '', color: s.color });
          }}
          decorator={() => {
            if (!tooltip) return null;
            const boxW = 150;
            const left = Math.max(4, Math.min(tooltip.x - boxW / 2, chartWidth - boxW - 4));
            const top = Math.max(4, tooltip.y - 58);
            return (
              <View
                style={{
                  position: 'absolute',
                  left,
                  top,
                  backgroundColor: '#262626',
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 8,
                  width: boxW,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: tooltip.color, marginRight: 6 }} />
                  <Text style={{ color: '#fff', fontSize: 11, fontFamily: 'Montserrat', fontWeight: '600' }}>
                    {tooltip.label}
                  </Text>
                </View>
                <Text style={{ color: '#bdbdbd', fontSize: 10, fontFamily: 'Montserrat' }}>
                  {tooltip.year} · <Text style={{ color: '#fff', fontWeight: '700' }}>₹{tooltip.value.toFixed(2)}L</Text>
                </Text>
              </View>
            );
          }}
          formatYLabel={value => {
            const num = Number(value);
            if (num === 0) return '₹0L';
            return num > 0 ? `₹+${num}L` : `₹${num}L`;
          }}
        />

        <TouchableOpacity style={styles.button} onPress={handleDownloadProjections}>
          <Text style={styles.buttonText}>Download Projections</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonOutline]}
          onPress={handleDownloadReport}
        >
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
    fontFamily: 'Montserrat',
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
    fontFamily: 'Montserrat',
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
    fontFamily: 'Montserrat',
  },
});