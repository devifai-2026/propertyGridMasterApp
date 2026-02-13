import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Image,
  useWindowDimensions,
} from 'react-native';
import ContactCards from './components/ContactCards';
import ContactForm from './components/ContactForm';
import Layout from '../../layout/Layout';

const ContactUsScreen = () => {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 768;

  useEffect(() => {
    // Scroll to top on mount if needed
  }, []);

  return (
    <Layout>
      <ScrollView
        style={styles.mainContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/* Header Section */}
          <ImageBackground
            //   source={require('../../assets/propertyDetails/squaresbg.png')} // path relative to this file: ../../assets... wait. src/screens/contact-us/ContactUsScreen.tsx -> ../../assets -> src/assets
            // Let's try to be precise.
            // src/screens/contact-us/ContactUsScreen.tsx
            // ../../assets/propertyDetails/squaresbg.png SHOULD work if structure is correct.
            // Actually, let's use a safe fallback color if require fails, but require is compile time.
            source={require('../../assets/propertyDetails/squaresbg.png')}
            style={styles.headerBackground}
            imageStyle={styles.headerBackgroundImage}
          >
            <View
              style={[
                styles.headerContent,
                isSmallScreen && styles.headerContentMobile,
              ]}
            >
              <View style={styles.headerTextContainer}>
                <Text style={styles.title}>We're Here to Help</Text>
                <Text style={styles.subtitle}>
                  Questions about properties, investments, partnerships, or your
                  account?
                </Text>
                <Text style={styles.subtitle2}>
                  Reach out and we'll get back to you promptly.
                </Text>
              </View>
              <View style={styles.headerImageContainer}>
                <Image
                  source={require('../../assets/ContactUs/img.png')}
                  style={styles.headerImage}
                  resizeMode="contain"
                />
              </View>
            </View>
          </ImageBackground>

          {/* Content Section */}
          <View style={styles.contentSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                Let's Start a Conversation
              </Text>
            </View>

            <View
              style={[
                styles.cardsFormContainer,
                isSmallScreen && styles.cardsFormContainerMobile,
              ]}
            >
              <View style={styles.cardsWrapper}>
                <ContactCards />
              </View>
              <View style={styles.formWrapper}>
                <ContactForm />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    width: '100%',
    alignSelf: 'center',
  },
  headerBackground: {
    width: '100%',
    backgroundColor: '#f9f9f9',
    paddingBottom: 40,
  },
  headerBackgroundImage: {
    opacity: 0.1,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: '5%',
    paddingTop: 40,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
    alignItems: 'center',
  },
  headerContentMobile: {
    flexDirection: 'column',
    textAlign: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTextContainer: {
    flex: 1,
    paddingRight: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: '800',
    color: '#000',
    marginBottom: 16,
    lineHeight: 48,
  },
  subtitle: {
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
    marginBottom: 8,
    lineHeight: 28,
  },
  subtitle2: {
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
    lineHeight: 28,
  },
  headerImageContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  headerImage: {
    width: 350,
    height: 350,
    maxWidth: '100%',
  },
  contentSection: {
    paddingHorizontal: '5%',
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
    marginTop: -40,
    marginBottom: 60,
  },
  sectionHeader: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#EE2529',
  },
  cardsFormContainer: {
    flexDirection: 'row',
    gap: 30,
    alignItems: 'flex-start',
  },
  cardsFormContainerMobile: {
    flexDirection: 'column',
    gap: 30,
  },
  cardsWrapper: {
    flex: 1,
    width: '100%',
  },
  formWrapper: {
    flex: 1,
    width: '100%',
  },
});

export default ContactUsScreen;
