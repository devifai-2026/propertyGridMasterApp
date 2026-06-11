import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Linking,
  ActivityIndicator,
} from 'react-native';
import {
  MessageCircle,
  Phone,
  Mail,
  CheckCircle,
  AlertCircle,
} from 'lucide-react-native';
import Layout from '../../layout/Layout';
import { COLORS, FONTS } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import { usePropertyAPIs } from '../../../helpers/hooks/propertyAPIs/usePropertyApis';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SupportScreen = () => {
  const { user } = useAuth();
  const { createSupportRequest, loading } = usePropertyAPIs();

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

  const SUPPORT_EMAIL = 'support@preleasegrid.com';
  const SUPPORT_PHONE = '+919876543210';

  // Prefill from the logged-in user when available.
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.mobileNumber || user?.mobile || '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitState, setSubmitState] = useState<'idle' | 'success' | 'error'>(
    'idle',
  );
  const [submitMessage, setSubmitMessage] = useState('');

  const setField = (key: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }));
    if (submitState !== 'idle') setSubmitState('idle');
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = 'Name is required';
    if (!form.message.trim()) next.message = 'Message is required';
    if (form.email.trim() && !EMAIL_REGEX.test(form.email.trim()))
      next.email = 'Please enter a valid email address';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = () => {
    if (loading) return;
    if (!validate()) return;

    createSupportRequest(
      {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        subject: form.subject.trim(),
        message: form.message.trim(),
      },
      () => {
        setSubmitState('success');
        setSubmitMessage('Your request has been submitted');
        // Reset the free-text fields; keep prefilled identity fields.
        setForm(prev => ({ ...prev, subject: '', message: '' }));
      },
      (error: any) => {
        setSubmitState('error');
        setSubmitMessage(
          error?.response?.data?.message ||
            error?.message ||
            'Something went wrong. Please try again.',
        );
      },
    );
  };

  const handleContactSupport = () => {
    Linking.openURL(`mailto:${SUPPORT_EMAIL}`);
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

          {/* Support Request Form */}
          <View style={styles.formCard}>
            <Text style={styles.sectionTitle}>Need Assistance?</Text>
            <Text style={styles.formIntro}>
              Send us your query and our team will get back to you. Works for
              guests and logged-in users alike.
            </Text>

            {submitState === 'success' && (
              <View style={[styles.banner, styles.bannerSuccess]}>
                <CheckCircle size={20} color={COLORS.success} />
                <Text style={[styles.bannerText, { color: COLORS.success }]}>
                  {submitMessage}
                </Text>
              </View>
            )}
            {submitState === 'error' && (
              <View style={[styles.banner, styles.bannerError]}>
                <AlertCircle size={20} color={COLORS.error} />
                <Text style={[styles.bannerText, { color: COLORS.error }]}>
                  {submitMessage}
                </Text>
              </View>
            )}

            <View style={styles.field}>
              <Text style={styles.label}>
                Name <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                placeholder="Your full name"
                placeholderTextColor="#999"
                value={form.name}
                onChangeText={v => setField('name', v)}
              />
              {!!errors.name && (
                <Text style={styles.errorText}>{errors.name}</Text>
              )}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder="you@example.com"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
                value={form.email}
                onChangeText={v => setField('email', v)}
              />
              {!!errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Phone</Text>
              <TextInput
                style={styles.input}
                placeholder="Your phone number"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
                value={form.phone}
                onChangeText={v => setField('phone', v)}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Subject</Text>
              <TextInput
                style={styles.input}
                placeholder="What is this about?"
                placeholderTextColor="#999"
                value={form.subject}
                onChangeText={v => setField('subject', v)}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>
                Message <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[
                  styles.input,
                  styles.textArea,
                  errors.message && styles.inputError,
                ]}
                placeholder="Tell us how we can help…"
                placeholderTextColor="#999"
                multiline
                numberOfLines={5}
                textAlignVertical="top"
                value={form.message}
                onChangeText={v => setField('message', v)}
              />
              {!!errors.message && (
                <Text style={styles.errorText}>{errors.message}</Text>
              )}
            </View>

            <TouchableOpacity
              style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
              onPress={handleSubmit}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.submitBtnText}>Submit Request</Text>
              )}
            </TouchableOpacity>
          </View>

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
                onPress={() => Linking.openURL(`tel:${SUPPORT_PHONE}`)}
              >
                <Phone size={24} color="#EE2529" />
                <Text style={styles.contactCardText}>Call Us</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.contactCard}
                onPress={handleContactSupport}
              >
                <Mail size={24} color="#EE2529" />
                <Text style={styles.contactCardText}>Email Us</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.contactCard}
                onPress={handleContactSupport}
              >
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
    fontFamily: FONTS.main,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
    fontFamily: FONTS.main,
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EEE',
    padding: 24,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  formIntro: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    lineHeight: 20,
    fontFamily: FONTS.main,
  },
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
    fontFamily: FONTS.main,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
    fontFamily: FONTS.main,
  },
  required: {
    color: '#EE2529',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1A1A1A',
    backgroundColor: '#FAFAFA',
    fontFamily: FONTS.main,
  },
  textArea: {
    minHeight: 120,
  },
  inputError: {
    borderColor: '#EE2529',
  },
  errorText: {
    color: '#EE2529',
    fontSize: 12,
    marginTop: 4,
    fontFamily: FONTS.main,
  },
  submitBtn: {
    backgroundColor: '#EE2529',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    minHeight: 50,
  },
  submitBtnDisabled: {
    opacity: 0.7,
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: FONTS.main,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 10,
    marginBottom: 20,
  },
  bannerSuccess: {
    backgroundColor: '#E8F5E9',
    borderWidth: 1,
    borderColor: '#A5D6A7',
  },
  bannerError: {
    backgroundColor: '#FDECEA',
    borderWidth: 1,
    borderColor: '#F5C6C2',
  },
  bannerText: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    fontFamily: FONTS.main,
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
    fontFamily: FONTS.main,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    fontFamily: FONTS.main,
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
    fontFamily: FONTS.main,
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
    fontFamily: FONTS.main,
  },
});

export default SupportScreen;
