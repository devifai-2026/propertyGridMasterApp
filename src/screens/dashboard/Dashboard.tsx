import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';
import Layout from '../../layout/Layout';
import Hero from './components/Hero';
import DiscoveryWizard from './components/DiscoveryWizard';
import CategoriesSection from './components/CategoriesSection';
import FeaturedSection from './components/FeaturedSection';
import WhyChooseSection from './components/WhyChooseSection';
import { usePropertyAPIs } from '../../../helpers/hooks/propertyAPIs/usePropertyApis';

const Dashboard = () => {
  const { getProperties } = usePropertyAPIs();
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
    <Layout>
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        <Hero />
        <DiscoveryWizard />
        <FeaturedSection properties={properties} />
        <CategoriesSection />
        <WhyChooseSection />
      </Animated.View>
    </Layout>
  );
};

export default Dashboard;
