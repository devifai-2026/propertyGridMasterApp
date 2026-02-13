import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { ChevronDown, Info, Upload, FileText, X } from 'lucide-react-native';

interface BasicDetailsProps {
  onNext: (data: any) => void;
  onFormValid: (isValid: boolean) => void;
}

const BasicDetails: React.FC<BasicDetailsProps> = ({ onNext, onFormValid }) => {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 768;

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 31 }, (_, i) =>
    (currentYear - i).toString(),
  );

  const buildingMaintenanceOptions = [
    'CBRE',
    'JLL',
    'Colliers',
    'Cushman & Wakefield',
    'In-house',
    'Owner',
  ];

  const [formData, setFormData] = useState({
    propertyType: '',
    builtYear: '',
    buildingGrade: '',
    carpetArea: '',
    carpetAreaUnit: 'sqft',
    lastRefurbished: '',
    ownership: '',
    fourWheelerParkings: '',
    twoWheelerParkings: '',
    powerBackup: '',
    numLifts: '',
    hvacType: '',
    furnishingStatus: '',
    buildingMaintained: '',
    keyAmenities: [] as string[],
    propertyDescription: '',
  });

  const [errors, setErrors] = useState<any>({});
  const [touched, setTouched] = useState<any>({});

  useEffect(() => {
    const isValid = validateFormSilently();
    onFormValid(isValid);
  }, [formData]);

  const validateFormSilently = () => {
    return (
      formData.propertyType !== '' &&
      formData.builtYear !== '' &&
      formData.buildingGrade !== '' &&
      formData.carpetArea !== '' &&
      formData.ownership !== '' &&
      formData.fourWheelerParkings !== '' &&
      formData.twoWheelerParkings !== '' &&
      formData.furnishingStatus !== ''
    );
  };

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={[styles.sectionTitle, isSmallScreen && styles.sectionTitleMobile]}>
        Property Overview and Basic Details
      </Text>

      <Text style={styles.subHeader}>Basic Property Details</Text>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Property Type *</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Select Property Type"
            value={formData.propertyType}
            onChangeText={v => handleInputChange('propertyType', v)}
          />
          <ChevronDown size={20} color="#999" style={styles.inputIcon} />
        </View>
      </View>

      <View style={[styles.row, isSmallScreen && styles.rowColumn]}>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Carpet Area *</Text>
          <View style={styles.areaInputGroup}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Area"
              keyboardType="numeric"
              value={formData.carpetArea}
              onChangeText={v => handleInputChange('carpetArea', v)}
            />
            <View style={styles.unitSelector}>
              <Text style={styles.unitText}>Sq. Ft.</Text>
            </View>
          </View>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Completion Year *</Text>
          <TextInput
            style={styles.input}
            placeholder="Year"
            keyboardType="numeric"
            value={formData.builtYear}
            onChangeText={v => handleInputChange('builtYear', v)}
          />
        </View>
      </View>

      <View style={[styles.row, isSmallScreen && styles.rowColumn]}>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Building Grade *</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Select Grade"
              value={formData.buildingGrade}
              onChangeText={v => handleInputChange('buildingGrade', v)}
            />
            <ChevronDown size={20} color="#999" style={styles.inputIcon} />
          </View>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Ownership *</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Select Ownership"
              value={formData.ownership}
              onChangeText={v => handleInputChange('ownership', v)}
            />
            <ChevronDown size={20} color="#999" style={styles.inputIcon} />
          </View>
        </View>
      </View>

      <Text style={styles.subHeader}>Parking Details</Text>
      <View style={[styles.row, isSmallScreen && styles.rowColumn]}>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>4 Wheeler Parkings *</Text>
          <TextInput
            style={styles.input}
            placeholder="Slots"
            keyboardType="numeric"
            value={formData.fourWheelerParkings}
            onChangeText={v => handleInputChange('fourWheelerParkings', v)}
          />
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>2 Wheeler Parkings *</Text>
          <TextInput
            style={styles.input}
            placeholder="Slots"
            keyboardType="numeric"
            value={formData.twoWheelerParkings}
            onChangeText={v => handleInputChange('twoWheelerParkings', v)}
          />
        </View>
      </View>

      <Text style={styles.subHeader}>Infrastructure</Text>
      <View style={[styles.row, isSmallScreen && styles.rowColumn]}>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Furnishing Status *</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Select Status"
              value={formData.furnishingStatus}
              onChangeText={v => handleInputChange('furnishingStatus', v)}
            />
            <ChevronDown size={20} color="#999" style={styles.inputIcon} />
          </View>
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Number of Lifts</Text>
          <TextInput
            style={styles.input}
            placeholder="0"
            keyboardType="numeric"
            value={formData.numLifts}
            onChangeText={v => handleInputChange('numLifts', v)}
          />
        </View>
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Property Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Describe your property..."
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          value={formData.propertyDescription}
          onChangeText={v => handleInputChange('propertyDescription', v)}
        />
      </View>

      <View style={styles.uploadBox}>
        <Upload size={32} color="#999" />
        <Text style={styles.uploadText}>Upload Photos / Videos</Text>
        <Text style={styles.uploadSubtext}>Max 10MB each</Text>
      </View>
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
  areaInputGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  unitSelector: {
    width: 80,
    backgroundColor: '#F2F2F2',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    height: 44,
  },
  unitText: {
    fontSize: 13,
    color: '#666',
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  uploadBox: {
    borderWidth: 2,
    borderColor: '#EEE',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAFAFA',
    marginTop: 8,
    marginBottom: 40,
  },
  uploadText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginTop: 8,
  },
  uploadSubtext: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
});

export default BasicDetails;
