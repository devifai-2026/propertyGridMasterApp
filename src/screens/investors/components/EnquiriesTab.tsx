import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { ChevronDown } from 'lucide-react-native';

interface Enquiry {
  id: string;
  date: string;
  property: string;
  location: string;
  tenant: string;
  cost: string;
}

const EnquiriesTab = () => {
  const [timeFilter, setTimeFilter] = useState('Last 30 Days');
  const [sortBy, setSortBy] = useState('Date');
  const [showAs, setShowAs] = useState('grid');

  const { width } = Dimensions.get('window');
  const isDesktop = width > 768;

  const enquiries: Enquiry[] = [
    {
      id: '1',
      date: '15/12/2025',
      property: 'Residential Space',
      location: 'Pune',
      tenant: 'AP Realtors',
      cost: '₹2.6 Crore',
    },
    {
      id: '2',
      date: '20/12/2025',
      property: 'Commercial Space',
      location: 'Mumbai',
      tenant: 'Global Innovations',
      cost: '₹3.6 Crore',
    },
    {
      id: '3',
      date: '15/12/2025',
      property: 'Residential Space',
      location: 'Pune',
      tenant: 'AP Realtors',
      cost: '₹2.6 Crore',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Properties Under Enquiry</Text>

        <View style={styles.filtersRow}>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterText}>{timeFilter}</Text>
            <ChevronDown size={16} color="#666" />
          </TouchableOpacity>

          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Sort by:</Text>
            <TouchableOpacity style={styles.filterButton}>
              <Text style={styles.filterText}>{sortBy}</Text>
              <ChevronDown size={16} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Show as:</Text>
            <TouchableOpacity style={styles.filterButton}>
              <ChevronDown size={16} color="#666" />
            </TouchableOpacity>
          </View>
        </View>
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
          {enquiries.map(item => (
            <View key={item.id} style={[styles.tableRow, styles.tableDataRow]}>
              <Text style={[styles.tableDataText, { flex: 1 }]}>
                {item.date}
              </Text>
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
                {item.cost}
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
  filtersRow: {
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  filterText: {
    fontSize: 13,
    color: '#666',
  },
  filterGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filterLabel: {
    fontSize: 13,
    color: '#666',
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
