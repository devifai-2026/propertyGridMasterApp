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
  Linking,
  useWindowDimensions,
  Dimensions,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '../../context/NavigationContext';
import { useAuthAPIs } from '../../../helpers/hooks/authAPIs/useAuthAPIs';
import { getHeaders } from '../../../helpers/api/headers';
import { BASE_URL } from '../../../helpers/environments';
import { decodeResponseData } from '../../../helpers/api/decoder';
import { COLORS } from '../../constants/theme';

const CrossIcon = ({ size = 18, color = "#EE2529" }: { size?: number, color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 18 18" fill="none">
    <Path d="M0.498101 0.498088C-0.166034 1.16222 -0.166034 2.23897 0.498101 2.90311L6.59498 8.99996L0.498101 15.0969C-0.166034 15.761 -0.166034 16.8379 0.498101 17.5019C1.16222 18.166 2.23899 18.166 2.9031 17.5019L8.99997 11.4049L15.097 17.5019C15.761 18.166 16.8379 18.166 17.5019 17.5019C18.166 16.8379 18.166 15.761 17.5019 15.0969L11.405 8.99996L17.5019 2.90313C18.166 2.23901 18.166 1.16224 17.5019 0.498123C16.8377 -0.166012 15.761 -0.166012 15.097 0.498123L8.99997 6.59497L2.9031 0.498088C2.23899 -0.166029 1.16222 -0.166029 0.498101 0.498088Z" fill={color}/>
  </Svg>
);

const SPECIALIZATION_OPTIONS = [
  'MNC Client',
  'Industrial',
  'Residential',
  'Commercial',
  'Office Lease',
];

type Role = 'owner_investor' | 'broker' | null;
type Screen = 'role' | 'details' | 'otp';

const SignupScreen = ({ onClose }: { onClose?: () => void }) => {
  // ── Screen navigation
  const [currentScreen, setCurrentScreen] = useState<Screen>('role');
  const [selectedRole, setSelectedRole] = useState<Role>(null);
  const [hoveredRole, setHoveredRole] = useState<Role>(null);

  // ── Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    reraNumber: '',
    email: '',
    locality: '',
    dealsClosed: '',
  });
  const [specializations, setSpecializations] = useState<string[]>([]);

  const toggleSpecialization = (item: string) => {
    setSpecializations(prev =>
      prev.includes(item) ? prev.filter(s => s !== item) : [...prev, item],
    );
  };
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

  // ── Profile photo (broker only)
  const [profilePhotoFile, setProfilePhotoFile] = useState<any>(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(
    null,
  );
  const fileInputRef = useRef<any>(null);

  const handlePickPhoto = () => {
    if (Platform.OS === 'web' && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      Alert.alert('Invalid file', 'Please upload an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      Alert.alert('File too large', 'File size should be less than 5MB');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setProfilePhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
    setProfilePhotoFile(file);
    e.target.value = '';
  };

  // ── Modal
  const [modalVisible, setModalVisible] = useState(true);

  const { login, updateUser } = useAuth();
  const { signup: register, sendOtp, loading: apiLoading } = useAuthAPIs();
  const { navigate, openLoginModal, closeSignupModal } = useNavigation();
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const isMobile = SCREEN_WIDTH < 768;

  const otpInputRefs = useRef<Array<TextInput | null>>([]);

  // ── Animation
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
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
    if (field === 'email')
      sanitized = value.replace(/[^a-zA-Z0-9._%+\-@]/g, '');
    setFormData(prev => ({ ...prev, [field]: sanitized }));
    if (fieldErrors[field]) setFieldErrors(prev => ({ ...prev, [field]: '' }));
  };

  // ── Validation
  const validateDetails = () => {
    const errors: Record<string, string> = {};
    if (!formData.firstName.trim())
      errors.firstName = 'Enter a valid first name';
    if (!formData.lastName.trim()) errors.lastName = 'Enter a valid last name';
    if (formData.phone.length !== 10)
      errors.phone = 'Enter a valid mobile number';
    if (
      !formData.email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      errors.email = 'Enter a valid Email ID';
    }
    if (selectedRole === 'broker') {
      if (!formData.locality.trim()) errors.locality = 'Required';
      if (!formData.dealsClosed.trim()) errors.dealsClosed = 'Required';
      if (specializations.length === 0)
        errors.specializations = 'Select at least one';
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
        Alert.alert(
          'Error',
          error?.response?.data?.message || 'Failed to send OTP',
        );
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
    if (digit && index < 5) otpInputRefs.current[index + 1]?.focus();
    setOtpFilled(newOtp.length === 6 && !newOtp.includes(''));
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
    if (otp.length < 6) {
      setOtpError('Please enter the complete OTP');
      return;
    }
    register(
      {
        mobileNumber: formData.phone,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        roleName: selectedRole === 'broker' ? 'Broker' : 'Investor',
        joinType: selectedRole === 'broker' ? 'broker' : 'investor',
        reraNumber: selectedRole === 'broker' ? formData.reraNumber : undefined,
        locality: selectedRole === 'broker' ? formData.locality : undefined,
        specializations:
          selectedRole === 'broker' ? specializations : undefined,
        dealsClosed:
          selectedRole === 'broker'
            ? parseInt(formData.dealsClosed) || 0
            : undefined,
        otp,
        verificationId,
      },
      async (response: any) => {
        if (response.success) {
          setModalVisible(false);
          closeSignupModal();
          if (selectedRole === 'broker') {
            await login(response.data);
            if (profilePhotoFile) {
              try {
                const headers = await getHeaders();
                delete (headers as any)['Content-Type'];
                const fd = new FormData();
                fd.append('profilePhoto', profilePhotoFile);
                fd.append('locality', formData.locality.trim());
                fd.append('specializations', JSON.stringify(specializations));
                fd.append(
                  'dealsClosed',
                  String(parseInt(formData.dealsClosed) || 0),
                );
                const res = await fetch(`${BASE_URL}/v1/brokers/profile`, {
                  method: 'POST',
                  headers: headers as any,
                  body: fd,
                });
                const photoData = await res.json();
                if (photoData.success) {
                  // data is an encoded string — fetch the profile to get the actual URL
                  const profileHeaders = await getHeaders();
                  const profileRes = await fetch(
                    `${BASE_URL}/v1/brokers/profile`,
                    {
                      method: 'GET',
                      headers: profileHeaders as any,
                    },
                  );
                  const profileData = await profileRes.json();
                  if (profileData.success && profileData.data) {
                    const decoded = decodeResponseData(profileData.data);
                    console.log(decoded);
                    if (decoded?.profilePhoto) {
                      await updateUser({ profilePhoto: decoded.profilePhoto });
                    }
                  }
                } else {
                  console.warn('[Photo upload failed]', photoData.message);
                }
              } catch (err) {
                console.error('[Photo upload error]', err);
              }
            }
            navigate('/my-prifile');
          } else {
            openLoginModal();
          }
        } else {
          setOtpError(
            response.message ||
              'Verification failed. Double-check your OTP and try once more.',
          );
        }
      },
      (error: any) => {
        setOtpError(
          error?.response?.data?.message ||
            "That doesn't seem right. Double-check your OTP and try once more.",
        );
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
        <TouchableOpacity
          onPress={handleClose}
          style={styles.closeButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <CrossIcon size={18} />
        </TouchableOpacity>
      </View>
    </>
  );

  // ── SCREEN 1: Role selection
  const renderRoleScreen = () => (
    <Animated.View
      style={[
        styles.roleScreenContent,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <View style={styles.headingBanner}>
        <Text style={styles.screenHeading}>
          <Text style={styles.signUpBold}>Sign UP.</Text> To live in our space.
        </Text>
      </View>
      <Text style={styles.screenSub}>
        Tell us who you are to personalize your experience
      </Text>

      <View style={styles.roleCenter}>
        <View style={styles.roleRow}>
          {/* Owner / Investor */}
          <TouchableOpacity
            style={[
              styles.roleCardWrapper,
              (selectedRole === 'owner_investor' || hoveredRole === 'owner_investor') && styles.roleCardActive,
            ]}
            onPress={() => setSelectedRole('owner_investor')}
            onMouseEnter={() => setHoveredRole('owner_investor')}
            onMouseLeave={() => setHoveredRole(null)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#D7EFF7', '#FFFFFF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              locations={[0.0761, 0.7484]}
              style={styles.roleCard}
            >
              <Image
                source={require('../../assets/SignUp/Owner.png')}
                style={styles.roleIcon}
                resizeMode="contain"
              />
              <Text style={styles.roleTitle}>Owner/{'\n'}Investor</Text>
              <Text style={styles.roleDesc}>
                Find profitable{'\n'}opportunities
              </Text>
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
            style={[
              styles.roleCardWrapper,
              (selectedRole === 'broker' || hoveredRole === 'broker') && styles.roleCardActive,
            ]}
            onPress={() => setSelectedRole('broker')}
            onMouseEnter={() => setHoveredRole('broker')}
            onMouseLeave={() => setHoveredRole(null)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#FDEDEE', '#FFFFFF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              locations={[0.0761, 0.7484]}
              style={styles.roleCard}
            >
              <Image
                source={require('../../assets/SignUp/broker.png')}
                style={styles.roleIcon}
                resizeMode="contain"
              />
              <Text style={styles.roleTitle}>Broker</Text>
              <Text style={styles.roleDesc}>
                Connect buyers{'\n'}and sellers
              </Text>
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
        <TouchableOpacity
          style={styles.btnOutline}
          onPress={() => {
            setModalVisible(false);
            closeSignupModal();
            openLoginModal();
          }}
        >
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
    <Animated.View
      style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
    >
      <View style={styles.headingBanner}>
        <Text style={styles.screenHeading}>Create your account</Text>
      </View>
      <Text style={styles.screenSub}>
        Just a few details to get you started
      </Text>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ width: '100%' }}
      >
        {selectedRole === 'broker' && (
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Profile Photo</Text>
            <TouchableOpacity
              style={styles.photoUploadBox}
              onPress={handlePickPhoto}
              activeOpacity={0.75}
            >
              {profilePhotoPreview ? (
                <Image
                  source={{ uri: profilePhotoPreview }}
                  style={styles.photoPreview}
                />
              ) : (
                <View style={styles.photoPlaceholder}>
                  <Text style={styles.photoUploadIcon}>↑</Text>
                  <Text style={styles.photoUploadText}>Upload Photo</Text>
                </View>
              )}
            </TouchableOpacity>
            {profilePhotoPreview && (
              <TouchableOpacity
                onPress={() => {
                  setProfilePhotoFile(null);
                  setProfilePhotoPreview(null);
                }}
                style={{ marginTop: 6 }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    color: COLORS.primary,
                    fontWeight: '600',
                  }}
                >
                  Remove photo
                </Text>
              </TouchableOpacity>
            )}
            {Platform.OS === 'web' && (
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            )}
          </View>
        )}
        {/* First + Last Name row */}
        <View style={styles.nameRow}>
          <View style={styles.nameField}>
            <Text style={styles.inputLabel}>
              First Name <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[
                styles.textInput,
                focusedField === 'firstName' && styles.textInputFocused,
                fieldErrors.firstName && styles.textInputError,
              ]}
              placeholder="Enter your first name"
              placeholderTextColor="#767676"
              value={formData.firstName}
              onChangeText={t => handleChange('firstName', t)}
              onFocus={() => setFocusedField('firstName')}
              onBlur={() => setFocusedField(null)}
            />
            {fieldErrors.firstName ? (
              <View style={styles.errorRow}>
                <Image
                  source={require('../../assets/SignUp/errorIcon.png')}
                  style={styles.errorIcon}
                />
                <Text style={styles.errorText}>{fieldErrors.firstName}</Text>
              </View>
            ) : null}
          </View>
          <View style={styles.nameField}>
            <Text style={styles.inputLabel}>
              Last Name <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[
                styles.textInput,
                focusedField === 'lastName' && styles.textInputFocused,
                fieldErrors.lastName && styles.textInputError,
              ]}
              placeholder="Enter your last name"
              placeholderTextColor="#767676"
              value={formData.lastName}
              onChangeText={t => handleChange('lastName', t)}
              onFocus={() => setFocusedField('lastName')}
              onBlur={() => setFocusedField(null)}
            />
            {fieldErrors.lastName ? (
              <View style={styles.errorRow}>
                <Image
                  source={require('../../assets/SignUp/errorIcon.png')}
                  style={styles.errorIcon}
                />
                <Text style={styles.errorText}>{fieldErrors.lastName}</Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* Mobile Number */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>
            Mobile Number <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[
              styles.textInput,
              focusedField === 'phone' && styles.textInputFocused,
              fieldErrors.phone && styles.textInputError,
            ]}
            placeholder="Enter your contact number"
            placeholderTextColor="#767676"
            keyboardType="numeric"
            maxLength={10}
            value={formData.phone}
            onChangeText={t => handleChange('phone', t)}
            onFocus={() => setFocusedField('phone')}
            onBlur={() => setFocusedField(null)}
          />
          {fieldErrors.phone ? (
            <View style={styles.errorRow}>
              <Image
                source={require('../../assets/SignUp/errorIcon.png')}
                style={styles.errorIcon}
              />
              <Text style={styles.errorText}>{fieldErrors.phone}</Text>
            </View>
          ) : null}
        </View>

        {/* Broker-only fields */}
        {selectedRole === 'broker' && (
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>RERA Number</Text>
              <TextInput
                style={[
                  styles.textInput,
                  focusedField === 'reraNumber' && styles.textInputFocused,
                ]}
                placeholder="Enter your RERA number"
                placeholderTextColor="#767676"
                value={formData.reraNumber}
                onChangeText={t => handleChange('reraNumber', t)}
                onFocus={() => setFocusedField('reraNumber')}
                onBlur={() => setFocusedField(null)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Locality <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  focusedField === 'locality' && styles.textInputFocused,
                  fieldErrors.locality && styles.textInputError,
                ]}
                placeholder="Enter city of operation"
                placeholderTextColor="#767676"
                value={formData.locality}
                onChangeText={t => handleChange('locality', t)}
                onFocus={() => setFocusedField('locality')}
                onBlur={() => setFocusedField(null)}
              />
              {fieldErrors.locality ? (
                <View style={styles.errorRow}>
                  <Image
                    source={require('../../assets/SignUp/errorIcon.png')}
                    style={styles.errorIcon}
                  />
                  <Text style={styles.errorText}>{fieldErrors.locality}</Text>
                </View>
              ) : null}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Specializations <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.tagsRow}>
                {SPECIALIZATION_OPTIONS.map(item => (
                  <TouchableOpacity
                    key={item}
                    onPress={() => toggleSpecialization(item)}
                    style={[
                      styles.tag,
                      specializations.includes(item) && styles.tagSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.tagText,
                        specializations.includes(item) &&
                          styles.tagTextSelected,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {fieldErrors.specializations ? (
                <View style={styles.errorRow}>
                  <Image
                    source={require('../../assets/SignUp/errorIcon.png')}
                    style={styles.errorIcon}
                  />
                  <Text style={styles.errorText}>
                    {fieldErrors.specializations}
                  </Text>
                </View>
              ) : null}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Deals Closed <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  focusedField === 'dealsClosed' && styles.textInputFocused,
                  fieldErrors.dealsClosed && styles.textInputError,
                ]}
                placeholder="Enter number of deals closed"
                placeholderTextColor="#767676"
                keyboardType="numeric"
                value={formData.dealsClosed}
                onChangeText={t =>
                  handleChange('dealsClosed', t.replace(/[^0-9]/g, ''))
                }
                onFocus={() => setFocusedField('dealsClosed')}
                onBlur={() => setFocusedField(null)}
              />
              {fieldErrors.dealsClosed ? (
                <View style={styles.errorRow}>
                  <Image
                    source={require('../../assets/SignUp/errorIcon.png')}
                    style={styles.errorIcon}
                  />
                  <Text style={styles.errorText}>
                    {fieldErrors.dealsClosed}
                  </Text>
                </View>
              ) : null}
            </View>
          </>
        )}

        {/* Email */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>
            Email <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[
              styles.textInput,
              focusedField === 'email' && styles.textInputFocused,
              fieldErrors.email && styles.textInputError,
            ]}
            placeholder="Enter your Email"
            placeholderTextColor="#767676"
            keyboardType="email-address"
            autoCapitalize="none"
            value={formData.email}
            onChangeText={t => handleChange('email', t)}
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField(null)}
          />
          {fieldErrors.email ? (
            <View style={styles.errorRow}>
              <Image
                source={require('../../assets/SignUp/errorIcon.png')}
                style={styles.errorIcon}
              />
              <Text style={styles.errorText}>{fieldErrors.email}</Text>
            </View>
          ) : null}
        </View>

        {/* Checkboxes */}
        <View style={styles.checkRow}>
          <TouchableOpacity
            style={[
              styles.checkbox,
              termsAccepted && styles.checkboxChecked,
              checkboxError && !termsAccepted && styles.checkboxError,
            ]}
            onPress={() => {
              setTermsAccepted(p => !p);
              setCheckboxError(false);
            }}
          >
            {termsAccepted && <Text style={styles.checkmark}>✓</Text>}
          </TouchableOpacity>
          <Text style={styles.checkLabel}>
            I agree to the{' '}
            <Text
              style={styles.checkLink}
              onPress={() => {
                if (Platform.OS === 'web') {
                  Linking.openURL('/terms-of-service');
                } else {
                  navigate('/terms-of-service');
                }
              }}
            >
              terms & conditions
            </Text>
          </Text>
        </View>

        <View style={styles.checkRow}>
          <TouchableOpacity
            style={[
              styles.checkbox,
              privacyAccepted && styles.checkboxChecked,
              checkboxError && !privacyAccepted && styles.checkboxError,
            ]}
            onPress={() => {
              setPrivacyAccepted(p => !p);
              setCheckboxError(false);
            }}
          >
            {privacyAccepted && <Text style={styles.checkmark}>✓</Text>}
          </TouchableOpacity>
          <Text style={styles.checkLabel}>
            I agree to the{' '}
            <Text
              style={styles.checkLink}
              onPress={() => {
                if (Platform.OS === 'web') {
                  Linking.openURL('/privacy-policy');
                } else {
                  navigate('/privacy-policy');
                }
              }}
            >
              Privacy Policy
            </Text>
          </Text>
        </View>

        {checkboxError && (
          <View style={styles.errorRow_privacy}>
            <Image
              source={require('../../assets/SignUp/errorIcon.png')}
              style={styles.errorIcon}
            />
            <Text style={styles.errorText}>
              Please agree to the Terms & Conditions and Privacy Policy
            </Text>
          </View>
        )}
      </KeyboardAvoidingView>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.btnOutline}
          onPress={() => resetAnim(() => setCurrentScreen('role'))}
        >
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
            <Text style={styles.btnPrimaryText}>
              {apiLoading ? 'Sending...' : 'Continue'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  // ── SCREEN 3: OTP verification
  const renderOtpScreen = () => (
    <Animated.View
      style={[
        styles.otpScreenContent,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <View style={styles.headingBanner}>
        <Text style={styles.screenHeading}>Verify your Contact Number</Text>
      </View>
      <Text style={[styles.screenSub, styles.otpScreenSub]}>
        We sent a verification code to{' '}
        <Text style={styles.phoneHighlight}>+91 ........</Text>
      </Text>

      <View style={styles.otpRow}>
        {[0, 1, 2, 3, 4, 5].map(index => (
          <TextInput
            key={index}
            ref={ref => {
              otpInputRefs.current[index] = ref;
            }}
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

      <View style={styles.otpErrorContainer}>
        {otpError ? <Text style={styles.otpErrorText}>{otpError}</Text> : null}
      </View>

      <View style={styles.otpResendRow}>
        <Text style={styles.otpResendLink} onPress={handleResendOtp}>
          Resend OTP
        </Text>
        <Text style={styles.otpResendLink}>Contact Support</Text>
      </View>

      <View style={styles.buttonRow_OTP}>
        <TouchableOpacity
          style={styles.btnOutline}
          onPress={() => resetAnim(() => setCurrentScreen('details'))}
        >
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
            <Text style={styles.btnPrimaryText}>
              {apiLoading ? 'Verifying...' : 'Verify & Continue'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  // ──────────────────────────────────────────
  // MAIN RENDER
  // ──────────────────────────────────────────
  return (
    <Modal
      animationType="none"
      transparent
      visible={modalVisible}
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View
              style={[styles.card, currentScreen === 'otp' && styles.cardOtp]}
            >
              <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                scrollEnabled={currentScreen !== 'role'}
                contentContainerStyle={
                  currentScreen === 'role'
                    ? styles.roleScrollContent
                    : undefined
                }
              >
                {renderHeader()}
                {currentScreen === 'role' && renderRoleScreen()}
                {currentScreen === 'details' && renderDetailsScreen()}
                {currentScreen === 'otp' && renderOtpScreen()}
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
    width: Dimensions.get('window').width > 768 ? 580 : '94%',
    height: Dimensions.get('window').width > 768 ? 600 : '90%',
    backgroundColor: COLORS.white,
    borderRadius: 24,
    overflow: 'hidden',
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
    paddingHorizontal: Dimensions.get('window').width > 768 ? 30 : 12,
  },
  logoContainer: { flexDirection: 'row', alignItems: 'center', height: 75 },
  logoImage: { width: 184, height: 75, resizeMode: 'contain' },
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
    fontFamily: 'Montserrat',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginBottom: 20,
    marginHorizontal: Dimensions.get('window').width > 768 ? -48 : -12,
  },

  /* ── Shared headings ── */
  headingBanner: {
    backgroundColor: '#FFFCF4',
    marginHorizontal: -32,
    paddingVertical: 16,
    paddingHorizontal: Dimensions.get('window').width > 768 ? 32 : 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  screenHeading: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: 'Montserrat',
  },
  signUpBold: {
    fontWeight: '700',
    fontSize: 18,
    color: '#262626',
    fontFamily: 'Montserrat',
  },
  screenSub: {
    fontSize: 18,
    color: '#767676',
    lineHeight: 18,
    textAlign: 'center',
    fontWeight: '400',
    marginBottom: 32,
    fontFamily: 'Montserrat',
  },

  /* ── Role cards ── */
  roleCenter: { flex: 1, justifyContent: 'center' },
  roleRow: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 36,
    paddingHorizontal: Dimensions.get('window').width > 768 ? 32 : 12,
    justifyContent: 'center',
  },
  roleCardWrapper: {
    width: 178.21,
    height: 178.21,
    borderRadius: 15,
    backgroundColor: COLORS.white,
    shadowColor: '#262626',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  roleCardActive: {
    shadowColor: '#EE2529',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 10,
  },
  cornerAccent: {
    position: 'absolute',
    width: 18,
    height: 18,
    // borderColor: '#EE2529', borderWidth: 2.5,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomLeftRadius: 16,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderBottomRightRadius: 16,
  },
  roleCard: { flex: 1, padding: 20, alignItems: 'center', borderRadius: 14 },
  roleIcon: { width: 48, height: 48, marginBottom: 12 },
  roleTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#262626',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 18,
    fontFamily: 'Montserrat',
  },
  roleDesc: {
    fontSize: 16,
    color: '#767676',
    textAlign: 'center',
    fontWeight: '400',
    lineHeight: 16,
    fontFamily: 'Montserrat',
  },

  /* ── Buttons ── */
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 48,
    paddingHorizontal: Dimensions.get('window').width > 768 ? 32 : 12,
  },
  buttonRow_OTP:{
    flexDirection: 'row',
    gap: 12,
    marginTop: 48,
    paddingHorizontal: Dimensions.get('window').width > 768 ? 32 : 12,
  },
  btnOutline: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    borderRadius: 5,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
  },
  btnOutlineText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#767676',
    lineHeight: 18,
    fontFamily: 'Montserrat',
  },
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
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    lineHeight: 18,
    fontFamily: 'Montserrat',
  },
  buttonDisabled: { opacity: 0.5 },

  /* ── Form inputs ── */
  nameRow: {
    flexDirection: Dimensions.get('window').width > 768 ? 'row' : 'column',
    gap: Dimensions.get('window').width > 768 ? 16 : 32,
    marginBottom: 32,
    paddingHorizontal: Dimensions.get('window').width > 768 ? 32 : 12,
  },
  nameField: { flex: 1 },
  inputGroup: { marginBottom: 32, paddingHorizontal: Dimensions.get('window').width > 768 ? 32 : 12, },
  inputLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#262626',
    marginBottom: 8,
    lineHeight: 16,
    fontFamily: 'Montserrat',
  },
  required: { color: '#000000ff' },
  textInput: {
    borderWidth: 1.5,
    borderColor: '#767676',
    borderRadius: 5,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 18,
    color: '#262626',
    backgroundColor: COLORS.white,
    fontWeight: '400',
    lineHeight: 18,
    fontFamily: 'Montserrat',
  },
  textInputFocused: { borderColor: '#3B82F6', backgroundColor: COLORS.white },
  textInputError: { borderColor: '#EE2529' },

  /* ── Field errors ── */
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
    paddingLeft: 12,
  },
  errorRow_privacy: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
    paddingLeft: 50,
  },
  errorIcon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
  },
  errorText: {
    color: '#EE2529',
    fontSize: 13,
    fontWeight: '500',
    fontFamily: 'Montserrat',
  },

  /* ── Checkboxes ── */
  checkRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 14,
    paddingHorizontal: Dimensions.get('window').width > 768 ? 32 : 12,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxChecked: { backgroundColor: '#EE2529', borderColor: '#EE2529' },
  checkboxError: { borderColor: '#EE2529' },
  checkmark: { color: COLORS.white, fontSize: 11, fontWeight: '700', fontFamily: 'Montserrat' },
  checkLabel: { fontSize: 18, color: '#262626', lineHeight: 16, flex: 1, fontFamily: 'Montserrat' },
  checkLink: { color: '#3B82F6', textDecorationLine: 'underline', fontFamily: 'Montserrat' },

  /* ── OTP ── */
  phoneHighlight: { fontWeight: '700', color: '#1F2937', fontFamily: 'Montserrat' },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 32,
    marginTop: 12,
  },
  otpInput: {
    width: Dimensions.get('window').width > 768 ? 80 : 45,
    height: Dimensions.get('window').width > 768 ? 80 : 45,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 26,
    fontWeight: '700',
    color: '#1F2937',
    backgroundColor: '#F9FAFB',
    fontFamily: 'Montserrat',
  },
  otpInputError: { borderColor: '#EE2529' },
  otpInputErrorFilled: { borderColor: '#EE2529', color: '#EE2529' },
  otpErrorText: {
    color: '#EE2529',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 18,
    paddingHorizontal: 8,
    fontFamily: 'Montserrat',
  },
  otpResendText: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 18,
    fontFamily: 'Montserrat',
  },
  otpResendLink: {
    color: '#1F2937',
    fontWeight: '500',
    textDecorationLine: 'underline',
    fontFamily: 'Montserrat',
  },
  roleScrollContent: { flex: 1 },
  roleScreenContent: { flex: 1, justifyContent: 'space-between' },
  otpScreenContent: { flex: 1, justifyContent: 'space-between' },
  otpScreenSub: { marginBottom: 56 },
  otpErrorContainer: { minHeight: 54, justifyContent: 'center' },
  otpResendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 48,
    marginBottom: 20,
  },
  cardOtp: {
    width: Dimensions.get('window').width > 768 ? 540 : '92%',
    height: Dimensions.get('window').width > 768 ? 540 : 'auto',
    borderRadius: 15,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  tag: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    backgroundColor: '#F9FAFB',
  },
  tagSelected: {
    backgroundColor: '#FFF3CA',
    borderColor: '#D4A017',
  },
  tagText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
    fontFamily: 'Montserrat',
  },
  tagTextSelected: {
    color: '#8B6914',
    fontWeight: '700',
  },
  photoUploadBox: {
    width: 110,
    height: 110,
    borderRadius: 10,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
  },
  photoPreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  photoPlaceholder: {
    alignItems: 'center',
  },
  photoUploadIcon: {
    fontSize: 24,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  photoUploadText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    fontFamily: 'Montserrat',
  },
});

export default SignupScreen;
