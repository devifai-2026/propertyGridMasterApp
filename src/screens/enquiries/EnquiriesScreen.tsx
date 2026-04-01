import React, { useState, useEffect, useRef } from 'react';
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
  Platform,
} from 'react-native';
import { Check, ChevronLeft } from 'lucide-react-native';
import { COLORS } from '../../constants/theme';
import { useNavigation } from '../../context/NavigationContext';
import { usePropertyAPIs } from '../../../helpers/hooks/propertyAPIs/usePropertyApis';
import { useAuth } from '../../context/AuthContext';
import { useAuthAPIs } from '../../../helpers/hooks/authAPIs/useAuthAPIs';
import Layout from '../../layout/Layout';

const { width } = Dimensions.get('window');
const isDesktop = width > 900;

const EnquiriesScreen = () => {
  const { user } = useAuth();
  const { currentPath, navigate, goBack } = useNavigation();
  const propertyId = currentPath.split('/enquiry/')[1];
  const [property, setProperty] = useState<any>(null);
  const { getPropertyById, createPropertyInquiry, loading } = usePropertyAPIs();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    otp: '',
    question: '',
    termsAccepted: false,
    privacyAccepted: false,
  });

  const otpInputRefs = useRef<Array<TextInput | null>>([]);

  const { sendOtp, verifyOtp, loading: authLoading } = useAuthAPIs();
  const [verificationId, setVerificationId] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName || user.name.split(' ')[0] || '',
        lastName: user.lastName || user.name.split(' ')[1] || '',
        email: user.email || '',
        phone: user.mobileNumber || '',
      }));
    }
  }, [user]);

  useEffect(() => {
    if (propertyId) {
      getPropertyById(propertyId, data => {
        setProperty(data);
      });
    }
  }, [propertyId]);

  const handleInputChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'phone') {
      setIsVerified(false);
      setOtpSent(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    // Only allow digits
    const digit = value.replace(/[^0-9]/g, '');

    const newOtp = formData.otp.split('');
    newOtp[index] = digit;
    const otpValue = newOtp.join('');
    setFormData(prev => ({ ...prev, otp: otpValue }));

    // Auto-focus next input if digit entered
    if (digit && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when 6th digit is entered
    if (digit && index === 5) {
      if (otpValue.length === 6) {
        setTimeout(() => {
          handleVerifyOTP(otpValue);
        }, 100);
      }
    }
  };

  const handleOtpKeyPress = (e: any, index: number) => {
    // Handle backspace on empty field - move to previous input
    if (
      e.nativeEvent.key === 'Backspace' &&
      !formData.otp[index] &&
      index > 0
    ) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleSendOTP = () => {
    const mobileNumber = formData.phone.replace(/\D/g, '');
    if (mobileNumber.length === 10) {
      sendOtp(
        { mobileNumber },
        (res: any) => {
          if (res.success) {
            setOtpSent(true);
            setIsVerified(false);
            setVerificationId(res.data.verificationId);
            // Auto-focus first OTP input after a short delay
            setTimeout(() => {
              otpInputRefs.current[0]?.focus();
            }, 100);
            Alert.alert(
              'OTP Sent',
              'A 6-digit OTP has been sent to your mobile number',
            );
          } else {
            Alert.alert('Error', res.message || 'Failed to send OTP');
          }
        },
        (err: any) => {
          Alert.alert(
            'Error',
            err?.response?.data?.message || 'Failed to send OTP',
          );
        },
      );
    } else {
      Alert.alert(
        'Invalid Phone',
        'Please enter a valid 10-digit phone number',
      );
    }
  };

  const handleVerifyOTP = (otpValue?: string) => {
    const code = otpValue || formData.otp;
    if (code.length !== 6) {
      Alert.alert('Error', 'Please enter a 6-digit OTP');
      return;
    }

    if (!verificationId) {
      Alert.alert('Error', 'Please send OTP first');
      return;
    }

    verifyOtp(
      { otp: code, verificationId },
      (res: any) => {
        if (res.success) {
          setIsVerified(true);
          Alert.alert('Verified', 'Mobile number verified successfully!');
        } else {
          Alert.alert('Error', res.message || 'Invalid OTP');
        }
      },
      (err: any) => {
        console.error('OTP Verify Error:', err);
        Alert.alert('Error', err?.response?.data?.message || 'Invalid OTP');
      },
    );
  };

  const handleSubmit = () => {

    if (!user) {
      Alert.alert(
        'Authentication Required',
        'Please login to submit an enquiry.',
      );
      navigate('/login');
      return;
    }

    if (!formData.question.trim()) {
      Alert.alert('Error', 'Please enter your inquiry question.');
      return;
    }

    const isProfileMobile = user && formData.phone === user.mobileNumber;
    if (!isVerified && !isProfileMobile) {
      Alert.alert('Error', 'Please verify your phone number first.');
      return;
    }

    if (!formData.termsAccepted) {
      Alert.alert('Error', 'Please agree to the terms & conditions.');
      return;
    }

    if (!formData.privacyAccepted) {
      Alert.alert('Error', 'Please agree to the Privacy Policy.');
      return;
    }

    const payload = {
      inquiry: formData.question,
      source: Platform.OS === 'web' ? 'web' : 'mobile',
    };


    createPropertyInquiry(
      propertyId,
      payload,
      () => {
        Alert.alert(
          'Success',
          user?.role === 'Broker' || user?.role === 'Investor'
            ? 'Property assigned successfully!'
            : 'Enquiry submitted successfully!',
        );
        navigate('/dashboard');
      },
      err => {
        console.error('API Error:', err);
        Alert.alert(
          'Error',
          err?.response?.data?.message || 'Failed to submit enquiry',
        );
      },
    );
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
            <Text style={styles.title}>
              {user?.role === 'Broker' || user?.role === 'Investor'
                ? 'Enquiry'
                : 'Enquire About This Property'}
            </Text>
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
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Confirm Phone No.</Text>
                <View style={styles.phoneInputContainer}>
                  <TextInput
                    style={styles.phoneInput}
                    placeholder="+91 00000 00000"
                    keyboardType="numeric"
                    maxLength={10}
                    value={formData.phone}
                    onChangeText={v => handleInputChange('phone', v)}
                    editable={!isVerified}
                  />
                  <TouchableOpacity
                    style={[
                      styles.otpButton,
                      isVerified && styles.otpButtonVerified,
                      formData.phone.length !== 10 && styles.otpButtonDisabled,
                    ]}
                    onPress={handleSendOTP}
                    disabled={
                      isVerified || formData.phone.length !== 10 || authLoading
                    }
                  >
                    <Text style={styles.otpButtonText}>
                      {isVerified
                        ? 'Verified'
                        : otpSent
                        ? 'Resend OTP'
                        : 'Send OTP'}
                    </Text>
                  </TouchableOpacity>
                </View>
                {!isVerified && (
                  <Text style={styles.otpHelpText}>
                    Didn't received OTP?{' '}
                    <Text style={styles.link} onPress={handleSendOTP}>
                      Click to resend OTP.
                    </Text>
                  </Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>OTP</Text>
                <View
                  style={[styles.otpContainer, isVerified && { opacity: 0.6 }]}
                >
                  {[0, 1, 2, 3, 4, 5].map(idx => (
                    <TextInput
                      key={idx}
                      ref={ref => {
                        otpInputRefs.current[idx] = ref;
                      }}
                      style={[
                        styles.otpInput,
                        isVerified && styles.otpInputVerified,
                      ]}
                      value={formData.otp[idx] || ''}
                      onChangeText={v => handleOtpChange(idx, v)}
                      onKeyPress={e => handleOtpKeyPress(e, idx)}
                      keyboardType="numeric"
                      maxLength={1}
                      editable={!isVerified}
                      selectTextOnFocus
                    />
                  ))}
                  {!isVerified && formData.otp.length === 6 && (
                    <TouchableOpacity
                      style={styles.verifyBtn}
                      onPress={() => handleVerifyOTP()}
                      disabled={authLoading}
                    >
                      <Text style={styles.verifyBtnText}>
                        {authLoading ? '...' : 'Verify'}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
                {isVerified && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                    <View style={styles.verifiedBadge}>
                      <Check size={16} color={COLORS.white} />
                    </View>
                    <Text style={[styles.verifiedText, { marginTop: 0, marginLeft: 6 }]}>
                      Verified
                    </Text>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Your Inquiry <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[
                  styles.input,
                  { height: 100, textAlignVertical: 'top' },
                ]}
                placeholder="What would you like to know about this property?"
                multiline
                value={formData.question}
                onChangeText={v => handleInputChange('question', v)}
              />
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
                  // user?.role !== 'Broker' &&
                  //   user?.role !== 'Investor' && {
                  //     backgroundColor: '#CCC',
                  //   },
                ]}
                onPress={handleSubmit}
                disabled={
                  loading 
                  // ||(user?.role !== 'Broker' && user?.role !== 'Investor')
                }
              >
                {loading ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <View
                      style={{
                        width: 16,
                        height: 16,
                        borderTopColor: COLORS.white,
                        borderRightColor: COLORS.white,
                        borderBottomColor: 'transparent',
                        borderLeftColor: 'transparent',
                        borderWidth: 2,
                        borderRadius: 8,
                      }}
                    />
                    <Text style={styles.submitButtonText}>Processing...</Text>
                  </View>
                ) : (
                  <Text style={styles.submitButtonText}>
                    {user?.role === 'Broker' || user?.role === 'Investor'
                      ? 'Enquiry'
                      : 'Enquire'}
                  </Text>
                )}
              </TouchableOpacity>
              {/* {user?.role !== 'Broker' && user?.role !== 'Investor' && (
                <Text style={styles.roleWarningText}>
                  * Only Brokers and Investors can assign property.
                </Text>
              )} */}
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
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  otpButtonVerified: {
    backgroundColor: '#10B981',
  },
  otpButtonText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '700',
  },
  otpHelpText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 8,
  },
  link: {
    color: '#3B82F6',
    textDecorationLine: 'underline',
  },
  otpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  otpInput: {
    width: 32,
    height: 48,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textDark,
    backgroundColor: '#F2F2F2',
  },
  otpInputVerified: {
    borderColor: '#10B981',
    backgroundColor: '#ECFDF5',
    color: '#065F46',
  },
  verifiedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  verifyBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    borderRadius: 8,
    justifyContent: 'center',
    height: 48,
    marginLeft: 4,
  },
  verifyBtnText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
  },
  verifiedText: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
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
  roleWarningText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default EnquiriesScreen;
