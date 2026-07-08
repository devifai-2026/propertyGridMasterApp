import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import ContactCards from './components/ContactCards';
import ContactForm from './components/ContactForm';
import Layout from '../../layout/Layout';

const ContactUsScreen = () => {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 768;

  return (
    <Layout>
      <ScrollView
        style={styles.mainContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/* Content Section */}
          <View style={[styles.contentSection, isSmallScreen && { marginTop: 20 }]}>
            <View style={[styles.sectionHeader, isSmallScreen && { padding: 16 }]}>
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
              {/* Contact form on the left */}
              <View style={[styles.formWrapper, !isSmallScreen && { flex: 1 }]}>
                <ContactForm />
              </View>
              {/* 4 info cards on the right */}
              <View style={[styles.cardsWrapper, !isSmallScreen && { flex: 1 }]}>
                <ContactCards />
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
  contentSection: {
    paddingHorizontal: '5%',
    maxWidth: '90%',
    alignSelf: 'center',
    width: '100%',
    marginTop: 40,
    marginBottom: 60,
  },
  sectionHeader: {
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
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
