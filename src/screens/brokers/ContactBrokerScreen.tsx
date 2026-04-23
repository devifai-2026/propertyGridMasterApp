import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';
import { ChevronDown, Phone, Mail, CheckCircle2 } from 'lucide-react-native';
import InputError from '../../components/common/InputError';
import LinearGradient from 'react-native-linear-gradient';
import Layout from '../../layout/Layout';
import { useNavigation } from '../../context/NavigationContext';
import { useAuth } from '../../context/AuthContext';
import { usePropertyAPIs } from '../../../helpers/hooks/propertyAPIs/usePropertyApis';
import ContactBrokerSVG from './ContactBrokerSVG';

const PROPERTY_TYPES = [
  'Residential',
  'Commercial',
  'Industrial',
  'Office Space',
  'Retail',
  'Warehouse',
  'Land / Plot',
];

const BUDGET_RANGES = [
  'Under ₹25L',
  '₹25L – ₹50L',
  '₹50L – ₹1Cr',
  '₹1Cr – ₹2Cr',
  '₹2Cr – ₹5Cr',
  'Above ₹5Cr',
];

const TIMELINES = [
  'Immediately',
  'Within 3 months',
  'Within 6 months',
  'Within 1 year',
  'Just exploring',
];

interface DropdownProps {
  placeholder: string;
  options: string[];
  value: string;
  onSelect: (val: string) => void;
  zIndex?: number;
}

const Dropdown: React.FC<DropdownProps> = ({
  placeholder,
  options,
  value,
  onSelect,
  zIndex = 10,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <View style={[styles.dropdownWrapper, { zIndex }]}>
      <TouchableOpacity
        style={styles.dropdownTrigger}
        onPress={() => setOpen(prev => !prev)}
        activeOpacity={0.8}
      >
        <Text style={[styles.dropdownValue, !value && { color: '#aaa' }]}>
          {value || placeholder}
        </Text>
        <ChevronDown size={18} color="#666" />
      </TouchableOpacity>
      {open && (
        <View style={styles.dropdownMenu}>
          {options.map(opt => (
            <TouchableOpacity
              key={opt}
              style={styles.dropdownItem}
              onPress={() => {
                onSelect(opt);
                setOpen(false);
              }}
            >
              <Text
                style={[
                  styles.dropdownItemText,
                  value === opt && styles.dropdownItemActive,
                ]}
              >
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const ContactBrokerScreen = () => {
  const { width } = useWindowDimensions();
  const isMobile = width <= 600;
  const { navigate, currentPath } = useNavigation();
  const { user } = useAuth();
  const { contactBroker, loading } = usePropertyAPIs();

  const brokerId = currentPath.split('/contact-broker/')[1] || '';

  const [form, setForm] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phoneNumber: user?.mobileNumber || user?.mobile || '',
    propertyType: '',
    budgetRange: '',
    timeline: '',
    additionalNotes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSuccess, setIsSuccess] = useState(false);

  const set = (key: string, val: string) => {
    setForm(prev => ({ ...prev, [key]: val }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }));
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.fullName.trim()) next.fullName = 'Full name is required';
    if (!form.email.trim()) next.email = 'Email is required';
    if (!form.phoneNumber.trim()) next.phoneNumber = 'Phone number is required';
    if (!form.propertyType) next.propertyType = 'Please select a property type';
    if (!form.budgetRange) next.budgetRange = 'Please select a budget range';
    if (!form.timeline) next.timeline = 'Please select a timeline';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSend = () => {
    if (!validate()) return;
    contactBroker(
      brokerId,
      {
        fullName: form.fullName,
        email: form.email,
        phoneNumber: form.phoneNumber,
        propertyType: form.propertyType,
        budgetRange: form.budgetRange,
        timeline: form.timeline,
        additionalNotes: form.additionalNotes,
      },
      () => {
        setIsSuccess(true);
      },
      err => {
        console.error('Contact broker error:', err);
      },
    );
  };

  return (
    <Layout>
      <View style={styles.bgWrapper}>
        {isSuccess ? (
          <View style={styles.successContainer}>
            <LinearGradient
              colors={['#FFF3CA', '#FFE8A3']}
              style={styles.successIconCircle}
            >
              <CheckCircle2 size={60} color="#EE2529" strokeWidth={2.5} />
            </LinearGradient>

            <Text style={styles.successTitle}>Query Submitted Successfully!</Text>
            <Text style={styles.successSubtitle}>
              Thank you for reaching out. Our expert broker will analyze your
              requirements and get in touch with you shortly.
            </Text>

            <View style={styles.successActionRow}>
              <TouchableOpacity
                style={styles.submitAnotherBtn}
                onPress={() => {
                  setForm({
                    fullName: user?.name || '',
                    email: user?.email || '',
                    phoneNumber: user?.mobileNumber || user?.mobile || '',
                    propertyType: '',
                    budgetRange: '',
                    timeline: '',
                    additionalNotes: '',
                  });
                  setIsSuccess(false);
                }}
              >
                <Text style={styles.submitAnotherBtnText}>Submit Another</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigate('/explore-brokers')}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={['#EE2529', '#C73834']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.doneBtn}
                >
                  <Text style={styles.doneBtnText}>Done</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <ScrollView
          contentContainerStyle={[
            styles.page,
            { paddingHorizontal: isMobile ? 16 : 40 },
          ]}
          keyboardShouldPersistTaps="handled"
        >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <ContactBrokerSVG />
          </View>
          <Text style={[styles.title, isMobile && { fontSize: 24 }]}>
            Connect with Broker
          </Text>
          <Text style={[styles.subtitle, isMobile && { fontSize: 14 }]}>
            Let us help you find the perfect property. Fill out the form below
            and our expert broker will reach out to you.
          </Text>
        </View>

        {/* Form card */}
        <View style={[styles.card, isMobile && { padding: 16 }]}>
          <Text style={styles.sectionIntroTitle}>Your Information</Text>
          <Text style={styles.sectionIntroSub}>
            Tell us about your property requirements and preferences
          </Text>

          {/* Personal Details */}
          <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
            Personal Details
          </Text>

          <View
            style={[
              styles.row,
              isMobile && { flexDirection: 'column' },
            ]}
          >
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={[styles.input, errors.fullName && styles.inputError]}
                placeholder="Rohit Sharma"
                placeholderTextColor="#aaa"
                value={form.fullName}
                onChangeText={t => set('fullName', t)}
              />
              <InputError message={errors.fullName} visible={!!errors.fullName} />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder="rohit@gmail.com"
                placeholderTextColor="#aaa"
                keyboardType="email-address"
                autoCapitalize="none"
                value={form.email}
                onChangeText={t => set('email', t)}
              />
              <InputError message={errors.email} visible={!!errors.email} />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={[styles.input, errors.phoneNumber && styles.inputError]}
              placeholder="+91 9987836479"
              placeholderTextColor="#aaa"
              keyboardType="phone-pad"
              value={form.phoneNumber}
              onChangeText={t => set('phoneNumber', t)}
            />
            <InputError message={errors.phoneNumber} visible={!!errors.phoneNumber} />
          </View>

          {/* Property Requirements */}
          <Text style={[styles.sectionTitle, { marginTop: 32 }]}>
            Property Requirements
          </Text>

          <View style={[styles.inputGroup, { zIndex: 30 }]}>
            <Text style={styles.label}>Type of Property Interest *</Text>
            <Dropdown
              placeholder="Select Property Type"
              options={PROPERTY_TYPES}
              value={form.propertyType}
              onSelect={v => set('propertyType', v)}
              zIndex={30}
            />
            <InputError message={errors.propertyType} visible={!!errors.propertyType} />
          </View>

          <View
            style={[
              styles.row,
              isMobile && { flexDirection: 'column' },
              { zIndex: 20 },
            ]}
          >
            <View style={[styles.inputGroup, { zIndex: 22 }]}>
              <Text style={styles.label}>Budget Range *</Text>
              <Dropdown
                placeholder="Select Budget Range"
                options={BUDGET_RANGES}
                value={form.budgetRange}
                onSelect={v => set('budgetRange', v)}
                zIndex={22}
              />
              <InputError message={errors.budgetRange} visible={!!errors.budgetRange} />
            </View>
            <View style={[styles.inputGroup, { zIndex: 20 }]}>
              <Text style={styles.label}>When are you looking to invest? *</Text>
              <Dropdown
                placeholder="Select Timeline"
                options={TIMELINES}
                value={form.timeline}
                onSelect={v => set('timeline', v)}
                zIndex={20}
              />
              <InputError message={errors.timeline} visible={!!errors.timeline} />
            </View>
          </View>

          <View style={[styles.inputGroup, { zIndex: 1 }]}>
            <Text style={styles.label}>Additional Notes / Requirements</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Tell us more about your specific requirements, preferred locations, or any other details..."
              placeholderTextColor="#aaa"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={form.additionalNotes}
              onChangeText={t => set('additionalNotes', t)}
            />
          </View>

          {/* Expert Consultation box */}
          <View style={styles.infoBox}>
            <Text style={styles.infoBoxTitle}>Expert Consultation</Text>
            <Text style={styles.infoBoxText}>
              Our experienced brokers will analyze your requirements and provide
              personalized property recommendations with detailed financial
              projections.
            </Text>
          </View>

          {/* Send button */}
          <View style={styles.sendRow}>
            <TouchableOpacity
              onPress={handleSend}
              activeOpacity={0.85}
              disabled={loading}
            >
              <LinearGradient
                colors={['#EE2529', '#C73834']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.sendBtn}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.sendBtnText}>Send</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Call / Email Us */}
        <View style={styles.divider} />
        <View
          style={[
            styles.contactRow,
            isMobile && { flexDirection: 'column' },
          ]}
        >
          <View style={styles.contactBlock}>
            <View style={styles.contactTitleRow}>
              <View style={styles.contactIconWrap}>
                <Phone size={22} color="#EE2529" />
              </View>
              <Text style={styles.contactBlockTitle}>Quick Call</Text>
            </View>
            <Text style={styles.contactBlockSub}>Need immediate assistance?</Text>
            <TouchableOpacity activeOpacity={0.8}>
              <LinearGradient
                colors={['#EE2529', '#C73834']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.contactBtn}
              >
                <Text style={styles.contactBtnText}>Call +91 1800-XXX-XXXX</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={[styles.verticalDivider, isMobile && { display: 'none' }]} />

          <View style={styles.contactBlock}>
            <View style={styles.contactTitleRow}>
              <View style={styles.contactIconWrap}>
                <Mail size={22} color="#EE2529" />
              </View>
              <Text style={styles.contactBlockTitle}>Email Us</Text>
            </View>
            <Text style={styles.contactBlockSub}>Prefer email communication?</Text>
            <TouchableOpacity activeOpacity={0.8}>
              <LinearGradient
                colors={['#EE2529', '#C73834']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.contactBtn}
              >
                <Text style={styles.contactBtnText}>Send an Email</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      )}
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  bgWrapper: {
    flex: 1,
    ...({
      backgroundImage: `url(${require('../../assets/Banner/bannerBg.png')})`,
      backgroundRepeat: 'repeat',
      backgroundSize: 'auto',
    } as any),
  },
  page: {
    paddingVertical: 40,
    maxWidth: 900,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    gap: 12,
  },
  iconCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#FFF3CA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#EE2529',
    fontFamily: 'Montserrat',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    fontFamily: 'Montserrat',
    maxWidth: 620,
    lineHeight: 22,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  sectionIntroTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
    fontFamily: 'Montserrat',
  },
  sectionIntroSub: {
    fontSize: 14,
    color: '#888',
    fontFamily: 'Montserrat',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#EE2529',
    fontFamily: 'Montserrat',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  inputGroup: {
    flex: 1,
    marginBottom: 16,
    position: 'relative',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222',
    marginBottom: 6,
    fontFamily: 'Montserrat',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#333',
    fontFamily: 'Montserrat',
    backgroundColor: '#fafafa',
  },
  inputError: {
    borderColor: '#EE2529',
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },

  dropdownWrapper: {
    position: 'relative',
  },
  dropdownTrigger: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    backgroundColor: '#f5f5f5',
  },
  dropdownValue: {
    fontSize: 15,
    color: '#333',
    fontFamily: 'Montserrat',
    flex: 1,
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#555',
    fontFamily: 'Montserrat',
  },
  dropdownItemActive: {
    color: '#EE2529',
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: '#F7F7F7',
    borderRadius: 10,
    padding: 18,
    marginTop: 28,
    marginBottom: 24,
  },
  infoBoxTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
    fontFamily: 'Montserrat',
    marginBottom: 6,
  },
  infoBoxText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Montserrat',
    lineHeight: 20,
  },
  sendRow: {
    alignItems: 'center',
  },
  sendBtn: {
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 140,
  },
  sendBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Montserrat',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 32,
  },
  contactRow: {
    flexDirection: 'row',
    paddingBottom: 40,
  },
  contactBlock: {
    flex: 1,
    paddingHorizontal: 32,
    paddingVertical: 24,
    gap: 10,
  },
  contactTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  contactIconWrap: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactBlockTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#EE2529',
    fontFamily: 'Montserrat',
  },
  contactBlockSub: {
    fontSize: 14,
    color: '#888',
    fontFamily: 'Montserrat',
    marginBottom: 8,
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  successIconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    shadowColor: '#EE2529',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#EE2529',
    fontFamily: 'Montserrat',
    textAlign: 'center',
    marginBottom: 16,
  },
  successSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    fontFamily: 'Montserrat',
    lineHeight: 24,
    marginBottom: 40,
    maxWidth: 450,
  },
  successActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  submitAnotherBtn: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#EE2529',
    minWidth: 160,
    alignItems: 'center',
  },
  submitAnotherBtnText: {
    color: '#EE2529',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Montserrat',
  },
  doneBtn: {
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 8,
    minWidth: 160,
    alignItems: 'center',
  },
  doneBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Montserrat',
  },
  verticalDivider: {
    width: 1,
    backgroundColor: '#e8e8e8',
    alignSelf: 'stretch',
  },
  contactBtn: {
    paddingVertical: 13,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  contactBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Montserrat',
  },
});

export default ContactBrokerScreen;
