import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { ChevronDown, Info, AlertTriangle } from 'lucide-react-native';
import InputError from '../../../components/common/InputError';
import CustomDropdown from './CustomDropdown';
import CustomDatePicker from './CustomDatePicker';

const tenantTypeOptions = [
  { label: 'Government', value: 'Government' },
  { label: 'Startup', value: 'Startup' },
  { label: 'MNC', value: 'MNC' },
  { label: 'Corporate', value: 'Corporate' },
  { label: 'Others', value: 'Others' },
];

const maintenanceScopeOptions = [
  { label: 'Yes, included in rent', value: 'included' },
  { label: 'No, excluded from rent', value: 'excluded' },
];

interface LeaseDetailsProps {
  onNext: (data: any) => void;
  onFormValid: (isValid: boolean) => void;
  initialData?: any;
}

const LeaseDetails = forwardRef<any, LeaseDetailsProps>(
  ({ onNext, onFormValid, initialData }, ref) => {
    const { width } = useWindowDimensions();
    const isSmallScreen = width < 768;
    const isMobile = width < 480;

    useImperativeHandle(ref, () => ({
      submit: () => {
        onNext(formData);
      },
    }));

    const [formData, setFormData] = useState({
      tenantType: initialData?.tenantType || '',
      leaseStartDate: initialData?.leaseStartDate || '',
      leaseExpiryDate: initialData?.leaseExpiryDate || '',
      lockInYears: initialData?.lockInYears || '',
      lockInMonths: initialData?.lockInMonths || '',
      leaseDuration: initialData?.leaseDuration || '',
      rentType: initialData?.rentType || 'perSqFt',
      rentPerSqFt: initialData?.rentPerSqFt || '',
      totalMonthlyRent: initialData?.totalMonthlyRent || '',
      securityDepositType: initialData?.securityDepositType || 'months',
      securityDepositMonths: initialData?.securityDepositMonths || '',
      securityDepositAmount: initialData?.securityDepositAmount || '',
      escalationPercentage: initialData?.escalationPercentage || '',
      escalationFrequency: initialData?.escalationFrequency || '',
      maintenanceScope: initialData?.maintenanceScope || '',
      maintenanceType: initialData?.maintenanceType || 'perSqFt',
      maintenanceAmount: initialData?.maintenanceAmount || '',
    });

    const [errors, setErrors] = useState<any>({});
    const [touched, setTouched] = useState<any>({});

    useEffect(() => {
      const isValid = validateFormSilently();
      onFormValid(isValid);
    }, [formData]);

    const validateFormSilently = () => {
      return (
        formData.tenantType !== '' &&
        formData.leaseStartDate !== '' &&
        formData.leaseExpiryDate !== '' &&
        formData.leaseDuration !== '' &&
        (formData.rentType === 'perSqFt'
          ? formData.rentPerSqFt !== ''
          : formData.totalMonthlyRent !== '') &&
        (formData.securityDepositType === 'months'
          ? formData.securityDepositMonths !== ''
          : formData.securityDepositAmount !== '') &&
        formData.escalationPercentage !== '' &&
        formData.escalationFrequency !== '' &&
        formData.maintenanceScope !== ''
      );
    };

    const validateField = (name: string, value: string) => {
      switch (name) {
        case 'tenantType':
          return !value ? 'Tenant Type is required' : '';
        case 'leaseStartDate':
          if (!value) return 'Lease Start Date is required';
          if (!/^\d{4}-\d{2}-\d{2}$/.test(value))
            return 'Invalid date format (YYYY-MM-DD)';
          return '';
        case 'leaseExpiryDate':
          if (!value) return 'Lease End Date is required';
          if (!/^\d{4}-\d{2}-\d{2}$/.test(value))
            return 'Invalid date format (YYYY-MM-DD)';
          return '';
        case 'leaseDuration':
          if (!value) return 'Lease Duration is required';
          if (!/^\d+$/.test(value) || parseInt(value) <= 0)
            return 'Please enter a valid duration';
          return '';
        case 'rentPerSqFt':
          if (formData.rentType === 'perSqFt') {
            if (!value) return 'Rent Per Sq Ft is required';
            if (!/^\d+(\.\d+)?$/.test(value) || parseFloat(value) <= 0)
              return 'Please enter a valid amount';
          }
          return '';
        case 'totalMonthlyRent':
          if (formData.rentType === 'lumpSum') {
            if (!value) return 'Total Monthly Rent is required';
            if (!/^\d+(\.\d+)?$/.test(value) || parseFloat(value) <= 0)
              return 'Please enter a valid amount';
          }
          return '';
        case 'securityDepositMonths':
          if (formData.securityDepositType === 'months') {
            if (!value) return 'Deposit (Months) is required';
            if (!/^\d+$/.test(value) || parseInt(value) <= 0)
              return 'Please enter a valid number';
          }
          return '';
        case 'securityDepositAmount':
          if (formData.securityDepositType === 'lumpSum') {
            if (!value) return 'Deposit Amount is required';
            if (!/^\d+(\.\d+)?$/.test(value) || parseFloat(value) <= 0)
              return 'Please enter a valid amount';
          }
          return '';
        case 'escalationPercentage':
          if (!value) return 'Annual Escalation is required';
          if (!/^\d+(\.\d+)?$/.test(value))
            return 'Please enter a valid percentage';
          return '';
        case 'escalationFrequency':
          if (!value) return 'Frequency is required';
          if (!/^\d+$/.test(value) || parseInt(value) <= 0)
            return 'Please enter a valid number';
          return '';
        case 'maintenanceScope':
          return !value ? 'Maintenance Costs is required' : '';
        default:
          return '';
      }
    };

    const handleInputChange = (name: string, value: string) => {
      setFormData(prev => ({ ...prev, [name]: value }));

      if (touched[name]) {
        const error = validateField(name, value);
        setErrors((prev: any) => ({ ...prev, [name]: error }));
      }
    };

    const handleBlur = (name: string, value?: string) => {
      setTouched((prev: any) => ({ ...prev, [name]: true }));
      const valueToValidate =
        value !== undefined
          ? value
          : (formData[name as keyof typeof formData] as string);
      const error = validateField(name, valueToValidate);
      setErrors((prev: any) => ({ ...prev, [name]: error }));
    };

    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text
          style={[
            styles.sectionTitle,
            isSmallScreen && styles.sectionTitleMobile,
          ]}
        >
          Lease & Tenant
        </Text>

        <Text style={[styles.subHeader, isMobile && styles.subHeaderMobile]}>Tenant Information</Text>
        <View style={styles.fieldContainer}>
          <Text style={[styles.label, isMobile && styles.labelMobile]}>Tenant Type *</Text>
          <CustomDropdown
            placeholder="Select Tenant Type"
            value={formData.tenantType}
            options={tenantTypeOptions}
            onChange={v => {
              handleInputChange('tenantType', v);
              handleBlur('tenantType', v);
            }}
            onBlur={() => handleBlur('tenantType')}
            error={touched.tenantType && !!errors.tenantType}
          />
            <InputError message={errors.tenantType} visible={touched.tenantType && !!errors.tenantType} />
        </View>

        <Text style={[styles.subHeader, isMobile && styles.subHeaderMobile]}>Lease Duration & Terms</Text>
        <View style={[styles.row, isSmallScreen && styles.rowColumn]}>
          <View style={styles.fieldContainer}>
            <Text style={[styles.label, isMobile && styles.labelMobile]}>Lease Start Date *</Text>
            <CustomDatePicker
              value={formData.leaseStartDate}
              onChange={v => handleInputChange('leaseStartDate', v)}
              onBlur={() => handleBlur('leaseStartDate')}
              placeholder="YYYY-MM-DD"
              error={touched.leaseStartDate && !!errors.leaseStartDate}
            />
            <InputError message={errors.leaseStartDate} visible={touched.leaseStartDate && !!errors.leaseStartDate} />
          </View>
          <View style={styles.fieldContainer}>
            <Text style={[styles.label, isMobile && styles.labelMobile]}>Lease End Date *</Text>
            <CustomDatePicker
              value={formData.leaseExpiryDate}
              onChange={v => handleInputChange('leaseExpiryDate', v)}
              onBlur={() => handleBlur('leaseExpiryDate')}
              placeholder="YYYY-MM-DD"
              error={touched.leaseExpiryDate && !!errors.leaseExpiryDate}
            />
            <InputError message={errors.leaseExpiryDate} visible={touched.leaseExpiryDate && !!errors.leaseExpiryDate} />
          </View>
        </View>

        <View style={[styles.row, isSmallScreen && styles.rowColumn]}>
          <View style={styles.fieldContainer}>
            <Text style={[styles.label, isMobile && styles.labelMobile]}>Lock In Period</Text>
            <View style={styles.flexRow}>
              <TextInput
                style={[styles.input, isMobile && styles.inputMobile, { flex: 1, marginRight: 8 }]}
                placeholder="Years"
                keyboardType="numeric"
                value={formData.lockInYears}
                onChangeText={v => handleInputChange('lockInYears', v)}
              />
              <TextInput
                style={[styles.input, isMobile && styles.inputMobile, { flex: 1 }]}
                placeholder="Months"
                keyboardType="numeric"
                value={formData.lockInMonths}
                onChangeText={v => handleInputChange('lockInMonths', v)}
              />
            </View>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={[styles.label, isMobile && styles.labelMobile]}>Lease Duration (Years) *</Text>
            <TextInput
              style={[
                styles.input,
                isMobile && styles.inputMobile,
                touched.leaseDuration &&
                  errors.leaseDuration &&
                  styles.inputError,
              ]}
              placeholder="0"
              keyboardType="numeric"
              value={formData.leaseDuration}
              onChangeText={v => handleInputChange('leaseDuration', v)}
              onBlur={(e: any) =>
                handleBlur('leaseDuration', e.nativeEvent.text)
              }
            />
            <InputError message={errors.leaseDuration} visible={touched.leaseDuration && !!errors.leaseDuration} />
          </View>
        </View>

        <Text style={[styles.subHeader, isMobile && styles.subHeaderMobile]}>Rental & Deposit Details</Text>
        <View style={[styles.toggleRow, isSmallScreen && styles.rowColumn]}>
          <View style={styles.toggleGroup}>
            <Text style={[styles.label, isMobile && styles.labelMobile]}>Rent Type</Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={styles.radioButton}
                onPress={() => handleInputChange('rentType', 'perSqFt')}
              >
                <View
                  style={[
                    styles.radioCircle,
                    formData.rentType === 'perSqFt' && styles.radioActive,
                  ]}
                >
                  {formData.rentType === 'perSqFt' && (
                    <View style={styles.radioInner} />
                  )}
                </View>
                <Text style={[styles.radioLabel, isMobile && styles.radioLabelMobile]}>Sq Ft</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.radioButton}
                onPress={() => handleInputChange('rentType', 'lumpSum')}
              >
                <View
                  style={[
                    styles.radioCircle,
                    formData.rentType === 'lumpSum' && styles.radioActive,
                  ]}
                >
                  {formData.rentType === 'lumpSum' && (
                    <View style={styles.radioInner} />
                  )}
                </View>
                <Text style={[styles.radioLabel, isMobile && styles.radioLabelMobile]}>Lump</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.toggleGroup}>
            <Text style={[styles.label, isMobile && styles.labelMobile]}>Deposit Type</Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={styles.radioButton}
                onPress={() =>
                  handleInputChange('securityDepositType', 'months')
                }
              >
                <View
                  style={[
                    styles.radioCircle,
                    formData.securityDepositType === 'months' &&
                      styles.radioActive,
                  ]}
                >
                  {formData.securityDepositType === 'months' && (
                    <View style={styles.radioInner} />
                  )}
                </View>
                <Text style={[styles.radioLabel, isMobile && styles.radioLabelMobile]}>Months</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.radioButton}
                onPress={() =>
                  handleInputChange('securityDepositType', 'lumpSum')
                }
              >
                <View
                  style={[
                    styles.radioCircle,
                    formData.securityDepositType === 'lumpSum' &&
                      styles.radioActive,
                  ]}
                >
                  {formData.securityDepositType === 'lumpSum' && (
                    <View style={styles.radioInner} />
                  )}
                </View>
                <Text style={[styles.radioLabel, isMobile && styles.radioLabelMobile]}>Lump</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={[styles.row, isSmallScreen && styles.rowColumn]}>
          {formData.rentType === 'perSqFt' ? (
            <View style={styles.fieldContainer}>
              <Text style={[styles.label, isMobile && styles.labelMobile]}>Rent Per Sq Ft *</Text>
              <TextInput
                style={[
                  styles.input,
                  isMobile && styles.inputMobile,
                  touched.rentPerSqFt &&
                    errors.rentPerSqFt &&
                    styles.inputError,
                ]}
                placeholder="0.00"
                keyboardType="numeric"
                value={formData.rentPerSqFt}
                onChangeText={v => handleInputChange('rentPerSqFt', v)}
                onBlur={(e: any) =>
                  handleBlur('rentPerSqFt', e.nativeEvent.text)
                }
              />
              <InputError message={errors.rentPerSqFt} visible={touched.rentPerSqFt && !!errors.rentPerSqFt} />
            </View>
          ) : (
            <View style={styles.fieldContainer}>
              <Text style={[styles.label, isMobile && styles.labelMobile]}>Total Monthly Rent *</Text>
              <TextInput
                style={[
                  styles.input,
                  isMobile && styles.inputMobile,
                  touched.totalMonthlyRent &&
                    errors.totalMonthlyRent &&
                    styles.inputError,
                ]}
                placeholder="0.00"
                keyboardType="numeric"
                value={formData.totalMonthlyRent}
                onChangeText={v => handleInputChange('totalMonthlyRent', v)}
                onBlur={(e: any) =>
                  handleBlur('totalMonthlyRent', e.nativeEvent.text)
                }
              />
               <InputError message={errors.totalMonthlyRent} visible={touched.totalMonthlyRent && !!errors.totalMonthlyRent} />
            </View>
          )}

          {formData.securityDepositType === 'months' ? (
            <View style={styles.fieldContainer}>
              <Text style={[styles.label, isMobile && styles.labelMobile]}>Deposit (Months) *</Text>
              <TextInput
                style={[
                  styles.input,
                  isMobile && styles.inputMobile,
                  touched.securityDepositMonths &&
                    errors.securityDepositMonths &&
                    styles.inputError,
                ]}
                placeholder="0"
                keyboardType="numeric"
                value={formData.securityDepositMonths}
                onChangeText={v =>
                  handleInputChange('securityDepositMonths', v)
                }
                onBlur={(e: any) =>
                  handleBlur('securityDepositMonths', e.nativeEvent.text)
                }
              />
              <InputError message={errors.securityDepositMonths} visible={touched.securityDepositMonths && !!errors.securityDepositMonths} />
            </View>
          ) : (
            <View style={styles.fieldContainer}>
              <Text style={[styles.label, isMobile && styles.labelMobile]}>Deposit Amount *</Text>
              <TextInput
                style={[
                  styles.input,
                  isMobile && styles.inputMobile,
                  touched.securityDepositAmount &&
                    errors.securityDepositAmount &&
                    styles.inputError,
                ]}
                placeholder="0.00"
                keyboardType="numeric"
                value={formData.securityDepositAmount}
                onChangeText={v =>
                  handleInputChange('securityDepositAmount', v)
                }
                onBlur={(e: any) =>
                  handleBlur('securityDepositAmount', e.nativeEvent.text)
                }
              />
              <InputError message={errors.securityDepositAmount} visible={touched.securityDepositAmount && !!errors.securityDepositAmount} />
            </View>
          )}
        </View>

        <Text style={[styles.subHeader, isMobile && styles.subHeaderMobile]}>Escalation Terms & Maintenance</Text>
        <View style={[styles.row, isSmallScreen && styles.rowColumn]}>
          <View style={styles.fieldContainer}>
            <Text style={[styles.label, isMobile && styles.labelMobile]}>Frequency (Years) *</Text>
            <TextInput
              style={[
                styles.input,
                isMobile && styles.inputMobile,
                touched.escalationFrequency &&
                  errors.escalationFrequency &&
                  styles.inputError,
              ]}
              placeholder="Every X years"
              keyboardType="numeric"
              value={formData.escalationFrequency}
              onChangeText={v => handleInputChange('escalationFrequency', v)}
              onBlur={(e: any) =>
                handleBlur('escalationFrequency', e.nativeEvent.text)
              }
            />
            <InputError message={errors.escalationFrequency} visible={touched.escalationFrequency && !!errors.escalationFrequency} />
          </View>
          <View style={styles.fieldContainer}>
            <Text style={[styles.label, isMobile && styles.labelMobile]}>Annual Escalation (%) *</Text>
            <TextInput
              style={[
                styles.input,
                isMobile && styles.inputMobile,
                touched.escalationPercentage &&
                  errors.escalationPercentage &&
                  styles.inputError,
              ]}
              placeholder="0 %"
              keyboardType="numeric"
              value={formData.escalationPercentage}
              onChangeText={v => handleInputChange('escalationPercentage', v)}
              onBlur={(e: any) =>
                handleBlur('escalationPercentage', e.nativeEvent.text)
              }
            />
            <InputError message={errors.escalationPercentage} visible={touched.escalationPercentage && !!errors.escalationPercentage} />
          </View>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={[styles.label, isMobile && styles.labelMobile]}>Maintenance Costs *</Text>
          <CustomDropdown
            placeholder="Are maintenance costs included?"
            value={formData.maintenanceScope}
            options={maintenanceScopeOptions}
            onChange={v => {
              handleInputChange('maintenanceScope', v);
              handleBlur('maintenanceScope', v);
            }}
            onBlur={() => handleBlur('maintenanceScope')}
            error={touched.maintenanceScope && !!errors.maintenanceScope}
          />
            <InputError message={errors.maintenanceScope} visible={touched.maintenanceScope && !!errors.maintenanceScope} />
        </View>

        {formData.maintenanceScope !== '' && (
          <View
            style={[
              styles.row,
              isSmallScreen && styles.rowColumn,
              { marginTop: 4 },
            ]}
          >
            <View style={[styles.fieldContainer, { flex: 0.4 }]}>
              <Text style={[styles.label, isMobile && styles.labelMobile]}>Type</Text>
              <View style={[styles.inputWrapper]}>
                <TextInput
                  style={[styles.input, isMobile && styles.inputMobile]}
                  value={
                    formData.maintenanceType === 'perSqFt' ? 'Sq Ft' : 'Lump'
                  }
                  editable={false}
                />
                <ChevronDown size={14} color="#999" style={styles.inputIcon} />
              </View>
            </View>
            <View style={styles.fieldContainer}>
              <Text style={[styles.label, isMobile && styles.labelMobile]}>Amount</Text>
              <TextInput
                style={[styles.input, isMobile && styles.inputMobile]}
                placeholder="0.00"
                keyboardType="numeric"
                value={formData.maintenanceAmount}
                onChangeText={v => handleInputChange('maintenanceAmount', v)}
              />
            </View>
          </View>
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#EE2529',
    textAlign: 'center',
    marginBottom: 24,
    fontFamily: 'Montserrat',
  },
  sectionTitleMobile: {
    fontSize: 18,
    marginBottom: 16,
    fontFamily: 'Montserrat',
  },
  subHeader: {
    fontSize: 22,
    fontWeight: '700',
    color: '#EE2529',
    marginBottom: 16,
    marginTop: 8,
    fontFamily: 'Montserrat',
  },
  subHeaderMobile: {
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  rowColumn: {
    flexDirection: 'column',
    gap: 0,
  },
  flexRow: {
    flexDirection: 'row',
  },
  fieldContainer: {
    flex: 1,
    marginBottom: 16,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#444',
    marginBottom: 6,
    fontFamily: 'Montserrat',
  },
  labelMobile: {
    fontSize: 14,
  },

  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  input: {
    backgroundColor: '#F2F2F2',
    height: 44,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 18,
    color: '#333',
    borderWidth: 1,
    borderColor: '#eee',
    fontFamily: 'Montserrat',
  },
  inputMobile: {
    fontSize: 14,
  },
  inputError: {
    borderColor: '#EE2529',
  },
  inputIcon: {
    position: 'absolute',
    right: 12,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  toggleGroup: {
    flex: 1,
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  radioCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
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
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFF',
  },
  radioLabel: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'Montserrat',
  },
  radioLabelMobile: {
    fontSize: 14,
  },
});

export default LeaseDetails;
