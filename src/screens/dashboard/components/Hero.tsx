import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
  StyleSheet,
} from 'react-native';
import { ArrowUpRight } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, FONTS } from '../../../constants/theme';
import { useNavigation } from '../../../context/NavigationContext';

const Hero = () => {
  const { width } = useWindowDimensions();
  const { navigate } = useNavigation();
  const isMobile = width < 768;

  return (
    <View style={styles.heroWrapper}>
      <View style={styles.gridOverlay} />
      <View
        style={[
          styles.heroContainer,
          {
            paddingHorizontal: isMobile ? 20 : 60,
            paddingVertical: isMobile ? 60 : 120,
          },
        ]}
      >
        <Text style={[styles.heroTitle, { fontSize: isMobile ? 36 : 60 }]}>
          Earn Effortlessly With
        </Text>
        <Text style={[styles.heroTitleRed, { fontSize: isMobile ? 48 : 65 }]}>
          PreleaseGrid
        </Text>
        <Text
          style={[
            styles.heroDescription,
            {
              fontSize: isMobile ? 16 : 23,
            },
          ]}
        >
          PreleaseGrid offers carefully curated pre-leased properties designed
          to deliver steady, reliable income — with verified assets, trusted
          tenants, and zero management hassle.
        </Text>

        <TouchableOpacity
          onPress={() => navigate('/explore-properties')}
          activeOpacity={0.9}
          style={styles.getStartedWrapper}
        >
          <LinearGradient
            colors={['#EE2529', '#C73834']}
            start={{ x: 0.0209, y: 0.5 }}
            end={{ x: 0.9879, y: 0.5 }}
            style={styles.getStartedBtn}
          >
            <Text style={styles.getStartedText}>Get Started</Text>
            <View style={styles.arrowCircle}>
              <ArrowUpRight size={20} color="#EE2529" strokeWidth={3} />
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  heroWrapper: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    position: 'relative',
    overflow: 'hidden',
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.4,
    ...Platform.select({
      web: {
        backgroundImage: `linear-gradient(#f0f0f0 1.5px, transparent 1.5px), linear-gradient(90deg, #f0f0f0 1.5px, transparent 1.5px)`,
        backgroundSize: '60px 60px',
      },
    }),
  },
  heroContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  heroTitle: {
    fontFamily: FONTS.main,
    fontWeight: '400', 
    color: '#1A1A1A',
    textAlign: 'center',
    textTransform: 'capitalize',
    letterSpacing: 2,
    marginBottom: -10, // Pull red text closer
  },
  heroTitleRed: {
    fontFamily: FONTS.main,
    fontWeight: '700', // Bold/Heavy
    color: '#EE2529',
    textAlign: 'center',
    textTransform: 'capitalize',
    marginBottom: 10,
    letterSpacing: -1,
  },
  heroDescription: {
    fontFamily: FONTS.main,
    color: '#777777', // Lighter gray as in ss
    textAlign: 'center',
    lineHeight: 30,
    maxWidth: 750, // Reduced to force 3-line wrap
    marginBottom: 30,
    fontWeight: '400',
  },
  getStartedWrapper: {
    borderRadius: 100,
    overflow: 'hidden',
    shadowColor: '#EE2529',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  getStartedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingLeft: 35,
    paddingRight: 8,
    borderRadius: 100,
  },
  getStartedText: {
    fontFamily: FONTS.main,
    color: '#fff',
    fontSize: 18,
    fontWeight: '500', // Making it a bit more readable than 100
    marginRight: 15,
  },
  arrowCircle: {
    backgroundColor: '#fff',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Hero;
