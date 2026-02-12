import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  Linking,
} from 'react-native';
import { useNavigation } from '../context/NavigationContext';
import { Linkedin, Facebook, Instagram, Youtube } from 'lucide-react-native';

const Footer = () => {
  const { width } = useWindowDimensions();
  const { navigate } = useNavigation();

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
            <TouchableOpacity style={styles.linkItem}>
              <Text style={styles.linkText}>Blogs</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.linkItem}>
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
            <TouchableOpacity style={styles.linkItem}>
              <Text style={styles.linkText}>Privacy Policy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.linkItem}>
              <Text style={styles.linkText}>Terms of Service</Text>
            </TouchableOpacity>
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
                <Linkedin size={24} color="#9CA3AF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconContainer}>
                <Instagram size={24} color="#9CA3AF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconContainer}>
                <Youtube size={24} color="#9CA3AF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconContainer}>
                <Facebook size={24} color="#9CA3AF" />
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
    marginBottom: 40,
  },
  logoColumn: {
    flex: 1,
    minWidth: 200,
    marginBottom: 20,
  },
  logo: {
    height: 60, // approximate 4rem
    width: 200, // adjust based on aspect ratio
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
  },
  linkItem: {
    marginBottom: 12,
  },
  linkText: {
    color: '#9CA3AF', // gray-400
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: '#374151', // gray-700
    marginVertical: 24,
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
});

export default Footer;
