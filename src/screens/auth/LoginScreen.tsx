import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Easing,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '../../context/NavigationContext';
import { useAuthAPIs } from '../../../helpers/hooks/authAPIs/useAuthAPIs';
import { COLORS } from '../../constants/theme';
import { allowedRoles } from '../../../helpers/allowedRoles';

const LoginScreen = ({ onClose }: { onClose?: () => void }) => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [verificationId, setVerificationId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [modalVisible, setModalVisible] = useState(true);
  const { login } = useAuth();
  const { login: authenticate, sendOtp, loading: apiLoading } = useAuthAPIs();
  const { openSignupModal, closeLoginModal } = useNavigation();

  const otpInputRefs = useRef<Array<TextInput | null>>([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    if (modalVisible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),
      ]).start();
    }
  }, [modalVisible]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 50,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setModalVisible(false);
      if (onClose) {
        onClose();
      } else {
        closeLoginModal();
      }
    });
  };

  const handleSendOtp = () => {
    setErrorMsg('');
    if (phone.length === 10) {
      sendOtp(
        { mobileNumber: phone },
        (response: any) => {
          if (response.success) {
            setVerificationId(response.data.verificationId);
            setOtpSent(true);
            setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
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
    const digit = text.replace(/[^0-9]/g, '');
    const newOtp = otp.split('');
    newOtp[index] = digit;
    setOtp(newOtp.join(''));
    if (digit && index < 5) otpInputRefs.current[index + 1]?.focus();
    setErrorMsg('');
  };

  const handleOtpKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleResendOtp = () => {
    setOtp('');
    sendOtp(
      { mobileNumber: phone },
      (response: any) => {
        if (response.success) {
          setVerificationId(response.data.verificationId);
          Alert.alert('Success', 'OTP resent successfully');
          setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
        } else {
          setErrorMsg(response.message || 'Failed to resend OTP');
        }
      },
      (error: any) => {
        setErrorMsg(error?.response?.data?.message || 'Failed to resend OTP');
      },
    );
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
              setModalVisible(false);
              if (onClose) {
                onClose();
              } else {
                closeLoginModal();
              }
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

  const renderLoginContent = () => (
    <Animated.View
      style={[
        styles.modalContent,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}>
      {/* ── TOP CREAM SECTION: Header + Welcome ── */}
      <View style={styles.topSection}>
        {/* Header: Logo left, Close right */}
        <View style={styles.header}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/Navbar/Preleasegrid logo 1.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          {/* Close */}
          <TouchableOpacity onPress={handleClose} style={styles.closeButton} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Welcome title + subtitle inside cream area */}
        {!otpSent ? (
          <View style={styles.titleArea}>
            <Text style={styles.welcomeTitle}>Welcome</Text>
            <Text style={styles.welcomeSubtitle}>Sign in to your account to continue</Text>
          </View>
        ) : (
          <View style={styles.titleArea}>
            <Text style={styles.welcomeTitle}>Verify your Contact Number</Text>
            <Text style={styles.welcomeSubtitle}>
              We sent a verification code to{' '}
              <Text style={styles.verifyPhone}>+91 .........</Text>
            </Text>
          </View>
        )}
      </View>

      {/* ── WHITE BODY SECTION ── */}
      <View style={styles.bodySection}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          {!otpSent ? (
            /* ══════ SCREEN 1: Phone entry ══════ */
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  Mobile Number <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your contact number"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  maxLength={10}
                  value={phone}
                  onChangeText={text => {
                    setPhone(text);
                    setErrorMsg('');
                  }}
                />
              </View>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.btnOutline}
                  onPress={() => {
                    setModalVisible(false);
                    closeLoginModal();
                    openSignupModal();
                  }}
                  disabled={apiLoading}>
                  <Text style={styles.btnOutlineText}>
                    {apiLoading ? 'Please wait...' : 'Sign Up'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.btnPrimary,
                    // phone.length !== 10 && styles.buttonDisabled,
                  ]}
                  onPress={handleSendOtp}
                  // disabled={apiLoading}
                  >
                  <LinearGradient
                    colors={['#EE2529', '#C73834']}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.btnGradient}>
                    <Text style={styles.btnPrimaryText}>
                      {apiLoading ? 'Sending...' : 'Continue'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            /* ══════ SCREEN 2: OTP entry ══════ */
            <>
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
                  />
                ))}
              </View>

              <TouchableOpacity
                onPress={handleResendOtp}
                style={styles.resendContainer}>
                <Text style={styles.resendText}>
                  Didn't received OTP?{' '}
                  <Text style={styles.resendLink}>Click to resend OTP.</Text>
                </Text>
              </TouchableOpacity>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.btnBack}
                  onPress={() => {
                    setOtpSent(false);
                    setOtp('');
                    setErrorMsg('');
                  }}>
                  <Text style={styles.btnBackText}>Back</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.btnPrimary,
                    // otp.length !== 6 && styles.buttonDisabled,
                  ]}
                  onPress={handleVerifyOtp}
                  // disabled={apiLoading || otp.length !== 6}
                  >
                  <LinearGradient
                    colors={['#EE2529', '#C73834']}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.btnGradient}>
                    <Text style={styles.btnPrimaryText}>
                      {apiLoading ? 'Verifying...' : 'Verify & Continue'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </>
          )}

          {!!errorMsg && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          )}
        </KeyboardAvoidingView>
      </View>
    </Animated.View>
  );

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={modalVisible}
      onRequestClose={handleClose}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>{renderLoginContent()}</TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  /* ── Overlay ── */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* ── Card ── */
  modalContent: {
    width: '90%',
    maxWidth: 420,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 12,
  },

  /* ── TOP CREAM SECTION ── */
  topSection: {
    // backgroundColor: '#FFFCF4',   // light cream background for welcome
    paddingTop: 18,
    paddingHorizontal: 20,
    paddingBottom: 0,
  },

  /* ── Header row ── */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 40,
  },
  logoImage: {
    width: 120,
    height: 40,
  },
  closeButton: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#EE2529',
    fontWeight: '600',
    lineHeight: 18,
  },

  /* ── Divider ── */
  divider: {
    height: 0,
    backgroundColor: 'transparent',
    marginBottom: 0,
  },

  /* ── Title area (still in cream bg) ── */
  titleArea: {
    paddingTop: 2,
    paddingBottom: 20,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
    backgroundColor:"#FFFCF4",
    width: '100%',
    textAlign: 'center',
    paddingTop: 10,
    marginBottom: 6,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  welcomeSubtitle: {
    fontSize: 13.5,
    color: '#888',
    textAlign: 'center',
  },
  verifyPhone: {
    fontWeight: '600',
    color: '#1F2937',
  },

  /* ── WHITE BODY SECTION ── */
  bodySection: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 28,
  },

  /* ── Input ── */
  inputGroup: {
    marginBottom: 35,
  },
  inputLabel: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#222',
    marginBottom: 8,
  },
  required: {
    color: '#EE2529',
  },
  textInput: {
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingVertical: 13,
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#1F2937',
    backgroundColor: '#FAFAFA',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },

  /* ── Button row ── */
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },

  /* Sign Up — outline, narrower */
  btnOutline: {
    flex: 0.72,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    borderRadius: 5,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
  },
  btnOutlineText: {
    fontSize: 14.5,
    fontWeight: '600',
    color: '#374151',
  },

  /* Continue — gradient, wider, more rounded */
  btnPrimary: {
    flex: 1,
    borderRadius: 5,
    overflow: 'hidden',
  },
  btnGradient: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimaryText: {
    fontSize: 14.5,
    fontWeight: '600',
    color: COLORS.white,
    letterSpacing: 0.2,
  },

  /* Back button (OTP screen) */
  btnBack: {
    flex: 0.72,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnBackText: {
    fontSize: 14.5,
    fontWeight: '600',
    color: '#374151',
  },

  buttonDisabled: {
    opacity: 0.45,
  },

  /* ── OTP inputs ── */
  otpInputGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 20,
  },
  otpInput: {
    width: 48,
    height: 56,
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    color: '#1F2937',
  },

  /* ── Resend ── */
  resendContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  resendText: {
    fontSize: 13,
    color: '#6B7280',
  },
  resendLink: {
    color: '#EE2529',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },

  /* ── Error ── */
  errorContainer: {
    backgroundColor: '#FEF2F2',
    padding: 12,
    borderRadius: 8,
    marginTop: 14,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 13,
    textAlign: 'center',
  },
});

export default LoginScreen;