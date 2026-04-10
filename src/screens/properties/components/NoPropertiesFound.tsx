import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  ImageBackground,
} from 'react-native';
import { Search, FilterX } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';

interface NoPropertiesFoundProps {
  onReset: () => void;
}

const NoPropertiesFound: React.FC<NoPropertiesFoundProps> = ({ onReset }) => {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 768;

  return (
    <View style={styles.container}>
      <ImageBackground 
        source={require('../../../assets/propertyDetails/squaresbg.png')} 
        style={styles.background}
        resizeMode="repeat"
      >
        <View style={styles.content}>
          <View style={styles.iconCircle}>
            <Search size={50} color="#EE2529" strokeWidth={1.5} />
            <View style={styles.xBadge}>
              <Text style={styles.xText}>×</Text>
            </View>
          </View>
          
          <Text style={[styles.title, isSmallScreen && { fontSize: 24 }]}>
            No Properties Match Your Filters
          </Text>
          
          <Text style={[styles.subtitle, isSmallScreen && { fontSize: 13 }]}>
            We couldn't find any properties matching your current search criteria. Try adjusting your filters or broadening your search.
          </Text>

          <TouchableOpacity onPress={onReset}>
            <LinearGradient
              colors={['#EE2529', '#C73834']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.resetButton}
            >
              <FilterX size={18} color="#FFF" />
              <Text style={styles.resetButtonText}>Reset Filters</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 20,
  },
  background: {
    width: '100%',
    paddingVertical: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 20,
    maxWidth: 600,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFF8E1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    position: 'relative',
  },
  xBadge: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -10 }, { translateY: -12 }],
    backgroundColor: '#FFF8E1',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  xText: {
    color: '#EE2529',
    fontSize: 30,
    fontWeight: '700',
    lineHeight: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#EE2529',
    fontFamily: 'Montserrat',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    fontFamily: 'Montserrat',
    lineHeight: 24,
    marginBottom: 35,
    maxWidth: 500,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 30,
    gap: 10,
  },
  resetButtonText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '600',
    fontFamily: 'Montserrat',
  },
});

export default NoPropertiesFound;
