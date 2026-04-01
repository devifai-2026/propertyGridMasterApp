import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  StyleSheet,
} from 'react-native';
import { COLORS } from '../../../constants/theme';
import LinearGradient from 'react-native-linear-gradient';

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
  const isMobile = width < 900;

  return (
    <View style={[styles.container, isMobile && styles.containerMobile]}>
      <View style={[styles.header, isMobile && styles.headerMobile]}>
        <Text style={[styles.title, isMobile && styles.titleMobile]}>
          Why choose PreLeaseGrid
        </Text>
        <Text style={[styles.subtitle, isMobile && styles.subtitleMobile]}>
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
        {!isMobile && (
          <View
            style={[
              styles.illustrationContainer,
              isMobile && styles.illustrationContainerMobile,
            ]}
          >
            <Image
              source={require('../../../assets/WhyChoose/img.png')}
              style={[
                styles.illustration,
                isMobile && styles.illustrationMobile,
              ]}
              resizeMode="contain"
            />
          </View>
        )}

        {/* Right Side Features */}
        <View
          style={[
            styles.featuresContainer,
            isMobile && styles.featuresContainerMobile,
          ]}
        >
          {FEATURES.map(feature => (
            <FeatureItem key={feature.id} item={feature} />
          ))}
          <TouchableOpacity
            style={[isMobile && styles.exploreBtnMobile]}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#EE2529', '#C73834']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.exploreBtn}
            >
              <Text style={styles.exploreBtnText}>Explore More</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 80,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    paddingHorizontal: 20,
    width: '100%',
  },
  containerMobile: {
    paddingVertical: 40,
    paddingHorizontal: 16,
  },
  header: {
    marginBottom: 60,
    alignItems: 'center',
    width: '100%',
  },
  headerMobile: {
    marginBottom: 40,
  },
  title: {
    fontSize: 42,
    fontWeight: '400',
    color: COLORS.textDark,
    marginBottom: 10,
    textAlign: 'center',
  },
  titleMobile: {
    fontSize: 28,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    maxWidth: 600,
  },
  subtitleMobile: {
    fontSize: 15,
    lineHeight: 22,
    maxWidth: '100%',
  },
  contentContainer: {
    width: '100%',
    maxWidth: '90%',
    justifyContent: 'center',
    alignItems: 'stretch',
    gap: 80,
  },
  illustrationContainer: {
    flex: 1.2,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: 850,
    maxHeight: 650,
  },
  illustrationContainerMobile: {
    flex: 0,
    height: 'auto', // Allow container to size to content
    marginBottom: 40,
    width: '100%',
    alignItems: 'center', // Center the image
  },
  illustration: {
    width: '100%',
    height: '100%',
  },
  illustrationMobile: {
    height: 300, // Explicit height on the image itself
    width: '100%',
    maxWidth: 400, // Prevent it from being too huge on tablets
  },
  featuresContainer: {
    flex: 1,
    paddingLeft: 40,
    maxWidth: 600,
  },
  featuresContainerMobile: {
    paddingLeft: 0,
    width: '100%',
    flex: 0, // Ensure it doesn't try to fill undefined height
    marginTop: 20,
  },
  featureItem: {
    flexDirection: 'row',
    marginBottom: 40,
    alignItems: 'center',
  },
  iconWrapper: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  featureIcon: {
    width: 45,
    height: 45,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  exploreBtn: {
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exploreBtnMobile: {
    alignSelf: 'center',
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  exploreBtnText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 16,
  },
});

export default WhyChooseSection;
