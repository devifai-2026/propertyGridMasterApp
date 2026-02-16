import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Switch,
  ScrollView,
  useWindowDimensions,
  Alert,
} from 'react-native';

import { useAuth } from '../../../context/AuthContext';
import { useAuthAPIs } from '../../../../helpers/hooks/authAPIs/useAuthAPIs';

interface PersonalDetailsProps {
  onNext: (data: any) => void;
  onFormValid: (isValid: boolean) => void;
  initialData?: any;
}

// ...

const PersonalDetails = forwardRef<any, PersonalDetailsProps>(
  ({ onNext, onFormValid, initialData }, ref) => {
    const { user } = useAuth();
    const { width } = useWindowDimensions();
    const isSmallScreen = width < 768;
    const isMobile = width < 480;
    const nameParts = user?.name ? user.name.split(' ') : [];
    const userFirstName = nameParts.length > 0 ? nameParts[0] : '';
    const userLastName =
      nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
    const userRoleLower = user?.role?.toLowerCase();

    const [formData, setFormData] = useState({
      firstName: userFirstName || initialData?.firstName || '',
      lastName: userLastName || initialData?.lastName || '',
      email: user?.email || initialData?.email || '',
      mobile: user?.mobileNumber || initialData?.mobile || '',
      listUnder:
        (userRoleLower === 'broker' || userRoleLower === 'owner'
          ? userRoleLower
          : '') ||
        initialData?.listUnder ||
        '',
      otp: initialData?.otp || '',
      agreeTerms: initialData?.agreeTerms || false,
      agreePrivacy: initialData?.agreePrivacy || false,
    });

    const [otpSent, setOtpSent] = useState(false);
    const [isOtpVerified, setIsOtpVerified] = useState(false);
    const [verificationId, setVerificationId] = useState('');
    const [errors, setErrors] = useState<any>({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [touched, setTouched] = useState<any>({});

    const { sendOtp, verifyOtp, loading: apiLoading } = useAuthAPIs();

    // Refs for OTP inputs
    const otpInputRefs = useRef<Array<TextInput | null>>([]);

    useEffect(() => {
      const isValid = !!validateFormSilently();
      onFormValid(isValid);
    }, [formData, otpSent, isOtpVerified]);

    const validateFormSilently = () => {
      const mobileNumber = formData.mobile.replace(/\D/g, '');

      return (
        formData.firstName.trim() !== '' &&
        /^[A-Za-z\s]{2,50}$/.test(formData.firstName.trim()) &&
        formData.lastName.trim() !== '' &&
        /^[A-Za-z\s]{2,50}$/.test(formData.lastName.trim()) &&
        (!formData.email ||
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) &&
        mobileNumber.length === 10 &&
        /^[6-9]\d{9}$/.test(mobileNumber) &&
        formData.listUnder !== '' &&
        isOtpVerified &&
        formData.agreeTerms &&
        formData.agreePrivacy
      );
    };

    const validateField = (name: string, value: any) => {
      switch (name) {
        case 'firstName':
          if (!value.trim()) return 'First Name is required';
          if (!/^[A-Za-z\s]{2,50}$/.test(value.trim()))
            return 'First Name must be 2-50 letters only';
          return '';

        case 'lastName':
          if (!value.trim()) return 'Last Name is required';
          if (!/^[A-Za-z\s]{2,50}$/.test(value.trim()))
            return 'Last Name must be 2-50 letters only';
          return '';

        case 'email':
          if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
            return 'Please enter a valid email address';
          return '';

        case 'mobile':
          const mobileNumber = value.replace(/\D/g, '');
          if (!mobileNumber) return 'Mobile number is required';
          if (mobileNumber.length !== 10)
            return 'Mobile number must be 10 digits';
          if (!/^[6-9]\d{9}$/.test(mobileNumber))
            return 'Please enter a valid Indian mobile number';
          return '';

        case 'listUnder':
          if (!value) return 'Please select Broker or Owner';
          return '';

        case 'otp':
          if (otpSent && !isOtpVerified) {
            if (!value) return 'OTP is required';
            if (!/^\d{6}$/.test(value)) return 'OTP must be 6 digits';
          }
          return '';

        case 'agreeTerms':
          if (!value) return 'Please agree to terms & conditions';
          return '';

        case 'agreePrivacy':
          if (!value) return 'Please agree to Privacy Policy';
          return '';

        default:
          return '';
      }
    };

    const handleChange = (name: string, value: any) => {
      setFormData(prev => ({ ...prev, [name]: value }));

      if (!touched[name]) {
        setTouched((prev: any) => ({ ...prev, [name]: true }));
      }

      if (touched[name] || isSubmitted) {
        const error = validateField(name, value);
        setErrors((prev: any) => ({ ...prev, [name]: error }));
      }
    };

    const handleMobileChange = (text: string) => {
      let value = text.replace(/\D/g, '');
      if (value.length > 5) {
        value = `${value.slice(0, 5)}-${value.slice(5, 10)}`;
      }
      handleChange('mobile', value);
    };

    const handleBlur = (name: string, value?: string) => {
      setTouched((prev: any) => ({ ...prev, [name]: true }));
      const valueToValidate =
        value !== undefined ? value : formData[name as keyof typeof formData];
      const error = validateField(name, valueToValidate);
      setErrors((prev: any) => ({ ...prev, [name]: error }));
    };

    const handleSendOtp = () => {
      const mobileNumber = formData.mobile.replace(/\D/g, '');
      const mobileError = validateField('mobile', formData.mobile);

      if (!mobileError && mobileNumber.length === 10) {
        sendOtp(
          { mobileNumber },
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
        setErrors((prev: any) => ({
          ...prev,
          mobile:
            mobileError || 'Please enter a valid mobile number to send OTP',
        }));
      }
    };

    const handleVerifyOtp = () => {
      if (formData.otp.length === 6) {
        verifyOtp(
          { otp: formData.otp, verificationId },
          (response: any) => {
            if (response.success) {
              setIsOtpVerified(true);
              Alert.alert('Success', 'Mobile number verified successfully');
            } else {
              Alert.alert('Error', response.message || 'Verification failed');
            }
          },
          (error: any) => {
            Alert.alert(
              'Error',
              error?.response?.data?.message || 'Verification failed',
            );
          },
        );
      } else {
        Alert.alert('Error', 'Please enter the complete 6-digit OTP');
      }
    };

    const handleOtpChange = (text: string, index: number) => {
      // Only allow digits
      const digit = text.replace(/[^0-9]/g, '');

      const newOtp = formData.otp.split('');
      newOtp[index] = digit;
      handleChange('otp', newOtp.join(''));

      // Auto-focus next input if digit entered
      if (digit && index < 5) {
        otpInputRefs.current[index + 1]?.focus();
      }

      // Auto-verify when 6th digit is entered
      if (digit && index === 5) {
        // We delay slightly to let the UI update
        setTimeout(() => {
          handleVerifyOtp();
        }, 100);
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

    const handleSubmit = () => {
      setIsSubmitted(true);
      const allTouched: any = {};
      Object.keys(formData).forEach(field => {
        allTouched[field] = true;
      });
      setTouched(allTouched);

      if (validateFormSilently()) {
        onNext({ ...formData, verificationId });
      }
    };

    useImperativeHandle(ref, () => ({
      submit: handleSubmit,
    }));

    const mobileNumberRaw = formData.mobile.replace(/\D/g, '');

    return (
      <View style={styles.container}>
        <Text
          style={[styles.sectionTitle, isMobile && styles.sectionTitleMobile]}
        >
          Personal Details
        </Text>

        <View style={[styles.row, isSmallScreen && styles.rowColumn]}>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>First Name *</Text>
            <TextInput
              style={[
                styles.input,
                touched.firstName && errors.firstName && styles.inputError,
              ]}
              value={formData.firstName}
              onChangeText={text => handleChange('firstName', text)}
              placeholder="Enter Your First Name"
              placeholderTextColor="#999"
              onBlur={(e: any) => handleBlur('firstName', e.nativeEvent.text)}
            />
            {touched.firstName && errors.firstName && (
              <Text style={styles.errorText}>{errors.firstName}</Text>
            )}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Last Name *</Text>
            <TextInput
              style={[
                styles.input,
                touched.lastName && errors.lastName && styles.inputError,
              ]}
              value={formData.lastName}
              onChangeText={text => handleChange('lastName', text)}
              placeholder="Enter Your Last Name"
              placeholderTextColor="#999"
              onBlur={(e: any) => handleBlur('lastName', e.nativeEvent.text)}
            />
            {touched.lastName && errors.lastName && (
              <Text style={styles.errorText}>{errors.lastName}</Text>
            )}
          </View>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[
              styles.input,
              touched.email && errors.email && styles.inputError,
            ]}
            value={formData.email}
            onChangeText={text => handleChange('email', text)}
            placeholder="Enter Email Address"
            placeholderTextColor="#999"
            keyboardType="email-address"
            onBlur={(e: any) => handleBlur('email', e.nativeEvent.text)}
          />
          {touched.email && errors.email && (
            <Text style={styles.errorText}>{errors.email}</Text>
          )}
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>List Property Under *</Text>
          <View style={styles.radioGroup}>
            <TouchableOpacity
              style={styles.radioButton}
              onPress={() => handleChange('listUnder', 'broker')}
            >
              <View
                style={[
                  styles.radioCircle,
                  formData.listUnder === 'broker' && styles.radioActive,
                ]}
              >
                {formData.listUnder === 'broker' && (
                  <View style={styles.radioInner} />
                )}
              </View>
              <Text style={styles.radioLabel}>Broker</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.radioButton}
              onPress={() => handleChange('listUnder', 'owner')}
            >
              <View
                style={[
                  styles.radioCircle,
                  formData.listUnder === 'owner' && styles.radioActive,
                ]}
              >
                {formData.listUnder === 'owner' && (
                  <View style={styles.radioInner} />
                )}
              </View>
              <Text style={styles.radioLabel}>Owner</Text>
            </TouchableOpacity>
          </View>
          {touched.listUnder && errors.listUnder && (
            <Text style={styles.errorText}>{errors.listUnder}</Text>
          )}
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Mobile Number *</Text>
          <View
            style={[
              styles.mobileInputContainer,
              isMobile && styles.mobileInputContainerMobile,
            ]}
          >
            <TextInput
              style={[
                styles.input,
                styles.mobileInput,
                touched.mobile && errors.mobile && styles.inputError,
              ]}
              value={formData.mobile}
              onChangeText={handleMobileChange}
              placeholder="98765-43210"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              maxLength={11}
              onBlur={(e: any) => handleBlur('mobile', e.nativeEvent.text)}
              editable={!isOtpVerified}
            />
            <TouchableOpacity
              style={[
                styles.otpBtn,
                isMobile && styles.otpBtnMobile,
                (mobileNumberRaw.length !== 10 || (otpSent && isOtpVerified)) &&
                  styles.otpBtnDisabled,
              ]}
              onPress={handleSendOtp}
              disabled={
                mobileNumberRaw.length !== 10 || (otpSent && isOtpVerified)
              }
            >
              <Text
                style={[styles.otpBtnText, isMobile && styles.otpBtnTextMobile]}
              >
                {isOtpVerified
                  ? 'Verified'
                  : otpSent
                  ? 'Resend OTP'
                  : 'Send OTP'}
              </Text>
              {apiLoading && otpSent && !isOtpVerified && (
                <View style={styles.loadingIndicator} />
              )}
            </TouchableOpacity>
          </View>
          {touched.mobile && errors.mobile && (
            <Text style={styles.errorText}>{errors.mobile}</Text>
          )}
        </View>

        {otpSent && (
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>OTP *</Text>
            <View
              style={[
                styles.otpInputGroup,
                isMobile && styles.otpInputGroupMobile,
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
                    isMobile && styles.otpInputMobile,
                    touched.otp && errors.otp && styles.inputError,
                  ]}
                  maxLength={1}
                  keyboardType="number-pad"
                  value={formData.otp[index] || ''}
                  onChangeText={text => handleOtpChange(text, index)}
                  onKeyPress={e => handleOtpKeyPress(e, index)}
                  selectTextOnFocus
                  autoComplete="one-time-code"
                  editable={!isOtpVerified}
                />
              ))}
              {!isOtpVerified && formData.otp.length === 6 && (
                <TouchableOpacity
                  style={styles.verifyBtn}
                  onPress={handleVerifyOtp}
                  disabled={apiLoading}
                >
                  <Text style={styles.verifyBtnText}>
                    {apiLoading ? '...' : 'Verify'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            {isOtpVerified && (
              <Text style={styles.verifiedText}>✓ Verified</Text>
            )}
            {touched.otp && errors.otp && !isOtpVerified && (
              <Text style={styles.errorText}>{errors.otp}</Text>
            )}
          </View>
        )}

        <View style={styles.checkboxSection}>
          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => handleChange('agreeTerms', !formData.agreeTerms)}
          >
            <View
              style={[
                styles.checkbox,
                formData.agreeTerms && styles.checkboxActive,
              ]}
            >
              {formData.agreeTerms && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>
              I agree to the{' '}
              <Text style={styles.linkText}>terms & conditions</Text>
            </Text>
          </TouchableOpacity>
          {isSubmitted && !formData.agreeTerms && (
            <Text style={styles.errorText}>
              Please agree to terms & conditions
            </Text>
          )}

          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => handleChange('agreePrivacy', !formData.agreePrivacy)}
          >
            <View
              style={[
                styles.checkbox,
                formData.agreePrivacy && styles.checkboxActive,
              ]}
            >
              {formData.agreePrivacy && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>
              I agree to the <Text style={styles.linkText}>Privacy Policy</Text>
            </Text>
          </TouchableOpacity>
          {isSubmitted && !formData.agreePrivacy && (
            <Text style={styles.errorText}>Please agree to Privacy Policy</Text>
          )}
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#EE2529',
    textAlign: 'center',
    marginBottom: 24,
  },
  sectionTitleMobile: {
    fontSize: 18,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  rowColumn: {
    flexDirection: 'column',
    gap: 0,
  },
  fieldContainer: {
    flex: 1,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#444',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F2F2F2',
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#333',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputError: {
    borderColor: '#EE2529',
  },
  errorText: {
    color: '#EE2529',
    fontSize: 11,
    marginTop: 4,
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 24,
    marginTop: 8,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CCC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {
    borderColor: '#EE2529',
    backgroundColor: '#EE2529',
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFF',
  },
  radioLabel: {
    fontSize: 14,
    color: '#444',
  },
  mobileInputContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  mobileInputContainerMobile: {
    flexDirection: 'column',
    gap: 10,
  },
  mobileInput: {
    flex: 1,
  },
  otpBtn: {
    backgroundColor: '#EE2529',
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    height: 48,
  },
  otpBtnMobile: {
    paddingHorizontal: 12,
    height: 44,
  },
  otpBtnDisabled: {
    backgroundColor: '#CCC',
  },
  otpBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  otpBtnTextMobile: {
    fontSize: 13,
  },
  otpInputGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  otpInputGroupMobile: {
    gap: 8,
    justifyContent: 'center',
  },
  otpInput: {
    width: 38,
    height: 48,
    backgroundColor: '#F2F2F2',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    borderWidth: 1,
    borderColor: '#CCC',
  },
  otpInputMobile: {
    width: 42,
    height: 44,
    fontSize: 18,
  },
  loadingIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFF',
    marginLeft: 8,
  },
  verifiedText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
  verifyBtn: {
    backgroundColor: '#EE2529',
    paddingHorizontal: 12,
    borderRadius: 8,
    justifyContent: 'center',
    height: 48,
  },
  verifyBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  checkboxSection: {
    gap: 12,
    marginTop: 8,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#CCC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: '#EE2529',
    borderColor: '#EE2529',
  },
  checkmark: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#444',
  },
  linkText: {
    color: '#2196F3',
    textDecorationLine: 'underline',
  },
});

export default PersonalDetails;
