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

const Hero = () => {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  return (
    <ImageBackground
      source={require('../../../assets/Banner/bannerBg.png')}
      style={[
        styles.heroContainer,
        {
          paddingHorizontal: isMobile ? 20 : 60,
          paddingVertical: isMobile ? 40 : 80,
          width: '100%', // Ensure it takes full width
          overflow: 'hidden', // Ensure borderRadius works
        },
      ]}
      imageStyle={{
        borderRadius: 10,
        resizeMode: 'cover', // Ensure image covers the area
      }}
    >
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: 'rgba(255,255,255,0.0)', // Transparent overlay to verify image visibility first
          borderRadius: 10,
        }}
      />
      <Text style={[styles.heroTitle, { fontSize: isMobile ? 32 : 56 }]}>
        Earn effortlessly with
      </Text>
      <Text style={[styles.heroTitleRed, { fontSize: isMobile ? 32 : 56 }]}>
        PreleaseGrid
      </Text>
      <Text
        style={[
          styles.heroDescription,
          {
            fontSize: isMobile ? 16 : 20,
            paddingHorizontal: isMobile ? 0 : 100,
          },
        ]}
      >
        PreleaseGrid offers carefully curated pre-leased properties designed to
        deliver steady, reliable income — with verified assets, trusted tenants,
        and zero management hassle.
      </Text>
      <TouchableOpacity style={styles.getStartedBtn}>
        <Text style={styles.getStartedText}>Get Started ➔</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  heroContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: '#fff', // Removed solid background
  },
  heroTitle: {
    fontWeight: '400',
    color: '#1A1A1A',
    textAlign: 'center',
    fontFamily: Platform.OS === 'web' ? 'system-ui' : undefined,
  },
  heroTitleRed: {
    fontWeight: '700',
    color: '#D32F2F',
    textAlign: 'center',
    marginBottom: 20,
  },
  heroDescription: {
    color: '#555',
    textAlign: 'center',
    lineHeight: 28,
    maxWidth: 800,
    marginBottom: 40,
  },
  getStartedBtn: {
    backgroundColor: '#D32F2F',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  getStartedText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Hero;
