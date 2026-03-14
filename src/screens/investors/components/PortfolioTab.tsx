import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { PieChart, LineChart } from 'react-native-chart-kit';
import PropertyCard, { Property } from '../../../components/PropertyCard';
import { useAuth } from '../../../context/AuthContext';
import { COLORS } from '../../../constants/theme';
import { usePropertyAPIs } from '../../../../helpers/hooks/propertyAPIs/usePropertyApis';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const DiversificationCard = ({ data }: { data: any[] }) => {
  const pieChartData = data.map(item => ({
    name: item.type,
    population: item.percentage,
    color: item.color,
    legendFontColor: '#666',
    legendFontSize: 13,
  }));

  const isWide = SCREEN_WIDTH > 768;
  const chartWidthToUse = isWide ? 350 : SCREEN_WIDTH - 80;

  return (
    <View style={styles.chartCard}>
      <Text style={styles.chartTitle}>Portfolio Diversification</Text>
      <PieChart
        data={pieChartData}
        width={chartWidthToUse}
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
        {data.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: item.color }]} />
            <Text style={styles.legendText}>
              {item.type} {item.percentage}%
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export const IncomeTrackerCard = ({ data }: { data: any }) => {
  const [containerWidth, setContainerWidth] = useState(0);
  const isWide = SCREEN_WIDTH > 768;

  const onLayout = (event: any) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width - 40);
  };

  const chartWidthToUse =
    containerWidth > 0
      ? containerWidth
      : isWide
      ? (SCREEN_WIDTH - 340) / 2
      : SCREEN_WIDTH - 60;

  return (
    <View style={styles.chartCard} onLayout={onLayout}>
      <Text style={styles.chartTitle}>Income Tracker</Text>
      <View style={{ alignItems: 'center' }}>
        <LineChart
          data={{
            labels: data.labels,
            datasets: [
              {
                data: data.expected,
                color: () => '#5DADE2',
                strokeWidth: 2,
              },
              {
                data: data.received,
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
          <View style={[styles.legendLine, { backgroundColor: '#5DADE2' }]} />
          <Text style={styles.legendText}>Expected</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendLine, { backgroundColor: '#EE2529' }]} />
          <Text style={styles.legendText}>Received</Text>
        </View>
      </View>
    </View>
  );
};

export const LeaseRenewalsCard = ({ renewals }: { renewals: any[] }) => {
  const isWide = SCREEN_WIDTH > 768;
  return (
    <View style={styles.tableCard}>
      <View style={styles.tableHeader}>
        <Text style={styles.tableTitle}>Upcoming Lease Renewals</Text>
        <Text style={styles.expiringBadge}>
          {renewals.length} Expiring Soon
        </Text>
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
            { width: isWide ? '100%' : 700, minWidth: '100%' },
          ]}
        >
          <View style={styles.tableRow}>
            <Text style={[styles.tableHeaderText, { flex: 1.5 }]}>
              Property
            </Text>
            <Text style={[styles.tableHeaderText, { flex: 1 }]}>Location</Text>
            <Text style={[styles.tableHeaderText, { flex: 1.2 }]}>Tenant</Text>
            <Text style={[styles.tableHeaderText, { flex: 1 }]}>
              Expiry Date
            </Text>
            <Text style={[styles.tableHeaderText, { flex: 1.2 }]}>
              Annual Rent
            </Text>
            <Text style={[styles.tableHeaderText, { flex: 0.8 }]}>Action</Text>
          </View>

          {renewals.map(item => (
            <View key={item.id} style={[styles.tableRow, styles.tableDataRow]}>
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
  );
};

const PortfolioTab = () => {
  const { user } = useAuth();
  const { getProperties, loading: propertiesLoading } = usePropertyAPIs();
  const [propertiesOwned, setPropertiesOwned] = useState<Property[]>([]);

  useEffect(() => {
    if (user?.userId) {
      // Fetch properties added by the current user
      const query = `addedBy=${user.userId}`;

      getProperties((data: any[]) => {
        if (Array.isArray(data)) {
          const formattedProps: Property[] = data.map((item: any) => ({
            id: item.propertyId,
            title: item.propertyType || 'Property',
            location: `${item.microMarket || ''}, ${item.city || ''}`.trim() || 'N/A',
            price: item.sellingPrice ? `₹${item.sellingPrice}` : 'N/A',
            rent: item.annualGrossRent ? `₹${item.annualGrossRent}` : 'N/A',
            tenure: item.leaseEndDate ? `${new Date(item.leaseEndDate).toLocaleDateString()}` : 'N/A',
            roi: item.grossRentalYield ? `${item.grossRentalYield}%` : 'N/A',
            type: item.propertyType || 'N/A',
            images: item.media && item.media.length > 0 
              ? item.media.map((m: any) => m.fileUrl) 
              : null,
            isVerified: item.isVerified,
            verified: item.isVerified === 'completed',
            badges: item.ownershipType ? [item.ownershipType] : [],
            raw: item
          }));
          setPropertiesOwned(formattedProps);
        }
      }, (err: any) => {
        console.error('Failed to fetch properties:', err);
      }, query);
    }
  }, [user?.userId, user?.role]);

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

  const incomeData = {
    labels: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'],
    expected: [45, 50, 52, 55, 55],
    received: [45, 52, 50, 55, 58],
  };

  const { width } = Dimensions.get('window');
  const isDesktop = width > 1024;

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
        <DiversificationCard data={diversificationData} />
        <IncomeTrackerCard data={incomeData} />
      </View>

      <LeaseRenewalsCard renewals={leaseRenewals} />

      {/* Properties Owned */}

      <View style={styles.propertiesSection}>
        <Text style={styles.sectionTitle}>Properties Owned</Text>
        <View style={styles.propertiesGrid}>
          {propertiesLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color={COLORS.primary} size="large" />
              <Text style={styles.loadingText}>Loading properties...</Text>
            </View>
          ) : propertiesOwned.length > 0 ? (
            propertiesOwned.map(property => (
              <PropertyCard
                key={property.id}
                item={{ ...property, raw: { userId: user?.userId } }}
                width={isDesktop ? '48%' : '100%'}
                noView={false}
              />
            ))
          ) : (
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyText}>No properties found in your portfolio.</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

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
    minWidth: 200,
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    marginBottom: 20,
  },
  chartCard: {
    flex: 1,
    minWidth: 350,
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
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    justifyContent: 'center',
    marginTop: 10,
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
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 14,
  },
  emptyStateContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  emptyText: {
    color: '#999',
    textAlign: 'center',
    fontSize: 14,
  },
});

export default PortfolioTab;
