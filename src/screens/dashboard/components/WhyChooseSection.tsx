import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  StyleSheet,
} from 'react-native';

const FEATURES = [
  {
    id: '1',
    image: require('../../../assets/WhyChoose/one.png'),
    title: 'Platform Verified Every property authenticated',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae ert.',
  },
  {
    id: '2',
    image: require('../../../assets/WhyChoose/two.png'),
    title: '12-18% Returns Guaranteed rental income',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae ert.',
  },
  {
    id: '3',
    image: require('../../../assets/WhyChoose/three.png'),
    title: 'Pre-Leased Only Immediate cash flow',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae ert.',
  },
  {
    id: '4',
    image: require('../../../assets/WhyChoose/four.png'),
    title: 'Premium Tenants Corporate & MNC leases',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae ert.',
  },
];

const FeatureItem = ({ item }: { item: (typeof FEATURES)[0] }) => {
  return (
    <View style={styles.featureItem}>
      <View style={styles.iconWrapper}>
        <Image
          source={item.image}
          style={styles.featureIcon}
          resizeMode="contain"
        />
      </View>
      <View style={styles.featureContent}>
        <Text style={styles.featureTitle}>{item.title}</Text>
        <Text style={styles.featureDescription}>{item.description}</Text>
      </View>
    </View>
  );
};

const WhyChooseSection = () => {
  const { width } = useWindowDimensions();
  const isMobile = width < 900; // Switch to stacked layout below 900px

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Why choose PreLeaseGrid</Text>
        <Text style={styles.subtitle}>
          The most trusted platform for premium real estate Property
        </Text>
      </View>

      <View
        style={[
          styles.contentContainer,
          { flexDirection: isMobile ? 'column' : 'row' },
        ]}
      >
        {/* Left Side Illustration */}
        <View
          style={[
            styles.illustrationContainer,
            isMobile && { marginBottom: 40, flex: 0, height: 'auto' },
          ]}
        >
          <Image
            source={require('../../../assets/WhyChoose/img.png')}
            style={[styles.illustration, isMobile && { height: 300 }]}
            resizeMode="contain"
          />
        </View>

        {/* Right Side Features */}
        <View
          style={[
            styles.featuresContainer,
            isMobile && { paddingLeft: 0, width: '100%', flex: 0 },
          ]}
        >
          {FEATURES.map(feature => (
            <FeatureItem key={feature.id} item={feature} />
          ))}
          <TouchableOpacity style={styles.exploreBtn}>
            <Text style={styles.exploreBtnText}>Explore More</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 80,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 60,
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: '400',
    color: '#1A1A1A',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  contentContainer: {
    width: '100%',
    maxWidth: 1200,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  illustrationContainer: {
    flex: 1,
    height: 500,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustration: {
    width: '100%',
    height: '100%',
  },
  featuresContainer: {
    flex: 1,
    paddingLeft: 40,
    maxWidth: 600,
  },
  featureItem: {
    flexDirection: 'row',
    marginBottom: 40,
    alignItems: 'flex-start',
  },
  iconWrapper: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  featureIcon: {
    width: 50,
    height: 50,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  exploreBtn: {
    backgroundColor: '#D32F2F',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 20,
  },
  exploreBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default WhyChooseSection;
