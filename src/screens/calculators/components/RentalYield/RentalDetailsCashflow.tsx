import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';

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

const RentalDetailsCashflow: React.FC = () => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Detailed Cashflow Projections</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator
        contentContainerStyle={{
          minWidth: 1040, // 8 columns * 130px
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
      <View style={[styles.buttonContainer, isDesktop && { marginTop: 30 }]}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Download Report</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
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
    marginBottom: 20,
  },
  heading: {
    textAlign: 'center',
    fontSize: 20,
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
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontSize: 14,
    textAlign: 'center',
  },
  headerText: {
    fontWeight: '700',
    fontSize: 15,
  },
  red: {
    color: '#C73834',
  },
  green: {
    color: '#429482',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 20,
  },
  button: {
    borderWidth: 1,
    borderColor: '#767676',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 6,
  },
  buttonText: {
    color: '#767676',
    fontWeight: '600',
  },
});

const cashFlowDetails: CashFlowRow[] = [
  {
    year: '1',
    annualRent: '₹6,00,000',
    emiPaid: '29,362.132',
    principal: '₹5,35,000',
    interest: '₹65,000',
    balance: '₹5,35,000',
    annualExpenses: '₹65,000',
    netCashFlow: '₹5,35,000',
  },
  {
    year: '2',
    annualRent: '₹6,48,000',
    emiPaid: '29,362.132',
    principal: '₹5,81,050',
    interest: '₹66,950',
    balance: '₹5,81,050',
    annualExpenses: '₹66,950',
    netCashFlow: '₹5,81,050',
  },
  {
    year: '3',
    annualRent: '₹6,99,840',
    emiPaid: '29,362.132',
    principal: '₹6,30,881.5',
    interest: '₹68,958.5',
    balance: '₹6,30,881.5',
    annualExpenses: '₹68,958.5',
    netCashFlow: '₹6,30,881',
  },
  {
    year: '4',
    annualRent: '₹7,55,827.2',
    emiPaid: '29,362.132',
    principal: '₹6,84,799.945',
    interest: '₹71,027.255',
    balance: '₹6,84,799.945',
    annualExpenses: '₹71,027.255',
    netCashFlow: '₹6.84,799.94',
  },
  {
    year: '5',
    annualRent: '₹8,16,293.376',
    emiPaid: '29,362.132',
    principal: '₹7,43,135.303',
    interest: '₹73,158.073',
    balance: '₹7,43,135.303',
    annualExpenses: '₹73,158.073',
    netCashFlow: '₹7.43,135.33',
  },
  {
    year: '6',
    annualRent: '₹8,81,597.846',
    emiPaid: '29,362.132',
    principal: '₹8,06,244.031',
    interest: '₹75,352.815',
    balance: '₹8,06,244.031',
    annualExpenses: '₹75,352.815',
    netCashFlow: '₹8.06,244.0',
  },
  {
    year: '7',
    annualRent: '₹9,52,124.594',
    emiPaid: '29,362.132',
    principal: '₹8,74,511.194',
    interest: '₹77,613.399',
    balance: '₹8,74,511.194',
    annualExpenses: '₹77,613.399',
    netCashFlow: '₹8.74,511.19',
  },
  {
    year: '8',
    annualRent: '₹10,28,294.561',
    emiPaid: '29,362.132',
    principal: '₹9,48,352.76',
    interest: '₹79,941.801',
    balance: '₹9,48,352.76',
    annualExpenses: '₹79,941.801',
    netCashFlow: '₹9.48,352.7',
  },
  {
    year: '9',
    annualRent: '₹11,10,558.126',
    emiPaid: '29,362.132',
    principal: '₹10,28,218.071',
    interest: '₹82,340.055',
    balance: '₹10,28,218.071',
    annualExpenses: '₹82,340.055',
    netCashFlow: '₹10.28,218.0',
  },
  {
    year: '10',
    annualRent: '₹11,99,402.776',
    emiPaid: '29,362.132',
    principal: '₹11,14,592.519',
    interest: '₹84,810.257',
    balance: '₹11,14,592.519',
    annualExpenses: '₹84,810.257',
    netCashFlow: '₹11.14,592.5',
  },
];
