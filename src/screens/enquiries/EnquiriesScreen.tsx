import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import { Check, ChevronLeft } from 'lucide-react-native';
import { COLORS } from '../../constants/theme';
import { useNavigation } from '../../context/NavigationContext';
import { usePropertyAPIs } from '../../../helpers/hooks/propertyAPIs/usePropertyApis';
import Layout from '../../layout/Layout';

const { width } = Dimensions.get('window');
const isDesktop = width > 900;

const EnquiriesScreen = () => {
  const { currentPath, navigate, goBack } = useNavigation();
  const propertyId = currentPath.split('/enquiry/')[1];
  const [property, setProperty] = useState<any>(null);
  const { getPropertyById, loading } = usePropertyAPIs();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    otp: ['', '', '', ''],
    termsAccepted: false,
    privacyAccepted: false,
  });

  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    if (propertyId) {
      getPropertyById(propertyId, data => {
        setProperty(data);
      });
    }
  }, [propertyId]);

  const handleInputChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...formData.otp];
      newOtp[index] = value;
      setFormData(prev => ({ ...prev, otp: newOtp }));
    }
  };

  const handleSendOTP = () => {
    if (formData.phone.length === 10) {
      setOtpSent(true);
      console.log('Sending OTP to:', formData.phone);
    }
  };

  const handleSubmit = () => {
    if (formData.termsAccepted && formData.privacyAccepted) {
      console.log('Form submitted:', formData);
      // Logic for submission
      Alert.alert('Success', 'Enquiry submitted successfully!');
      navigate('/dashboard');
    }
  };

  return (
    <Layout>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.backContainer}>
          <TouchableOpacity onPress={goBack} style={styles.backButton}>
            <ChevronLeft size={24} color={COLORS.textDark} />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.contentCard}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/Navbar/Preleasegrid logo 1.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          <View style={styles.headerBanner}>
            <Text style={styles.title}>Enquire About This Property</Text>
          </View>

          <Text style={styles.subtitle}>
            Please read carefully before confirming the Enquiry.
          </Text>

          {/* Property Summary */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text>Loading property info...</Text>
            </View>
          ) : property ? (
            <View style={styles.propertyInfo}>
              <View style={styles.infoCol}>
                <Text style={styles.infoLabel}>Property Type</Text>
                <Text style={styles.infoValue}>{property.propertyType}</Text>
              </View>
              <View style={styles.infoCol}>
                <Text style={styles.infoLabel}>Location</Text>
                <Text style={styles.infoValue}>
                  {property.city}, {property.state}
                </Text>
              </View>
              <View style={styles.infoCol}>
                <Text style={styles.infoLabel}>Cost</Text>
                <Text style={styles.infoValue}>
                  ₹{property.sellingPrice} Cr
                </Text>
              </View>
            </View>
          ) : null}

          <View style={styles.descriptionContainer}>
            <Text style={styles.infoLabel}>Description</Text>
            <Text style={styles.descriptionText}>
              The retail property diversification strategy focuses on spreading
              investments across various types of retail spaces, such as
              shopping malls, stand-alone stores, and mixed-use developments.
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.row}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  First Name <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your first name"
                  value={formData.firstName}
                  onChangeText={v => handleInputChange('firstName', v)}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Last Name <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your last name"
                  value={formData.lastName}
                  onChangeText={v => handleInputChange('lastName', v)}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your Email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={formData.email}
                onChangeText={v => handleInputChange('email', v)}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1.5 }]}>
                <Text style={styles.label}>Confirm Phone No.</Text>
                <View style={styles.phoneInputContainer}>
                  <TextInput
                    style={styles.phoneInput}
                    placeholder="+91"
                    keyboardType="numeric"
                    maxLength={10}
                    value={formData.phone}
                    onChangeText={v => handleInputChange('phone', v)}
                  />
                  <TouchableOpacity
                    style={styles.otpButton}
                    onPress={handleSendOTP}
                  >
                    <Text style={styles.otpButtonText}>
                      {otpSent ? 'Resend OTP' : 'Send OTP'}
                    </Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.otpHelpText}>
                  Didn't received OTP?{' '}
                  <Text style={styles.link} onPress={handleSendOTP}>
                    Click to resend OTP.
                  </Text>
                </Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>OTP</Text>
                <View style={styles.otpContainer}>
                  {formData.otp.map((digit, idx) => (
                    <TextInput
                      key={idx}
                      style={styles.otpInput}
                      value={digit}
                      onChangeText={v => handleOtpChange(idx, v)}
                      keyboardType="numeric"
                      maxLength={1}
                    />
                  ))}
                </View>
              </View>
            </View>

            {/* Checkboxes */}
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() =>
                handleInputChange('termsAccepted', !formData.termsAccepted)
              }
            >
              <View
                style={[
                  styles.checkbox,
                  formData.termsAccepted && styles.checkboxActive,
                ]}
              >
                {formData.termsAccepted && (
                  <Check size={12} color={COLORS.white} />
                )}
              </View>
              <Text style={styles.checkboxLabel}>
                I agree to the{' '}
                <Text style={styles.link}>terms & conditions</Text>
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() =>
                handleInputChange('privacyAccepted', !formData.privacyAccepted)
              }
            >
              <View
                style={[
                  styles.checkbox,
                  formData.privacyAccepted && styles.checkboxActive,
                ]}
              >
                {formData.privacyAccepted && (
                  <Check size={12} color={COLORS.white} />
                )}
              </View>
              <Text style={styles.checkboxLabel}>
                I agree to the <Text style={styles.link}>Privacy Policy</Text>
              </Text>
            </TouchableOpacity>

            {/* Action Buttons */}
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.cancelButton} onPress={goBack}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  (!formData.termsAccepted || !formData.privacyAccepted) &&
                    styles.submitButtonDisabled,
                ]}
                onPress={handleSubmit}
                disabled={!formData.termsAccepted || !formData.privacyAccepted}
              >
                <Text style={styles.submitButtonText}>Enquire</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: isDesktop ? 40 : 16,
    backgroundColor: '#F9FAFB',
  },
  backContainer: {
    marginBottom: 20,
    maxWidth: 800,
    alignSelf: 'center',
    width: '100%',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  backText: {
    fontSize: 16,
    color: COLORS.textDark,
    fontWeight: '500',
  },
  contentCard: {
    maxWidth: 800,
    width: '100%',
    alignSelf: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: isDesktop ? 40 : 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  logoContainer: {
    marginBottom: 24,
    alignItems: 'flex-start',
  },
  logoImage: {
    height: 48,
    width: 200,
  },
  headerBanner: {
    backgroundColor: '#FFFCF4',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.textDark,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  propertyInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FDFDFD',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    marginBottom: 24,
  },
  infoCol: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    color: COLORS.textDark,
    fontWeight: '500',
  },
  descriptionContainer: {
    marginBottom: 32,
  },
  descriptionText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  form: {
    gap: 20,
  },
  row: {
    flexDirection: isDesktop ? 'row' : 'column',
    gap: 16,
  },
  inputGroup: {
    flex: 1,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 8,
  },
  required: {
    color: COLORS.primary,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: COLORS.textDark,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 4,
    alignItems: 'center',
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: COLORS.textDark,
  },
  otpButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  otpButtonText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },
  otpHelpText: {
    fontSize: 11,
    color: COLORS.textDark,
    marginTop: 8,
  },
  link: {
    color: '#3B82F6',
    textDecorationLine: 'underline',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  otpInput: {
    width: 44,
    height: 44,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checkboxLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#767676',
  },
  submitButton: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.white,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
});

export default EnquiriesScreen;
