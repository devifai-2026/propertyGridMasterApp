import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { useNavigation } from '../context/NavigationContext';
import instagram from '../assets/Footer/Instagram.png';
import linkedin from '../assets/Footer/linkedin.png';
import youtube from '../assets/Footer/youtube.png';


const errorPages = [
  { code: '404', title: 'Page Not Found' },
  { code: '500', title: 'Internal Server Error' },
  { code: '503', title: 'Service Unavailable' },
  { code: '403', title: 'Forbidden' },
];

const Footer = () => {
  const { width } = useWindowDimensions();
  const { navigate } = useNavigation();
  const [errorPagesOpen, setErrorPagesOpen] = useState(false);

  // Hide on mobile (breakpoint 768px for example)
  if (width < 768) {
    return null;
  }

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <View style={styles.footerContainer}>
      <View style={[styles.contentWrapper, isMobile && styles.contentWrapperMobile]}>
        {/* Top Section: Logo + 3 columns */}
        <View style={[styles.topSection, isMobile && styles.topSectionMobile]}>
          {/* Logo (image) */}
          <View style={[styles.logoColumn, isMobile && styles.logoColumnMobile]}>
            <TouchableOpacity onPress={() => handleNavigate('/')}>
              <Image
                source={require('../assets/Footer/logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          {/* Quick Links */}
          <View style={[styles.linksColumn, isMobile && styles.linksColumnMobile]}>
            <Text style={styles.columnTitle}>Quick Links</Text>
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
                <Text style={styles.linkText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Resources */}
          <View style={[styles.linksColumn, isMobile && styles.linksColumnMobile]}>
            <Text style={styles.columnTitle}>Resources</Text>
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
                <Text style={styles.linkText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Legal + Error Pages Dropdown */}
          <View style={[styles.linksColumn, isMobile && styles.linksColumnMobile]}>
            <Text style={styles.columnTitle}>Legal</Text>
            <TouchableOpacity
              onPress={() => handleNavigate('/privacy-policy')}
              style={styles.linkItem}
            >
              <Text style={styles.linkText}>Privacy Policy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleNavigate('/terms-of-service')}
              style={styles.linkItem}
            >
              <Text style={styles.linkText}>Terms of Service</Text>
            </TouchableOpacity>
            <View style={styles.dropdownWrapper}>
              <TouchableOpacity
                onPress={() => setErrorPagesOpen(!errorPagesOpen)}
                style={styles.dropdownTrigger}
              >
                <Text style={styles.linkText}>Error Pages</Text>
                <ChevronDown
                  size={16}
                  color="#9CA3AF"
                  style={{
                    transform: [{ rotate: errorPagesOpen ? '180deg' : '0deg' }],
                  }}
                />
              </TouchableOpacity>
              {errorPagesOpen && (
                <View style={styles.dropdownMenu}>
                  {errorPages.map((page) => (
                    <TouchableOpacity
                      key={page.code}
                      onPress={() => handleNavigate('/error-pages')}
                      style={styles.dropdownItem}
                    >
                      <Text style={styles.dropdownItemText}>
                        {page.code} – {page.title}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          <Text style={styles.descriptionText}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            varius enim in eros elementum tristique. Duis cursus, mi quis viverra
            ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat
            .Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            varius enim in eros elementum tristique. Duis cursus, mi quis viverra
            ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat
            .Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            varius enim in eros elementum tristique. Duis cursus, mi quis viverra
            ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat .Lorem
            ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim
            in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros
            dolor interdum nulla, ut commodo diam libero vitae erat .
          </Text>

          <View style={[styles.footerBottomRow, isMobile && styles.footerBottomRowMobile]}>
            <Text style={styles.copyrightLabel}>
              © 2025 PreLeaseGrid |{'  '}All Rights Reserved
            </Text>
            <View style={styles.socialIcons}>
              <TouchableOpacity style={styles.iconContainer}>
                <Image
                  source={instagram}
                  style={styles.socialIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconContainer}>
                <Image
                  source={linkedin}
                  style={styles.socialIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconContainer}>
                <Image
                  source={youtube}
                  style={styles.socialIcon}
                  resizeMode="contain"
                />
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
    backgroundColor: '#262626',
    width: '100%',
    paddingVertical: 60,
  },
  contentWrapper: {
    maxWidth: 1440,
    width: '95%',
    alignSelf: 'center',
    paddingHorizontal: 40,
  },
  topSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 36,
    flexWrap: 'wrap',
    gap: 24,
  },
  logoColumn: {
    flex: 2,
    minWidth: 260,
    marginBottom: 20,
  },
  logo: {
    height: 100,
    width: 320,
  },
  linksColumn: {
    flex: 1,
    paddingRight: 8,
  },
  linksColumnMobile: {
    width: '100%',
    paddingRight: 0,
    marginBottom: 8,
  },
  columnTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    fontFamily: 'Montserrat',
  },
  linkItem: {
    marginBottom: 14,
  },
  linkText: {
    color: '#9CA3AF',
    fontSize: 14,            // ← slightly larger
    fontFamily: 'Montserrat',
    lineHeight: 22,
  },
  dropdownWrapper: {
    marginTop: 4,
    zIndex: 10,
    width : 200
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
    width: '100%',           // ← full column width like image 2
  },
  dropdownTriggerText: {
    color: '#374151',
    fontSize: 14,
    fontFamily: 'Montserrat',
  },
  divider: {
    height: 1,
    backgroundColor: '#374151', // gray-700
    marginVertical: 32,
  },
  bottomSection: {
    width: '100%',
  },
  copyrightText: {
    color: '#9CA3AF', // gray-400
    fontSize: 14,
    lineHeight: 24,
    marginBottom: 32,
  },
  footerBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
  },
  copyrightLabel: {
    color: '#9CA3AF',
    fontSize: 14,            // ← slightly larger
    fontFamily: 'Montserrat',
  },
  socialIcons: {
    flexDirection: 'row',
    gap: 16,                 // ← more gap between icons like image 2
    alignItems: 'center',
  },
  iconContainer: {
    padding: 2,
  },
  socialIcon: {
    width: 30,               // ← larger icons like image 2
    height: 30,
  },
  socialIcon: {
    width: 40,
    height: 24,
  },
  dropdownWrapper: {
    marginBottom: 12,
  },
  dropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#4B5563',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    width:150,
    backgroundColor:'#ffffff'
  },
  dropdownMenu: {
    marginTop: 4,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ffffff',
    borderRadius: 6,
    paddingVertical: 4,
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  dropdownItemText: {
    color: '#9CA3AF',
    fontSize: 13,
  },
});

export default Footer;