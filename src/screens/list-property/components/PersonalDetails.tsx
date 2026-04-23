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
import { AlertTriangle } from 'lucide-react-native';
import InputError from '../../../components/common/InputError';

import { useAuth } from '../../../context/AuthContext';
import { useAuthAPIs } from '../../../../helpers/hooks/authAPIs/useAuthAPIs';

interface PersonalDetailsProps {
  onNext: (data: any) => void;
  onFormValid: (isValid: boolean) => void;
  initialData?: any;
  isEditMode?: boolean;
}

// ...

const PersonalDetails = forwardRef<any, PersonalDetailsProps>(
  ({ onNext, onFormValid, initialData, isEditMode }, ref) => {
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
      firstName: initialData?.firstName || userFirstName || '',
      lastName: initialData?.lastName || userLastName || '',
      email: initialData?.email || user?.email || '',
      mobile: initialData?.mobile || user?.mobileNumber || '',
      listUnder:
        initialData?.listUnder ||
        (userRoleLower === 'broker' || userRoleLower === 'owner'
          ? userRoleLower
          : '') ||
        '',
      agreeTerms: initialData?.agreeTerms || false,
      agreePrivacy: initialData?.agreePrivacy || false,
    });

    useEffect(() => {
      if (initialData && Object.keys(initialData).length > 0) {
        setFormData(prev => ({
          ...prev,
          firstName: initialData.firstName || prev.firstName,
          lastName: initialData.lastName || prev.lastName,
          email: initialData.email || prev.email,
          mobile: initialData.mobile || prev.mobile,
          listUnder: initialData.listUnder || prev.listUnder,
          agreeTerms: initialData.agreeTerms ?? prev.agreeTerms,
          agreePrivacy: initialData.agreePrivacy ?? prev.agreePrivacy,
        }));

      }
    }, [initialData]);

    const [errors, setErrors] = useState<any>({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [touched, setTouched] = useState<any>({});

    const { loading: apiLoading } = useAuthAPIs();

    useEffect(() => {
      const isValid = !!validateFormSilently();
      onFormValid(isValid);
    }, [formData]);

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



    const handleSubmit = () => {
      setIsSubmitted(true);
      const allTouched: any = {};
      Object.keys(formData).forEach(field => {
        allTouched[field] = true;
      });
      setTouched(allTouched);

      if (validateFormSilently()) {
        onNext(formData);
      }
    };

    useImperativeHandle(ref, () => ({
      submit: handleSubmit,
    }));



    return (
      <View style={styles.container}>
        <Text
          style={[styles.sectionTitle, isMobile && styles.sectionTitleMobile]}
        >
          Personal Details
        </Text>

        <View style={[styles.row, isSmallScreen && styles.rowColumn]}>
          <View style={styles.fieldContainer}>
            <Text style={[styles.label, isMobile && styles.labelMobile]}>First Name *</Text>
            <TextInput
              style={[
                styles.input,
                isMobile && styles.inputMobile,
                touched.firstName && errors.firstName && styles.inputError,
              ]}
              value={formData.firstName}
              onChangeText={text => handleChange('firstName', text)}
              placeholder="Enter Your First Name"
              placeholderTextColor="#999"
              onBlur={(e: any) => handleBlur('firstName', e.nativeEvent.text)}
            />
            <InputError message={errors.firstName} visible={touched.firstName && !!errors.firstName} />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={[styles.label, isMobile && styles.labelMobile]}>Last Name *</Text>
            <TextInput
              style={[
                styles.input,
                isMobile && styles.inputMobile,
                touched.lastName && errors.lastName && styles.inputError,
              ]}
              value={formData.lastName}
              onChangeText={text => handleChange('lastName', text)}
              placeholder="Enter Your Last Name"
              placeholderTextColor="#999"
              onBlur={(e: any) => handleBlur('lastName', e.nativeEvent.text)}
            />
            <InputError message={errors.lastName} visible={touched.lastName && !!errors.lastName} />
          </View>
        </View>

        <View style={[styles.row, isSmallScreen && styles.rowColumn]}>
          <View style={styles.fieldContainer}>
            <Text style={[styles.label, isMobile && styles.labelMobile]}>Email</Text>
            <TextInput
              style={[
                styles.input,
                isMobile && styles.inputMobile,
                touched.email && errors.email && styles.inputError,
              ]}
              value={formData.email}
              onChangeText={text => handleChange('email', text)}
              placeholder="Enter Email Address"
              placeholderTextColor="#999"
              keyboardType="email-address"
              onBlur={(e: any) => handleBlur('email', e.nativeEvent.text)}
            />
            <InputError message={errors.email} visible={touched.email && !!errors.email} />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={[styles.label, isMobile && styles.labelMobile]}>List Property Under *</Text>
            <View
              style={[
                styles.radioGroup,
                isEditMode && styles.radioGroupDisabled,
              ]}
            >
              <TouchableOpacity
                style={styles.radioButton}
                onPress={() =>
                  !isEditMode && handleChange('listUnder', 'broker')
                }
                disabled={isEditMode}
              >
                <View
                  style={[
                    styles.radioCircle,
                    formData.listUnder === 'broker' && styles.radioActive,
                    isEditMode && styles.radioCircleDisabled,
                  ]}
                >
                  {formData.listUnder === 'broker' && (
                    <View
                      style={[
                        styles.radioInner,
                        isEditMode && styles.radioInnerDisabled,
                      ]}
                    />
                  )}
                </View>
                <Text
                  style={[
                    styles.radioLabel,
                    isMobile && styles.radioLabelMobile,
                    isEditMode && styles.radioLabelDisabled,
                  ]}
                >
                  Broker
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.radioButton}
                onPress={() =>
                  !isEditMode && handleChange('listUnder', 'owner')
                }
                disabled={isEditMode}
              >
                <View
                  style={[
                    styles.radioCircle,
                    formData.listUnder === 'owner' && styles.radioActive,
                    isEditMode && styles.radioCircleDisabled,
                  ]}
                >
                  {formData.listUnder === 'owner' && (
                    <View
                      style={[
                        styles.radioInner,
                        isEditMode && styles.radioInnerDisabled,
                      ]}
                    />
                  )}
                </View>
                <Text
                  style={[
                    styles.radioLabel,
                    isMobile && styles.radioLabelMobile,
                    isEditMode && styles.radioLabelDisabled,
                  ]}
                >
                  Owner
                </Text>
              </TouchableOpacity>
            </View>
            <InputError message={errors.listUnder} visible={touched.listUnder && !!errors.listUnder} />
          </View>
        </View>

        <View style={[styles.row, isSmallScreen && styles.rowColumn]}>
          <View style={styles.fieldContainer}>
            <Text style={[styles.label, isMobile && styles.labelMobile]}>Mobile Number *</Text>
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
                  isMobile && styles.inputMobile,
                  touched.mobile && errors.mobile && styles.inputError,
                ]}
                value={formData.mobile}
                onChangeText={handleMobileChange}
                placeholder="98765-43210"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
                maxLength={11}
                onBlur={(e: any) => handleBlur('mobile', e.nativeEvent.text)}
              />
            </View>
            <InputError message={errors.mobile} visible={touched.mobile && !!errors.mobile} />
          </View>
        </View>



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
            <Text style={[styles.checkboxLabel, isMobile && styles.checkboxLabelMobile]}>
              I agree to the{' '}
              <Text style={styles.linkText}>terms & conditions</Text>
            </Text>
          </TouchableOpacity>
          <InputError message="Please agree to terms & conditions" visible={isSubmitted && !formData.agreeTerms} />

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
            <Text style={[styles.checkboxLabel, isMobile && styles.checkboxLabelMobile]}>
              I agree to the <Text style={styles.linkText}>Privacy Policy</Text>
            </Text>
          </TouchableOpacity>
          <InputError message="Please agree to Privacy Policy" visible={isSubmitted && !formData.agreePrivacy} />
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    padding: 30,
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: '600',
    color: '#EE2529',
    textAlign: 'center',
    marginBottom: 24,
    fontFamily: 'Montserrat',
  },
  sectionTitleMobile: {
    fontSize: 22,
    marginBottom: 16,
    fontFamily: 'Montserrat',
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
    fontSize: 18,
    fontWeight: '700',
    color: '#444',
    marginBottom: 8,
    fontFamily: 'Montserrat',
  },
  labelMobile: {
    fontSize: 14,
  },
  input: {
    backgroundColor: '#F2F2F2',
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 18,
    color: '#333',
    borderWidth: 1,
    borderColor: 'transparent',
    fontFamily: 'Montserrat',
  },
  inputMobile: {
    fontSize: 14,
    height: 40,
  },
  inputError: {
    borderColor: '#EE2529',
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
    fontSize: 18,
    color: '#444',
    fontFamily: 'Montserrat',
  },
  radioLabelMobile: {
    fontSize: 14,
  },
  mobileInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    height: 48,
    overflow: 'hidden',
  },
  mobileInputContainerMobile: {
    flexDirection: 'row', // Keep it same for mobile to keep button inside
  },
  mobileInput: {
    flex: 1,
    height: '100%',
    borderWidth: 0,
    backgroundColor: 'transparent',
    paddingHorizontal: 12,
    fontSize: 18,
    fontFamily: 'Montserrat',
  },
  otpBtn: {
    backgroundColor: '#EE2529',
    height: 38,
    marginRight: 5,
    paddingHorizontal: 12,
    borderRadius: 6,
    justifyContent: 'center',
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
    fontSize: 18,
    color: '#444',
    fontFamily: 'Montserrat',
  },
  checkboxLabelMobile: {
    fontSize: 14,
  },
  linkText: {
    color: '#2196F3',
    textDecorationLine: 'underline',
    fontFamily: 'Montserrat',
  },
  radioInnerDisabled: {
    backgroundColor: '#9ca3af',
  },
  radioGroupDisabled: {
    opacity: 0.7,
  },
  radioCircleDisabled: {
    borderColor: '#d1d5db',
  },
  radioLabelDisabled: {
    color: '#6b7280',
  },

});

export default PersonalDetails;
