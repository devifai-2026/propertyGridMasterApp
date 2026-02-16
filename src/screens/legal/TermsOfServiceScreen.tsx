import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Layout from '../../layout/Layout';
import { COLORS } from '../../constants/theme';

const TermsOfServiceScreen = () => {
  return (
    <Layout>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Terms of Service</Text>
          <Text style={styles.lastUpdated}>Effective Date: October 2025</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.heading}>1. Terms</Text>
          <Text style={styles.paragraph}>
            By accessing this property grid web application, you are agreeing to
            be bound by these website Terms and Conditions of Use, all
            applicable laws and regulations, and agree that you are responsible
            for compliance with any applicable local laws.
          </Text>

          <Text style={styles.heading}>2. Use License</Text>
          <Text style={styles.paragraph}>
            Permission is granted to temporarily download one copy of the
            materials (information or software) on PropertyGrid's website for
            personal, non-commercial transitory viewing only. This is the grant
            of a license, not a transfer of title.
          </Text>

          <Text style={styles.heading}>3. Disclaimer</Text>
          <Text style={styles.paragraph}>
            The materials on PropertyGrid's website are provided "as is".
            PropertyGrid makes no warranties, expressed or implied, and hereby
            disclaims and negates all other warranties, including without
            limitation, implied warranties or conditions of merchantability,
            fitness for a particular purpose, or non-infringement of
            intellectual property or other violation of rights.
          </Text>

          <Text style={styles.heading}>4. Limitations</Text>
          <Text style={styles.paragraph}>
            In no event shall PropertyGrid or its suppliers be liable for any
            damages (including, without limitation, damages for loss of data or
            profit, or due to business interruption) arising out of the use or
            inability to use the materials on PropertyGrid's Internet site.
          </Text>

          <Text style={styles.heading}>5. Revisions and Errata</Text>
          <Text style={styles.paragraph}>
            The materials appearing on PropertyGrid's website could include
            technical, typographical, or photographic errors. PropertyGrid does
            not warrant that any of the materials on its website are accurate,
            complete, or current. PropertyGrid may make changes to the materials
            contained on its website at any time without notice.
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

export default TermsOfServiceScreen;
