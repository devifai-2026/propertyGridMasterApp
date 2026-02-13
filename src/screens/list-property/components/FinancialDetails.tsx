import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { Info } from 'lucide-react-native';

interface FinancialDetailsProps {
  onNext: (data: any) => void;
  onFormValid: (isValid: boolean) => void;
  initialData?: any;
}

const FinancialDetails: React.FC<FinancialDetailsProps> = ({
  onNext,
  onFormValid,
  initialData,
}) => {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 768;

  const [formData, setFormData] = useState({
    sellingPrice: initialData?.sellingPrice || '',
    propertyTax: initialData?.propertyTax || '',
    insurance: initialData?.insurance || '',
    otherCosts: initialData?.otherCosts || '',
    additionalIncome: initialData?.additionalIncome || '',
  });

  const [errors, setErrors] = useState<any>({});
  const [touched, setTouched] = useState<any>({});

  const [metrics, setMetrics] = useState({
    annualGrossRent: '₹0',
    grossRentalYield: '0%',
    annualOperatingCosts: '₹0',
    netRentalYield: '0%',
    netOperatingIncome: '₹0',
    paybackPeriod: '0 years',
    recurringCostsPerSqFt: '0',
    recurringCostsAsPercentageOfRent: '0%',
  });

  useEffect(() => {
    calculateMetrics();
    const isValid = validateFormSilently();
    onFormValid(isValid);
  }, [formData]);

  const validateFormSilently = () => {
    return (
      formData.sellingPrice !== '' &&
      formData.propertyTax !== '' &&
      formData.insurance !== ''
    );
  };

  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'sellingPrice':
        if (!value) return 'Selling Price is required';
        if (!/^\d+(\.\d+)?$/.test(value) || parseFloat(value) <= 0) return 'Please enter a valid price';
        return '';
      case 'propertyTax':
        if (!value) return 'Property Tax is required';
        if (!/^\d+(\.\d+)?$/.test(value)) return 'Please enter a valid amount';
        return '';
      case 'insurance':
        if (!value) return 'Insurance is required';
        if (!/^\d+(\.\d+)?$/.test(value)) return 'Please enter a valid amount';
        return '';
      default:
        return '';
    }
  };

  const calculateMetrics = () => {
    // This is a simplified version of the metrics calculation
    // In a real app, these would depend on inputs from previous steps (carpet area, rent)
    const sellingPrice = parseFloat(formData.sellingPrice) || 0;
    const propertyTax = parseFloat(formData.propertyTax) || 0;
    const insurance = parseFloat(formData.insurance) || 0;
    const otherCosts = parseFloat(formData.otherCosts) || 0;
    const additionalIncome = parseFloat(formData.additionalIncome) || 0;

    const opCosts = propertyTax + insurance + otherCosts;

    setMetrics(prev => ({
      ...prev,
      annualOperatingCosts: `₹${opCosts.toLocaleString()}`,
    }));
  };

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev: any) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (name: string) => {
    setTouched((prev: any) => ({ ...prev, [name]: true }));
    const error = validateField(name, formData[name as keyof typeof formData]);
    setErrors((prev: any) => ({ ...prev, [name]: error }));
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={[styles.sectionTitle, isSmallScreen && styles.sectionTitleMobile]}>Financial Analytics</Text>

      <Text style={styles.subHeader}>Property Details</Text>
      <View style={styles.fieldContainer}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>Selling Price *</Text>
          <Info size={14} color="#999" />
        </View>
        <TextInput
          style={[
            styles.input,
            touched.sellingPrice && errors.sellingPrice && styles.inputError,
          ]}
          placeholder="Enter Property Selling Price"
          keyboardType="numeric"
          value={formData.sellingPrice}
          onChangeText={v => handleInputChange('sellingPrice', v)}
          onBlur={() => handleBlur('sellingPrice')}
        />
        {touched.sellingPrice && errors.sellingPrice && (
          <Text style={styles.errorText}>{errors.sellingPrice}</Text>
        )}
      </View>

      <Text style={styles.subHeader}>Annual Operating Costs</Text>
      <View style={[styles.row, isSmallScreen && styles.rowColumn]}>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Property Tax (Annual) *</Text>
          <TextInput
            style={[
              styles.input,
              touched.propertyTax && errors.propertyTax && styles.inputError,
            ]}
            placeholder="0"
            keyboardType="numeric"
            value={formData.propertyTax}
            onChangeText={v => handleInputChange('propertyTax', v)}
            onBlur={() => handleBlur('propertyTax')}
          />
          {touched.propertyTax && errors.propertyTax && (
            <Text style={styles.errorText}>{errors.propertyTax}</Text>
          )}
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Insurance (Annual) *</Text>
          <TextInput
            style={[
              styles.input,
              touched.insurance && errors.insurance && styles.inputError,
            ]}
            placeholder="0"
            keyboardType="numeric"
            value={formData.insurance}
            onChangeText={v => handleInputChange('insurance', v)}
            onBlur={() => handleBlur('insurance')}
          />
          {touched.insurance && errors.insurance && (
            <Text style={styles.errorText}>{errors.insurance}</Text>
          )}
        </View>
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Other Costs (Annual)</Text>
        <TextInput
          style={styles.input}
          placeholder="0"
          keyboardType="numeric"
          value={formData.otherCosts}
          onChangeText={v => handleInputChange('otherCosts', v)}
        />
      </View>

      <View style={styles.totalBox}>
        <Text style={styles.totalLabel}>Total Operating Annual Costs</Text>
        <Text style={styles.totalValue}>{metrics.annualOperatingCosts}</Text>
      </View>

      <Text style={styles.subHeader}>Additional Income Details</Text>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Additional Income (Annual)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Additional Income"
          keyboardType="numeric"
          value={formData.additionalIncome}
          onChangeText={v => handleInputChange('additionalIncome', v)}
        />
        <Text style={styles.helpText}>
          Any additional income from parking, advertisements, etc.
        </Text>
      </View>

      <Text style={styles.subHeader}>Calculated Metrics</Text>
      <View style={styles.metricsGrid}>
        {[
          { label: 'Annual Gross Rent:', value: metrics.annualGrossRent },
          { label: 'Gross Rental Yield:', value: metrics.grossRentalYield },
          {
            label: 'Annual Operating Costs:',
            value: metrics.annualOperatingCosts,
          },
          { label: 'Net Rental Yield:', value: metrics.netRentalYield },
          {
            label: 'Net Operating Income (NOI):',
            value: metrics.netOperatingIncome,
          },
          { label: 'Payback Period:', value: metrics.paybackPeriod },
          {
            label: 'Recurring Costs per sq ft:',
            value: metrics.recurringCostsPerSqFt,
          },
          {
            label: 'Recurring Costs as % of Rent:',
            value: metrics.recurringCostsAsPercentageOfRent,
          },
        ].map((item, idx) => (
          <View key={idx} style={styles.metricItem}>
            <Text style={styles.metricLabel}>{item.label}</Text>
            <Text style={styles.metricValue}>{item.value}</Text>
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
  sectionTitleMobile: {
    fontSize: 18,
    marginBottom: 16,
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
  rowColumn: {
    flexDirection: 'column',
    gap: 0,
  },
  fieldContainer: {
    flex: 1,
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#444',
    marginBottom: 6,
  },
  errorText: {
    color: '#EE2529',
    fontSize: 11,
    marginTop: 4,
  },
  input: {
    backgroundColor: '#F2F2F2',
    height: 44,
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
  totalBox: {
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  totalLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#444',
  },
  totalValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
  },
  helpText: {
    fontSize: 11,
    color: '#888',
    marginTop: 4,
  },
  metricsGrid: {
    gap: 10,
    marginBottom: 20,
  },
  metricItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
  },
  metricLabel: {
    fontSize: 12,
    color: '#666',
  },
  metricValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#444',
  },
});

export default FinancialDetails;
