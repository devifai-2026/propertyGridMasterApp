import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  Linking,
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
      <View style={styles.contentWrapper}>
        <View style={styles.topSection}>
          {/* Logo Section */}
          <View style={styles.logoColumn}>
            <TouchableOpacity onPress={() => handleNavigate('/')}>
              <Image
                source={require('../assets/Footer/logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          {/* Quick Links */}
          <View style={styles.linksColumn}>
            <Text style={styles.columnTitle}>Quick Links</Text>
            <TouchableOpacity
              onPress={() => handleNavigate('/explore-properties')}
              style={styles.linkItem}
            >
              <Text style={styles.linkText}>Explore Properties</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleNavigate('/calculators')}
              style={styles.linkItem}
            >
              <Text style={styles.linkText}>Calculators</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleNavigate('/explore-brokers')}
              style={styles.linkItem}
            >
              <Text style={styles.linkText}>Explore Brokers</Text>
            </TouchableOpacity>
          </View>

          {/* Resources */}
          <View style={styles.linksColumn}>
            <Text style={styles.columnTitle}>Resources</Text>
            <TouchableOpacity
              onPress={() => handleNavigate('/blogs')}
              style={styles.linkItem}
            >
              <Text style={styles.linkText}>Blogs</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleNavigate('/how-it-works')}
              style={styles.linkItem}
            >
              <Text style={styles.linkText}>How it Works</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleNavigate('/contact-us')}
              style={styles.linkItem}
            >
              <Text style={styles.linkText}>Contact Us</Text>
            </TouchableOpacity>
          </View>

          {/* Legal */}
          <View style={styles.linksColumn}>
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
          <Text style={styles.copyrightText}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            varius enim in eros elementum tristique. Duis cursus, mi quis
            viverra ornare, eros dolor interdum nulla, ut commodo diam libero
            vitae erat. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Suspendisse varius enim in eros elementum tristique. Duis cursus, mi
            quis viverra ornare, eros dolor interdum nulla, ut commodo diam
            libero vitae erat.
          </Text>

          <View style={styles.footerBottomRow}>
            <Text style={styles.copyrightLabel}>
              © 2025 PreLeaseGrid | All Rights Reserved
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
    backgroundColor: '#000000',
    width: '100%',
    paddingVertical: 64,
  },
  contentWrapper: {
    maxWidth: 1440,
    width: '95%',
    alignSelf: 'center',
    paddingHorizontal: 24,
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  logoColumn: {
    flex: 1,
    minWidth: 200,
    marginBottom: 20,
  },
  logo: {
    height: 90, // approximate 4rem
    width: 350, // adjust based on aspect ratio
  },
  linksColumn: {
    flex: 1,
    minWidth: 150,
    marginBottom: 20,
  },
  columnTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    fontFamily: 'Montserrat',
  },
  linkItem: {
    marginBottom: 12,
  },
  linkText: {
    color: '#9CA3AF', // gray-400
    fontSize: 14,
    fontFamily: 'Montserrat',
  },
  divider: {
    height: 1,
    backgroundColor: '#374151', // gray-700
    marginVertical: 5,
  },
  bottomSection: {
    //
  },
  copyrightText: {
    color: '#9CA3AF', // gray-400
    fontSize: 14,
    lineHeight: 24,
    marginBottom: 20,
  },
  footerBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
  },
  copyrightLabel: {
    color: '#6B7280', // gray-500
    fontSize: 14,
  },
  socialIcons: {
    flexDirection: 'row',
    gap: 16,
  },
  iconContainer: {
    padding: 4,
  },
  socialIcon: {
    width: 24,
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
