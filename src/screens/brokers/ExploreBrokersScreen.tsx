import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import Layout from '../../layout/Layout';
import { MapPin, ArrowDown } from 'lucide-react-native';

const brokers = Array.from({ length: 8 }, (_, index) => ({
  id: index + 1,
  name: 'APJ Realtors',
  agentName: 'Rajendra P',
  location: 'Pune',
  rera: '123456789',
  propertiesListed: 7,
  dealsClosed: 45,
  tags: ['MNC Client', 'Industrial', 'Commercial', 'Office Lease'],
  image: require('../../assets/ExploreBrokers/cardImg.png'),
}));

const ExploreBrokersScreen = () => {
  const { width } = useWindowDimensions();
  const isMobile = width <= 600;
  const isDesktop = width > 1024;

  return (
    <Layout>
      <View style={styles.container}>
        {/* Header Banner */}
        <View style={styles.header}>
          <Image
            source={require('../../assets/propertyDetails/squaresbg.png')}
            style={styles.headerBg}
            resizeMode="cover"
          />
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>
              <Text style={{ color: '#EE2529', fontWeight: 'bold' }}>
                Agents
              </Text>{' '}
              available for you
            </Text>
            <TouchableOpacity style={styles.sortContainer}>
              <Text style={styles.sortLabel}>
                Sort by:{' '}
                <Text style={{ color: '#EE2529', fontWeight: 'bold' }}>
                  A-Z
                </Text>
              </Text>
              <ArrowDown size={14} color="#EE2529" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Grid using Map to avoid nested FlatList inside Layout ScrollView */}
        <View
          style={[
            styles.gridContainer,
            {
              flexDirection: isDesktop ? 'row' : 'column',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            },
          ]}
        >
          {brokers.map(item => (
            <View
              key={item.id}
              style={[styles.card, { width: isDesktop ? '48%' : '100%' }]}
            >
              <Image
                source={require('../../assets/ExploreBrokers/top.png')}
                style={styles.bgPatternTop}
                resizeMode="cover"
              />
              <Image
                source={require('../../assets/ExploreBrokers/bottom.png')}
                style={styles.bgPatternBottom}
                resizeMode="cover"
              />

              <View
                style={[
                  styles.cardContent,
                  { flexDirection: !isMobile ? 'row' : 'column' },
                ]}
              >
                {/* Left Section */}
                <View
                  style={[
                    styles.leftSection,
                    !isMobile
                      ? { flex: 1, alignItems: 'flex-start' }
                      : {
                          width: '100%',
                          alignItems: 'center',
                          marginBottom: 20,
                        },
                  ]}
                >
                  <View
                    style={{ alignItems: isMobile ? 'center' : 'flex-start' }}
                  >
                    <Text style={styles.brokerCompany}>{item.name}</Text>
                    <Image
                      source={item.image}
                      style={styles.brokerImage}
                      resizeMode="contain"
                    />
                  </View>
                  <TouchableOpacity style={styles.contactBtn}>
                    <Text style={styles.contactBtnText}>Contact Broker</Text>
                  </TouchableOpacity>
                </View>

                {/* Right Section */}
                <View
                  style={[
                    styles.rightSection,
                    !isMobile ? { flex: 1.5 } : { width: '100%' },
                  ]}
                >
                  <Text
                    style={[
                      styles.agentName,
                      { textAlign: !isMobile ? 'left' : 'center' },
                    ]}
                  >
                    {item.agentName}
                  </Text>
                  <View
                    style={[
                      styles.locationRow,
                      { justifyContent: !isMobile ? 'flex-start' : 'center' },
                    ]}
                  >
                    <MapPin size={14} color="#EE2529" />
                    <Text style={styles.locationText}>{item.location}</Text>
                    <Text style={styles.reraText}>RERA: {item.rera}</Text>
                  </View>

                  <View
                    style={[
                      styles.divider,
                      { alignSelf: !isMobile ? 'flex-start' : 'center' },
                    ]}
                  />

                  <View style={styles.specializationContainer}>
                    <Text
                      style={[
                        styles.specLabel,
                        { textAlign: !isMobile ? 'left' : 'center' },
                      ]}
                    >
                      Specializes In:
                    </Text>
                    <View
                      style={[
                        styles.tagsRow,
                        {
                          justifyContent: !isMobile ? 'flex-start' : 'center',
                        },
                      ]}
                    >
                      {item.tags.map((tag, idx) => (
                        <View key={idx} style={styles.tag}>
                          <Text style={styles.tagText}>{tag}</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  <View
                    style={[
                      styles.statsRow,
                      { alignItems: !isMobile ? 'flex-start' : 'center' },
                    ]}
                  >
                    <Text style={styles.statText}>
                      <Text style={styles.statHighlight}>
                        {item.propertiesListed}
                      </Text>{' '}
                      Properties Listed
                    </Text>
                    <Text style={styles.statText}>
                      <Text style={styles.statHighlight}>
                        {item.dealsClosed}
                      </Text>{' '}
                      Deals Closed
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    minHeight: '100%',
    padding: 20,
  },
  header: {
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
    opacity: 0.1,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    color: '#333',
  },
  sortContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  sortLabel: {
    fontSize: 14,
    color: '#333',
  },
  gridContainer: {
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  bgPatternTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 200,
    height: 200,
    opacity: 0.1,
  },
  bgPatternBottom: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 150,
    height: 150,
    opacity: 0.1,
  },
  cardContent: {
    padding: 20,
    gap: 20,
  },
  leftSection: {
    flex: 1,
    justifyContent: 'space-between',
  },
  brokerCompany: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#EE2529',
    marginBottom: 10,
  },
  brokerImage: {
    width: 120,
    height: 120,
    marginBottom: 15,
  },
  contactBtn: {
    backgroundColor: '#EE2529', // Gradient placeholder
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: 160,
    alignItems: 'center',
    marginTop: 10,
  },
  contactBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  rightSection: {
    flex: 1.5,
  },
  agentName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#EE2529',
    marginBottom: 5,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
  },
  reraText: {
    fontSize: 14,
    color: '#666',
  },
  divider: {
    height: 1,
    backgroundColor: '#EE2529',
    marginVertical: 10,
    width: 50,
  },
  specializationContainer: {
    marginBottom: 15,
  },
  specLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#FFF3CA',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    color: '#333',
  },
  statsRow: {
    marginTop: 10,
  },
  statText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  statHighlight: {
    color: '#EE2529',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ExploreBrokersScreen;
