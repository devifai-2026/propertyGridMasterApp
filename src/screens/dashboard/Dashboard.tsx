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
    getProperties(r => setProperties(r));
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

// {
//     "success": false,
//     "message": "Access token expired",
//     "expired": true,
//     "stack": "Error: Access token expired\n    at /Users/mac/Desktop/This PC/Git/property-grid/pre-lease-server/src/middlewares/auth.js:29:23\n    at /Users/mac/Desktop/This PC/Git/property-grid/pre-lease-server/src/middlewares/auth.js:82:5\n    at /Users/mac/Desktop/This PC/Git/property-grid/pre-lease-server/src/utils/asyncHandler.js:4:7\n    at Layer.handleRequest (/Users/mac/Desktop/This PC/Git/property-grid/pre-lease-server/node_modules/router/lib/layer.js:152:17)\n    at next (/Users/mac/Desktop/This PC/Git/property-grid/pre-lease-server/node_modules/router/lib/route.js:157:13)\n    at Route.dispatch (/Users/mac/Desktop/This PC/Git/property-grid/pre-lease-server/node_modules/router/lib/route.js:117:3)\n    at handle (/Users/mac/Desktop/This PC/Git/property-grid/pre-lease-server/node_modules/router/index.js:435:11)\n    at Layer.handleRequest (/Users/mac/Desktop/This PC/Git/property-grid/pre-lease-server/node_modules/router/lib/layer.js:152:17)\n    at /Users/mac/Desktop/This PC/Git/property-grid/pre-lease-server/node_modules/router/index.js:295:15\n    at processParams (/Users/mac/Desktop/This PC/Git/property-grid/pre-lease-server/node_modules/router/index.js:582:12)"
// }