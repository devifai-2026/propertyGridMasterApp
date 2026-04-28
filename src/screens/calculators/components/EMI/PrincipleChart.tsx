import React from 'react';
import { View, Text, StyleSheet, Dimensions, useWindowDimensions } from 'react-native';
import Svg, {
  G,
  Text as SvgText,
  Path,
  Line as SvgLine,
} from 'react-native-svg';

interface PrincipleChartProps {
  data?: {
    loanAmount?: number;
    interestRate?: string;
    loanTenure?: string;
  };
}

const PrincipleChart = ({ data }: PrincipleChartProps) => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const isTablet = width >= 768 && width < 1024;

  const chartWidth = isDesktop ? 600 : isTablet ? width - 80 : width - 60;

  const loanAmount = data?.loanAmount || 0;
  const interestRate = parseFloat(data?.interestRate || '0') || 0;
  const years = Math.min(parseFloat(data?.loanTenure || '10') || 10, 10);

  const calculateAmortization = () => {
    const principal = loanAmount;
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = years * 12;
    const monthlyPayment =
      principal *
      (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    const data = [];
    let remainingBalance = principal;

    for (let year = 1; year <= Math.min(years, 10); year++) {
      let yearlyPrincipal = 0;
      let yearlyInterest = 0;

      for (let month = 0; month < 12; month++) {
        const interestPayment = remainingBalance * monthlyRate;
        const principalPayment = monthlyPayment - interestPayment;

        yearlyInterest += interestPayment;
        yearlyPrincipal += principalPayment;
        remainingBalance -= principalPayment;
      }

      data.push({
        year: `Year ${year}`,
        interest: Math.round(yearlyInterest),
        principal: Math.round(yearlyPrincipal),
      });
    }

    return data;
  };

  const amortData = calculateAmortization();

  const chartHeight = 220;
  const padding = 50;
  const maxValue = amortData.length > 0
    ? Math.max(...amortData.map(d => d.interest + d.principal), 1)
    : 100000;

  const getY = (val: number) => chartHeight - (val / maxValue) * chartHeight + 10;
  const getX = (index: number) => padding + (index / (amortData.length - 1)) * (chartWidth - padding - 10);

  // Create path for interest (top area)
  let interestPath = amortData.length > 0
    ? `M ${getX(0)} ${getY(amortData[0].interest + amortData[0].principal)}`
    : '';
  amortData.forEach((item, i) => {
    if (i > 0) interestPath += ` L ${getX(i)} ${getY(item.interest + item.principal)}`;
  });
  if (amortData.length > 0) {
    interestPath += ` L ${getX(amortData.length - 1)} ${getY(amortData[amortData.length - 1].principal)}`;
    for (let i = amortData.length - 1; i >= 0; i--) {
      interestPath += ` L ${getX(i)} ${getY(amortData[i].principal)}`;
    }
    interestPath += ' Z';
  }

  // Create path for principal (bottom area)
  let principalPath = amortData.length > 0
    ? `M ${getX(0)} ${getY(amortData[0].principal)}`
    : '';
  amortData.forEach((item, i) => {
    if (i > 0) principalPath += ` L ${getX(i)} ${getY(item.principal)}`;
  });
  if (amortData.length > 0) {
    principalPath += ` L ${getX(amortData.length - 1)} ${chartHeight + 10} L ${getX(0)} ${chartHeight + 10} Z`;
  }

  const yAxisTicks = [0, Math.round(maxValue * 0.25), Math.round(maxValue * 0.5), Math.round(maxValue * 0.75), maxValue];
  const formatYAxis = (val: number) => {
    const lakhValue = val / 100000;
    return `₹${lakhValue.toFixed(1)}L`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Principal vs Interest Payments Over Time</Text>
        <Text style={styles.subtitle}>
          See how your EMI composition changes - more principal, less interest over time
        </Text>

        <Svg height={chartHeight + 50} width={chartWidth}>
          {/* Grid lines and Y-axis labels */}
          {yAxisTicks.map((val, i) => {
            const y = getY(val);
            return (
              <G key={i}>
                <SvgLine
                  x1={padding}
                  y1={y}
                  x2={chartWidth - 10}
                  y2={y}
                  stroke="#f0f0f0"
                  strokeWidth="1"
                />
                <SvgText x={5} y={y + 4} fontSize="10" fill="#999" fontFamily="Montserrat">
                  {formatYAxis(val)}
                </SvgText>
              </G>
            );
          })}

          {/* Areas */}
          <Path d={principalPath} fill="#26BFCC" opacity={0.9} stroke="#26BFCC" strokeWidth={2} />
          <Path d={interestPath} fill="#C73834" opacity={0.9} stroke="#C73834" strokeWidth={2} />

          {/* X-axis labels */}
          {amortData.map((item, i) => (
            <SvgText
              key={i}
              x={getX(i)}
              y={chartHeight + 25}
              fontSize="10"
              fill="#6b7280"
              textAnchor="middle"
              fontFamily="Montserrat"
            >
              {item.year}
            </SvgText>
          ))}
        </Svg>

        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#C73834' }]} />
            <Text style={styles.legendText}>Interest Payment</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#26BFCC' }]} />
            <Text style={styles.legendText}>Principal Payment</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginTop: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 5,
    textAlign: 'center',
    fontFamily: 'Montserrat',
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Montserrat',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 15,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  legendText: {
    fontSize: 12,
    color: '#333',
    fontFamily: 'Montserrat',
  },
});

export default PrincipleChart;
