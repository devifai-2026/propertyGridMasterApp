import React from 'react';
import Layout from '../../layout/Layout';
import Hero from './components/Hero';
import DiscoveryWizard from './components/DiscoveryWizard';
import CategoriesSection from './components/CategoriesSection';
import FeaturedSection from './components/FeaturedSection';
import WhyChooseSection from './components/WhyChooseSection';

const Dashboard = () => {
  return (
    <Layout>
      <Hero />
      <DiscoveryWizard />
      <FeaturedSection />
      <CategoriesSection />
      <WhyChooseSection />
    </Layout>
  );
};

export default Dashboard;
