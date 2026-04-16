import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  Image,
} from 'react-native';
import download from "../../../../assets/Calculator/download.png"
import share from "../../../../assets/Calculator/share.png"
import { Dimensions } from 'react-native';

const { width: windowWidth } = Dimensions.get('window');
const isDesktop = windowWidth >= 1024;


type CashFlowRow = {
  year: string;
  annualRent: string;
  emiPaid: string;
  principal: string;
  interest: string;
  balance: string;
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
    const escalationEvery = 3;
    const escalationPercent = 8;
    const annualExpenses = data?.totalAnnualExpenses || 0;
    const monthlyEMI = data?.monthlyEMI || 0;
    const annualEMI = monthlyEMI * 12;
    
    // Very simplified principal/interest split for the table
    // In a real app we'd use an amortization schedule
    let remainingBalance = data?.loanAmount || 0;
    const annualRate = parseFloat(data?.interestRate || '0') / 100;
    
    for (let year = 1; year <= 10; year++) {
      if (year > 1 && (year - 1) % escalationEvery === 0) {
        currentRent = currentRent * (1 + escalationPercent / 100);
      }
      
      const interestPaid = remainingBalance * annualRate;
      const principalPaid = Math.min(remainingBalance, Math.max(0, annualEMI - interestPaid));
      remainingBalance -= principalPaid;
      
      const netCashFlow = currentRent - annualExpenses - (data?.loanAmount ? annualEMI : 0);
      
      details.push({
        year: year.toString(),
        annualRent: `₹${currentRent.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,
        emiPaid: data?.loanAmount ? `₹${annualEMI.toLocaleString('en-IN', { maximumFractionDigits: 0 })}` : '-',
        principal: data?.loanAmount ? `₹${principalPaid.toLocaleString('en-IN', { maximumFractionDigits: 0 })}` : '-',
        interest: data?.loanAmount ? `₹${interestPaid.toLocaleString('en-IN', { maximumFractionDigits: 0 })}` : '-',
        balance: data?.loanAmount ? `₹${remainingBalance.toLocaleString('en-IN', { maximumFractionDigits: 0 })}` : '-',
        annualExpenses: `₹${annualExpenses.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,
        netCashFlow: `₹${netCashFlow.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,
      });
    }
    return details;
  };

  const cashFlowDetails = calculateDetailedCashflow();

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Detailed Cashflow Projections</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator
        contentContainerStyle={{
          minWidth: 1040, 
          width: isDesktop ? '100%' : undefined,
        }}
      >
        <View style={styles.tableBody}>
          {/* Header */}
          <View style={[styles.row, styles.headerRow]}>
            {[
              'Year',
              'Annual Rent',
              'EMI Paid',
              'Principal',
              'Interest',
              'Balance',
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
              <Text style={[styles.cell, styles.red]}>{item.emiPaid}</Text>
              <Text style={styles.cell}>{item.principal}</Text>
              <Text style={styles.cell}>{item.interest}</Text>
              <Text style={[styles.cell, styles.green]}>{item.balance}</Text>
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
           <View style={[styles.buttonContainer, isDesktop && { marginTop: 30 }]}>
             <TouchableOpacity style={styles.button}>
               <Image source={download} style={styles.buttonIcon} />
               <Text style={styles.buttonText}>Download Report</Text>
             </TouchableOpacity>
     
             <TouchableOpacity style={styles.button}>
               <Image source={share} style={styles.buttonIcon} />
               <Text style={styles.buttonText}>Share Report</Text>
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
  },
  headerText: {
    fontWeight: '700',
    fontSize: 18,
  },
  red: {
    color: '#C73834',
  },
  green: {
    color: '#429482',
  },
  buttonContainer: {
    flexDirection: isDesktop ? 'row' : 'column',
    justifyContent: 'center',
    gap: 12,
    marginTop: isDesktop ? 30 : 20,
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
    paddingHorizontal: isDesktop ? 20 : 10,
    borderRadius: 6,
    width: isDesktop ? 'auto' : '100%',
  },
  buttonIcon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  buttonText: {
    color: '#767676',
    fontWeight: '600',
    fontSize: isDesktop ? 16 : 14,
  },
});
