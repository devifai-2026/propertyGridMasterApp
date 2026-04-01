import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
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

type Role = 'owner_investor' | 'broker' | null;
type Screen = 'role' | 'details' | 'otp';

const SignupScreen = ({ onClose }: { onClose?: () => void }) => {
  // ── Screen navigation
  const [currentScreen, setCurrentScreen] = useState<Screen>('role');
  const [selectedRole, setSelectedRole] = useState<Role>(null);

  // ── Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    reraNumber: '',
    email: '',
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [checkboxError, setCheckboxError] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // ── OTP state
  const [otp, setOtp] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpFilled, setOtpFilled] = useState(false);

  // ── Modal
  const [modalVisible, setModalVisible] = useState(true);

  const { login } = useAuth();
  const { signup: register, sendOtp, loading: apiLoading } = useAuthAPIs();
  const { openLoginModal, closeSignupModal } = useNavigation();

  const otpInputRefs = useRef<Array<TextInput | null>>([]);

  // ── Animation
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true, easing: Easing.out(Easing.ease) }),
      Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true, easing: Easing.out(Easing.ease) }),
    ]).start();
  }, [currentScreen]);

  const resetAnim = (cb: () => void) => {
    fadeAnim.setValue(0);
    slideAnim.setValue(40);
    cb();
  };

  const handleClose = () => {
    setModalVisible(false);
    if (onClose) {
      onClose();
    } else {
      closeSignupModal();
    }
  };

  const handleChange = (field: string, value: string) => {
    let sanitized = value;
    if (field === 'phone') sanitized = value.replace(/[^0-9]/g, '');
    if (field === 'email') sanitized = value.replace(/[^a-zA-Z0-9._%+\-@]/g, '');
    setFormData(prev => ({ ...prev, [field]: sanitized }));
    if (fieldErrors[field]) setFieldErrors(prev => ({ ...prev, [field]: '' }));
  };

  // ── Validation
  const validateDetails = () => {
    const errors: Record<string, string> = {};
    if (!formData.firstName.trim()) errors.firstName = 'Required';
    if (!formData.lastName.trim()) errors.lastName = 'Required';
    if (formData.phone.length !== 10) errors.phone = 'Enter a valid mobile number';
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Enter a valid Email ID';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ── Screen 1 → 2
  const handleRoleContinue = () => {
    if (!selectedRole) return;
    resetAnim(() => setCurrentScreen('details'));
  };

  // ── Screen 2 → 3 (send OTP)
  const handleDetailsContinue = () => {
    if (!validateDetails()) return;
    if (!termsAccepted || !privacyAccepted) {
      setCheckboxError(true);
      return;
    }
    setCheckboxError(false);
    sendOtp(
      { mobileNumber: formData.phone },
      (response: any) => {
        if (response.success) {
          setVerificationId(response.data.verificationId);
          setOtpError('');
          resetAnim(() => setCurrentScreen('otp'));
          setTimeout(() => otpInputRefs.current[0]?.focus(), 150);
        } else {
          Alert.alert('Error', response.message || 'Failed to send OTP');
        }
      },
      (error: any) => {
        Alert.alert('Error', error?.response?.data?.message || 'Failed to send OTP');
      },
    );
  };

  // ── OTP input handlers
  const handleOtpChange = (text: string, index: number) => {
    const digit = text.replace(/[^0-9]/g, '');
    const arr = otp.split('');
    arr[index] = digit;
    const newOtp = arr.join('');
    setOtp(newOtp);
    setOtpError('');
    if (digit && index < 3) otpInputRefs.current[index + 1]?.focus();
    setOtpFilled(newOtp.length === 4 && !newOtp.includes(''));
  };

  const handleOtpKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleResendOtp = () => {
    setOtp('');
    setOtpError('');
    setOtpFilled(false);
    sendOtp(
      { mobileNumber: formData.phone },
      (response: any) => {
        if (response.success) {
          setVerificationId(response.data.verificationId);
          setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
        } else {
          setOtpError(response.message || 'Failed to resend OTP');
        }
      },
      (error: any) => {
        setOtpError(error?.response?.data?.message || 'Failed to resend OTP');
      },
    );
  };

  // ── Screen 3 → Submit
  const handleVerifyAndSignup = async () => {
    if (otp.length < 4) { setOtpError('Please enter the complete OTP'); return; }
    register(
      {
        mobileNumber: formData.phone,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        roleName: selectedRole === 'broker' ? 'Broker' : 'Investor',
        reraNumber: selectedRole === 'broker' ? formData.reraNumber : undefined,
        otp,
        verificationId,
      },
      async (response: any) => {
        if (response.success) {
          setModalVisible(false);
          closeSignupModal();
          openLoginModal();
        } else {
          setOtpError(response.message || 'Verification failed. Double-check your OTP and try once more.');
        }
      },
      (error: any) => {
        setOtpError(error?.response?.data?.message || "That doesn't seem right. Double-check your OTP and try once more.");
      },
    );
  };

  // ──────────────────────────────────────────
  // RENDER HELPERS
  // ──────────────────────────────────────────

  const renderHeader = () => (
    <>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/Navbar/Preleasegrid logo 1.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  // ── SCREEN 1: Role selection
  const renderRoleScreen = () => (
    <Animated.View style={[styles.roleScreenContent, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <View style={styles.headingBanner}>
        <Text style={styles.screenHeading}>
          <Text style={styles.signUpBold}>Sign UP.</Text>
          {' '}To live in our space.
        </Text>
      </View>
      <Text style={styles.screenSub}>Tell us who you are to personalize your experience</Text>

      <View style={styles.roleCenter}>
      <View style={styles.roleRow}>
        {/* Owner / Investor */}
        <TouchableOpacity
          style={[styles.roleCardWrapper, selectedRole === 'owner_investor' && styles.roleCardActive]}
          onPress={() => setSelectedRole('owner_investor')}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#D7EFF7', '#FFFFFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            locations={[0.0761, 0.7484]}
            style={styles.roleCard}
          >
            <Image source={require('../../assets/SignUp/Owner.png')} style={styles.roleIcon} resizeMode="contain" />
            <Text style={styles.roleTitle}>Owner/{'\n'}Investor</Text>
            <Text style={styles.roleDesc}>Find profitable{'\n'}opportunities</Text>
          </LinearGradient>
          {selectedRole === 'owner_investor' && (
            <>
              <View style={[styles.cornerAccent, styles.cornerBL]} />
              <View style={[styles.cornerAccent, styles.cornerBR]} />
            </>
          )}
        </TouchableOpacity>

        {/* Broker */}
        <TouchableOpacity
          style={[styles.roleCardWrapper, selectedRole === 'broker' && styles.roleCardActive]}
          onPress={() => setSelectedRole('broker')}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#FDEDEE', '#FFFFFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            locations={[0.0761, 0.7484]}
            style={styles.roleCard}
          >
            <Image source={require('../../assets/SignUp/broker.png')} style={styles.roleIcon} resizeMode="contain" />
            <Text style={styles.roleTitle}>Broker</Text>
            <Text style={styles.roleDesc}>Connect buyers{'\n'}and sellers</Text>
          </LinearGradient>
          {selectedRole === 'broker' && (
            <>
              <View style={[styles.cornerAccent, styles.cornerBL]} />
              <View style={[styles.cornerAccent, styles.cornerBR]} />
            </>
          )}
        </TouchableOpacity>
      </View>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.btnOutline} onPress={() => {
          setModalVisible(false);
          closeSignupModal();
          openLoginModal();
        }}>
          <Text style={styles.btnOutlineText}>Back to Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnPrimary}
          onPress={handleRoleContinue}
        >
          <LinearGradient
            colors={['#EE2529', '#C73834']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.btnGradient}
          >
            <Text style={styles.btnPrimaryText}>Continue</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  // ── SCREEN 2: Account details
  const renderDetailsScreen = () => (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
      <View style={styles.headingBanner}>
        <Text style={styles.screenHeading}>Create your account</Text>
      </View>
      <Text style={styles.screenSub}>Just a few details to get you started</Text>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ width: '100%' }}>
        {/* First + Last Name row */}
        <View style={styles.nameRow}>
          <View style={styles.nameField}>
            <Text style={styles.inputLabel}>First Name <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={[
                styles.textInput,
                focusedField === 'firstName' && styles.textInputFocused,
                fieldErrors.firstName && styles.textInputError,
              ]}
              placeholder="Enter your first name"
              placeholderTextColor="#9CA3AF"
              value={formData.firstName}
              onChangeText={t => handleChange('firstName', t)}
              onFocus={() => setFocusedField('firstName')}
              onBlur={() => setFocusedField(null)}
            />
          </View>
          <View style={styles.nameField}>
            <Text style={styles.inputLabel}>Last Name <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={[
                styles.textInput,
                focusedField === 'lastName' && styles.textInputFocused,
                fieldErrors.lastName && styles.textInputError,
              ]}
              placeholder="Enter your last name"
              placeholderTextColor="#9CA3AF"
              value={formData.lastName}
              onChangeText={t => handleChange('lastName', t)}
              onFocus={() => setFocusedField('lastName')}
              onBlur={() => setFocusedField(null)}
            />
          </View>
        </View>

        {/* Mobile Number */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Mobile Number <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={[
              styles.textInput,
              focusedField === 'phone' && styles.textInputFocused,
              fieldErrors.phone && styles.textInputError,
            ]}
            placeholder="Enter your contact number"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
            maxLength={10}
            value={formData.phone}
            onChangeText={t => handleChange('phone', t)}
            onFocus={() => setFocusedField('phone')}
            onBlur={() => setFocusedField(null)}
          />
          {fieldErrors.phone ? (
            <View style={styles.errorRow}>
              <Text style={styles.errorIcon}>▲</Text>
              <Text style={styles.errorText}>{fieldErrors.phone}</Text>
            </View>
          ) : null}
        </View>

        {/* RERA Number — broker only, optional */}
        {selectedRole === 'broker' && (
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>RERA Number</Text>
            <TextInput
              style={[
                styles.textInput,
                focusedField === 'reraNumber' && styles.textInputFocused,
              ]}
              placeholder="Enter your RERA number"
              placeholderTextColor="#9CA3AF"
              value={formData.reraNumber}
              onChangeText={t => handleChange('reraNumber', t)}
              onFocus={() => setFocusedField('reraNumber')}
              onBlur={() => setFocusedField(null)}
            />
          </View>
        )}

        {/* Email */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Email <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={[
              styles.textInput,
              focusedField === 'email' && styles.textInputFocused,
              fieldErrors.email && styles.textInputError,
            ]}
            placeholder="Enter your Email"
            placeholderTextColor="#9CA3AF"
            keyboardType="email-address"
            autoCapitalize="none"
            value={formData.email}
            onChangeText={t => handleChange('email', t)}
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField(null)}
          />
          {fieldErrors.email ? (
            <View style={styles.errorRow}>
              <Text style={styles.errorIcon}>▲</Text>
              <Text style={styles.errorText}>{fieldErrors.email}</Text>
            </View>
          ) : null}
        </View>

        {/* Checkboxes */}
        <TouchableOpacity style={styles.checkRow} onPress={() => { setTermsAccepted(p => !p); setCheckboxError(false); }}>
          <View style={[styles.checkbox, termsAccepted && styles.checkboxChecked, checkboxError && !termsAccepted && styles.checkboxError]}>
            {termsAccepted && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.checkLabel}>
            I agree to the <Text style={styles.checkLink}>terms & conditions</Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.checkRow} onPress={() => { setPrivacyAccepted(p => !p); setCheckboxError(false); }}>
          <View style={[styles.checkbox, privacyAccepted && styles.checkboxChecked, checkboxError && !privacyAccepted && styles.checkboxError]}>
            {privacyAccepted && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.checkLabel}>
            I agree to the <Text style={styles.checkLink}>Privacy Policy</Text>
          </Text>
        </TouchableOpacity>

        {checkboxError && (
          <View style={styles.errorRow}>
            <Text style={styles.errorIcon}>▲</Text>
            <Text style={styles.errorText}>Please agree to the Terms & Conditions and Privacy Policy</Text>
          </View>
        )}
      </KeyboardAvoidingView>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.btnOutline} onPress={() => resetAnim(() => setCurrentScreen('role'))}>
          <Text style={styles.btnOutlineText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btnPrimary, apiLoading && styles.buttonDisabled]}
          onPress={handleDetailsContinue}
          disabled={apiLoading}
        >
          <LinearGradient
            colors={['#EE2529', '#C73834']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.btnGradient}
          >
            <Text style={styles.btnPrimaryText}>{apiLoading ? 'Sending...' : 'Continue'}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  // ── SCREEN 3: OTP verification
  const renderOtpScreen = () => (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
      <View style={styles.headingBanner}>
        <Text style={styles.screenHeading}>Verify your Contact Number</Text>
      </View>
      <Text style={styles.screenSub}>
        We sent a verification code to{' '}
        <Text style={styles.phoneHighlight}>+91 ........</Text>
      </Text>

      <View style={styles.otpRow}>
        {[0, 1, 2, 3].map(index => (
          <TextInput
            key={index}
            ref={ref => { otpInputRefs.current[index] = ref; }}
            style={[
              styles.otpInput,
              otpError ? styles.otpInputError : null,
              otp[index] && otpError ? styles.otpInputErrorFilled : null,
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

      {otpError ? (
        <Text style={styles.otpErrorText}>{otpError}</Text>
      ) : null}

      <Text style={styles.otpResendText}>
        Didn't received OTP?{' '}
        <Text style={styles.otpResendLink} onPress={handleResendOtp}>Click to resend OTP.</Text>
      </Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.btnOutline} onPress={() => resetAnim(() => setCurrentScreen('details'))}>
          <Text style={styles.btnOutlineText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnPrimary}
          onPress={handleVerifyAndSignup}
          // disabled={!otpFilled || apiLoading}
        >
          <LinearGradient
            colors={['#EE2529', '#C73834']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.btnGradient}
          >
            <Text style={styles.btnPrimaryText}>{apiLoading ? 'Verifying...' : 'Verify & Continue'}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  // ──────────────────────────────────────────
  // MAIN RENDER
  // ──────────────────────────────────────────
  return (
    <Modal animationType="none" transparent visible={modalVisible} onRequestClose={handleClose}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.card}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                scrollEnabled={currentScreen !== 'role'}
                contentContainerStyle={currentScreen === 'role' ? styles.roleScrollContent : undefined}
              >
                {renderHeader()}
                {currentScreen === 'role'    && renderRoleScreen()}
                {currentScreen === 'details' && renderDetailsScreen()}
                {currentScreen === 'otp'     && renderOtpScreen()}
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

// ──────────────────────────────────────────
// STYLES
// ──────────────────────────────────────────
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: 673,
    height: 745,
    backgroundColor: COLORS.white,
    borderRadius: 24,
    overflow: 'hidden',
    paddingHorizontal: 48,
    paddingTop: 24,
    paddingBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },

  /* ── Header ── */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  logoContainer: { flexDirection: 'row', alignItems: 'center', height: 40 },
  logoImage: { width: 120, height: 40 },
  closeButton:     { width: 28, height: 28, justifyContent: 'center', alignItems: 'center' },
  closeButtonText: { fontSize: 16, color: '#EE2529', fontWeight: '600', lineHeight: 18 },
  divider: { height: 1, backgroundColor: '#E5E7EB', marginBottom: 20, marginHorizontal: -48 },

  /* ── Shared headings ── */
  headingBanner: {
    backgroundColor: '#FFFCF4',
    marginHorizontal: -48,
    paddingVertical: 16,
    paddingHorizontal: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  screenHeading: {
    fontSize: 20, fontWeight: '700', color: '#1A1A1A',
    textAlign: 'center', lineHeight: 24,
  },
  signUpBold: { fontWeight: '700' },
  screenSub: {
    fontSize: 13, color: '#6B7280', lineHeight: 18,
    textAlign: 'center', marginBottom: 32,
  },

  /* ── Role cards ── */
  roleCenter: { flex: 1, justifyContent: 'center' },
  roleRow: { flexDirection: 'row', gap: 16, marginBottom: 36 },
  roleCardWrapper: {
    flex: 1, borderRadius: 16,
  },
  roleCardActive: {
    shadowColor: '#EE2529',
    shadowOffset: { width: 1.17, height: 4.69 },
    shadowOpacity: 1,
    shadowRadius: 2.35,
    elevation: 6,
  },
  cornerAccent: {
    position: 'absolute', width: 18, height: 18,
    // borderColor: '#EE2529', borderWidth: 2.5,
  },
  cornerBL: {
    bottom: 0, left: 0,
    borderTopWidth: 0, borderRightWidth: 0,
    borderBottomLeftRadius: 16,
  },
  cornerBR: {
    bottom: 0, right: 0,
    borderTopWidth: 0, borderLeftWidth: 0,
    borderBottomRightRadius: 16,
  },
  roleCard: { padding: 20, alignItems: 'center', borderRadius: 14 },
  roleIcon:  { width: 48, height: 48, marginBottom: 12 },
  roleTitle: { fontSize: 15, fontWeight: '700', color: '#1F2937', textAlign: 'center', marginBottom: 6, lineHeight: 18 },
  roleDesc:  { fontSize: 12, color: '#6B7280', textAlign: 'center', lineHeight: 16 },

  /* ── Buttons ── */
  buttonRow:   { flexDirection: 'row', gap: 12, marginTop: 24 },
  btnOutline: {
    flex: 1, borderWidth: 1.5, borderColor: '#D1D5DB', borderRadius: 12,
    paddingVertical: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.white,
  },
  btnOutlineText: { fontSize: 15, fontWeight: '600', color: '#374151', lineHeight: 18 },
  btnPrimary: {
    flex: 1, borderRadius: 5, overflow: 'hidden',
  },
  btnGradient: {
    paddingVertical: 14, alignItems: 'center', justifyContent: 'center',
  },
  btnPrimaryText: { fontSize: 15, fontWeight: '600', color: COLORS.white, lineHeight: 18 },
  buttonDisabled: { opacity: 0.5 },

  /* ── Form inputs ── */
  nameRow:   { flexDirection: 'row', gap: 16, marginBottom: 20 },
  nameField: { flex: 1 },
  inputGroup:  { marginBottom: 20 },
  inputLabel:  { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 8, lineHeight: 16 },
  required:    { color: '#EE2529' },
  textInput: {
    borderWidth: 1.5, borderColor: '#E5E7EB', borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 13, fontSize: 15, color: '#1F2937', backgroundColor: '#F9FAFB', lineHeight: 18,
  },
  textInputFocused: { borderColor: '#3B82F6', backgroundColor: COLORS.white },
  textInputError:   { borderColor: '#EE2529' },

  /* ── Field errors ── */
  errorRow:  { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 5 },
  errorIcon: { color: '#EE2529', fontSize: 10, fontWeight: '700' },
  errorText: { color: '#EE2529', fontSize: 12, lineHeight: 14 },

  /* ── Checkboxes ── */
  checkRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 14 },
  checkbox: {
    width: 18, height: 18, borderWidth: 1.5, borderColor: '#D1D5DB',
    borderRadius: 4, alignItems: 'center', justifyContent: 'center', marginTop: 2,
  },
  checkboxChecked: { backgroundColor: '#EE2529', borderColor: '#EE2529' },
  checkboxError: { borderColor: '#EE2529' },
  checkmark:  { color: COLORS.white, fontSize: 11, fontWeight: '700' },
  checkLabel: { fontSize: 13, color: '#374151', lineHeight: 16, flex: 1 },
  checkLink:  { color: '#3B82F6', textDecorationLine: 'underline' },

  /* ── OTP ── */
  phoneHighlight: { fontWeight: '700', color: '#1F2937' },
  otpRow: {
    flexDirection: 'row', justifyContent: 'center',
    gap: 12, marginBottom: 20, marginTop: 12,
  },
  otpInput: {
    width: 64, height: 64, borderWidth: 1.5, borderColor: '#E5E7EB',
    borderRadius: 12, textAlign: 'center', fontSize: 26, fontWeight: '700',
    color: '#1F2937', backgroundColor: '#F9FAFB',
  },
  otpInputError:       { borderColor: '#EE2529' },
  otpInputErrorFilled: { borderColor: '#EE2529', color: '#EE2529' },
  otpErrorText: {
    color: '#EE2529', fontSize: 13, textAlign: 'center',
    marginBottom: 16, lineHeight: 18, paddingHorizontal: 8,
  },
  otpResendText: {
    fontSize: 13, color: '#6B7280', textAlign: 'center',
    marginBottom: 8, lineHeight: 18,
  },
  otpResendLink: {
    color: '#1F2937', fontWeight: '500', textDecorationLine: 'underline',
  },
  roleScrollContent: { flex: 1 },
  roleScreenContent: { flex: 1, justifyContent: 'space-between' },
});

export default SignupScreen;