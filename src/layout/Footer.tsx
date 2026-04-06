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
  const isMobile = width < 768;

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

            {/* Error Pages Dropdown */}
            <View style={styles.dropdownWrapper}>
              <TouchableOpacity
                onPress={() => setErrorPagesOpen(!errorPagesOpen)}
                style={styles.dropdownTrigger}
              >
                <Text style={styles.dropdownTriggerText}>Error Pages</Text>
                <ChevronDown
                  size={16}
                  color="#6B7280"
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
                <Image source={instagram} style={styles.socialIcon} resizeMode="contain" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconContainer}>
                <Image source={linkedin} style={styles.socialIcon} resizeMode="contain" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconContainer}>
                <Image source={youtube} style={styles.socialIcon} resizeMode="contain" />
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
    // maxWidth: 1280,
    width: '100%',           // ← was '90%', now full width
    // paddingHorizontal: 52,   // ← was 20, reduced side padding like image 2
    paddingLeft: 188,
    paddingRight: 80
  },
  contentWrapperMobile: {
    width: '100%',
    paddingHorizontal: 20,
  },
  topSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 36,
    flexWrap: 'wrap',
    // marginLeft: 30,          // ← negative margin to offset column padding
  },
  topSectionMobile: {
    flexDirection: 'column',
    gap: 32,
  },
  logoColumn: {
    // width: '25%',            // ← slightly narrower to give links more room
    paddingRight: 125,
  },
  logoColumnMobile: {
    width: '100%',
    paddingRight: 0,
    marginBottom: 8,
  },
  logo: {
    width: 550,              // ← larger to match image 2
    height: 120,             // ← taller to show full logo icon + text
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
    color: '#FFFFFF',
    fontSize: 18,            // ← slightly larger to match image 2
    fontWeight: '700',
    marginBottom: 20,
    fontFamily: 'Montserrat',
  },
  linkItem: {
    marginBottom: 14,        // ← slightly more spacing like image 2
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
    fontSize: 14,            // ← slightly larger to match image 2
    lineHeight: 26,          // ← more line height like image 2
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
    alignItems: 'flex-start',
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
});

export default Footer;