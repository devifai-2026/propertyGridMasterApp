import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ArrowDown } from 'lucide-react-native';

interface BrokerHeaderProps {
  totalCount: number;
  sortBy: string;
  onToggleSort: () => void;
}

const BrokerHeader: React.FC<BrokerHeaderProps> = ({
  totalCount,
  sortBy,
  onToggleSort,
}) => {
  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <View>
          <Text style={styles.headerTitle}>
            <Text style={{ color: '#EE2529', fontWeight: '800' }}>
              {totalCount}
            </Text>{' '}
            <Text style={{ color: '#EE2529' }}>Agents</Text> available for you
          </Text>
        
        </View>
        <TouchableOpacity style={styles.sortContainer} onPress={onToggleSort}>
          <Text style={styles.sortLabel}>
            Sort by:{' '}
            <Text style={{ color: '#EE2529', fontWeight: '600' }}>
              {sortBy === 'name_asc' ? 'A-Z' : 'Most Listed'}
            </Text>
          </Text>
          <ArrowDown
            size={14}
            color="#EE2529"
            style={{
              transform: [
                { rotate: sortBy === 'name_asc' ? '0deg' : '180deg' },
              ],
            }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: 20,
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
    fontWeight: '400',
  },
  sortContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 18,
    paddingVertical: 10,
   
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sortLabel: {
    fontSize: 16,
    color: '#767676',
    fontWeight: '400',
  },
});

export default BrokerHeader;
