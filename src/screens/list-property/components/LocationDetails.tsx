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
import { ChevronDown, Plus, X, Trash2, AlertTriangle } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import CustomDropdown from './CustomDropdown';

const INDIAN_STATES = [
  'Andaman and Nicobar Islands',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Chhattisgarh',
  'Dadra and Nagar Haveli',
  'Daman and Diu',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Ladakh',
  'Lakshadweep',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Puducherry',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
];

const CITY_BY_STATE: any = {
  'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Amaravati', 'Tirupati'],
  'Arunachal Pradesh': ['Itanagar', 'Naharlagun'],
  Assam: ['Guwahati', 'Dibrugarh', 'Silchar'],
  Bihar: ['Patna', 'Gaya', 'Bhagalpur'],
  Chandigarh: ['Chandigarh'],
  Chhattisgarh: ['Raipur', 'Durg', 'Bilaspur'],
  Delhi: ['New Delhi', 'Delhi'],
  Goa: ['Panaji', 'Margao'],
  Gujarat: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar'],
  Haryana: ['Gurgaon', 'Faridabad', 'Hisar', 'Panipat'],
  'Himachal Pradesh': ['Shimla', 'Manali', 'Kangra'],
  Jharkhand: ['Ranchi', 'Jamshedpur', 'Dhanbad'],
  Karnataka: ['Bangalore', 'Mysore', 'Pune', 'Mangalore', 'Belgaum'],
  Kerala: ['Kochi', 'Thiruvananthapuram', 'Kozhikode'],
  'Madhya Pradesh': ['Indore', 'Bhopal', 'Jabalpur'],
  Maharashtra: ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Aurangabad'],
  Manipur: ['Imphal'],
  Meghalaya: ['Shillong'],
  Mizoram: ['Aizawl'],
  Nagaland: ['Kohima'],
  Odisha: ['Bhubaneswar', 'Cuttack', 'Rourkela'],
  Puducherry: ['Puducherry', 'Yanam'],
  Punjab: ['Chandigarh', 'Ludhiana', 'Amritsar', 'Jalandhar'],
  Rajasthan: ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota'],
  Sikkim: ['Gangtok'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Salem'],
  Telangana: ['Hyderabad', 'Secundrabad', 'Warangal'],
  Tripura: ['Agartala'],
  'Uttar Pradesh': ['Lucknow', 'Noida', 'Ghaziabad', 'Kanpur', 'Varanasi'],
  Uttarakhand: ['Dehradun', 'Haridwar', 'Nainital'],
  'West Bengal': ['Kolkata', 'Darjeeling', 'Siliguri'],
};

const CONNECTIVITY_TYPES = [
  { label: 'Airport', value: 'Airport' },
  { label: 'Railway Station', value: 'Railway Station' },
  { label: 'Metro Station', value: 'Metro Station' },
  { label: 'Highway', value: 'Highway' },
  { label: 'Bus Station', value: 'Bus Station' },
  { label: 'Hospital', value: 'Hospital' },
  { label: 'School', value: 'School' },
  { label: 'Shopping Mall', value: 'Shopping Mall' },
  { label: 'Office Park', value: 'Office Park' },
];

interface LocationDetailsProps {
  onNext: (data: any) => void;
  onFormValid: (isValid: boolean) => void;
  initialData?: any;
}

const LocationDetails = forwardRef<any, LocationDetailsProps>(
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
      microMarket: initialData?.microMarket || '',
      city: initialData?.city || '',
      state: initialData?.state || '',
      connectivity: initialData?.connectivity || [
        { id: 1, type: '', name: '', distance: '' },
      ],
      demandDrivers: initialData?.demandDrivers || '',
      futureInfrastructure: initialData?.futureInfrastructure || '',
      faqs:
        initialData?.faqs ||
        ([] as { id: number; question: string; answer: string }[]),
    });

    const [errors, setErrors] = useState<any>({});
    const [touched, setTouched] = useState<any>({});

    useEffect(() => {
      const isValid = validateFormSilently();
      onFormValid(isValid);
    }, [formData]);

    const validateFormSilently = () => {
      return (
        formData.microMarket.trim() !== '' &&
        formData.city.trim() !== '' &&
        formData.state.trim() !== ''
      );
    };

    const validateField = (name: string, value: string) => {
      switch (name) {
        case 'microMarket':
          return !value?.trim() ? 'Micro Market is required' : '';
        case 'city':
          return !value?.trim() ? 'City is required' : '';
        case 'state':
          return !value?.trim() ? 'State is required' : '';
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

    const handleBlur = (name: string, value?: string) => {
      setTouched((prev: any) => ({ ...prev, [name]: true }));
      const valueToValidate =
        value !== undefined
          ? value
          : (formData[name as keyof typeof formData] as string);
      const error = validateField(name, valueToValidate);
      setErrors((prev: any) => ({ ...prev, [name]: error }));
    };

    const handleConnectivityChange = (
      id: number,
      field: string,
      value: string,
    ) => {
      setFormData(prev => ({
        ...prev,
        connectivity: prev.connectivity.map((item: any) =>
          item.id === id ? { ...item, [field]: value } : item,
        ),
      }));
    };

    const addConnectivity = () => {
      setFormData(prev => ({
        ...prev,
        connectivity: [
          ...prev.connectivity,
          { id: Date.now(), type: '', name: '', distance: '' },
        ],
      }));
    };

    const removeConnectivity = (id: number) => {
      setFormData(prev => ({
        ...prev,
        connectivity: prev.connectivity.filter((item: any) => item.id !== id),
      }));
    };

    const addFaq = () => {
      setFormData(prev => ({
        ...prev,
        faqs: [...prev.faqs, { id: Date.now(), question: '', answer: '' }],
      }));
    };

    const handleFaqChange = (id: number, field: string, value: string) => {
      setFormData(prev => ({
        ...prev,
        faqs: prev.faqs.map((faq: any) =>
          faq.id === id ? { ...faq, [field]: value } : faq,
        ),
      }));
    };

    const removeFaq = (id: number) => {
      setFormData(prev => ({
        ...prev,
        faqs: prev.faqs.filter((faq: any) => faq.id !== id),
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
          Location & Market Details
        </Text>

        <Text style={[styles.subHeader, isMobile && styles.subHeaderMobile]}>Location Details</Text>
        <View style={styles.fieldContainer}>
          <Text style={[styles.label, isMobile && styles.labelMobile]}>Micro Market *</Text>
          <TextInput
            style={[
              styles.input,
              isMobile && styles.inputMobile,
              touched.microMarket && errors.microMarket && styles.inputError,
            ]}
            placeholder="Enter Micro Market"
            value={formData.microMarket}
            onChangeText={v => handleInputChange('microMarket', v)}
            onBlur={(e: any) => handleBlur('microMarket', e.nativeEvent.text)}
          />
          {touched.microMarket && errors.microMarket && (
            <View style={styles.errorRow}>
              <AlertTriangle size={12} color="#EE2529" strokeWidth={3} />
              <Text style={styles.errorText}>{errors.microMarket}</Text>
            </View>
          )}
        </View>

        <View style={[styles.row, isSmallScreen && styles.rowColumn]}>
          <View style={styles.fieldContainer}>
            <Text style={[styles.label, isMobile && styles.labelMobile]}>State *</Text>
            <CustomDropdown
              placeholder="Select State"
              value={formData.state}
              options={INDIAN_STATES.map(s => ({ label: s, value: s }))}
              onChange={v => {
                handleInputChange('state', v);
                // Clear city when state changes
                handleInputChange('city', '');
                handleBlur('state', v);
              }}
              onBlur={() => handleBlur('state')}
              error={touched.state && !!errors.state}
              searchable
            />
            {touched.state && errors.state && (
              <View style={styles.errorRow}>
                <AlertTriangle size={12} color="#EE2529" strokeWidth={3} />
                <Text style={styles.errorText}>{errors.state}</Text>
              </View>
            )}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={[styles.label, isMobile && styles.labelMobile]}>City *</Text>
            <CustomDropdown
              placeholder="Select City"
              value={formData.city}
              options={
                formData.state && CITY_BY_STATE[formData.state]
                  ? CITY_BY_STATE[formData.state].map((c: string) => ({
                      label: c,
                      value: c,
                    }))
                  : []
              }
              onChange={v => {
                handleInputChange('city', v);
                handleBlur('city', v);
              }}
              onBlur={() => handleBlur('city')}
              error={touched.city && !!errors.city}
              searchable
            />
            {touched.city && errors.city && (
              <View style={styles.errorRow}>
                <AlertTriangle size={14} fill="#EE2529" color="#FFF" />
                <Text style={styles.errorText}>{errors.city}</Text>
              </View>
            )}
          </View>
        </View>

        <Text style={[styles.subHeader, isMobile && styles.subHeaderMobile]}>Connectivity Details</Text>
        {formData.connectivity.map((item: any, index: number) => (
          <View key={item.id} style={styles.connectivityCard}>
            <View style={styles.connectivityHeader}>
              <Text style={styles.itemNumber}>#{index + 1}</Text>
              {formData.connectivity.length > 1 && (
                <TouchableOpacity onPress={() => removeConnectivity(item.id)}>
                  <Trash2 size={18} color="#EE2529" />
                </TouchableOpacity>
              )}
            </View>
            <View style={[styles.row, isSmallScreen && styles.rowColumn]}>
              <View style={[styles.fieldContainer, { flex: 1.2 }]}>
                <Text style={[styles.labelSmall, isMobile && styles.labelSmallMobile]}>Type</Text>
                <CustomDropdown
                  placeholder="Select Type"
                  value={item.type}
                  options={CONNECTIVITY_TYPES}
                  onChange={v => handleConnectivityChange(item.id, 'type', v)}
                />
              </View>
              <View style={[styles.fieldContainer, { flex: 2 }]}>
                <Text style={[styles.labelSmall, isMobile && styles.labelSmallMobile]}>Name</Text>
                <TextInput
                  style={[styles.inputSmall, isMobile && styles.inputSmallMobile]}
                  placeholder="Enter Name"
                  value={item.name}
                  onChangeText={v =>
                    handleConnectivityChange(item.id, 'name', v)
                  }
                />
              </View>
              <View style={styles.fieldContainer}>
                <Text style={[styles.labelSmall, isMobile && styles.labelSmallMobile]}>Distance (KM)</Text>
                <TextInput
                  style={[styles.inputSmall, isMobile && styles.inputSmallMobile]}
                  placeholder="0"
                  keyboardType="numeric"
                  value={item.distance}
                  onChangeText={v =>
                    handleConnectivityChange(item.id, 'distance', v)
                  }
                />
              </View>
            </View>
          </View>
        ))}

        <View style={styles.centerWrapper}>
          <TouchableOpacity
            style={styles.gradientBtnWrapper}
            onPress={addConnectivity}
          >
            <LinearGradient
              colors={['#EE2529', '#C73834']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.addConnectivityBtn}
            >
              <Plus size={18} color="#FFF" />
              <Text style={[styles.addConnectivityBtnText, isMobile && styles.addConnectivityBtnTextMobile]}>Add Connectivity</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <Text style={[styles.subHeader, isMobile && styles.subHeaderMobile]}>Demand Drivers</Text>
        <View style={styles.fieldContainer}>
          <Text style={[styles.label, isMobile && styles.labelMobile]}>Key factors driving property demand</Text>
          <TextInput
            style={[styles.input, styles.textArea, isMobile && styles.inputMobile]}
            placeholder="e.g., Proximity to campuses"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            value={formData.demandDrivers}
            onChangeText={v => handleInputChange('demandDrivers', v)}
          />
        </View>

        <Text style={[styles.subHeader, isMobile && styles.subHeaderMobile]}>Future Infrastructure</Text>
        <View style={styles.fieldContainer}>
          <Text style={[styles.label, isMobile && styles.labelMobile]}>Upcoming developments and projects</Text>
          <TextInput
            style={[styles.input, styles.textArea, isMobile && styles.inputMobile]}
            placeholder="e.g., Upcoming Ring Road"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            value={formData.futureInfrastructure}
            onChangeText={v => handleInputChange('futureInfrastructure', v)}
          />
        </View>

        <Text style={[styles.subHeader, isMobile && styles.subHeaderMobile]}>Frequently Asked Questions</Text>
        {formData.faqs.map((faq: any, index: number) => (
          <View key={faq.id} style={styles.faqCard}>
            <View style={styles.faqHeader}>
              <Text style={styles.itemNumber}>FAQ #{index + 1}</Text>
              <TouchableOpacity onPress={() => removeFaq(faq.id)}>
                <Trash2 size={18} color="#EE2529" />
              </TouchableOpacity>
            </View>
            <View style={styles.fieldContainer}>
              <Text style={[styles.labelSmall, isMobile && styles.labelSmallMobile]}>Question</Text>
              <TextInput
                style={[styles.inputSmall, isMobile && styles.inputSmallMobile]}
                placeholder="Enter Question"
                value={faq.question}
                onChangeText={v => handleFaqChange(faq.id, 'question', v)}
              />
            </View>
            <View style={styles.fieldContainer}>
              <Text style={[styles.labelSmall, isMobile && styles.labelSmallMobile]}>Answer</Text>
              <TextInput
                style={[styles.inputSmall, isMobile && styles.inputSmallMobile, { height: 60, paddingTop: 8 }]}
                placeholder="Enter Answer"
                multiline
                textAlignVertical="top"
                value={faq.answer}
                onChangeText={v => handleFaqChange(faq.id, 'answer', v)}
              />
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.addOutlineBtn} onPress={addFaq}>
          <Plus size={18} color="#EE2529" />
          <Text style={[styles.addOutlineBtnText, isMobile && styles.addOutlineBtnTextMobile]}>Add FAQ</Text>
        </TouchableOpacity>

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
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    fontFamily: 'Montserrat',
  },
  labelSmallMobile: {
    fontSize: 12,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
    paddingLeft: 12,
  },
  errorIcon: {
    color: '#EE2529',
    fontSize: 10,
    fontWeight: '700',
  },
  errorText: {
    color: '#EE2529',
    fontSize: 13,
    fontWeight: '500',
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
  inputSmall: {
    backgroundColor: '#FFF',
    height: 40,
    borderRadius: 6,
    paddingHorizontal: 8,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    fontFamily: 'Montserrat',
  },
  inputSmallMobile: {
    fontSize: 13,
  },
  inputIcon: {
    position: 'absolute',
    right: 12,
  },
  textArea: {
    height: 80,
    paddingTop: 12,
  },
  connectivityCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  connectivityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  faqCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  itemNumber: {
    fontSize: 12,
    fontWeight: '700',
    color: '#999',
    fontFamily: 'Montserrat',
  },
  addOutlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 44,
    borderWidth: 1,
    borderColor: '#EE2529',
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 24,
  },
  addOutlineBtnText: {
    color: '#EE2529',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Montserrat',
  },
  addOutlineBtnTextMobile: {
    fontSize: 14,
  },
  centerWrapper: {
    alignItems: 'center',
    width: '100%',
    marginVertical: 16,
  },
  gradientBtnWrapper: {
    width: '30%',
    minWidth: 150,
  },
  addConnectivityBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    borderRadius: 8,
  },
  addConnectivityBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Montserrat',
  },
  addConnectivityBtnTextMobile: {
    fontSize: 12,
  },
});

export default LocationDetails;
