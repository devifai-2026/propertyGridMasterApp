import React from "react";
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  ScrollView,
} from "react-native";

interface FinancialDetailsProps {
  data?: {
    propertyPrice?: number;
    downPayment?: number;
    loanAmount?: number;
    monthlyEMI?: number;
    totalLoanInterest?: number;
    interestRate?: string;
    loanTenure?: string;
  };
}

const FinancialDetails = ({ data }: FinancialDetailsProps) => {
  const { width } = useWindowDimensions();

  const isDesktop = width >= 1024;
  const isTablet = width >= 768;

  const financialData = [
    {
      label: "Property Price",
      value: `₹${data?.propertyPrice?.toLocaleString('en-IN') || '0'}`,
      color: "#C73834",
    },
    {
      label: "Down Payment",
      value: `₹${data?.downPayment?.toLocaleString('en-IN') || '0'}`,
      subtext: data?.propertyPrice ? `${((data.downPayment! / data.propertyPrice) * 100).toFixed(1)}% of price` : "0% of price",
      color: "#767676",
    },
    {
      label: "Loan Amount",
      value: `₹${data?.loanAmount?.toLocaleString('en-IN') || '0'}`,
      subtext: data?.propertyPrice ? `${((data.loanAmount! / data.propertyPrice) * 100).toFixed(1)}% financed` : "0% financed",
      color: "#26BFCC",
    },
    {
      label: "Monthly EMI",
      value: `₹${data?.monthlyEMI?.toLocaleString('en-IN', { maximumFractionDigits: 2 }) || '0'}`,
      subtext: `@${data?.interestRate || '0'}% for ${data?.loanTenure || '0'} years`,
      color: "#429482",
    },
    {
      label: "Total Interest",
      value: `₹${data?.totalLoanInterest?.toLocaleString('en-IN', { maximumFractionDigits: 2 }) || '0'}`,
      subtext: `Over ${data?.loanTenure || '0'} years`,
      color: "#F7C952",
    },
  ];

  const getCardWidth = () => {
    if (isDesktop) return "19%";
    if (isTablet) return "32%";
    return "100%";
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Financing Details Breakdown</Text>

      <View style={styles.flexWrap}>
        {financialData.map((item, index) => (
          <View key={index} style={[styles.card, { width: getCardWidth() }]}>
            <Text style={styles.label}>{item.label}</Text>

            <Text style={[styles.value, { color: item.color }]}>
              {item.value}
            </Text>

            {item.subtext && (
              <Text style={styles.subtext}>{item.subtext}</Text>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default FinancialDetails;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  heading: {
    color: "#EE2529",
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 18,
  },
  flexWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 14,
    marginRight: 10,
    elevation: 4, // android shadow
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  label: {
    color: "#767676",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },
  value: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 4,
  },
  subtext: {
    color: "#767676",
    fontSize: 16,
  },
});
