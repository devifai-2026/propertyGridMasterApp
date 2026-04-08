import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  ActivityIndicator,
  Image,
} from 'react-native';
import Layout from '../../layout/Layout';
import { usePropertyAPIs } from '../../../helpers/hooks/propertyAPIs/usePropertyApis';
import BrokerHeader from './components/BrokerHeader';
import BrokerCard from './components/BrokerCard';
import BrokerPagination from './components/BrokerPagination';

import bg from "../../assets/Calculator/bg.png"

const ExploreBrokersScreen = () => {
  const { width, height: screenHeight } = useWindowDimensions();
  const isMobile = width <= 600;
  const isDesktop = width > 1024;

  const { getBrokers, loading } = usePropertyAPIs();
  const [brokers, setBrokers] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState('name_asc');
  const [visibleContactId, setVisibleContactId] = useState<string | null>(null);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const fetchBrokers = (page: number = 1, sort: string = sortBy) => {
    getBrokers(
      (data: any[], meta?: any) => {
        setBrokers(data);
        if (meta && meta.pagination) {
          setPagination(meta.pagination);
        }
      },
      error => {
        console.error('Error fetching brokers:', error);
      },
      `page=${page}&limit=8&sortBy=${sort}`,
    );
  };

  React.useEffect(() => {
    fetchBrokers(1, sortBy);
  }, [sortBy]);

  const toggleSort = () => {
    const nextSort = sortBy === 'name_asc' ? 'properties_desc' : 'name_asc';
    setSortBy(nextSort);
  };

  const handlePageChange = (page: number) => {
    fetchBrokers(page, sortBy);
  };

  return (
    <Layout>
      <View style={{ flex: 1 }}>
        <Image 
          source={bg} 
          style={[styles.backgroundImage, { height: screenHeight * 0.4 }]} 
          resizeMode="cover" 
        />
        <View style={styles.container}>
          <BrokerHeader
            totalCount={pagination.totalCount}
            sortBy={sortBy}
            onToggleSort={toggleSort}
          />

          {loading ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color="#EE2529" />
              <Text style={styles.loadingText}>
                Finding the best agents for you...
              </Text>
            </View>
          ) : brokers.length === 0 ? (
            <View style={styles.centerContainer}>
              <Text style={styles.emptyText}>
                No brokers found at the moment.
              </Text>
            </View>
          ) : (
            <View
              style={[
                styles.gridContainer,
                {
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                },
              ]}
            >
              {brokers.map(item => (
                <BrokerCard
                  key={item.id}
                  item={item}
                  isMobile={isMobile}
                  isDesktop={isDesktop}
                  isVisibleContact={visibleContactId === item.id}
                  onToggleContact={() =>
                    setVisibleContactId(
                      visibleContactId === item.id ? null : item.id,
                    )
                  }
                />
              ))}
            </View>
          )}

          <BrokerPagination
            pagination={pagination}
            onPageChange={handlePageChange}
          />
        </View>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    position: 'absolute',
    top: -100,
    left: 0,
    right: 0,
    zIndex: -1,
  },
  container: {
    backgroundColor: 'transparent',
    minHeight: '100%',
    padding: 20,
    width: '90%',
    maxWidth: 1600,
    alignSelf: 'center',
  },
  gridContainer: {
    paddingBottom: 20,
  },
  centerContainer: {
    padding: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 15,
    color: '#888',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
  },
});

export default ExploreBrokersScreen;
