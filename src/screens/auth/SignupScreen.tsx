import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { Briefcase, Building2, Home, Smartphone } from 'lucide-react-native';
import Layout from '../../layout/Layout';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '../../context/NavigationContext';

const SignupScreen = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    userType: '', // 'investor', 'broker', or 'owner'
  });
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [focusedOtpIndex, setFocusedOtpIndex] = useState<number | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const { login } = useAuth();
  const { navigate } = useNavigation();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const isSmallMobile = width < 400;

  // Refs for OTP inputs
  const otpInputRefs = useRef<Array<TextInput | null>>([]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = () => {
    return (
      formData.firstName.trim() !== '' &&
      formData.lastName.trim() !== '' &&
      formData.email.trim() !== '' &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
      formData.phone.length === 10 &&
      formData.userType !== ''
    );
  };

  const handleSendOtp = () => {
    if (isFormValid()) {
      setOtpSent(true);
      // Auto-focus first OTP input after a short delay
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
      Alert.alert(
        'OTP Sent',
        'A 4-digit OTP has been sent to your mobile number',
      );
    } else {
      Alert.alert('Error', 'Please fill in all required fields correctly');
    }
  };

  const handleOtpChange = (text: string, index: number) => {
    // Only allow digits
    const digit = text.replace(/[^0-9]/g, '');

    const newOtp = otp.split('');
    newOtp[index] = digit;
    setOtp(newOtp.join(''));

    // Auto-focus next input if digit entered
    if (digit && index < 3) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyPress = (e: any, index: number) => {
    // Handle backspace on empty field - move to previous input
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleSignup = async () => {
    if (otp.length === 4) {
      // Here you would verify OTP and create account with backend
      // For now, we'll just proceed with login
      const success = await login(formData.phone);
      if (success) {
        Alert.alert('Success', 'Account created successfully!', [
          { text: 'OK', onPress: () => navigate('/dashboard') },
        ]);
      }
    } else {
      Alert.alert('Error', 'Please enter the complete 4-digit OTP');
    }
  };

  return (
    <Layout>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.card}>
            <View style={styles.header}>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>
                Sign up to get started with your property journey
              </Text>
            </View>

            {!otpSent ? (
              <>
                {/* Name Fields */}
                <View style={[styles.row, isSmallMobile && styles.rowStack]}>
                  <View
                    style={[
                      styles.inputGroup,
                      !isSmallMobile && styles.halfWidth,
                    ]}
                  >
                    <Text style={styles.inputLabel}>First Name *</Text>
                    <TextInput
                      style={[
                        styles.textInput,
                        focusedField === 'firstName' && styles.textInputFocused,
                      ]}
                      placeholder="John"
                      placeholderTextColor="#9CA3AF"
                      value={formData.firstName}
                      onChangeText={text => handleChange('firstName', text)}
                      onFocus={() => setFocusedField('firstName')}
                      onBlur={() => setFocusedField(null)}
                    />
                  </View>

                  <View
                    style={[
                      styles.inputGroup,
                      !isSmallMobile && styles.halfWidth,
                    ]}
                  >
                    <Text style={styles.inputLabel}>Last Name *</Text>
                    <TextInput
                      style={[
                        styles.textInput,
                        focusedField === 'lastName' && styles.textInputFocused,
                      ]}
                      placeholder="Doe"
                      placeholderTextColor="#9CA3AF"
                      value={formData.lastName}
                      onChangeText={text => handleChange('lastName', text)}
                      onFocus={() => setFocusedField('lastName')}
                      onBlur={() => setFocusedField(null)}
                    />
                  </View>
                </View>

                {/* Email */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Email Address *</Text>
                  <TextInput
                    style={[
                      styles.textInput,
                      focusedField === 'email' && styles.textInputFocused,
                    ]}
                    placeholder="john.doe@example.com"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={formData.email}
                    onChangeText={text => handleChange('email', text)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>

                {/* Phone */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Mobile Number *</Text>
                  <TextInput
                    style={[
                      styles.textInput,
                      focusedField === 'phone' && styles.textInputFocused,
                    ]}
                    placeholder="9876543210"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                    maxLength={10}
                    value={formData.phone}
                    onChangeText={text => handleChange('phone', text)}
                    onFocus={() => setFocusedField('phone')}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>

                {/* User Type Selection */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>I am a *</Text>
                  <View
                    style={[
                      styles.userTypeContainer,
                      isSmallMobile && styles.userTypeContainerStack,
                    ]}
                  >
                    {[
                      { id: 'investor', label: 'Investor', Icon: Briefcase },
                      { id: 'broker', label: 'Broker', Icon: Building2 },
                      { id: 'owner', label: 'Owner', Icon: Home },
                    ].map(type => (
                      <TouchableOpacity
                        key={type.id}
                        style={[
                          styles.userTypeCard,
                          isSmallMobile && styles.userTypeCardSmall,
                          formData.userType === type.id &&
                            styles.userTypeCardActive,
                        ]}
                        onPress={() => handleChange('userType', type.id)}
                      >
                        <type.Icon
                          size={isSmallMobile ? 20 : 24}
                          color={
                            formData.userType === type.id
                              ? '#D32F2F'
                              : '#6B7280'
                          }
                          strokeWidth={2.5}
                        />
                        <Text
                          style={[
                            styles.userTypeLabel,
                            formData.userType === type.id &&
                              styles.userTypeLabelActive,
                          ]}
                        >
                          {type.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </>
            ) : (
              /* OTP Section */
              <View style={styles.otpSection}>
                <View style={styles.otpIconContainer}>
                  <Smartphone size={32} color="#D32F2F" strokeWidth={2} />
                </View>
                <Text style={styles.otpTitle}>Verify Your Number</Text>
                <Text style={styles.otpHint}>
                  We've sent a 4-digit code to{'\n'}
                  <Text style={styles.phoneHighlight}>
                    +91 {formData.phone}
                  </Text>
                </Text>

                <View
                  style={[
                    styles.otpInputGroup,
                    isSmallMobile && styles.otpInputGroupSmall,
                  ]}
                >
                  {[0, 1, 2, 3].map(index => (
                    <TextInput
                      key={index}
                      ref={ref => {
                        otpInputRefs.current[index] = ref;
                      }}
                      style={[
                        styles.otpInput,
                        isSmallMobile && styles.otpInputSmall,
                        focusedOtpIndex === index && styles.otpInputFocused,
                        otp[index] && styles.otpInputFilled,
                      ]}
                      maxLength={1}
                      keyboardType="number-pad"
                      value={otp[index] || ''}
                      onChangeText={text => handleOtpChange(text, index)}
                      onKeyPress={e => handleOtpKeyPress(e, index)}
                      onFocus={() => setFocusedOtpIndex(index)}
                      onBlur={() => setFocusedOtpIndex(null)}
                      selectTextOnFocus
                      autoComplete="one-time-code"
                    />
                  ))}
                </View>

                <TouchableOpacity
                  style={styles.resendBtn}
                  onPress={() => {
                    setOtp('');
                    Alert.alert(
                      'OTP Resent',
                      'A new OTP has been sent to your mobile number',
                    );
                  }}
                >
                  <Text style={styles.resendText}>
                    Didn't receive code? Resend
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.changeNumberBtn}
                  onPress={() => {
                    setOtpSent(false);
                    setOtp('');
                  }}
                >
                  <Text style={styles.changeNumberText}>Change Number</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.btnOutline}
                onPress={() => navigate('/login')}
              >
                <Text style={styles.btnOutlineText}>
                  {otpSent ? 'Back' : 'Sign In'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.btnFilled,
                  (otpSent ? otp.length !== 4 : !isFormValid()) &&
                    styles.btnDisabled,
                ]}
                onPress={otpSent ? handleSignup : handleSendOtp}
                disabled={otpSent ? otp.length !== 4 : !isFormValid()}
              >
                <Text style={styles.btnFilledText}>
                  {otpSent ? 'Create Account' : 'Continue'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Terms */}
            {!otpSent && (
              <Text style={styles.termsText}>
                By signing up, you agree to our{' '}
                <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F5F7FA',
    minHeight: '100%',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 540,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 8,
    marginVertical: 16,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A1A2E',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  rowStack: {
    flexDirection: 'column',
    gap: 0,
  },
  inputGroup: {
    marginBottom: 16,
  },
  halfWidth: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
    letterSpacing: 0.1,
  },
  textInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1F2937',
    fontWeight: '500',
  },
  textInputFocused: {
    borderColor: '#D32F2F',
    backgroundColor: '#FFFFFF',
  },
  userTypeContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  userTypeContainerStack: {
    flexDirection: 'column',
  },
  userTypeCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
  },
  userTypeCardSmall: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 0,
    gap: 12,
  },
  userTypeCardActive: {
    borderColor: '#D32F2F',
    backgroundColor: '#FEF2F2',
  },
  userTypeLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 6,
  },
  userTypeLabelActive: {
    color: '#D32F2F',
    fontWeight: '700',
  },
  otpSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  otpIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  otpTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1A2E',
    marginBottom: 6,
  },
  otpHint: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
    paddingHorizontal: 16,
  },
  phoneHighlight: {
    fontWeight: '700',
    color: '#1F2937',
  },
  otpInputGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 18,
  },
  otpInputGroupSmall: {
    gap: 8,
  },
  otpInput: {
    width: 48,
    height: 48,
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    color: '#1F2937',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  otpInputSmall: {
    width: 42,
    height: 42,
    fontSize: 18,
  },
  otpInputFocused: {
    borderColor: '#D32F2F',
    backgroundColor: '#FFFFFF',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  otpInputFilled: {
    borderColor: '#10B981',
    backgroundColor: '#ECFDF5',
  },
  resendBtn: {
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 6,
    marginBottom: 6,
  },
  resendText: {
    fontSize: 12,
    color: '#D32F2F',
    fontWeight: '600',
  },
  changeNumberBtn: {
    alignSelf: 'center',
    paddingVertical: 6,
    paddingHorizontal: 6,
  },
  changeNumberText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 6,
  },
  btnOutline: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  btnOutlineText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#6B7280',
  },
  btnFilled: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: '#D32F2F',
    alignItems: 'center',
    shadowColor: '#D32F2F',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
  btnFilledText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  btnDisabled: {
    backgroundColor: '#D1D5DB',
    shadowOpacity: 0,
    elevation: 0,
  },
  termsText: {
    fontSize: 11,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 18,
    lineHeight: 16,
    paddingHorizontal: 8,
  },
  termsLink: {
    color: '#D32F2F',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

export default SignupScreen;
