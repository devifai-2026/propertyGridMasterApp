import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { useNavigation } from '../context/NavigationContext';
import instagram from '../assets/Footer/Instagram.png';
import linkedin from '../assets/Footer/linkedin.png';

const Footer = () => {
  const { width } = useWindowDimensions();
  const { navigate } = useNavigation();
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const isDesktop = width >= 1024;

  const handleNavigate = (path: string) => {
    navigate(path);
  };
  return (
    <View style={styles.footerContainer}>
      <View style={[
        styles.contentWrapper,
        isTablet && styles.contentWrapperTablet,
        isMobile && styles.contentWrapperMobile
      ]}>
        {/* Top Section: Logo + 3 columns */}
        <View style={[styles.topSection, isMobile && styles.topSectionMobile]}>
          {/* Logo (image) */}
          <View style={[styles.logoColumn, isMobile && styles.logoColumnMobile]}>
            <TouchableOpacity onPress={() => handleNavigate('/')}>
              <Image
                source={require('../assets/Footer/logo.png')}
                style={[
                  styles.logo,
                  isMobile && styles.logoMobile,
                  isTablet && styles.logoTablet
                ]}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          {/* Quick Links */}
          <View style={[styles.linksColumn, isMobile && styles.linksColumnMobile]}>
            <Text style={[styles.columnTitle, isMobile && { textAlign: 'center' }]}>Quick Links</Text>
            {[
              { label: 'Explore Properties', path: '/explore-properties' },
              { label: 'Calculators', path: '/calculators' },
              { label: 'Explore Brokers', path: '/explore-brokers' },
            ].map((item) => (
              <TouchableOpacity
                key={item.path}
                onPress={() => handleNavigate(item.path)}
                style={styles.linkItem}
              >
                <Text style={[styles.linkText, isMobile && { textAlign: 'center' }]}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Resources */}
          <View style={[styles.linksColumn, isMobile && styles.linksColumnMobile]}>
            <Text style={[styles.columnTitle, isMobile && { textAlign: 'center' }]}>Resources</Text>
            {[
              { label: 'Blogs', path: '/blogs' },
              { label: 'How it Works', path: '/how-it-works' },
              { label: 'Contact Us', path: '/contact-us' },
            ].map((item) => (
              <TouchableOpacity
                key={item.path}
                onPress={() => handleNavigate(item.path)}
                style={styles.linkItem}
              >
                <Text style={[styles.linkText, isMobile && { textAlign: 'center' }]}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Legal + Error Pages Dropdown */}
          <View style={[styles.linksColumn, isMobile && styles.linksColumnMobile]}>
            <Text style={[styles.columnTitle, isMobile && { textAlign: 'center' }]}>Legal</Text>
            <TouchableOpacity
              onPress={() => handleNavigate('/privacy-policy')}
              style={styles.linkItem}
            >
              <Text style={[styles.linkText, isMobile && { textAlign: 'center' }]}>Privacy Policy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleNavigate('/terms-of-service')}
              style={styles.linkItem}
            >
              <Text style={[styles.linkText, isMobile && { textAlign: 'center' }]}>Terms of Service</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          <View style={[styles.footerBottomRow, isMobile && styles.footerBottomRowMobile]}>
            <Text style={styles.copyrightLabel}>
              © 2025 PreLeaseGrid |{'  '}All Rights Reserved
            </Text>
            <View style={styles.socialIcons}>
              <TouchableOpacity style={styles.iconContainer}>
                <Image source={instagram} style={styles.socialIcon} resizeMode="contain" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconContainer}>
                <Image source={linkedin} style={styles.socialIcon} resizeMode="contain" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    backgroundColor: '#1E1E1E',
    width: '100%',
    paddingTop: 52,
    paddingBottom: 32,
  },
  contentWrapper: {
    width: '100%',
    paddingLeft: 85,
    paddingRight: 85,
  },
  contentWrapperMobile: {
    width: '100%',
    paddingHorizontal: 24,
  },
  contentWrapperTablet: {
    width: '100%',
    paddingHorizontal: 40,
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Added this to justify content between
    alignItems: 'flex-start',
    marginBottom: 36,
    flexWrap: 'wrap',
  },
  topSectionMobile: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 32,
  },
  logoColumn: {
    // Removed paddingRight to allow space-between to work properly
  },
  logoColumnMobile: {
    width: '100%',
    paddingRight: 0,
    marginBottom: 8,
    alignItems: 'center',
  },
  logo: {
    width: 400,
    height: 80,
  },
  logoTablet: {
    width: 300,
    height: 60,
  },
  logoMobile: {
    width: 240,
    height: 50,
  },
  linksColumn: {
    paddingRight: 8,
    minWidth: 160,
  },
  linksColumnMobile: {
    width: '100%',
    paddingRight: 0,
    marginBottom: 24,
    alignItems: 'center',
  },
  columnTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
    fontFamily: 'Montserrat',
  },
  linkItem: {
    marginBottom: 14,
  },
  linkText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontFamily: 'Montserrat',
    lineHeight: 22,
  },
  dropdownWrapper: {
    marginTop: 4,
    zIndex: 10,
    width: 200,
  },
  dropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    width: '100%',
  },
  dropdownTriggerText: {
    color: '#374151',
    fontSize: 14,
    fontFamily: 'Montserrat',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 44,
    left: 0,
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 6,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 20,
  },
  dropdownItem: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  dropdownItemText: {
    color: '#6B7280',
    fontSize: 13,
    fontFamily: 'Montserrat',
  },
  divider: {
    height: 1,
    backgroundColor: '#374151',
    marginBottom: 28,
  },
  bottomSection: {
    width: '100%',
  },
  descriptionText: {
    color: '#9CA3AF',
    fontSize: 14,
    lineHeight: 26,
    marginBottom: 28,
    fontFamily: 'Montserrat',
  },
  footerBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
    flexWrap: 'wrap',
    gap: 16,
  },
  footerBottomRowMobile: {
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: 20,
  },
  copyrightLabel: {
    color: '#9CA3AF',
    fontSize: 14,
    fontFamily: 'Montserrat',
    textAlign: 'center',
  },
  socialIcons: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  iconContainer: {
    padding: 2,
  },
  socialIcon: {
    width: 30,
    height: 30,
  },
});

export default Footer;