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
  ImageBackground,
  Image,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import { Briefcase, Building2, Home, Smartphone } from 'lucide-react-native';
import Layout from '../../layout/Layout';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '../../context/NavigationContext';
import { useAuthAPIs } from '../../../helpers/hooks/authAPIs/useAuthAPIs';
import { COLORS } from '../../constants/theme';

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
  const [verificationId, setVerificationId] = useState('');
  const [focusedOtpIndex, setFocusedOtpIndex] = useState<number | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const { login } = useAuth();
  const { signup: register, sendOtp, loading: apiLoading } = useAuthAPIs();
  const { navigate } = useNavigation();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const isDesktop = width >= 1024;
  const isSmallMobile = width < 400;

  // Refs for OTP inputs
  const otpInputRefs = useRef<Array<TextInput | null>>([]);

  // Animation value
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
    ]).start();
  }, []);

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
      sendOtp(
        { mobileNumber: formData.phone },
        (response: any) => {
          if (response.success) {
            setVerificationId(response.data.verificationId);
            setOtpSent(true);
            // Auto-focus first OTP input after a short delay
            setTimeout(() => {
              otpInputRefs.current[0]?.focus();
            }, 100);
            Alert.alert(
              'OTP Sent',
              'A 6-digit OTP has been sent to your mobile number',
            );
          } else {
            Alert.alert('Error', response.message || 'Failed to send OTP');
          }
        },
        (error: any) => {
          Alert.alert(
            'Error',
            error?.response?.data?.message || 'Failed to send OTP',
          );
        },
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
    if (digit && index < 5) {
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
    if (otp.length === 6) {
      register(
        {
          mobileNumber: formData.phone,
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          roleName:
            formData.userType.charAt(0).toUpperCase() +
            formData.userType.slice(1), // investor -> Investor
          otp,
          verificationId,
        },
        async (response: any) => {
          if (response.success) {
            if (Platform.OS === 'web') {
              navigate('/login');
            } else {
              Alert.alert(
                'Success',
                'Account created successfully! Please login to continue.',
                [{ text: 'OK', onPress: () => navigate('/login') }],
              );
            }
          } else {
            Alert.alert('Error', response.message || 'Signup failed');
          }
        },
        (error: any) => {
          Alert.alert(
            'Error',
            error?.response?.data?.message || 'Something went wrong',
          );
        },
      );
    } else {
      Alert.alert('Error', 'Please enter the complete 6-digit OTP');
    }
  };

  return (
    <Layout>
      <View style={styles.scrollContainer}>
        <View style={[styles.container, isDesktop && styles.desktopContainer]}>
          <Animated.View
            style={[
              styles.contentWrapper,
              isDesktop && styles.desktopContentWrapper,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View
              style={[
                styles.formSection,
                isDesktop && styles.desktopFormSection,
              ]}
            >
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
                    <View
                      style={[styles.row, isSmallMobile && styles.rowStack]}
                    >
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
                            focusedField === 'firstName' &&
                              styles.textInputFocused,
                          ]}
                          placeholder="John"
                          placeholderTextColor={COLORS.textSecondary}
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
                            focusedField === 'lastName' &&
                              styles.textInputFocused,
                          ]}
                          placeholder="Doe"
                          placeholderTextColor={COLORS.textSecondary}
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
                        placeholderTextColor={COLORS.textSecondary}
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
                        placeholderTextColor={COLORS.textSecondary}
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
                          {
                            id: 'investor',
                            label: 'Investor',
                            Icon: Briefcase,
                          },
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
                                  ? COLORS.primary
                                  : COLORS.textSecondary
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
                      <Smartphone
                        size={32}
                        color={COLORS.primary}
                        strokeWidth={2}
                      />
                    </View>
                    <Text style={styles.otpTitle}>Verify Your Number</Text>
                    <Text style={styles.otpHint}>
                      We've sent a 6-digit code to{'\n'}
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
                      {[0, 1, 2, 3, 4, 5].map(index => (
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
                      (otpSent ? otp.length !== 6 : !isFormValid()) &&
                        styles.btnDisabled,
                    ]}
                    onPress={otpSent ? handleSignup : handleSendOtp}
                    disabled={
                      apiLoading ||
                      (otpSent ? otp.length !== 6 : !isFormValid())
                    }
                  >
                    <Text style={styles.btnFilledText}>
                      {apiLoading
                        ? 'Processing...'
                        : otpSent
                        ? 'Create Account'
                        : 'Continue'}
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

            {isDesktop && (
              <View style={styles.imageSection}>
                <Image
                  source={require('../../assets/Banner/property.png')}
                  style={styles.sideImage}
                  resizeMode="cover"
                />
              </View>
            )}
          </Animated.View>
        </View>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100%',
  },
  desktopContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  contentWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  desktopContentWrapper: {
    flexDirection: 'row',
    maxWidth: 900,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 20,
  },
  formSection: {
    width: '100%',
    alignItems: 'center',
  },
  desktopFormSection: {
    flex: 1,
    padding: 10,
  },
  imageSection: {
    flex: 1,
    height: '100%',
    minHeight: 450,
    padding: 10,
    backgroundColor: 'transparent',
  },
  sideImage: {
    width: '100%',
    height: '100%',
    flex: 1,
    borderRadius: 20,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 420,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 8,
    marginVertical: 16,
    // On desktop, the card shadow/border is handled by the wrapper
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textDark,
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
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
    color: COLORS.textDark,
    marginBottom: 8,
    letterSpacing: 0.1,
  },
  textInput: {
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: COLORS.divider,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.textDark,
    fontWeight: '500',
  },
  textInputFocused: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
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
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: COLORS.divider,
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
    borderColor: COLORS.primary,
    backgroundColor: COLORS.lightRed,
  },
  userTypeLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginTop: 6,
  },
  userTypeLabelActive: {
    color: COLORS.primary,
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
    backgroundColor: COLORS.lightRed,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  otpTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textDark,
    marginBottom: 6,
  },
  otpHint: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
    paddingHorizontal: 16,
  },
  phoneHighlight: {
    fontWeight: '700',
    color: COLORS.textDark,
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
    width: 42,
    height: 42,
    backgroundColor: COLORS.background,
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    borderWidth: 2,
    borderColor: COLORS.divider,
    color: COLORS.textDark,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  otpInputSmall: {
    width: 36,
    height: 36,
    fontSize: 16,
  },
  otpInputFocused: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  otpInputFilled: {
    borderColor: COLORS.success,
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
    color: COLORS.primary,
    fontWeight: '600',
  },
  changeNumberBtn: {
    alignSelf: 'center',
    paddingVertical: 6,
    paddingHorizontal: 6,
  },
  changeNumberText: {
    fontSize: 12,
    color: COLORS.textSecondary,
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
    borderColor: COLORS.divider,
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  btnOutlineText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  btnFilled: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
  btnFilledText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.white,
    letterSpacing: 0.2,
  },
  btnDisabled: {
    backgroundColor: COLORS.divider,
    shadowOpacity: 0,
    elevation: 0,
  },
  termsText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 18,
    lineHeight: 16,
    paddingHorizontal: 8,
  },
  termsLink: {
    color: COLORS.primary,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

export default SignupScreen;
