import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  StyleSheet,
} from 'react-native';
import { COLORS, FONTS } from '../../../constants/theme';
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
        <Image source={item.image} style={styles.featureIcon} resizeMode="contain" />
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

  const handleExplorePress = () => {
    // Add your navigation logic here
    console.log('Explore more pressed');
  };

  return (
    <View style={[styles.container, isMobile && styles.containerMobile]}>
      <View style={[styles.header, isMobile && styles.headerMobile]}>
        <Text style={[styles.title, isMobile && styles.titleMobile]}>
          Why choose PreLeaseGrid
        </Text>
        <Text style={[styles.subtitle, isMobile && styles.subtitleMobile]}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.
        </Text>
      </View>

      <View
        style={[
          styles.contentContainer,
          { flexDirection: isMobile ? 'column' : 'row' },
          isMobile && styles.contentContainerMobile,
        ]}
      >
        {!isMobile && (
          <View style={styles.illustrationContainer}>
            <Image
              source={require('../../../assets/WhyChoose/img.png')}
              style={styles.illustration}
              resizeMode="contain"
            />
          </View>
        )}

        {/* Mobile Illustration - Optional */}
        {isMobile && (
          <View style={styles.illustrationContainerMobile}>
            <Image
              source={require('../../../assets/WhyChoose/img.png')}
              style={styles.illustrationMobile}
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
          {FEATURES.map((feature, index) => (
            <React.Fragment key={feature.id}>
              <FeatureItem item={feature} />
              {index < FEATURES.length - 1 && (
                <View style={styles.divider} />
              )}
            </React.Fragment>
          ))}
          <TouchableOpacity
            style={[styles.exploreBtnWrapper, isMobile && styles.exploreBtnMobile]}
            activeOpacity={0.7}
            onPress={handleExplorePress}
          >
            <LinearGradient
              colors={['#EE2529', '#C73834']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.exploreBtn}
            >
              <Text style={styles.exploreBtnText}>Explore more</Text>
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
    alignItems: 'center',
    paddingHorizontal: 20,
    width: '100%',
  },
  containerMobile: {
    paddingVertical: 50,
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
    color: '#262626',
    marginBottom: 16,
    textAlign: 'center',
    fontFamily: FONTS.avenir,
  },
  titleMobile: {
    fontSize: 32,
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 18,
    color: '#666666',
    textAlign: 'center',
    maxWidth: 1190,
    lineHeight: 28,
    fontFamily: 'Montserrat',
    fontWeight: '400',
  },
  subtitleMobile: {
    fontSize: 15,
    lineHeight: 24,
    paddingHorizontal: 20,
    maxWidth: '100%',
  },
  contentContainer: {
    width: '100%',
    maxWidth: 1300,
    justifyContent: 'center',
    alignItems: 'stretch',
    gap: 80,
  },
  contentContainerMobile: {
    gap: 40,
    maxWidth: '100%',
  },
  illustrationContainer: {
    flex: 1.2,
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: 550,
  },
  illustrationContainerMobile: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  illustration: {
    width: '100%',
    height: '100%',
  },
  illustrationMobile: {
    width: '100%',
    height: 300,
    maxWidth: 400,
  },
  featuresContainer: {
    flex: 1,
    paddingLeft: 10,
    maxWidth: 800,
  },
  featuresContainerMobile: {
    paddingLeft: 0,
    width: '100%',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 8,
  },
  iconWrapper: {
    width: 72,
    height: 72,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    backgroundColor: '#FFF5F5',
    borderRadius: 12,
  },
  featureIcon: {
    width: 50,
    height: 50,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#262626',
    marginBottom: 8,
    fontFamily: 'Montserrat',
    lineHeight: 24,
  },
  featureDescription: {
    fontSize: 16,
    color: '#262626',
    lineHeight: 22,
    fontFamily: 'Montserrat',
    fontWeight: '400',
  },
  exploreBtnWrapper: {
    alignSelf: 'center',
    marginTop: 20,
  },
  exploreBtnMobile: {
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  exploreBtn: {
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 200,
  },
  exploreBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
    fontFamily: 'Montserrat',
  },
  divider: {
  height: 1,
  backgroundColor: '#767676',
  marginVertical: 10,
  marginLeft: 92,  // 👈 iconWrapper width (76) + marginRight (16)
},
});

export default WhyChooseSection;