import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
  useWindowDimensions,
  Image,
  ImageBackground,
  ScrollView,
  Animated,
  Easing,
} from 'react-native';
import Layout from '../../layout/Layout';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '../../context/NavigationContext';
import { useAuthAPIs } from '../../../helpers/hooks/authAPIs/useAuthAPIs';
import { COLORS } from '../../constants/theme';
import { allowedRoles } from '../../../helpers/allowedRoles';

const LoginScreen = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [verificationId, setVerificationId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const { login } = useAuth();
  const { login: authenticate, sendOtp, loading: apiLoading } = useAuthAPIs();
  const { navigate } = useNavigation();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const isDesktop = width >= 1024;

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

  const handleSendOtp = () => {
    setErrorMsg('');
    if (phone.length === 10) {
      sendOtp(
        { mobileNumber: phone },
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
            setErrorMsg(response.message || 'Failed to send OTP');
          }
        },
        (error: any) => {
          setErrorMsg(error?.response?.data?.message || 'Failed to send OTP');
        },
      );
    } else {
      setErrorMsg('Please enter a valid 10-digit number');
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
    setErrorMsg('');
  };

  const handleOtpKeyPress = (e: any, index: number) => {
    // Handle backspace on empty field - move to previous input
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    setErrorMsg('');
    if (otp.length === 6) {
      authenticate(
        { mobileNumber: phone, otp, verificationId },
        async (response: any) => {
          if (response.success) {
            if (!allowedRoles.includes(response.data.role)) {
              setErrorMsg(
                'Access Denied: Only Owners, Brokers, and Investors can access this platform.',
              );
              return;
            }
            const success = await login(response.data);
            if (success) {
              navigate('/dashboard');
            }
          } else {
            setErrorMsg(response.message || 'Login failed');
          }
        },
        (error: any) => {
          setErrorMsg(error?.response?.data?.message || 'Something went wrong');
        },
      );
    } else {
      setErrorMsg('Please enter the complete 6-digit OTP');
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
                  <Text style={styles.title}>Welcome</Text>
                  <Text style={styles.subtitle}>
                    Sign in to your account to continue
                  </Text>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Mobile Number *</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter your contact number"
                    placeholderTextColor={COLORS.textSecondary}
                    keyboardType="numeric"
                    maxLength={10}
                    value={phone}
                    onChangeText={text => {
                      setPhone(text);
                      setErrorMsg('');
                    }}
                    editable={!otpSent}
                  />
                </View>

                {otpSent && (
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Enter OTP *</Text>
                    <View style={styles.otpInputGroup}>
                      {[0, 1, 2, 3, 4, 5].map(index => (
                        <TextInput
                          key={index}
                          ref={ref => {
                            otpInputRefs.current[index] = ref;
                          }}
                          style={styles.otpInput}
                          maxLength={1}
                          keyboardType="number-pad"
                          value={otp[index] || ''}
                          onChangeText={text => handleOtpChange(text, index)}
                          onKeyPress={e => handleOtpKeyPress(e, index)}
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
                      <Text style={styles.resendText}>Resend OTP</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {!otpSent && (
                  <View style={styles.dummyInfo}>
                    <Text style={styles.dummyTitle}>
                      Dummy Login Credentials:
                    </Text>
                    <Text style={styles.dummyText}>• Investor: 7550969935</Text>
                    <Text style={styles.dummyText}>• Broker: 7550969932</Text>
                    <Text style={styles.dummyText}>• Owner: 7550969934</Text>
                  </View>
                )}

                {errorMsg ? (
                  <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{errorMsg}</Text>
                  </View>
                ) : null}

                <View style={styles.actions}>
                  <TouchableOpacity
                    style={styles.btnOutline}
                    onPress={() => navigate('/dashboard')}
                  >
                    <Text style={styles.btnOutlineText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.btnFilled,
                      (otpSent ? otp.length !== 6 : phone.length !== 10) &&
                        styles.btnDisabled,
                    ]}
                    onPress={otpSent ? handleVerifyOtp : handleSendOtp}
                    disabled={
                      apiLoading ||
                      (otpSent ? otp.length !== 6 : phone.length !== 10)
                    }
                  >
                    <Text style={styles.btnFilledText}>
                      {apiLoading
                        ? 'Processing...'
                        : otpSent
                        ? 'Verify & Login'
                        : 'Send OTP'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {!otpSent && (
                  <View style={styles.signupSection}>
                    <Text style={styles.signupText}>
                      Don't have an account?
                    </Text>
                    <TouchableOpacity onPress={() => navigate('/signup')}>
                      <Text style={styles.signupLink}>Sign up</Text>
                    </TouchableOpacity>
                  </View>
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
    padding: 16,
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
    justifyContent: 'center',
  },
  imageSection: {
    flex: 1,
    height: '100%',
    minHeight: 450,
    backgroundColor: 'transparent',
    padding: 10,
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
    // On desktop, the card shadow/border is mostly handled by wrapper, but we keep basic styling
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.textDark,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: COLORS.divider,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: COLORS.textDark,
  },
  dummyInfo: {
    backgroundColor: COLORS.background,
    padding: 15,
    borderRadius: 8,
    marginBottom: 30,
  },
  dummyTitle: {
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 8,
    fontSize: 14,
  },
  dummyText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  errorContainer: {
    backgroundColor: '#FFF5F5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FEB2B2',
  },
  errorText: {
    color: '#C53030',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: 15,
  },
  btnOutline: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.divider,
    alignItems: 'center',
  },
  btnOutlineText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  btnFilled: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  btnFilledText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
  btnDisabled: {
    backgroundColor: COLORS.divider,
    opacity: 0.6,
  },
  otpInputGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 15,
  },
  otpInput: {
    width: 44,
    height: 44,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    borderWidth: 2,
    borderColor: COLORS.divider,
    color: COLORS.textDark,
  },
  resendBtn: {
    alignSelf: 'center',
    paddingVertical: 8,
  },
  resendText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  signupSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    gap: 6,
  },
  signupText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  signupLink: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
