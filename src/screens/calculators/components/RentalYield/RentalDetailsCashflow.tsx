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
import download from "../../../../assets/Calculator/download.png"
import share from "../../../../assets/Calculator/share.png"

type CashFlowRow = {
  year: string;
  annualRent: string;
  annualExpenses: string;
  netCashFlow: string;
};

interface RentalDetailsCashflowProps {
  data?: {
    annualGrossRent?: number;
    totalAnnualExpenses?: number;
    totalInvestment?: number;
    monthlyEMI?: number;
    rentEscalationEvery?: number;
    rentEscalationPercent?: number;
    loanAmount?: number;
    interestRate?: string;
    totalLoanInterest?: number;
  };
}

const RentalDetailsCashflow = ({ data }: RentalDetailsCashflowProps) => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  const calculateDetailedCashflow = () => {
    const details = [];
    let currentRent = data?.annualGrossRent || 0;
    const escalationEvery = data?.rentEscalationEvery ?? 3;
    const escalationPercent = data?.rentEscalationPercent ?? 8;
    const annualExpenses = data?.totalAnnualExpenses || 0;

    for (let year = 1; year <= 10; year++) {
      if (year > 1 && (year - 1) % escalationEvery === 0) {
        currentRent = currentRent * (1 + escalationPercent / 100);
      }

      const netCashFlow = currentRent - annualExpenses;

      details.push({
        year: year.toString(),
        annualRent: `₹${currentRent.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,
        annualExpenses: `₹${annualExpenses.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,
        netCashFlow: `₹${netCashFlow.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,
      });
    }
    return details;
  };

  const cashFlowDetails = calculateDetailedCashflow();

  const handleDownloadReport = () => {
    const details = calculateDetailedCashflow();
    const headers = ['Year', 'Annual Rent', 'Annual Expenses', 'Net Cash Flow'];
    let csv = 'Property Investment Detailed Cashflow Report\n';
    csv += `Generated: ${new Date().toLocaleDateString('en-IN')}\n\n`;
    csv += headers.join(',') + '\n';
    details.forEach(row => {
      csv += [row.year, row.annualRent, row.annualExpenses, row.netCashFlow].join(',') + '\n';
    });

    if (Platform.OS === 'web') {
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'property-cashflow-report.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      Share.share({ message: csv, title: 'Property Cashflow Report' });
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Property Investment Detailed Cashflow Projections Report. 10-Year Net Income projection starts at ${cashFlowDetails[0]?.netCashFlow || 'N/A'}.`,
        url: Platform.OS === 'web' ? window.location.href : undefined,
      });
    } catch (error) {
      console.error('Error sharing report:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Detailed Cashflow Projections</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator
        contentContainerStyle={{
          minWidth: 520,
          width: isDesktop ? '100%' : undefined,
        }}
      >
        <View style={styles.tableBody}>
          {/* Header */}
          <View style={[styles.row, styles.headerRow]}>
            {[
              'Year',
              'Annual Rent',
              'Annual Expenses',
              'Net Cash Flow',
            ].map((title, index) => (
              <Text key={index} style={[styles.cell, styles.headerText]}>
                {title}
              </Text>
            ))}
          </View>

          {/* Rows */}
          {cashFlowDetails.map((item, index) => (
            <View key={index} style={styles.row}>
              <Text style={styles.cell}>{item.year}</Text>
              <Text style={styles.cell}>{item.annualRent}</Text>
              <Text style={styles.cell}>{item.annualExpenses}</Text>
              <Text style={[styles.cell, styles.green]}>
                {item.netCashFlow}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Buttons */}
      {/* Buttons */}
           <View style={[styles.buttonContainer, isDesktop && { flexDirection: 'row', marginTop: 30 }]}>
             <TouchableOpacity style={[styles.button, isDesktop && { paddingHorizontal: 20, width: 'auto' }]} onPress={handleDownloadReport}>
               <Image source={download} style={styles.buttonIcon} />
               <Text style={[styles.buttonText, isDesktop && { fontSize: 16 }]}>Download Report</Text>
             </TouchableOpacity>

             <TouchableOpacity style={[styles.button, isDesktop && { paddingHorizontal: 20, width: 'auto' }]} onPress={handleShare}>
               <Image source={share} style={styles.buttonIcon} />
               <Text style={[styles.buttonText, isDesktop && { fontSize: 16 }]}>Share Report</Text>
             </TouchableOpacity>
           </View>
    </View>
  );
};

export default RentalDetailsCashflow;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 40,
  },
  heading: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
    color: '#262626',
    fontFamily: 'Montserrat',
  },
  tableBody: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  headerRow: {
    borderBottomWidth: 2,
    borderColor: '#262626',
  },
  cell: {
    flex: 1,
    minWidth: 130,
    paddingVertical: 14,
    paddingHorizontal: 8,
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Montserrat',
  },
  headerText: {
    fontWeight: '700',
    fontSize: 18,
    fontFamily: 'Montserrat',
  },
  red: {
    color: '#C73834',
    fontFamily: 'Montserrat',
  },
  green: {
    color: '#429482',
    fontFamily: 'Montserrat',
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    gap: 12,
    marginTop: 20,
    width: '100%',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#767676',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 6,
    width: '100%',
  },
  buttonIcon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  buttonText: {
    color: '#767676',
    fontWeight: '600',
    fontSize: 14,
    fontFamily: 'Montserrat',
  },
});
