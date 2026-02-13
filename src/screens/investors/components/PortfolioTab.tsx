import React, { useState } from 'react';
import {
  Platform,
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { PieChart, LineChart, BarChart } from 'react-native-chart-kit';
import { MapPin } from 'lucide-react-native';

const PortfolioTab = () => {
  const leaseRenewals = [
    {
      id: '1',
      property: 'Residential Space',
      location: 'Pune',
      tenant: 'AP Realtors',
      expiryDate: '15/12/2025',
      annualRent: '₹2,65,00,000',
    },
    {
      id: '2',
      property: 'Commercial Space',
      location: 'Mumbai',
      tenant: 'Global Innovations',
      expiryDate: '20/12/2025',
      annualRent: '₹2,55,00,000',
    },
  ];

  const diversificationData = [
    { type: 'Commercial', percentage: 55, color: '#EE2529' },
    { type: 'Residential', percentage: 30, color: '#767676' },
    { type: 'Industrial', percentage: 15, color: '#5DADE2' },
  ];

  const pieChartData = diversificationData.map(item => ({
    name: item.type,
    population: item.percentage,
    color: item.color,
    legendFontColor: '#666',
    legendFontSize: 13,
  }));

  const incomeData = {
    labels: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'],
    expected: [45, 50, 52, 55, 55],
    received: [45, 52, 50, 55, 58],
  };

  // Format data specifically for recharts
  const webChartData = incomeData.labels.map((label, index) => ({
    name: label,
    expected: incomeData.expected[index],
    received: incomeData.received[index],
  }));

  const propertiesOwned = [
    {
      id: '1',
      title: 'Skyline Apartments',
      location: 'Bandra West, Mumbai',
      image: require('../../../assets/FeaturedProperties/cardImg.png'),
      investmentAmount: '₹10,00,000',
      propertyType: 'Residential',
    },
    {
      id: '2',
      title: 'Tech Park Commercial',
      location: 'Whitefield, Bangalore',
      image: require('../../../assets/FeaturedProperties/cardImg.png'),
      investmentAmount: '₹15,00,000',
      propertyType: 'Commercial',
    },
    {
      id: '3',
      title: 'Green Valley Villas',
      location: 'Gurgaon, Delhi NCR',
      image: require('../../../assets/FeaturedProperties/cardImg.png'),
      investmentAmount: '₹8,00,000',
      propertyType: 'Villa',
    },
    {
      id: '4',
      title: 'Marina Bay Complex',
      location: 'Kochi, Kerala',
      image: require('../../../assets/FeaturedProperties/cardImg.png'),
      investmentAmount: '₹6,60,000',
      propertyType: 'Commercial',
    },
    {
      id: '4',
      title: 'Ocean View Residency',
      location: 'Marine Drive, Kochi',
      image: require('../../../assets/FeaturedProperties/cardImg.png'),
      investmentAmount: '₹12,00,000',
      propertyType: 'Residential',
    },
  ];

  const [containerWidth, setContainerWidth] = useState(0);
  const screenWidth = Dimensions.get('window').width;
  const isDesktop = screenWidth > 768;

  const onLayout = (event: any) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width - 40); // Subtract padding
  };

  const chartWidthToUse =
    containerWidth > 0
      ? containerWidth
      : isDesktop
      ? (screenWidth - 340) / 2
      : screenWidth - 60;

  return (
    <View style={styles.container}>
      <View style={styles.summaryGrid}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Invested</Text>
          <Text style={styles.summaryValue}>₹5,20,00,000</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Properties</Text>
          <Text style={styles.summaryValue}>04</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Average Yield</Text>
          <Text style={styles.summaryValue}>8.5%</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Monthly Income</Text>
          <Text style={[styles.summaryValue, { color: '#EE2529' }]}>
            ₹4,50,000
          </Text>
        </View>
      </View>

      <View style={styles.chartsRow}>
        {/* Portfolio Diversification */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Portfolio Diversification</Text>
          <PieChart
            data={pieChartData}
            width={chartWidth}
            height={200}
            chartConfig={{
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute={false}
            hasLegend={false}
          />
          <View style={styles.legend}>
            {diversificationData.map((item, index) => (
              <View key={index} style={styles.legendItem}>
                <View
                  style={[styles.legendDot, { backgroundColor: item.color }]}
                />
                <Text style={styles.legendText}>
                  {item.type} {item.percentage}%
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Income Tracker */}
        <View style={styles.chartCard} onLayout={onLayout}>
          <Text style={styles.chartTitle}>Income Tracker</Text>
          <View style={{ alignItems: 'center' }}>
            <LineChart
              data={{
                labels: incomeData.labels,
                datasets: [
                  {
                    data: incomeData.expected,
                    color: () => '#5DADE2',
                    strokeWidth: 2,
                  },
                  {
                    data: incomeData.received,
                    color: () => '#EE2529',
                    strokeWidth: 2,
                  },
                ],
              }}
              width={chartWidthToUse}
              height={220}
              fromZero
              bezier={false}
              withShadow={false}
              withInnerLines
              withOuterLines={false}
              withVerticalLines={false}
              yAxisSuffix="L"
              chartConfig={{
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                backgroundGradientFromOpacity: 0,
                backgroundGradientToOpacity: 0,
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                labelColor: () => '#666666',
                propsForBackgroundLines: {
                  stroke: '#E5E5E5',
                  strokeWidth: 1,
                },
              }}
              style={{
                borderRadius: 8,
              }}
            />
          </View>

          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendLine, { backgroundColor: '#5DADE2' }]}
              />
              <Text style={styles.legendText}>Expected</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendLine, { backgroundColor: '#EE2529' }]}
              />
              <Text style={styles.legendText}>Received</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Upcoming Lease Renewals */}
      <View style={styles.tableCard}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableTitle}>Upcoming Lease Renewals</Text>
          <Text style={styles.expiringBadge}>2 Expiring Soon</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ width: '100%' }}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View
            style={[
              styles.table,
              { width: isDesktop ? '100%' : 700, minWidth: '100%' },
            ]}
          >
            {/* Table Header */}
            <View style={styles.tableRow}>
              <Text style={[styles.tableHeaderText, { flex: 1.5 }]}>
                Property
              </Text>
              <Text style={[styles.tableHeaderText, { flex: 1 }]}>
                Location
              </Text>
              <Text style={[styles.tableHeaderText, { flex: 1.2 }]}>
                Tenant
              </Text>
              <Text style={[styles.tableHeaderText, { flex: 1 }]}>
                Expiry Date
              </Text>
              <Text style={[styles.tableHeaderText, { flex: 1.2 }]}>
                Annual Rent
              </Text>
              <Text style={[styles.tableHeaderText, { flex: 0.8 }]}>
                Action
              </Text>
            </View>

            {/* Table Rows */}
            {leaseRenewals.map(item => (
              <View
                key={item.id}
                style={[styles.tableRow, styles.tableDataRow]}
              >
                <Text style={[styles.tableDataText, { flex: 1.5 }]}>
                  {item.property}
                </Text>
                <Text style={[styles.tableDataText, { flex: 1 }]}>
                  {item.location}
                </Text>
                <Text style={[styles.tableDataText, { flex: 1.2 }]}>
                  {item.tenant}
                </Text>
                <Text style={[styles.tableDataText, { flex: 1 }]}>
                  {item.expiryDate}
                </Text>
                <Text style={[styles.tableDataText, { flex: 1.2 }]}>
                  {item.annualRent}
                </Text>
                <TouchableOpacity style={styles.viewButton}>
                  <Text style={styles.viewButtonText}>view</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Properties Owned */}
      <View style={styles.propertiesSection}>
        <Text style={styles.sectionTitle}>Properties Owned</Text>
        <View style={styles.propertiesGrid}>
          {propertiesOwned.map(property => (
            <View key={property.id} style={styles.propertyCard}>
              <Image
                source={property.image}
                style={styles.propertyImage}
                resizeMode="cover"
              />
              <View style={styles.propertyContent}>
                <View style={styles.propertyHeader}>
                  <Text style={styles.propertyTitle}>{property.title}</Text>
                  <View style={styles.typeBadge}>
                    <Text style={styles.typeText}>{property.propertyType}</Text>
                  </View>
                </View>
                <View style={styles.locationRow}>
                  <MapPin size={14} color="#767676" />
                  <Text style={styles.locationText}>{property.location}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.investmentRow}>
                  <Text style={styles.investmentLabel}>Investment Amount</Text>
                  <Text style={styles.investmentValue}>
                    {property.investmentAmount}
                  </Text>
                </View>
                <TouchableOpacity style={styles.viewDetailsBtn}>
                  <Text style={styles.viewDetailsBtnText}>View Details</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const { width } = Dimensions.get('window');
const isDesktop = width > 1024;
const chartWidth = isDesktop ? 350 : width - 80;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F8F9FA',
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    marginBottom: 20,
  },
  summaryCard: {
    flex: 1,
    minWidth: isDesktop ? 200 : '45%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  summaryLabel: {
    fontSize: 13,
    color: '#767676',
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  chartsRow: {
    flexDirection: isDesktop ? 'row' : 'column',
    gap: 20,
    marginBottom: 20,
  },
  chartCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  chartWrapper: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 20,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendLine: {
    width: 20,
    height: 3,
    backgroundColor: '#5DADE2',
  },
  legendText: {
    fontSize: 13,
    color: '#666',
  },
  tableCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  tableTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  expiringBadge: {
    color: '#EE2529',
    fontSize: 14,
    fontWeight: '600',
  },
  table: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tableDataRow: {
    backgroundColor: '#fff',
  },
  tableHeaderText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
  },
  tableDataText: {
    fontSize: 13,
    color: '#666',
  },
  viewButton: {
    flex: 0.8,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  viewButtonText: {
    fontSize: 12,
    color: '#767676',
  },
  propertiesSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  propertiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  propertyCard: {
    width: isDesktop ? '48%' : '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  propertyImage: {
    width: '100%',
    height: 180,
  },
  propertyContent: {
    padding: 15,
  },
  propertyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  propertyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  typeBadge: {
    backgroundColor: '#FFF3CA',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeText: {
    fontSize: 11,
    color: '#EE2529',
    fontWeight: '600',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 15,
  },
  locationText: {
    fontSize: 13,
    color: '#767676',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 12,
  },
  investmentRow: {
    marginBottom: 15,
  },
  investmentLabel: {
    fontSize: 12,
    color: '#767676',
    marginBottom: 4,
  },
  investmentValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#EE2529',
  },
  viewDetailsBtn: {
    borderWidth: 1,
    borderColor: '#EE2529',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  viewDetailsBtnText: {
    color: '#EE2529',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default PortfolioTab;

const chartConfig = {
  backgroundColor: '#ffffff',
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  decimalPlaces: 0,

  color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
  labelColor: (opacity = 1) => `rgba(102,102,102,${opacity})`,

  propsForDots: {
    r: '4',
    strokeWidth: '2',
  },

  propsForBackgroundLines: {
    stroke: '#E5E5E5',
    strokeWidth: 1,
  },

  propsForLabels: {
    fontSize: 12,
  },
};
