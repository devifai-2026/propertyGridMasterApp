import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  Image,
  Share,
  Platform,
} from 'react-native';
import download from '../../../../assets/Calculator/download.png';
import share from '../../../../assets/Calculator/share.png';
import { Dimensions } from 'react-native';

const { width: windowWidth } = Dimensions.get('window');
const isDesktopStatic = windowWidth >= 1024;

interface CoverageAnalysisProps {
  data?: {
    monthlyRent?: number;
    monthlyEMI?: number;
    loanAmount?: number;
    interestRate?: string;
    loanTenure?: string;
    rentEscalationPercent?: number;
    propertyPrice?: number;
  };
}

const CoverageAnalysis: React.FC<CoverageAnalysisProps> = ({ data }) => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  const generateCoverageData = () => {
    const monthlyRent = data?.monthlyRent || 0;
    const monthlyEMI = data?.monthlyEMI || 0;
    const loanAmount = data?.loanAmount || 0;
    const annualRate = (parseFloat(data?.interestRate || '0') || 0) / 100;
    const monthlyRate = annualRate / 12;
    const totalYears = Math.min(parseFloat(data?.loanTenure || '10') || 10, 10);
    const rentEscalationPct = (data?.rentEscalationPercent || 8) / 100;

    const rows = [];
    let currentMonthlyRent = monthlyRent;
    let outstandingBalance = loanAmount;
    let cumulativeCashFlow = 0;

    for (let year = 1; year <= totalYears; year++) {
      if (year > 1) currentMonthlyRent = currentMonthlyRent * (1 + rentEscalationPct);

      const annualRent = currentMonthlyRent * 12;
      const annualEMI = monthlyEMI * 12;

      let yearlyInterest = 0;
      let yearlyPrincipal = 0;
      let tempBalance = outstandingBalance;
      for (let m = 0; m < 12; m++) {
        const interest = tempBalance * monthlyRate;
        const principal = Math.min(tempBalance, Math.max(0, monthlyEMI - interest));
        yearlyInterest += interest;
        yearlyPrincipal += principal;
        tempBalance -= principal;
      }
      outstandingBalance = Math.max(0, tempBalance);

      const coverage = annualEMI > 0 ? (annualRent / annualEMI) * 100 : 0;
      const netCashFlow = annualRent - annualEMI;
      cumulativeCashFlow += netCashFlow;

      const fmt = (v: number) => `₹${v.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

      rows.push({
        year: year.toString(),
        annualRent: fmt(annualRent),
        emiPaid: annualEMI > 0 ? fmt(annualEMI) : '-',
        coverage: `${coverage.toFixed(1)}%`,
        principalPaid: yearlyPrincipal > 0 ? fmt(yearlyPrincipal) : '-',
        interestPaid: yearlyInterest > 0 ? fmt(yearlyInterest) : '-',
        outstandingBalance: outstandingBalance > 0 ? fmt(outstandingBalance) : '₹0',
        netCashFlow: fmt(netCashFlow),
        cumulativeCashFlow: fmt(cumulativeCashFlow),
        cumulativeRaw: cumulativeCashFlow,
      });
    }
    return rows;
  };

  const tableData = generateCoverageData();

  const handleDownloadReport = () => {
    const headers = [
      'Year', 'Annual Rent', 'EMI Paid', 'Coverage %',
      'Principal Paid', 'Interest Paid', 'Outstanding Balance',
      'Net Cash Flow', 'Cumulative Cash Flow',
    ];
    let csv = 'EMI Loan Coverage Analysis Report\n';
    csv += `Generated: ${new Date().toLocaleDateString('en-IN')}\n\n`;
    csv += headers.join(',') + '\n';
    tableData.forEach(row => {
      csv += [
        row.year, row.annualRent, row.emiPaid, row.coverage,
        row.principalPaid, row.interestPaid, row.outstandingBalance,
        row.netCashFlow, row.cumulativeCashFlow,
      ].join(',') + '\n';
    });

    if (Platform.OS === 'web') {
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'emi-coverage-analysis.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      Share.share({ message: csv, title: 'EMI Coverage Analysis Report' });
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: 'Loan Coverage Analysis Report. View year-by-year principal, interest, and coverage ratio projections.',
        url: Platform.OS === 'web' ? window.location.href : undefined,
      });
    } catch (error) {
      console.error('Error sharing report:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Year-by-Year Loan Coverage Analysis</Text>

      <View style={styles.tableWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator>
          <View style={styles.tableContainer}>
            <View style={[styles.row, styles.headerRow]}>
              {[
                'Year', 'Annual Rent', 'EMI Paid', 'Coverage %',
                'Principal Paid', 'Interest Paid', 'Outstanding Balance',
                'Net Cash Flow', 'Cumulative Cash Flow',
              ].map((item, index) => (
                <Text key={index} style={[styles.cell, styles.headerText]}>
                  {item}
                </Text>
              ))}
            </View>

            {tableData.map((row, index) => (
              <View
                key={row.year}
                style={[
                  styles.row,
                  index % 2 === 0 ? styles.whiteRow : styles.grayRow,
                ]}
              >
                <Text style={styles.cell}>{row.year}</Text>
                <Text style={styles.cell}>{row.annualRent}</Text>
                <Text style={styles.cell}>{row.emiPaid}</Text>
                <Text style={[styles.cell, styles.green]}>{row.coverage}</Text>
                <Text style={styles.cell}>{row.principalPaid}</Text>
                <Text style={styles.cell}>{row.interestPaid}</Text>
                <Text style={styles.cell}>{row.outstandingBalance}</Text>
                <Text style={styles.cell}>{row.netCashFlow}</Text>
                <Text style={[styles.cell, row.cumulativeRaw < 0 ? styles.red : styles.green]}>
                  {row.cumulativeCashFlow}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      <View style={[styles.buttonContainer, isDesktop && { marginTop: 30 }]}>
        <TouchableOpacity style={styles.button} onPress={handleDownloadReport}>
          <Image source={download} style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Download Report</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleShare}>
          <Image source={share} style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Share Report</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CoverageAnalysis;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fff',
    padding: 0,
  },
  heading: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    color: '#262626',
    paddingHorizontal: 16,
    paddingTop: 16,
    fontFamily: 'Montserrat',
  },
  tableWrapper: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableContainer: {
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#e5e5e5',
  },
  headerRow: {
    borderBottomWidth: 2,
    borderColor: '#000',
  },
  cell: {
    width: 150,
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'Montserrat',
  },
  headerText: {
    fontWeight: '700',
    fontSize: 15,
    fontFamily: 'Montserrat',
  },
  whiteRow: {
    backgroundColor: '#ffffff',
  },
  grayRow: {
    backgroundColor: '#f9f9f9',
  },
  green: {
    color: '#429482',
    fontWeight: '600',
    fontFamily: 'Montserrat',
  },
  red: {
    color: '#EE2529',
    fontWeight: '600',
    fontFamily: 'Montserrat',
  },
  buttonContainer: {
    flexDirection: isDesktopStatic ? 'row' : 'column',
    justifyContent: 'center',
    gap: 12,
    marginTop: isDesktopStatic ? 30 : 20,
    paddingHorizontal: 16,
    paddingBottom: 20,
    width: '100%',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#767676',
    paddingVertical: 10,
    paddingHorizontal: isDesktopStatic ? 18 : 10,
    borderRadius: 6,
    gap: 8,
    width: isDesktopStatic ? 'auto' : '100%',
  },
  buttonIcon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  buttonText: {
    color: '#767676',
    fontWeight: '600',
    fontSize: isDesktopStatic ? 16 : 14,
    fontFamily: 'Montserrat',
  },
});
