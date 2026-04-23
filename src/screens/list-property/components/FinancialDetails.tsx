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
import { Info, AlertTriangle } from 'lucide-react-native';
import InputError from '../../../components/common/InputError';

interface FinancialDetailsProps {
  onNext: (data: any) => void;
  onFormValid: (isValid: boolean) => void;
  initialData?: any;
}

const FinancialDetails = forwardRef<any, FinancialDetailsProps>(
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
          if (!/^\d+(\.\d+)?$/.test(value) || parseFloat(value) <= 0)
            return 'Please enter a valid price';
          return '';
        case 'propertyTax':
          if (!value) return 'Property Tax is required';
          if (!/^\d+(\.\d+)?$/.test(value))
            return 'Please enter a valid amount';
          return '';
        case 'insurance':
          if (!value) return 'Insurance is required';
          if (!/^\d+(\.\d+)?$/.test(value))
            return 'Please enter a valid amount';
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
      const error = validateField(
        name,
        formData[name as keyof typeof formData],
      );
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
          Financial Analytics
        </Text>

        <Text style={[styles.subHeader, isMobile && styles.subHeaderMobile]}>Property Details</Text>
        <View style={styles.fieldContainer}>
          <View style={styles.labelRow}>
            <Text style={[styles.label, isMobile && styles.labelMobile]}>Selling Price *</Text>
            <Info size={14} color="#999" />
          </View>
          <TextInput
            style={[
              styles.input,
              isMobile && styles.inputMobile,
              touched.sellingPrice && errors.sellingPrice && styles.inputError,
            ]}
            placeholder="Enter Property Selling Price"
            keyboardType="numeric"
            value={formData.sellingPrice}
            onChangeText={v => handleInputChange('sellingPrice', v)}
            onBlur={() => handleBlur('sellingPrice')}
          />
          <InputError message={errors.sellingPrice} visible={touched.sellingPrice && !!errors.sellingPrice} />
        </View>

        <Text style={[styles.subHeader, isMobile && styles.subHeaderMobile]}>Annual Operating Costs</Text>
        <View style={[styles.row, isSmallScreen && styles.rowColumn]}>
          <View style={styles.fieldContainer}>
            <Text style={[styles.label, isMobile && styles.labelMobile]}>Property Tax (Annual) *</Text>
            <TextInput
              style={[
                styles.input,
                isMobile && styles.inputMobile,
                touched.propertyTax && errors.propertyTax && styles.inputError,
              ]}
              placeholder="0"
              keyboardType="numeric"
              value={formData.propertyTax}
              onChangeText={v => handleInputChange('propertyTax', v)}
              onBlur={() => handleBlur('propertyTax')}
            />
            <InputError message={errors.propertyTax} visible={touched.propertyTax && !!errors.propertyTax} />
          </View>
          <View style={styles.fieldContainer}>
            <Text style={[styles.label, isMobile && styles.labelMobile]}>Insurance (Annual) *</Text>
            <TextInput
              style={[
                styles.input,
                isMobile && styles.inputMobile,
                touched.insurance && errors.insurance && styles.inputError,
              ]}
              placeholder="0"
              keyboardType="numeric"
              value={formData.insurance}
              onChangeText={v => handleInputChange('insurance', v)}
              onBlur={() => handleBlur('insurance')}
            />
            <InputError message={errors.insurance} visible={touched.insurance && !!errors.insurance} />
          </View>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={[styles.label, isMobile && styles.labelMobile]}>Other Costs (Annual)</Text>
          <TextInput
            style={[styles.input, isMobile && styles.inputMobile]}
            placeholder="0"
            keyboardType="numeric"
            value={formData.otherCosts}
            onChangeText={v => handleInputChange('otherCosts', v)}
          />
        </View>

        <View style={styles.totalBox}>
          <Text style={[styles.totalLabel, isMobile && styles.totalLabelMobile]}>Total Operating Annual Costs</Text>
          <Text style={[styles.totalValue, isMobile && styles.totalValueMobile]}>{metrics.annualOperatingCosts}</Text>
        </View>

        <Text style={[styles.subHeader, isMobile && styles.subHeaderMobile]}>Additional Income Details</Text>
        <View style={styles.fieldContainer}>
          <Text style={[styles.label, isMobile && styles.labelMobile]}>Additional Income (Annual)</Text>
          <TextInput
            style={[styles.input, isMobile && styles.inputMobile]}
            placeholder="Enter Additional Income"
            keyboardType="numeric"
            value={formData.additionalIncome}
            onChangeText={v => handleInputChange('additionalIncome', v)}
          />
          <Text style={styles.helpText}>
            Any additional income from parking, advertisements, etc.
          </Text>
        </View>

        <Text style={[styles.subHeader, isMobile && styles.subHeaderMobile]}>Calculated Metrics</Text>
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
              <View style={styles.metricContent}>
                <Text style={[styles.metricLabel, isMobile && styles.metricLabelMobile]}>{item.label}</Text>
                <Text style={[styles.metricValue, isMobile && styles.metricValueMobile]}>{item.value}</Text>
              </View>
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
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
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
    fontSize: 18,
    fontWeight: '600',
    color: '#444',
    fontFamily: 'Montserrat',
  },
  totalLabelMobile: {
    fontSize: 14,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    fontFamily: 'Montserrat',
  },
  totalValueMobile: {
    fontSize: 13,
  },
  helpText: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
    fontFamily: 'Montserrat',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  metricItem: {
    width: '48%',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    minHeight: 70,
    justifyContent: 'center',
  },
  metricContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  metricLabel: {
    fontSize: 18,
    color: '#6666',
    fontFamily: 'Montserrat',
    flex: 1,
    marginRight: 8,
  },
  metricLabelMobile: {
    fontSize: 13,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6666',
    fontFamily: 'Montserrat',
  },
  metricValueMobile: {
    fontSize: 13,
  },
});

export default FinancialDetails;
