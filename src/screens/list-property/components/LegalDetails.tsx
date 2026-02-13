import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { ChevronDown, Plus, X } from 'lucide-react-native';

interface LegalDetailsProps {
  onNext: (data: any) => void;
  onFormValid: (isValid: boolean) => void;
}

const LegalDetails: React.FC<LegalDetailsProps> = ({ onNext, onFormValid }) => {
  const [formData, setFormData] = useState({
    titleStatus: '',
    occupancyCertificate: '',
    leaseRegistration: '',
    pendingLitigations: 'no',
    litigationNote: '',
    certifications: {
      rera: false,
      leed: false,
      igbc: false,
    },
    otherCertifications: [''],
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

  const handleInputChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleCertification = (cert: keyof typeof formData.certifications) => {
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
    const newCerts = formData.otherCertifications.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      otherCertifications: newCerts.length ? newCerts : [''],
    }));
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Legal & Title Details</Text>

      <Text style={styles.subHeader}>Title & Ownership Status</Text>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Title Status *</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Select Status"
            value={formData.titleStatus}
            onChangeText={v => handleInputChange('titleStatus', v)}
          />
          <ChevronDown size={20} color="#999" style={styles.inputIcon} />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Occupancy Certificate *</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Select Status"
              value={formData.occupancyCertificate}
              onChangeText={v => handleInputChange('occupancyCertificate', v)}
            />
            <ChevronDown size={20} color="#999" style={styles.inputIcon} />
          </View>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Lease Registration *</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Select Status"
              value={formData.leaseRegistration}
              onChangeText={v => handleInputChange('leaseRegistration', v)}
            />
            <ChevronDown size={20} color="#999" style={styles.inputIcon} />
          </View>
        </View>
      </View>

      <Text style={styles.subHeader}>Litigation Status</Text>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Any Pending Litigations *</Text>
        <View style={styles.radioGroup}>
          <TouchableOpacity
            style={styles.radioButton}
            onPress={() => handleInputChange('pendingLitigations', 'yes')}
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
            <Text style={styles.radioLabel}>Yes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.radioButton}
            onPress={() => handleInputChange('pendingLitigations', 'no')}
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
            <Text style={styles.radioLabel}>No</Text>
          </TouchableOpacity>
        </View>
      </View>

      {formData.pendingLitigations === 'yes' && (
        <View style={styles.fieldContainer}>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter Brief note on Litigation"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            value={formData.litigationNote}
            onChangeText={v => handleInputChange('litigationNote', v)}
          />
        </View>
      )}

      <Text style={styles.subHeader}>Licenses & Certifications</Text>
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
            <Text style={styles.checkboxLabel}>{cert.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.otherCertContainer}>
        <Text style={styles.labelSmall}>Add Others (if Any)</Text>
        {formData.otherCertifications.map((cert, index) => (
          <View key={index} style={styles.certInputRow}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
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
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#EE2529',
    textAlign: 'center',
    marginBottom: 24,
  },
  subHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: '#EE2529',
    marginBottom: 16,
    marginTop: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  fieldContainer: {
    flex: 1,
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#444',
    marginBottom: 6,
  },
  labelSmall: {
    fontSize: 11,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
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
    fontSize: 14,
    color: '#333',
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
    fontSize: 14,
    color: '#444',
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
    fontSize: 14,
    color: '#444',
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
