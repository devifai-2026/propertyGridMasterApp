import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Layout from '../../layout/Layout';
import { COLORS } from '../../constants/theme';

const PrivacyPolicyScreen = () => {
  return (
    <Layout>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Privacy Policy</Text>
          <Text style={styles.lastUpdated}>Last Updated: October 2025</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.paragraph}>
            Your privacy is important to us. It is our policy to respect your
            privacy regarding any information we may collect from you across our
            website, other sites we own and operate.
          </Text>

          <Text style={styles.heading}>1. Information We Collect</Text>
          <Text style={styles.paragraph}>
            We only ask for personal information when we truly need it to
            provide a service to you. We collect it by fair and lawful means,
            with your knowledge and consent. We also let you know why we’re
            collecting it and how it will be used.
          </Text>

          <Text style={styles.heading}>2. How We Use Information</Text>
          <Text style={styles.paragraph}>
            We simply store the data we collect for as long as necessary to
            provide you with your requested service. What data we store, we’ll
            protect within commercially acceptable means to prevent loss and
            theft, as well as unauthorized access, disclosure, copying, use or
            modification.
          </Text>

          <Text style={styles.heading}>3. Sharing of Information</Text>
          <Text style={styles.paragraph}>
            We don’t share any personally identifying information publicly or
            with third-parties, except when required to by law.
          </Text>

          <Text style={styles.heading}>4. Your Rights</Text>
          <Text style={styles.paragraph}>
            You are free to refuse our request for your personal information,
            with the understanding that we may be unable to provide you with
            some of your desired services.
          </Text>

          <Text style={styles.paragraph}>
            Your continued use of our website will be regarded as acceptance of
            our practices around privacy and personal information. If you have
            any questions about how we handle user data and personal
            information, feel free to contact us.
          </Text>
        </View>
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    paddingBottom: 60,
  },
  header: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    marginBottom: 0,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 8,
  },
  lastUpdated: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  content: {
    maxWidth: 800,
    width: '90%',
    alignSelf: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: COLORS.white,
    marginTop: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  heading: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.textDark,
    marginTop: 24,
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 16,
    color: COLORS.textSecondary,
    lineHeight: 26,
    marginBottom: 16,
  },
});

export default PrivacyPolicyScreen;
