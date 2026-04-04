import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { Calendar, TrendingUp } from 'lucide-react-native';

interface RentalCardsProps {
  containerStyle?: any;
  data?: {
    grossYield?: string;
    netYield?: string;
    cashFlow?: string;
    paybackPeriod?: string;
  };
}

const RentalCards = ({ containerStyle, data }: RentalCardsProps) => {
  const { width } = useWindowDimensions();

  const isDesktop = width >= 1024;
  const isTablet = width >= 768 && width < 1024;

  const cardWidth = isDesktop
    ? '23%' // 4 columns
    : isTablet
    ? '48%' // 2 columns
    : '100%'; // 1 column on mobile

  const squareSize = (width - 60) / 2; // mobile square calculation (unused for 1 column now)

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.grid}>
        {/* 1 - Gross Rental Yield */}
        <View style={[styles.card, styles.redCard, { width: cardWidth }]}>
          <View style={styles.flexGrow}>
            <Text style={styles.title}>Gross Rental Yield</Text>
            <Text style={styles.redValue}>{data?.grossYield || '13.33%'}</Text>
            <Text style={styles.subText}>% Before expenses</Text>
          </View>

          <View style={styles.bottomText}>
            <Text style={styles.subText}>Return before expenses.</Text>
            <Text style={styles.subText}>Higher %=stronger rental income.</Text>
          </View>
        </View>

        {/* 2 - Net Rental Yield */}
        <View style={[styles.card, styles.blueCard, { width: cardWidth }]}>
          <View style={styles.flexGrow}>
            <Text style={styles.title}>Net Rental Yield</Text>
            <Text style={styles.blueValue}>{data?.netYield || '12.11%'}</Text>
            <Text style={styles.subText}>% After expenses</Text>
          </View>

          <View style={styles.bottomText}>
            <Text style={styles.subText}>Return after all expenses.</Text>
            <Text style={styles.subText}>Shows your real profit.</Text>
          </View>
        </View>

        {/* 3 - Annual Cash Flow */}
        <View style={[styles.card, styles.blueCard, { width: cardWidth }]}>
          <View style={styles.flexGrow}>
            <View style={styles.rowBetween}>
              <Text style={styles.title}>Annual Cash Flow</Text>
              {isDesktop && <TrendingUp size={20} color="#429482" />}
            </View>
            <Text style={styles.greenValue}>
              {data?.cashFlow || '₹5.35 Lakhs'}
            </Text>
            <Text style={styles.subText}>Net annual income</Text>
          </View>

          <View style={styles.bottomText}>
            <Text style={styles.subText}>Net yearly income.</Text>
            <Text style={styles.subText}>Money you can use or reinvest.</Text>
          </View>
        </View>

        {/* 4 - Payback Period */}
        <View style={[styles.card, styles.yellowCard, { width: cardWidth }]}>
          <View style={styles.flexGrow}>
            <View style={styles.rowBetween}>
              <Text style={styles.title}>Payback Period</Text>
              {isDesktop && <Calendar size={20} color="#F7C952" />}
            </View>
            <Text style={styles.yellowValue}>
              {data?.paybackPeriod || '9.1 years'}
            </Text>
            <Text style={styles.subText}>Time to break even</Text>
          </View>

          <View style={styles.bottomText}>
            <Text style={styles.subText}>Years to recover cost.</Text>
            <Text style={styles.subText}>Shorter = quicker returns.</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default RentalCards;

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    paddingHorizontal: 20,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },

  card: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 2,
    justifyContent: 'space-between',
  },

  flexGrow: {
    flex: 1,
  },

  bottomText: {
    marginTop: 10,
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  title: {
    fontSize: 18,
    fontWeight: '600',
  },

  subText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },

  redCard: {
    backgroundColor: '#FDEDEE',
    borderColor: '#C73834',
  },

  blueCard: {
    backgroundColor: '#D7EFF7',
    borderColor: '#26BFCC',
  },

  yellowCard: {
    backgroundColor: '#FFFCF4',
    borderColor: '#F7C952',
  },

  redValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#C73834',
    marginTop: 4,
  },

  blueValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#26BFCC',
    marginTop: 4,
  },

  greenValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#429482',
    marginTop: 4,
  },

  yellowValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#F7C952',
    marginTop: 4,
  },
});
