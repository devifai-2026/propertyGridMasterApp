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


const CoverageAnalysis: React.FC = () => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Year-by-Year Loan Coverage Analysis</Text>

      <View style={styles.tableWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator>
          <View style={styles.tableContainer}>
          {/* Header */}
          <View style={[styles.row, styles.headerRow]}>
            {[
              'Year',
              'Annual Rent',
              'EMI Paid',
              'Coverage %',
              'Principal Paid',
              'Interest Paid',
              'Outstanding Balance',
              'Net Cash Flow',
              'Cumulative Cash Flow',
            ].map((item, index) => (
              <Text key={index} style={[styles.cell, styles.headerText]}>
                {item}
              </Text>
            ))}
          </View>

          {/* Rows */}
          {data.map((row, index) => (
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
              <Text
                style={[
                  styles.cell,
                  parseFloat(row.cumulativeCashFlow.replace(/[^0-9.-]+/g, '')) <
                  0
                    ? styles.red
                    : styles.green,
                ]}
              >
                {row.cumulativeCashFlow}
              </Text>
            </View>
          ))}
          </View>
        </ScrollView>
      </View>

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
  },
  headerText: {
    fontWeight: '700',
    fontSize: 15,
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
  },
  red: {
    color: '#EE2529',
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: isDesktop ? 'row' : 'column',
    justifyContent: 'center',
    gap: 12,
    marginTop: isDesktop ? 30 : 20,
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
    paddingHorizontal: isDesktop ? 18 : 10,
    borderRadius: 6,
    gap: 8,
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

const data = [
  {
    year: 1,
    annualRent: '₹6,00,000',
    emiPaid: '₹4,83,122.768',
    coverage: '122.7%',
    principalPaid: '₹1,98,352.247',
    interestPaid: '₹2,90,760.521',
    outstandingBalance: '₹29,51,637.753',
    netCashFlow: '₹45,877.232',
    cumulativeCashFlow: '₹-16,79,122.768',
  },
  {
    year: 2,
    annualRent: '₹6,48,000',
    emiPaid: '₹4,83,122.768',
    coverage: '132.5%',
    principalPaid: '₹2,18,049.221',
    interestPaid: '₹2,71,073.547',
    outstandingBalance: '₹27,33,588.532',
    netCashFlow: '₹93,877.232',
    cumulativeCashFlow: '₹-15,85,245.535',
  },
  {
    year: 3,
    annualRent: '₹6,99,840',
    emiPaid: '₹4,83,122.768',
    coverage: '143.1%',
    principalPaid: '₹2,39,690.079',
    interestPaid: '₹2,49,432.688',
    outstandingBalance: '₹24,93,898.453',
    netCashFlow: '₹1,44,577.232',
    cumulativeCashFlow: '₹-14,39,528.303',
  },
  {
    year: 4,
    annualRent: '₹7,55,827.2',
    emiPaid: '₹4,83,122.768',
    coverage: '154.5%',
    principalPaid: '₹2,63,478.74',
    interestPaid: '₹2,25,644.027',
    outstandingBalance: '₹22,30,419.713',
    netCashFlow: '₹2,01,704.432',
    cumulativeCashFlow: '₹-12,37,823.87',
  },
  {
    year: 5,
    annualRent: '₹8,16,293.376',
    emiPaid: '₹4,83,122.768',
    coverage: '166.9%',
    principalPaid: '₹2,89,628.369',
    interestPaid: '₹1,94,494.399',
    outstandingBalance: '₹19,40,791.344',
    netCashFlow: '₹2,62,170.608',
    cumulativeCashFlow: '₹-9,75,653.262',
  },
  {
    year: 6,
    annualRent: '₹8,81,597.846',
    emiPaid: '₹4,83,122.768',
    coverage: '180.2%',
    principalPaid: '₹3,18,373.285',
    interestPaid: '₹1,70,749.483',
    outstandingBalance: '₹16,22,418.059',
    netCashFlow: '₹3,27,474.079',
    cumulativeCashFlow: '₹-6,48,179.183',
  },
  {
    year: 7,
    annualRent: '₹9,52,124.594',
    emiPaid: '₹4,83,122.768',
    coverage: '194.7%',
    principalPaid: '₹3,49,971.064',
    interestPaid: '₹1,39,151.703',
    outstandingBalance: '₹12,72,446.995',
    netCashFlow: '₹3,98,801.826',
    cumulativeCashFlow: '₹-2,50,177.357',
  },
  {
    year: 8,
    annualRent: '₹10,28,294.561',
    emiPaid: '₹4,83,122.768',
    coverage: '210.2%',
    principalPaid: '₹3,84,704.847',
    interestPaid: '₹1,04,417.921',
    outstandingBalance: '₹8,87,742.148',
    netCashFlow: '₹4,74,171.794',
    cumulativeCashFlow: '₹2,23,994.436',
  },
  {
    year: 9,
    annualRent: '₹11,10,558.176',
    emiPaid: '₹4,83,122.768',
    coverage: '227.1%',
    principalPaid: '₹4,22,885.873',
    interestPaid: '₹66,236.894',
    outstandingBalance: '₹4,64,856.775',
    netCashFlow: '₹5,56,435.359',
    cumulativeCashFlow: '₹7,80,429.795',
  },
  {
    year: 10,
    annualRent: '₹11,99,402.776',
    emiPaid: '₹4,83,122.768',
    coverage: '246.2%',
    principalPaid: '₹4,64,856.775',
    interestPaid: '₹24,266.493',
    outstandingBalance: '₹0',
    netCashFlow: '₹6,45,280.009',
    cumulativeCashFlow: '₹14,25,709.804',
  },
];
