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
import Svg, { Circle, Path } from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, FONTS } from '../../../constants/theme';
import { useNavigation } from '../../../context/NavigationContext';

const GetStartedIcon = () => (
  <Svg width="32" height="32" viewBox="0 0 39 39" fill="none">
    <Circle cx="19.5" cy="19.5" r="19.5" fill="white"/>
    <Path 
      fillRule="evenodd" 
      clipRule="evenodd" 
      d="M25.0596 12.7441C25.2439 12.9284 25.3458 13.1801 25.3429 13.4436L25.2348 23.2809C25.2288 23.8297 24.7789 24.2795 24.2302 24.2855C23.6814 24.2916 23.2413 23.8515 23.2474 23.3027L23.3291 15.8645L13.6779 25.5156C13.2856 25.908 12.6564 25.9149 12.2726 25.5311C11.8888 25.1473 11.8957 24.5181 12.288 24.1257L21.9392 14.4746L14.5009 14.5563C13.9521 14.5623 13.5121 14.1223 13.5181 13.5735C13.5242 13.0247 13.974 12.5749 14.5228 12.5689L24.3601 12.4608C24.6236 12.4579 24.8753 12.5598 25.0596 12.7441Z" 
      fill="#EE2529"
    />
  </Svg>
);

const Hero = () => {
  const { width } = useWindowDimensions();
  const { navigate } = useNavigation();
  const isMobile = width < 768;

  const bannerBg = require('../../../assets/Banner/bannerBg.png');

  const HeroContent = (
    <View
      style={[
        styles.heroContainer,
        {
          paddingHorizontal: isMobile ? 20 : 60,
          paddingVertical: isMobile ? 20 : 30,
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
            fontSize: 18,
          },
        ]}
      >
        PreleaseGrid offers carefully curated pre-leased properties designed to
        deliver steady, reliable income — with verified assets, trusted tenants,
        and zero management hassle.
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
          <GetStartedIcon />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.heroWrapper}>
      <View style={styles.heroBackground}>
        {HeroContent}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  heroWrapper: {
    width: '100%',
    position: 'relative',
  },
  heroBackground: {
    width: '100%',
    minHeight: 600,
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  heroContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  heroTitle: {
    fontFamily: FONTS.avenir,
    fontWeight: '400', 
    color: '#1A1A1A',
    textAlign: 'center',
    textTransform: 'capitalize',
    letterSpacing: 2,
    marginBottom: -10, 
    fontSize:60,
  },
  heroTitleRed: {
    fontFamily: FONTS.avenir,
    fontWeight: '700', 
    color: '#EE2529',
    textAlign: 'center',
    textTransform: 'capitalize',
    marginBottom: 14,
    letterSpacing: -1,
    fontSize:60,
  },
  heroDescription: {
    fontFamily: FONTS.main,
    color: '#262626',
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 600,
    marginBottom: 30,
    fontWeight: '400',
    fontSize:18,
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
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 100,
    width:189,
    height:59,
  },
  getStartedText: {
    fontFamily: FONTS.main,
    color: '#fff',
    fontSize: 16,
    fontWeight: '600', 
    marginRight: 12,
  },
});

export default Hero;
