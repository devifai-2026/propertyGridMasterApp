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
import { Plus, X, AlertTriangle } from 'lucide-react-native';
import InputError from '../../../components/common/InputError';
import CustomDropdown from './CustomDropdown';

interface LegalDetailsProps {
  onNext: (data: any) => void;
  onFormValid: (isValid: boolean) => void;
  initialData?: any;
}

const LegalDetails = forwardRef<any, LegalDetailsProps>(
  ({ onNext, onFormValid, initialData }, ref) => {
    const { width } = useWindowDimensions();
    const isSmallScreen = width < 768;
    const isMobile = width < 480;

    useImperativeHandle(ref, () => ({
      submit: () => {
        onNext(formData);
      },
    }));

    const titleStatusOptions = [
      { label: 'No Litigation', value: 'No Litigation' },
      { label: 'Pending Litigation', value: 'Pending Litigation' },
    ];

    const occupancyCertificateOptions = [
      { label: 'Yes, available', value: 'Yes, available' },
      { label: 'In Process', value: 'In Process' },
      { label: 'Not available', value: 'Not available' },
    ];

    const leaseRegistrationOptions = [
      { label: 'Registered Lease', value: 'Registered Lease' },
      { label: 'Notorized Lease', value: 'Notorized Lease' },
      { label: 'No lease document', value: 'No lease document' },
    ];

    const [formData, setFormData] = useState({
      titleStatus: initialData?.titleStatus || '',
      occupancyCertificate: initialData?.occupancyCertificate || '',
      leaseRegistration: initialData?.leaseRegistration || '',
      pendingLitigations: initialData?.pendingLitigations || 'no',
      litigationNote: initialData?.litigationNote || '',
      certifications: initialData?.certifications || {
        rera: false,
        leed: false,
        igbc: false,
      },
      otherCertifications: initialData?.otherCertifications || [''],
    });

    const [errors, setErrors] = useState<any>({});
    const [touched, setTouched] = useState<any>({});

    useEffect(() => {
      const isValid = validateFormSilently();
      onFormValid(isValid);
    }, [formData]);

    const validateFormSilently = () => {
      return (
        formData.titleStatus !== '' &&
        formData.occupancyCertificate !== '' &&
        formData.leaseRegistration !== '' &&
        formData.pendingLitigations !== '' &&
        (formData.pendingLitigations !== 'yes' ||
          formData.litigationNote.trim() !== '')
      );
    };

    const validateField = (name: string, value: any) => {
      switch (name) {
        case 'titleStatus':
          return !value ? 'Title Status is required' : '';
        case 'occupancyCertificate':
          return !value ? 'Occupancy Certificate is required' : '';
        case 'leaseRegistration':
          return !value ? 'Lease Registration is required' : '';
        case 'pendingLitigations':
          return !value ? 'Please select Yes or No' : '';
        case 'litigationNote':
          if (formData.pendingLitigations === 'yes' && !value.trim()) {
            return 'Please provide litigation details';
          }
          return '';
        default:
          return '';
      }
    };

    const handleInputChange = (name: string, value: any) => {
      setFormData(prev => ({ ...prev, [name]: value }));

      if (touched[name]) {
        const error = validateField(name, value);
        setErrors((prev: any) => ({ ...prev, [name]: error }));
      }
    };

    const handleBlur = (name: string, value?: any) => {
      setTouched((prev: any) => ({ ...prev, [name]: true }));
      const valueToValidate =
        value !== undefined ? value : formData[name as keyof typeof formData];
      const error = validateField(name, valueToValidate);
      setErrors((prev: any) => ({ ...prev, [name]: error }));
    };

    const toggleCertification = (
      cert: keyof typeof formData.certifications,
    ) => {
      setFormData(prev => ({
        ...prev,
        certifications: {
          ...prev.certifications,
          [cert]: !prev.certifications[cert],
        },
      }));
    };

    const handleOtherCertChange = (index: number, value: string) => {
      const newCerts = [...formData.otherCertifications];
      newCerts[index] = value;
      setFormData(prev => ({ ...prev, otherCertifications: newCerts }));
    };

    const addOtherCert = () => {
      if (
        formData.otherCertifications[
          formData.otherCertifications.length - 1
        ].trim()
      ) {
        setFormData(prev => ({
          ...prev,
          otherCertifications: [...prev.otherCertifications, ''],
        }));
      }
    };

    const removeOtherCert = (index: number) => {
      const newCerts = formData.otherCertifications.filter(
        (_: any, i: number) => i !== index,
      );
      setFormData(prev => ({
        ...prev,
        otherCertifications: newCerts.length ? newCerts : [''],
      }));
    };

    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text
          style={[
            styles.sectionTitle,
            isSmallScreen && styles.sectionTitleMobile,
          ]}
        >
          Legal & Title Details
        </Text>

        <Text style={[styles.subHeader, isMobile && styles.subHeaderMobile]}>Title & Ownership Status</Text>

        <View style={[styles.row, isSmallScreen && styles.rowColumn]}>
          <View style={styles.fieldContainer}>
            <Text style={[styles.label, isMobile && styles.labelMobile]}>Title Status *</Text>
            <CustomDropdown
              placeholder="Select Status"
              value={formData.titleStatus}
              options={titleStatusOptions}
              onChange={v => {
                handleInputChange('titleStatus', v);
                handleBlur('titleStatus', v);
              }}
              onBlur={() => handleBlur('titleStatus')}
              error={touched.titleStatus && !!errors.titleStatus}
            />
            <InputError message={errors.titleStatus} visible={touched.titleStatus && !!errors.titleStatus} />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={[styles.label, isMobile && styles.labelMobile]}>Occupancy Certificate (OC) *</Text>
            <CustomDropdown
              placeholder="Select Status"
              value={formData.occupancyCertificate}
              options={occupancyCertificateOptions}
              onChange={v => {
                handleInputChange('occupancyCertificate', v);
                handleBlur('occupancyCertificate', v);
              }}
              onBlur={() => handleBlur('occupancyCertificate')}
              error={
                touched.occupancyCertificate && !!errors.occupancyCertificate
              }
            />
            <InputError message={errors.occupancyCertificate} visible={touched.occupancyCertificate && !!errors.occupancyCertificate} />
          </View>
        </View>

        <View style={[styles.row, isSmallScreen && styles.rowColumn]}>
          <View style={styles.fieldContainer}>
            <Text style={[styles.label, isMobile && styles.labelMobile]}>Lease Registration *</Text>
            <CustomDropdown
              placeholder="Select Status"
              value={formData.leaseRegistration}
              options={leaseRegistrationOptions}
              onChange={v => {
                handleInputChange('leaseRegistration', v);
                handleBlur('leaseRegistration', v);
              }}
              onBlur={() => handleBlur('leaseRegistration')}
              error={touched.leaseRegistration && !!errors.leaseRegistration}
            />
            <InputError message={errors.leaseRegistration} visible={touched.leaseRegistration && !!errors.leaseRegistration} />
          </View>
          {!isSmallScreen && <View style={styles.fieldContainer} />}
        </View>

        <View style={styles.fieldContainer}>
          <Text style={[styles.label, isMobile && styles.labelMobile]}>Any Pending Litigations *</Text>
          <View style={styles.radioGroup}>
            <TouchableOpacity
              style={styles.radioButton}
              onPress={() => {
                handleInputChange('pendingLitigations', 'yes');
                handleBlur('pendingLitigations');
              }}
            >
              <View
                style={[
                  styles.radioCircle,
                  formData.pendingLitigations === 'yes' && styles.radioActive,
                ]}
              >
                {formData.pendingLitigations === 'yes' && (
                  <View style={styles.radioInner} />
                )}
              </View>
              <Text style={[styles.radioLabel, isMobile && styles.radioLabelMobile]}>Yes</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.radioButton}
              onPress={() => {
                handleInputChange('pendingLitigations', 'no');
                handleBlur('pendingLitigations');
              }}
            >
              <View
                style={[
                  styles.radioCircle,
                  formData.pendingLitigations === 'no' && styles.radioActive,
                ]}
              >
                {formData.pendingLitigations === 'no' && (
                  <View style={styles.radioInner} />
                )}
              </View>
              <Text style={[styles.radioLabel, isMobile && styles.radioLabelMobile]}>No</Text>
            </TouchableOpacity>
          </View>
          <InputError message={errors.pendingLitigations} visible={touched.pendingLitigations && !!errors.pendingLitigations} />
        </View>

        {formData.pendingLitigations === 'yes' && (
          <View style={styles.fieldContainer}>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                isMobile && styles.inputMobile,
                touched.litigationNote &&
                  errors.litigationNote &&
                  styles.inputError,
              ]}
              placeholder="Enter Brief note on Litigation"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              value={formData.litigationNote}
              onChangeText={v => handleInputChange('litigationNote', v)}
              onBlur={(e: any) =>
                handleBlur('litigationNote', e.nativeEvent.text)
              }
            />
            <InputError message={errors.litigationNote} visible={touched.litigationNote && !!errors.litigationNote} />
          </View>
        )}

        <Text style={[styles.subHeader, isMobile && styles.subHeaderMobile]}>Licenses & Certifications</Text>
        <View style={styles.certGrid}>
          {(['rera', 'leed', 'igbc'] as const).map(cert => (
            <TouchableOpacity
              key={cert}
              style={styles.checkboxRow}
              onPress={() => toggleCertification(cert)}
            >
              <View
                style={[
                  styles.checkbox,
                  formData.certifications[cert] && styles.checkboxActive,
                ]}
              >
                {formData.certifications[cert] && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </View>
              <Text style={[styles.checkboxLabel, isMobile && styles.checkboxLabelMobile]}>{cert.toUpperCase()}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.otherCertContainer}>
          <Text style={[styles.labelSmall, isMobile && styles.labelMobile]}>Add Others (if Any)</Text>
          {formData.otherCertifications.map((cert: any, index: number) => (
            <View key={index} style={styles.certInputRow}>
              <TextInput
                style={[styles.input, isMobile && styles.inputMobile, { flex: 1 }]}
                placeholder="Enter certification"
                value={cert}
                onChangeText={v => handleOtherCertChange(index, v)}
              />
              {index === formData.otherCertifications.length - 1 ? (
                <TouchableOpacity style={styles.addBtn} onPress={addOtherCert}>
                  <Plus size={20} color="#FFF" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={() => removeOtherCert(index)}
                >
                  <X size={20} color="#666" />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
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
  labelSmall: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    fontFamily: 'Montserrat',
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
  textArea: {
    height: 80,
    paddingTop: 12,
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 24,
    marginTop: 4,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
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
    color: '#444',
    fontFamily: 'Montserrat',
  },
  radioLabelMobile: {
    fontSize: 14,
  },
  certGrid: {
    gap: 12,
    marginBottom: 20,
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
  otherCertContainer: {
    marginTop: 8,
  },
  certInputRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  addBtn: {
    backgroundColor: '#EE2529',
    width: 44,
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeBtn: {
    backgroundColor: '#E0E0E0',
    width: 44,
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LegalDetails;
