import React from "react";
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  ScrollView,
} from "react-native";

type FinancialItem = {
  label: string;
  value: string;
  subtext?: string;
  color: string;
};

const financialData: FinancialItem[] = [
  {
    label: "Property Price",
    value: "₹45,00,000",
    color: "#C73834",
  },
  {
    label: "Down Payment",
    value: "₹13,50,000",
    subtext: "30.0% of price",
    color: "#767676",
  },
  {
    label: "Loan Amount",
    value: "₹31,50,000",
    subtext: "70.0% financed",
    color: "#26BFCC",
  },
  {
    label: "Monthly EMI",
    value: "₹29,362.132",
    subtext: "@9.5% for 20 years",
    color: "#429482",
  },
  {
    label: "Total Interest",
    value: "₹38,96,911.78",
    subtext: "Over 20 years",
    color: "#F7C952",
  },
];

const FinancialDetails: React.FC = () => {
  const { width } = useWindowDimensions();

  // Desktop breakpoint
  const isDesktop = width >= 1024;
  const isTablet = width >= 768;

  const getCardWidth = () => {
    if (isDesktop) return "20%"; // 5 cards in row
    if (isTablet) return "33.33%"; // 3 cards
    return "50%"; // mobile 2 cards
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
  },
  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 14,
    elevation: 4, // android shadow
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  label: {
    color: "#767676",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 6,
  },
  value: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 4,
  },
  subtext: {
    color: "#767676",
    fontSize: 14,
  },
});
