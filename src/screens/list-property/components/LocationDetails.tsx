import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { ChevronDown, Plus, X, Trash2 } from 'lucide-react-native';

interface LocationDetailsProps {
  onNext: (data: any) => void;
  onFormValid: (isValid: boolean) => void;
}

const LocationDetails: React.FC<LocationDetailsProps> = ({
  onNext,
  onFormValid,
}) => {
  const [formData, setFormData] = useState({
    microMarket: '',
    city: '',
    state: '',
    connectivity: [{ id: 1, type: '', name: '', distance: '' }],
    demandDrivers: '',
    futureInfrastructure: '',
    faqs: [] as { id: number; question: string; answer: string }[],
  });

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

  const handleInputChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleConnectivityChange = (
    id: number,
    field: string,
    value: string,
  ) => {
    setFormData(prev => ({
      ...prev,
      connectivity: prev.connectivity.map(item =>
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
      connectivity: prev.connectivity.filter(item => item.id !== id),
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
      faqs: prev.faqs.map(faq =>
        faq.id === id ? { ...faq, [field]: value } : faq,
      ),
    }));
  };

  const removeFaq = (id: number) => {
    setFormData(prev => ({
      ...prev,
      faqs: prev.faqs.filter(faq => faq.id !== id),
    }));
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Location & Market Details</Text>

      <Text style={styles.subHeader}>Location Details</Text>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Micro Market *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Micro Market"
          value={formData.microMarket}
          onChangeText={v => handleInputChange('microMarket', v)}
        />
      </View>

      <View style={styles.row}>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>State *</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Select State"
              value={formData.state}
              onChangeText={v => handleInputChange('state', v)}
            />
            <ChevronDown size={20} color="#999" style={styles.inputIcon} />
          </View>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>City *</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Select City"
              value={formData.city}
              onChangeText={v => handleInputChange('city', v)}
            />
            <ChevronDown size={20} color="#999" style={styles.inputIcon} />
          </View>
        </View>
      </View>

      <Text style={styles.subHeader}>Connectivity Details</Text>
      {formData.connectivity.map((item, index) => (
        <View key={item.id} style={styles.connectivityCard}>
          <View style={styles.connectivityHeader}>
            <Text style={styles.itemNumber}>#{index + 1}</Text>
            {formData.connectivity.length > 1 && (
              <TouchableOpacity onPress={() => removeConnectivity(item.id)}>
                <Trash2 size={18} color="#EE2529" />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.labelSmall}>Type</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.inputSmall}
                placeholder="Airport, Railway..."
                value={item.type}
                onChangeText={v => handleConnectivityChange(item.id, 'type', v)}
              />
              <ChevronDown size={16} color="#999" style={styles.inputIcon} />
            </View>
          </View>
          <View style={styles.row}>
            <View style={[styles.fieldContainer, { flex: 2 }]}>
              <Text style={styles.labelSmall}>Name</Text>
              <TextInput
                style={styles.inputSmall}
                placeholder="Enter Name"
                value={item.name}
                onChangeText={v => handleConnectivityChange(item.id, 'name', v)}
              />
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.labelSmall}>Distance (KM)</Text>
              <TextInput
                style={styles.inputSmall}
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

      <TouchableOpacity style={styles.addOutlineBtn} onPress={addConnectivity}>
        <Plus size={18} color="#EE2529" />
        <Text style={styles.addOutlineBtnText}>Add Connectivity</Text>
      </TouchableOpacity>

      <Text style={styles.subHeader}>Demand Drivers</Text>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Key factors driving property demand</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="e.g., Proximity to campuses"
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          value={formData.demandDrivers}
          onChangeText={v => handleInputChange('demandDrivers', v)}
        />
      </View>

      <Text style={styles.subHeader}>Future Infrastructure</Text>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Upcoming developments and projects</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="e.g., Upcoming Ring Road"
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          value={formData.futureInfrastructure}
          onChangeText={v => handleInputChange('futureInfrastructure', v)}
        />
      </View>

      <Text style={styles.subHeader}>Frequently Asked Questions</Text>
      {formData.faqs.map((faq, index) => (
        <View key={faq.id} style={styles.faqCard}>
          <View style={styles.faqHeader}>
            <Text style={styles.itemNumber}>FAQ #{index + 1}</Text>
            <TouchableOpacity onPress={() => removeFaq(faq.id)}>
              <Trash2 size={18} color="#EE2529" />
            </TouchableOpacity>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.labelSmall}>Question</Text>
            <TextInput
              style={styles.inputSmall}
              placeholder="Enter Question"
              value={faq.question}
              onChangeText={v => handleFaqChange(faq.id, 'question', v)}
            />
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.labelSmall}>Answer</Text>
            <TextInput
              style={[styles.inputSmall, { height: 60, paddingTop: 8 }]}
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
        <Text style={styles.addOutlineBtnText}>Add FAQ</Text>
      </TouchableOpacity>

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
    color: '#666',
    marginBottom: 4,
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
  inputSmall: {
    backgroundColor: '#FFF',
    height: 40,
    borderRadius: 6,
    paddingHorizontal: 8,
    fontSize: 13,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
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
    fontSize: 14,
    fontWeight: '600',
  },
});

export default LocationDetails;
