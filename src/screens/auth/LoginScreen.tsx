import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Easing,
  Image,
  useWindowDimensions,
  Dimensions,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '../../context/NavigationContext';
import { useAuthAPIs } from '../../../helpers/hooks/authAPIs/useAuthAPIs';
import { COLORS } from '../../constants/theme';
import { allowedRoles } from '../../../helpers/allowedRoles';

const CrossIcon = ({ size = 18, color = "#EE2529" }: { size?: number, color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 18 18" fill="none">
    <Path d="M0.498101 0.498088C-0.166034 1.16222 -0.166034 2.23897 0.498101 2.90311L6.59498 8.99996L0.498101 15.0969C-0.166034 15.761 -0.166034 16.8379 0.498101 17.5019C1.16222 18.166 2.23899 18.166 2.9031 17.5019L8.99997 11.4049L15.097 17.5019C15.761 18.166 16.8379 18.166 17.5019 17.5019C18.166 16.8379 18.166 15.761 17.5019 15.0969L11.405 8.99996L17.5019 2.90313C18.166 2.23901 18.166 1.16224 17.5019 0.498123C16.8377 -0.166012 15.761 -0.166012 15.097 0.498123L8.99997 6.59497L2.9031 0.498088C2.23899 -0.166029 1.16222 -0.166029 0.498101 0.498088Z" fill={color}/>
  </Svg>
);

const LoginScreen = ({ onClose }: { onClose?: () => void }) => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [verificationId, setVerificationId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [otpError, setOtpError] = useState(false);
  const [modalVisible, setModalVisible] = useState(true);
  const { login } = useAuth();
  const { login: authenticate, sendOtp, loading: apiLoading } = useAuthAPIs();
  const { openSignupModal, closeLoginModal } = useNavigation();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

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
    setOtpError(false);
  };

  const handleOtpKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleResendOtp = () => {
    setOtp('');
    setOtpError(false);
    setErrorMsg('');
    sendOtp(
      { mobileNumber: phone },
      (response: any) => {
        if (response.success) {
          setVerificationId(response.data.verificationId);
          setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
        } else {
          setErrorMsg(
            'Having trouble receiving your OTP? Please check your mobile number. If the issue persists, contact our support team',
          );
        }
      },
      (error: any) => {
        setErrorMsg(
          'Having trouble receiving your OTP? Please check your mobile number. If the issue persists, contact our support team',
        );
      },
    );
  };

  const handleVerifyOtp = async () => {
    setErrorMsg('');
    setOtpError(false);
    if (otp.length === 6) {
      authenticate(
        { mobileNumber: phone, otp, verificationId },
        async (response: any) => {
          if (response.success) {
            const userRoles = response.data.roles || [];
            console.log(response)
            if (!response.data.role && userRoles.length > 0) {
              response.data.role = userRoles[0];
            }
            // const hasAllowedRole = userRoles.some((role: string) => allowedRoles.includes(role));

            // if (!hasAllowedRole) {
            //   setOtpError(true);
            //   setErrorMsg(
            //     'Access Denied: Only Owners, Brokers, and Investors can access this platform.',
            //   );
            //   return;
            // }
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
            setOtpError(true);
            setErrorMsg(
              "That doesn't seem right. Double-check your OTP and try once more.",
            );
          }
        },
        (error: any) => {
          setOtpError(true);
          setErrorMsg(
            "That doesn't seem right. Double-check your OTP and try once more.",
          );
        },
      );
    } else {
      setOtpError(true);
      setErrorMsg('Please enter the complete 6-digit OTP');
    }
  };

  const renderLoginContent = () => (
    <Animated.View
      style={[
        styles.modalContent,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}>

      {/* ── HEADER SECTION ── */}
      <View style={styles.headerSection}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/Navbar/Preleasegrid logo 1.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <TouchableOpacity
            onPress={handleClose}
            style={styles.closeButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <CrossIcon size={18} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── WELCOME / TITLE SECTION ── */}
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeTitle}>
          {!otpSent ? 'Welcome' : 'Verify your Contact Number'}
        </Text>
      </View>

      {/* ── SUBTITLE SECTION ── */}
      <View style={styles.subtitleContainer}>
        {!otpSent ? (
          <Text style={styles.welcomeSubtitle}>
            Sign in to your account to continue
          </Text>
        ) : (
          <Text style={styles.welcomeSubtitle}>
            We sent a verification code to{' '}
            <Text style={styles.verifyPhone}>+91 .........</Text>
          </Text>
        )}
      </View>

      {/* ── FORM SECTION ── */}
      <View style={styles.formSection}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}>

          {!otpSent ? (
            /* ══════ SCREEN 1: Phone entry ══════ */
            <>
              <View style={styles.inputGroup_phone}>
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
                    setPhone(text.replace(/[^0-9]/g, ''));
                    setErrorMsg('');
                  }}
                />
              </View>

              <View style={styles.buttonRowMain}>
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
                  style={styles.btnPrimary}
                  onPress={handleSendOtp}>
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

              {!!errorMsg && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{errorMsg}</Text>
                </View>
              )}
            </>
          ) : (
            /* ══════ SCREEN 2: OTP entry ══════ */
            <>
              {/* OTP Boxes */}
              <View style={styles.otpInputGroup}>
                {[0, 1, 2, 3, 4, 5].map(index => (
                  <TextInput
                    key={index}
                    ref={ref => {
                      otpInputRefs.current[index] = ref;
                    }}
                    style={[
                      styles.otpInput,
                      otpError && styles.otpInputError,
                    ]}
                    maxLength={1}
                    keyboardType="number-pad"
                    value={otp[index] || ''}
                    onChangeText={text => handleOtpChange(text, index)}
                    onKeyPress={e => handleOtpKeyPress(e, index)}
                    selectTextOnFocus
                  />
                ))}
              </View>

              {/* Error message */}
              {!!errorMsg && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{errorMsg}</Text>
                </View>
              )}

              {/* Resend OTP + Contact Support links */}
              <View style={styles.resendContainer}>
                <TouchableOpacity onPress={handleResendOtp}>
                  <Text style={styles.resendLink}>
                    Didn’t received OTP? <Text style={styles.resendLinkAction}>Click to resend OTP.</Text>
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { /* open support */ }}>
                   {/* <Text style={styles.resendLink}>Contact Support</Text> */}
                </TouchableOpacity>
              </View>

              {/* Buttons */}
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.btnBack}
                  onPress={() => {
                    setOtpSent(false);
                    setOtp('');
                    setErrorMsg('');
                    setOtpError(false);
                  }}>
                  <Text style={styles.btnBackText}>Back</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.btnPrimary}
                  onPress={handleVerifyOtp}>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* ── Card ── */
  modalContent: {
    width: Platform.OS === 'web' ? (Dimensions.get('window').width > 768 ? 665 : '92%') : '92%',
    maxWidth: 665,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 12,
  },

  /* ── HEADER SECTION ── */
  headerSection: {
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 16,
    paddingHorizontal: 24,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    width: 184,
    height: 75,
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#EE2529',
    fontWeight: '600',
    fontFamily: 'Montserrat',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
  },

  /* ── WELCOME CONTAINER ── */
  welcomeContainer: {
    backgroundColor: '#FFFCF4',
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#262626',
    textAlign: 'center',
    fontFamily: 'Montserrat',
  },

  /* ── SUBTITLE CONTAINER ── */
  subtitleContainer: {
    backgroundColor: COLORS.white,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeSubtitle: {
    fontSize: 18,
    color: '#767676',
    textAlign: 'center',
    lineHeight: 18,
    fontFamily: 'Montserrat',
  },
  verifyPhone: {
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: 'Montserrat',
  },

  /* ── FORM SECTION ── */
  formSection: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 32,
    paddingTop: 8,
    paddingBottom: 40,
  },
  keyboardView: {
    width: '100%',
  },

  /* ── Input ── */
  inputGroup: {
    marginBottom: 28,
  },
  inputGroup_phone:{
    width: '100%',
    paddingHorizontal: Platform.OS === 'web' && Dimensions.get('window').width > 768 ? 44 : 0,
    marginBottom: 28
  },
  inputLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
    fontFamily: 'Montserrat',
  },
  required: {
    color: '#000000',
  },
  textInput: {
    borderWidth: 1.5,
    borderColor: '#767676',
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 18,
    color: '#262626',
    backgroundColor: '#FFFFFF',
    fontWeight: '400',
    fontFamily: 'Montserrat',
  },

  /* ── Button row ── */
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  buttonRowMain:{
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    width: '100%',
    paddingHorizontal: Platform.OS === 'web' && Dimensions.get('window').width > 768 ? 20 : 0
  },

  /* Sign Up button */
  btnOutline: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#767676',
    borderRadius: 5,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
  },
  btnOutlineText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#767676',
    fontFamily: 'Montserrat',
  },

  /* Continue / Verify button */
  btnPrimary: {
    flex: 1,
    borderRadius: 5,
    overflow: 'hidden',
  },
  btnGradient: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimaryText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Montserrat',
  },

  /* Back button */
  btnBack: {
    flex: 1,
   
    borderRadius: 5,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#767676',
  },
  btnBackText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#767676',
    fontFamily: 'Montserrat',
  },

  /* ── OTP inputs ── */
  otpInputGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 20,
  },
  otpInput: {
    width: Dimensions.get('window').width > 768 ? 72 : 45,
    height: Dimensions.get('window').width > 768 ? 72 : 45,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 26,
    fontWeight: '600',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    color: '#1F2937',
    fontFamily: 'Montserrat',
  },
  otpInputError: {
    borderColor: '#EE2529',
    borderWidth: 1.5,
  },

  /* ── Resend + Contact Support ── */
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginTop: 16,
    marginBottom: 24,
  },
  resendLink: {
    fontSize: 18,
    fontWeight: '400',
    color: '#262626',
    fontFamily: 'Montserrat',
  },
  resendLinkAction: {
    textDecorationLine: 'underline',
    fontWeight: '400',
     color: '#262626',
  },

  /* ── Error ── */
  errorContainer: {
    backgroundColor: '#FEF2F2',
    padding: 12,
    borderRadius: 8,
    marginTop: 4,
    marginBottom: 4,
  },
  errorText: {
    color: '#EE2529',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    fontFamily: 'Montserrat',
  },
});

export default LoginScreen;