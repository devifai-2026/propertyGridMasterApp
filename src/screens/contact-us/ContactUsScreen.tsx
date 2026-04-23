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
import bgBanner from "../../assets/Banner/bannerBg.png"
import { FONTS } from '../../constants/theme';

const ContactUsScreen = () => {
  const { width, height } = useWindowDimensions();
  const isSmallScreen = width < 768;
  const headerHeight = height * 0.50;

  useEffect(() => {
    // Scroll to top on mount if needed
  }, []);

  return (
    <Layout>
      <ScrollView
        style={styles.mainContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/* Header Section */}
          <ImageBackground
            source={bgBanner}
            style={[styles.headerBackground, { height: headerHeight }]}
            imageStyle={styles.headerBackgroundImage}
          >
            <View
              style={[
                styles.headerContent,
                isSmallScreen && styles.headerContentMobile,
              ]}
            >
              <View style={[styles.headerTextContainer, isSmallScreen && { alignItems: 'center', paddingRight: 0 }]}>
                <Text style={[styles.title, isSmallScreen && { fontSize: 32, lineHeight: 38, textAlign: 'center' }]}>
                  We're Here to Help
                </Text>
                <Text style={[styles.subtitle, isSmallScreen && { fontSize: 16, textAlign: 'center' }]}>
                  Questions about properties, investments, partnerships, or your
                  account?
                </Text>
                <Text style={[styles.subtitle2, isSmallScreen && { fontSize: 16, textAlign: 'center' }]}>
                  Reach out and we'll get back to you promptly.
                </Text>
              </View>
              <View style={[styles.headerImageContainer, isSmallScreen && { display: 'none' }]}>
                <Image
                  source={require('../../assets/ContactUs/img.png')}
                  style={styles.headerImage}
                  resizeMode="contain"
                />
              </View>
            </View>
          </ImageBackground>

          {/* Content Section */}
          <View style={[styles.contentSection, isSmallScreen && { marginTop: 20 }]}>
            <View style={[styles.sectionHeader, isSmallScreen && { marginTop: 40, padding: 16 }]}>
              <Text style={[styles.sectionTitle, isSmallScreen && { fontSize: 22, textAlign: 'center' }]}>
                Let's Start a Conversation
              </Text>
            </View>

            <View
              style={[
                styles.cardsFormContainer,
                isSmallScreen && styles.cardsFormContainerMobile,
              ]}
            >
              <View style={[styles.cardsWrapper, !isSmallScreen && { flex: 1 }]}>
                <ContactCards />
              </View>
              <View style={[styles.formWrapper, !isSmallScreen && { flex: 1 }]}>
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
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    width: '100%',
    alignSelf: 'center',
  },
  headerBackground: {
    width: '100%',
    paddingBottom: 40,
    justifyContent: 'center',
    overflow: 'visible',
  },
  headerBackgroundImage: {
    resizeMode: 'cover',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: '5%',
    paddingTop: 40,
    maxWidth: '90%',
    alignSelf: 'center',
    width: '100%',
    alignItems: 'center',
    overflow: 'visible',
  },
  headerContentMobile: {
    flexDirection: 'column',
    textAlign: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTextContainer: {
    flex: 1,
    paddingRight: 10,
  },
  title: {
    fontSize: 56,
    fontWeight: 700,
    color: '#262626',
    marginBottom: 20,
    lineHeight: 48,
    fontFamily:FONTS.avenir,
  },
  subtitle: {
    fontSize: 18,
    color: '#333',
    fontWeight: 600,
    marginBottom: 3,
    lineHeight: 24,
    fontFamily:'Montserrat',
  },
  subtitle2: {
    fontSize: 18,
    color: '#333',
    fontWeight: 600,
    lineHeight: 24,
    fontFamily:'Montserrat',
  },
  headerImageContainer: {
    position: 'relative',
    alignItems: 'flex-end',
    justifyContent: 'center',
    overflow: 'visible',
  },
  headerImage: {
    position: 'absolute',
    top: -280,
    right: -100,
    width: 950,
    height: 650,
    zIndex: 20,
  },
  contentSection: {
    paddingHorizontal: '5%',
    maxWidth: '90%',
    alignSelf: 'center',
    width: '100%',
    marginTop: -40,
    marginBottom: 60,
  },
  sectionHeader: {
   
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 30,
    elevation: 4,
    marginTop:200,
    
   
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: 700,
    color: '#EE2529',
    fontFamily:'Montserrat',
  },
  cardsFormContainer: {
    flexDirection: 'row',
    gap: 30,
    alignItems: 'stretch',
  },
  cardsFormContainerMobile: {
    flexDirection: 'column',
    gap: 40,
  },
  cardsWrapper: {
    width: '100%',
  },
  formWrapper: {
    width: '100%',
  },
});

export default ContactUsScreen;
