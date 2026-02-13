import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { ChevronRight, MessageCircle, Phone, Mail } from 'lucide-react-native';
import Layout from '../../layout/Layout';

const SupportScreen = () => {
  const faqs = [
    {
      id: 1,
      question: 'How do I list a property?',
      answer:
        'To list a property, navigate to the "List Property" section from the menu, fill in the required details including property type, location, and pricing, and submit your listing for review.',
    },
    {
      id: 2,
      question: 'Is there a fee for listing?',
      answer:
        'Basic listings are free. We offer premium listing packages that provide higher visibility and additional features for a small fee.',
    },
    {
      id: 3,
      question: 'How can I contact a broker?',
      answer:
        'You can browse our "Explore Brokers" section to find verified brokers in your area. Each broker profile contains their contact information and a button to send a direct inquiry.',
    },
    {
      id: 4,
      question: 'I forgot my password. What should I do?',
      answer:
        'Click on "Sign In" and then select "Forgot Password". Enter your registered email address, and we will send you instructions to reset your password.',
    },
  ];

  const handleContactSupport = () => {
    Linking.openURL('mailto:support@propertygrid.com');
  };

  return (
    <Layout>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Support Center</Text>
          <Text style={styles.subtitle}>How can we help you today?</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
            <View style={styles.faqList}>
              {faqs.map(faq => (
                <View key={faq.id} style={styles.faqItem}>
                  <Text style={styles.faqQuestion}>{faq.question}</Text>
                  <Text style={styles.faqAnswer}>{faq.answer}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.contactSection}>
            <Text style={styles.sectionTitle}>Still need help?</Text>
            <Text style={styles.contactText}>
              Our support team is available 24/7 to assist you.
            </Text>

            <View style={styles.contactOptions}>
              <TouchableOpacity
                style={styles.contactCard}
                onPress={() => Linking.openURL('tel:+1234567890')}
              >
                <Phone size={24} color="#EE2529" />
                <Text style={styles.contactCardText}>Call Us</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.contactCard}
                onPress={() =>
                  Linking.openURL('mailto:support@propertygrid.com')
                }
              >
                <Mail size={24} color="#EE2529" />
                <Text style={styles.contactCardText}>Email Us</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.contactCard} onPress={() => {}}>
                <MessageCircle size={24} color="#EE2529" />
                <Text style={styles.contactCardText}>Chat Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  container: {
    maxWidth: 1000,
    alignSelf: 'center',
    width: '100%',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
  },
  faqList: {
    gap: 16,
  },
  faqItem: {
    backgroundColor: '#F9F9F9',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  contactSection: {
    alignItems: 'center',
    backgroundColor: '#FFF0F0',
    padding: 30,
    borderRadius: 16,
  },
  contactText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  contactOptions: {
    flexDirection: 'row',
    gap: 20,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  contactCard: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    gap: 10,
    minWidth: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  contactCardText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
});

export default SupportScreen;
