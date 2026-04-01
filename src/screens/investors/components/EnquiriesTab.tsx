import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { usePropertyAPIs } from '../../../../helpers/hooks/propertyAPIs/usePropertyApis';
import { useNavigation } from '../../../context/NavigationContext';
import { COLORS } from '../../../constants/theme';
import { ActivityIndicator } from 'react-native';

const EnquiriesTab = ({ roleType }: { roleType?: 'investor' | 'broker' }) => {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const { getMyInquiries, loading } = usePropertyAPIs();
  const { navigate } = useNavigation();

  const { width } = Dimensions.get('window');
  const isDesktop = width > 768;

  React.useEffect(() => {
    getMyInquiries((data: any) => {
      if (data && Array.isArray(data)) {
        setEnquiries(data);
      }
    }, undefined, roleType ? `inquirerRoleType=${roleType}` : '');
  }, [roleType]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Properties Under Enquiry</Text>
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
            <Text style={[styles.tableHeaderText, { flex: 1 }]}>Date</Text>
            <Text style={[styles.tableHeaderText, { flex: 1.5 }]}>
              Property
            </Text>
            <Text style={[styles.tableHeaderText, { flex: 1 }]}>Location</Text>
            <Text style={[styles.tableHeaderText, { flex: 1.2 }]}>Tenant</Text>
            <Text style={[styles.tableHeaderText, { flex: 1 }]}>Cost</Text>
            <Text style={[styles.tableHeaderText, { flex: 0.8 }]}>Action</Text>
          </View>

          {/* Table Rows */}
          {loading && enquiries.length === 0 ? (
            <View style={{ padding: 40 }}>
              <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
          ) : enquiries.length === 0 ? (
            <View style={{ padding: 40, alignItems: 'center' }}>
              <Text style={{ color: '#666' }}>No enquiries found.</Text>
            </View>
          ) : (
            enquiries.map(item => (
              <View key={item.id} style={[styles.tableRow, styles.tableDataRow]}>
                <Text style={[styles.tableDataText, { flex: 1 }]}>
                  {new Date(item.createdAt).toLocaleDateString()}
                </Text>
                <Text style={[styles.tableDataText, { flex: 1.5 }]}>
                  {item.property?.propertyType} Space
                </Text>
                <Text style={[styles.tableDataText, { flex: 1 }]}>
                  {item.property?.city}
                </Text>
                <Text style={[styles.tableDataText, { flex: 1.2 }]}>
                  {item.inquirer?.firstName} {item.inquirer?.lastName}
                </Text>
                <Text style={[styles.tableDataText, { flex: 1 }]}>
                  ₹{item.property?.sellingPrice} Cr
                </Text>
                <TouchableOpacity
                  style={styles.viewButton}
                  onPress={() => navigate(`/enquiry-details/${item.id}`)}
                >
                  <Text style={styles.viewButtonText}>view</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#EE2529',
    marginBottom: 20,
  },
  table: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
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
});

export default EnquiriesTab;
