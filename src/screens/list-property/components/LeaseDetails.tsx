import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { ChevronDown, Info } from 'lucide-react-native';

interface LeaseDetailsProps {
  onNext: (data: any) => void;
  onFormValid: (isValid: boolean) => void;
}

const LeaseDetails: React.FC<LeaseDetailsProps> = ({ onNext, onFormValid }) => {
  const [formData, setFormData] = useState({
    tenantType: '',
    leaseStartDate: '',
    leaseExpiryDate: '',
    lockInYears: '',
    lockInMonths: '',
    leaseDuration: '',
    rentType: 'perSqFt',
    rentPerSqFt: '',
    totalMonthlyRent: '',
    securityDepositType: 'months',
    securityDepositMonths: '',
    securityDepositAmount: '',
    escalationPercentage: '',
    escalationFrequency: '',
    maintenanceScope: '',
    maintenanceType: 'perSqFt',
    maintenanceAmount: '',
  });

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

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Lease & Tenant</Text>

      <Text style={styles.subHeader}>Tenant Information</Text>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Tenant Type *</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Select Tenant Type"
            value={formData.tenantType}
            onChangeText={v => handleInputChange('tenantType', v)}
          />
          <ChevronDown size={20} color="#999" style={styles.inputIcon} />
        </View>
      </View>

      <Text style={styles.subHeader}>Lease Duration & Terms</Text>
      <View style={styles.row}>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Lease Start Date *</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            value={formData.leaseStartDate}
            onChangeText={v => handleInputChange('leaseStartDate', v)}
          />
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Lease End Date *</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            value={formData.leaseExpiryDate}
            onChangeText={v => handleInputChange('leaseExpiryDate', v)}
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Lock In Period</Text>
          <View style={styles.flexRow}>
            <TextInput
              style={[styles.input, { flex: 1, marginRight: 8 }]}
              placeholder="Years"
              keyboardType="numeric"
              value={formData.lockInYears}
              onChangeText={v => handleInputChange('lockInYears', v)}
            />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Months"
              keyboardType="numeric"
              value={formData.lockInMonths}
              onChangeText={v => handleInputChange('lockInMonths', v)}
            />
          </View>
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Lease Duration (Years) *</Text>
          <TextInput
            style={styles.input}
            placeholder="0"
            keyboardType="numeric"
            value={formData.leaseDuration}
            onChangeText={v => handleInputChange('leaseDuration', v)}
          />
        </View>
      </View>

      <Text style={styles.subHeader}>Rental & Deposit Details</Text>
      <View style={styles.toggleRow}>
        <View style={styles.toggleGroup}>
          <Text style={styles.label}>Rent Type</Text>
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
              <Text style={styles.radioLabel}>Sq Ft</Text>
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
              <Text style={styles.radioLabel}>Lump</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.toggleGroup}>
          <Text style={styles.label}>Deposit Type</Text>
          <View style={styles.radioGroup}>
            <TouchableOpacity
              style={styles.radioButton}
              onPress={() => handleInputChange('securityDepositType', 'months')}
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
              <Text style={styles.radioLabel}>Months</Text>
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
              <Text style={styles.radioLabel}>Lump</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.row}>
        {formData.rentType === 'perSqFt' ? (
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Rent Per Sq Ft *</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              keyboardType="numeric"
              value={formData.rentPerSqFt}
              onChangeText={v => handleInputChange('rentPerSqFt', v)}
            />
          </View>
        ) : (
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Total Monthly Rent *</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              keyboardType="numeric"
              value={formData.totalMonthlyRent}
              onChangeText={v => handleInputChange('totalMonthlyRent', v)}
            />
          </View>
        )}

        {formData.securityDepositType === 'months' ? (
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Deposit (Months) *</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              keyboardType="numeric"
              value={formData.securityDepositMonths}
              onChangeText={v => handleInputChange('securityDepositMonths', v)}
            />
          </View>
        ) : (
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Deposit Amount *</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              keyboardType="numeric"
              value={formData.securityDepositAmount}
              onChangeText={v => handleInputChange('securityDepositAmount', v)}
            />
          </View>
        )}
      </View>

      <Text style={styles.subHeader}>Escalation Terms & Maintenance</Text>
      <View style={styles.row}>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Frequency (Years) *</Text>
          <TextInput
            style={styles.input}
            placeholder="Every X years"
            keyboardType="numeric"
            value={formData.escalationFrequency}
            onChangeText={v => handleInputChange('escalationFrequency', v)}
          />
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Annual Escalation (%) *</Text>
          <TextInput
            style={styles.input}
            placeholder="0 %"
            keyboardType="numeric"
            value={formData.escalationPercentage}
            onChangeText={v => handleInputChange('escalationPercentage', v)}
          />
        </View>
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Maintenance Costs *</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Are costs included?"
            value={formData.maintenanceScope}
            onChangeText={v => handleInputChange('maintenanceScope', v)}
          />
          <ChevronDown size={20} color="#999" style={styles.inputIcon} />
        </View>
      </View>

      {formData.maintenanceScope !== '' && (
        <View style={[styles.row, { marginTop: 4 }]}>
          <View style={[styles.fieldContainer, { flex: 0.4 }]}>
            <Text style={styles.label}>Type</Text>
            <View style={[styles.inputWrapper]}>
              <TextInput
                style={styles.input}
                value={
                  formData.maintenanceType === 'perSqFt' ? 'Sq Ft' : 'Lump'
                }
                editable={false}
              />
              <ChevronDown size={14} color="#999" style={styles.inputIcon} />
            </View>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Amount</Text>
            <TextInput
              style={styles.input}
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
  flexRow: {
    flexDirection: 'row',
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
    fontSize: 13,
    color: '#666',
  },
});

export default LeaseDetails;
