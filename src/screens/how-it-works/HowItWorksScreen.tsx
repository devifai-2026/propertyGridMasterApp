import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import {
  Search,
  BarChart2,
  Handshake,
  FilePlus,
  ShieldCheck,
  Users,
  ArrowRight,
  ChevronRight,
} from 'lucide-react-native';
import Layout from '../../layout/Layout';
import { useNavigation } from '../../context/NavigationContext';

type TabType = 'investor' | 'owner';

const HowItWorksScreen = () => {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const [activeTab, setActiveTab] = useState<TabType>('investor');
  const { navigate } = useNavigation();

  const investorSteps = [
    {
      id: 1,
      icon: <Search size={32} color="#EE2529" />,
      title: 'Discover Properties',
      description:
        'Explore our vast database of pre-leased commercial properties. Use advanced filters to find the perfect match for your investment goals.',
    },
    {
      id: 2,
      icon: <BarChart2 size={32} color="#EE2529" />,
      title: 'Analyze Data',
      description:
        'Access detailed analytics, including rental yield, ROI calculations, and market trends, to make informed databacked decisions.',
    },
    {
      id: 3,
      icon: <Handshake size={32} color="#EE2529" />,
      title: 'Connect & Invest',
      description:
        'Directly connect with property owners or verified brokers. Negotiate terms and close deals seamlessly through our platform.',
    },
  ];

  const ownerSteps = [
    {
      id: 1,
      icon: <FilePlus size={32} color="#EE2529" />,
      title: 'List Your Property',
      description:
        'Submit your property details through our easy-to-use listing form. Provide key information like location, lease terms, and pricing.',
    },
    {
      id: 2,
      icon: <ShieldCheck size={32} color="#EE2529" />,
      title: 'Get Verified',
      description:
        'Our team reviews and verifies your listing to ensure authenticity, building trust with potential investors and tenants.',
    },
    {
      id: 3,
      icon: <Users size={32} color="#EE2529" />,
      title: 'Reach Investors',
      description:
        'Your property goes live to our network of active investors. Receive inquiries and manage interest directly from your dashboard.',
    },
  ];

  const currentSteps = activeTab === 'investor' ? investorSteps : ownerSteps;

  return (
    <Layout>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <Text style={styles.heroTitle}>How It Works</Text>
            <Text style={styles.heroSubtitle}>
              Whether you're looking to grow your wealth or monetize your
              assets, we make the process simple, transparent, and efficient.
            </Text>
          </View>

          {/* Tab Switcher */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === 'investor' && styles.activeTab,
              ]}
              onPress={() => setActiveTab('investor')}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'investor' && styles.activeTabText,
                ]}
              >
                For Investors
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === 'owner' && styles.activeTab,
              ]}
              onPress={() => setActiveTab('owner')}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'owner' && styles.activeTabText,
                ]}
              >
                For Property Owners
              </Text>
            </TouchableOpacity>
          </View>

          {/* Steps Grid */}
          <View
            style={[
              styles.stepsContainer,
              isMobile
                ? styles.stepsContainerMobile
                : styles.stepsContainerDesktop,
            ]}
          >
            {currentSteps.map((step, index) => (
              <React.Fragment key={step.id}>
                {/* Step Card */}
                <View style={styles.stepCard}>
                  <View style={styles.iconWrapper}>
                    {step.icon}
                    <View style={styles.stepNumberBadge}>
                      <Text style={styles.stepNumberText}>{step.id}</Text>
                    </View>
                  </View>
                  <Text style={styles.stepTitle}>{step.title}</Text>
                  <Text style={styles.stepDescription}>{step.description}</Text>
                </View>

                {/* Arrow Connector (Desktop only, between steps) */}
                {!isMobile && index < currentSteps.length - 1 && (
                  <View style={styles.arrowContainer}>
                    <ChevronRight size={24} color="#E0E0E0" />
                  </View>
                )}
              </React.Fragment>
            ))}
          </View>

          {/* CTA Section */}
          <View style={styles.ctaSection}>
            {/* Using a simple gradient-like background view instead of image for reliability if assets missings
              But styling a view is safer. Let's just use a colored view with some style. */}
            <View style={styles.ctaBackground}>
              <View style={styles.ctaContent}>
                <Text style={styles.ctaTitle}>
                  Ready to Start Your Journey?
                </Text>
                <Text style={styles.ctaText}>
                  Join thousands of users who have transformed their real estate
                  experience with us.
                </Text>
                <TouchableOpacity
                  style={styles.ctaButton}
                  onPress={() =>
                    navigate(
                      activeTab === 'investor'
                        ? '/explore-properties'
                        : '/list-property',
                    )
                  }
                >
                  <Text style={styles.ctaButtonText}>
                    {activeTab === 'investor'
                      ? 'Explore Properties'
                      : 'List Your Property'}
                  </Text>
                  <ArrowRight size={20} color="#EE2529" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  container: {
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 50,
  },
  heroTitle: {
    fontSize: 42,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 16,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    maxWidth: 700,
    lineHeight: 28,
  },
  tabContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 50,
    padding: 6,
    marginBottom: 60,
  },
  tabButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 40,
  },
  activeTab: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#888',
  },
  activeTabText: {
    color: '#EE2529',
  },
  stepsContainer: {
    width: '100%',
    marginBottom: 80,
  },
  stepsContainerDesktop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  stepsContainerMobile: {
    flexDirection: 'column',
    gap: 40,
  },
  stepCard: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  arrowContainer: {
    paddingTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  stepNumberBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EE2529',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  stepNumberText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  ctaSection: {
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#1A1A1A',
  },
  ctaBackground: {
    width: '100%',
    padding: 60,
    alignItems: 'center',
  },
  ctaContent: {
    alignItems: 'center',
    maxWidth: 600,
  },
  ctaTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  ctaText: {
    fontSize: 18,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 28,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 50,
    gap: 12,
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#EE2529',
    whiteSpace: 'nowrap',
  },
});

export default HowItWorksScreen;
