import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, {
  G,
  Text as SvgText,
  Path,
  Line as SvgLine,
} from 'react-native-svg';

const { width } = Dimensions.get('window');
const chartWidth = width - 60;

const PrincipleChart = () => {
  // Calculate amortization schedule for 20 years loan
  const loanAmount = 315000;
  const interestRate = 9.5;
  const years = 20;

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

  const data = calculateAmortization();

  const chartHeight = 220;
  const padding = 50;
  const maxValue = 100000;

  const getY = (val: number) => chartHeight - (val / maxValue) * chartHeight + 10;
  const getX = (index: number) => padding + (index / (data.length - 1)) * (chartWidth - padding - 10);

  // Create path for interest (top area)
  let interestPath = `M ${getX(0)} ${getY(data[0].interest + data[0].principal)}`;
  data.forEach((item, i) => {
    if (i > 0) interestPath += ` L ${getX(i)} ${getY(item.interest + item.principal)}`;
  });
  interestPath += ` L ${getX(data.length - 1)} ${getY(data[data.length - 1].principal)}`;
  for (let i = data.length - 1; i >= 0; i--) {
    interestPath += ` L ${getX(i)} ${getY(data[i].principal)}`;
  }
  interestPath += ' Z';

  // Create path for principal (bottom area)
  let principalPath = `M ${getX(0)} ${getY(data[0].principal)}`;
  data.forEach((item, i) => {
    if (i > 0) principalPath += ` L ${getX(i)} ${getY(item.principal)}`;
  });
  principalPath += ` L ${getX(data.length - 1)} ${chartHeight + 10} L ${getX(0)} ${chartHeight + 10} Z`;

  const yAxisTicks = [0, 30000, 50000, 80000, 100000];
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
                <SvgText x={5} y={y + 4} fontSize="10" fill="#999">
                  {formatYAxis(val)}
                </SvgText>
              </G>
            );
          })}

          {/* Areas */}
          <Path d={principalPath} fill="#26BFCC" opacity={0.9} stroke="#26BFCC" strokeWidth={2} />
          <Path d={interestPath} fill="#C73834" opacity={0.9} stroke="#C73834" strokeWidth={2} />

          {/* X-axis labels */}
          {data.map((item, i) => (
            <SvgText
              key={i}
              x={getX(i)}
              y={chartHeight + 25}
              fontSize="10"
              fill="#6b7280"
              textAnchor="middle"
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
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 20,
    textAlign: 'center',
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
  },
});

export default PrincipleChart;
