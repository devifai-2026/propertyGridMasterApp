import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Platform, View } from 'react-native';
import Layout from '../../layout/Layout';
import Hero from './components/Hero';
import DiscoveryWizard from './components/DiscoveryWizard';
import CategoriesSection from './components/CategoriesSection';
import FeaturedSection from './components/FeaturedSection';
import WhyChooseSection from './components/WhyChooseSection';
import { usePropertyAPIs } from '../../../helpers/hooks/propertyAPIs/usePropertyApis';

const Dashboard = () => {
  const { getProperties, loading } = usePropertyAPIs();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const [properties, setProperties] = useState<any[]>([]);
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
    ]).start();
    getProperties(
      r => setProperties(r),
      r => console.log(r),
      'isVerified=completed',
    );
  }, []);
  return (
    <>
      {Platform.OS === 'web' && (
        <View
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: -1,
            backgroundImage: `url(${require('../../assets/Banner/bannerBg.png')})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: 'rgba(255,255,255,0.3)',
            backgroundBlendMode: 'overlay',
          } as any}
        />
      )}
      <Layout style={{ backgroundColor: 'transparent' }}>
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
            backgroundColor: Platform.OS === 'web' ? 'transparent' : 'white',
          }}
        >
          <Hero />
          <DiscoveryWizard />
          <FeaturedSection properties={properties} loading={loading} />
          <CategoriesSection />
          <WhyChooseSection />
        </Animated.View>
      </Layout>
    </>
  );
};

export default Dashboard;
