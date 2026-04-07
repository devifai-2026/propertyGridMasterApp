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
  Platform,
  useWindowDimensions,
} from 'react-native';
import { Upload, AlertTriangle } from 'lucide-react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import CustomDropdown from './CustomDropdown';
import CustomMultiSelect from './CustomMultiSelect';
import { usePropertyAPIs } from '../../../../helpers/hooks/propertyAPIs/usePropertyApis';

interface BasicDetailsProps {
  onNext: (data: any) => void;
  onFormValid: (isValid: boolean) => void;
  initialData?: any;
}

const BasicDetails = forwardRef<any, BasicDetailsProps>(
  ({ onNext, onFormValid, initialData }, ref) => {
    const { width } = useWindowDimensions();
    const isSmallScreen = width < 768;
    const { getAmenities, getCaretakers } = usePropertyAPIs();

    useImperativeHandle(ref, () => ({
      submit: () => {
        onNext({ ...formData, mediaFiles });
      },
    }));

    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: 31 }, (_, i) => ({
      label: (currentYear - i).toString(),
      value: (currentYear - i).toString(),
    }));

    const propertyTypeOptions = [
      { label: 'Residential', value: 'Residential' },
      { label: 'Retail', value: 'Retail' },
      { label: 'Offices', value: 'Offices' },
      { label: 'Industrial', value: 'Industrial' },
      { label: 'Others', value: 'Others' },
    ];

    const buildingGradeOptions = [
      { label: 'Grade A+', value: 'A+' },
      { label: 'Grade A', value: 'A' },
      { label: 'Grade B+', value: 'B+' },
      { label: 'Grade B', value: 'B' },
      { label: 'Grade C', value: 'C' },
    ];

    const ownershipOptions = [
      { label: 'Freehold', value: 'Freehold' },
      { label: 'Leasehold', value: 'Leasehold' },
      { label: 'Jointly-hold', value: 'Jointly-hold' },
      { label: 'Government Owned', value: 'Government Owned' },
    ];

    const furnishingOptions = [
      {
        label: 'Fully Furnished by landowner',
        value: 'Fully Furnished by landowner',
      },
      {
        label: 'Semi-Furnished by landowner',
        value: 'Semi-Furnished by landowner',
      },
      {
        label: 'Not Furnished by landowner',
        value: 'Not Furnished by landowner',
      },
    ];

    const powerBackupOptions = [
      { label: 'Yes', value: 'Yes' },
      { label: 'No', value: 'No' },
    ];

    const hvacOptions = [
      { label: 'Central AC', value: 'Central AC' },
      { label: 'Split AC', value: 'Split AC' },
      { label: 'VRF System', value: 'VRF System' },
      { label: 'Chilled Water System', value: 'Chilled Water System' },
      { label: 'None', value: 'None' },
    ];

    const [amenityOptions, setAmenityOptions] = useState<any[]>([]);
    const [caretakerOptions, setCaretakerOptions] = useState<any[]>([]);

    useEffect(() => {
      getAmenities(data => {
        if (Array.isArray(data)) {
          const options = data.map((a: any) => ({
            label: a.amenityName,
            value: a.amenityId,
          }));
          setAmenityOptions(options);
        }
      });
      getCaretakers(data => {
        if (Array.isArray(data)) {
          const options = data.map((c: any) => ({
            label: c.caretakerName,
            value: String(c.caretakerId),
          })); // Convert to string for Dropdown
          setCaretakerOptions(options);
        }
      });
    }, []);

    const [formData, setFormData] = useState({
      propertyType: initialData?.propertyType || '',
      builtYear: initialData?.builtYear || '',
      buildingGrade: initialData?.buildingGrade || '',
      carpetArea: initialData?.carpetArea || '',
      carpetAreaUnit: initialData?.carpetAreaUnit || 'sqft',
      lastRefurbished: initialData?.lastRefurbished || '',
      ownership: initialData?.ownership || '',
      fourWheelerParkings: initialData?.fourWheelerParkings || '',
      twoWheelerParkings: initialData?.twoWheelerParkings || '',
      powerBackup: initialData?.powerBackup || '',
      numLifts: initialData?.numLifts || '',
      hvacType: initialData?.hvacType || '',
      furnishingStatus: initialData?.furnishingStatus || '',
      buildingMaintained: initialData?.buildingMaintained || '',
      amenityIds: initialData?.amenityIds || ([] as (string | number)[]),
      propertyDescription: initialData?.propertyDescription || '',
    });

    const [mediaFiles, setMediaFiles] = useState<any[]>(
      initialData?.mediaFiles || [],
    );

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

    const validateField = (name: string, value: string) => {
      switch (name) {
        case 'propertyType':
          return !value ? 'Property Type is required' : '';
        case 'builtYear':
          if (!value) return 'Completion Year is required';
          if (!/^\d{4}$/.test(value)) return 'Please enter a valid year';
          const year = parseInt(value);
          if (year < 1900 || year > currentYear)
            return `Year must be between 1900 and ${currentYear}`;
          return '';
        case 'buildingGrade':
          return !value ? 'Building Grade is required' : '';
        case 'carpetArea':
          if (!value) return 'Carpet Area is required';
          if (!/^\d+$/.test(value) || parseInt(value) <= 0)
            return 'Please enter a valid area';
          return '';
        case 'ownership':
          return !value ? 'Ownership is required' : '';
        case 'fourWheelerParkings':
          if (!value) return '4 Wheeler Parkings is required';
          if (!/^\d+$/.test(value)) return 'Please enter a valid number';
          return '';
        case 'twoWheelerParkings':
          if (!value) return '2 Wheeler Parkings is required';
          if (!/^\d+$/.test(value)) return 'Please enter a valid number';
          return '';
        case 'furnishingStatus':
          return !value ? 'Furnishing Status is required' : '';
        default:
          return '';
      }
    };

    const handleInputChange = (name: string, value: any) => {
      setFormData(prev => ({ ...prev, [name]: value }));

      if (touched[name]) {
        // cast value to string for validation if needed, though most fields needing validation are strings
        const error = validateField(name, String(value));
        setErrors((prev: any) => ({ ...prev, [name]: error }));
      }
    };

    const handleBlur = (name: string, value?: string) => {
      setTouched((prev: any) => ({ ...prev, [name]: true }));
      const valueToValidate =
        value !== undefined
          ? value
          : String(formData[name as keyof typeof formData]);
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
          Property Overview and Basic Details
        </Text>

        <Text style={styles.subHeader}>Basic Property Details</Text>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Property Type *</Text>
          <CustomDropdown
            placeholder="Select Property Type"
            value={formData.propertyType}
            options={propertyTypeOptions}
            onChange={v => {
              handleInputChange('propertyType', v);
              handleBlur('propertyType', v);
            }}
            onBlur={() => handleBlur('propertyType')}
            error={touched.propertyType && !!errors.propertyType}
          />
          {touched.propertyType && errors.propertyType && (
            <View style={styles.errorRow}>
              <AlertTriangle size={14} fill="#EE2529" color="#FFF" />
              <Text style={styles.errorText}>{errors.propertyType}</Text>
            </View>
          )}
        </View>

        <View style={[styles.row, isSmallScreen && styles.rowColumn]}>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Carpet Area *</Text>
            <View style={styles.areaInputGroup}>
              <TextInput
                style={[
                  styles.input,
                  { flex: 1 },
                  touched.carpetArea && errors.carpetArea && styles.inputError,
                ]}
                placeholder="Area"
                keyboardType="numeric"
                value={formData.carpetArea}
                onChangeText={v => handleInputChange('carpetArea', v)}
                onBlur={(e: any) =>
                  handleBlur('carpetArea', e.nativeEvent.text)
                }
              />
              <View style={styles.unitSelector}>
                <Text style={styles.unitText}>Sq. Ft.</Text>
              </View>
            </View>
            {touched.carpetArea && errors.carpetArea && (
              <View style={styles.errorRow}>
                <AlertTriangle size={14} fill="#EE2529" color="#FFF" />
                <Text style={styles.errorText}>{errors.carpetArea}</Text>
              </View>
            )}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Completion Year *</Text>
            <TextInput
              style={[
                styles.input,
                touched.builtYear && errors.builtYear && styles.inputError,
              ]}
              placeholder="Year"
              keyboardType="numeric"
              value={formData.builtYear}
              onChangeText={v => handleInputChange('builtYear', v)}
              onBlur={(e: any) => handleBlur('builtYear', e.nativeEvent.text)}
            />
            {touched.builtYear && errors.builtYear && (
              <View style={styles.errorRow}>
                <AlertTriangle size={14} fill="#EE2529" color="#FFF" />
                <Text style={styles.errorText}>{errors.builtYear}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={[styles.row, isSmallScreen && styles.rowColumn]}>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Building Grade *</Text>
            <CustomDropdown
              placeholder="Select Grade"
              value={formData.buildingGrade}
              options={buildingGradeOptions}
              onChange={v => {
                handleInputChange('buildingGrade', v);
                handleBlur('buildingGrade', v);
              }}
              onBlur={() => handleBlur('buildingGrade')}
              error={touched.buildingGrade && !!errors.buildingGrade}
            />
            {touched.buildingGrade && errors.buildingGrade && (
              <View style={styles.errorRow}>
                <AlertTriangle size={14} fill="#EE2529" color="#FFF" />
                <Text style={styles.errorText}>{errors.buildingGrade}</Text>
              </View>
            )}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Ownership *</Text>
            <CustomDropdown
              placeholder="Select Ownership"
              value={formData.ownership}
              options={ownershipOptions}
              onChange={v => {
                handleInputChange('ownership', v);
                handleBlur('ownership', v);
              }}
              onBlur={() => handleBlur('ownership')}
              error={touched.ownership && !!errors.ownership}
            />
            {touched.ownership && errors.ownership && (
              <View style={styles.errorRow}>
                <AlertTriangle size={14} fill="#EE2529" color="#FFF" />
                <Text style={styles.errorText}>{errors.ownership}</Text>
              </View>
            )}
          </View>
        </View>

        <Text style={styles.subHeader}>Parking Details</Text>
        <View style={[styles.row, isSmallScreen && styles.rowColumn]}>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>4 Wheeler Parkings *</Text>
            <TextInput
              style={[
                styles.input,
                touched.fourWheelerParkings &&
                  errors.fourWheelerParkings &&
                  styles.inputError,
              ]}
              placeholder="Slots"
              keyboardType="numeric"
              value={formData.fourWheelerParkings}
              onChangeText={v => handleInputChange('fourWheelerParkings', v)}
              onBlur={(e: any) =>
                handleBlur('fourWheelerParkings', e.nativeEvent.text)
              }
            />
            {touched.fourWheelerParkings && errors.fourWheelerParkings && (
              <View style={styles.errorRow}>
                <AlertTriangle size={14} fill="#EE2529" color="#FFF" />
                <Text style={styles.errorText}>{errors.fourWheelerParkings}</Text>
              </View>
            )}
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>2 Wheeler Parkings *</Text>
            <TextInput
              style={[
                styles.input,
                touched.twoWheelerParkings &&
                  errors.twoWheelerParkings &&
                  styles.inputError,
              ]}
              placeholder="Slots"
              keyboardType="numeric"
              value={formData.twoWheelerParkings}
              onChangeText={v => handleInputChange('twoWheelerParkings', v)}
              onBlur={(e: any) =>
                handleBlur('twoWheelerParkings', e.nativeEvent.text)
              }
            />
            {touched.twoWheelerParkings && errors.twoWheelerParkings && (
              <View style={styles.errorRow}>
                <AlertTriangle size={14} fill="#EE2529" color="#FFF" />
                <Text style={styles.errorText}>{errors.twoWheelerParkings}</Text>
              </View>
            )}
          </View>
        </View>

        <Text style={styles.subHeader}>Infrastructure</Text>
        <View style={[styles.row, isSmallScreen && styles.rowColumn]}>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Furnishing Status *</Text>
            <CustomDropdown
              placeholder="Select Status"
              value={formData.furnishingStatus}
              options={furnishingOptions}
              onChange={v => {
                handleInputChange('furnishingStatus', v);
                handleBlur('furnishingStatus', v);
              }}
              onBlur={() => handleBlur('furnishingStatus')}
              error={touched.furnishingStatus && !!errors.furnishingStatus}
            />
            {touched.furnishingStatus && errors.furnishingStatus && (
              <View style={styles.errorRow}>
                <AlertTriangle size={14} fill="#EE2529" color="#FFF" />
                <Text style={styles.errorText}>{errors.furnishingStatus}</Text>
              </View>
            )}
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

        <Text style={styles.subHeader}>
          Building Amenities & Infrastructure
        </Text>
        {/* Amenities Multi-Select */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Amenities</Text>
          <CustomMultiSelect
            placeholder="Select Amenities"
            value={formData.amenityIds}
            options={amenityOptions}
            onChange={v => handleInputChange('amenityIds', v)}
          />
        </View>

        <View style={[styles.row, isSmallScreen && styles.rowColumn]}>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Power Backup</Text>
            <CustomDropdown
              placeholder="Select Power Backup"
              value={formData.powerBackup}
              options={powerBackupOptions}
              onChange={v => {
                handleInputChange('powerBackup', v);
                handleBlur('powerBackup', v);
              }}
              onBlur={() => handleBlur('powerBackup')}
              error={touched.powerBackup && !!errors.powerBackup}
            />
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>HVAC Type</Text>
            <CustomDropdown
              placeholder="Select HVAC Type"
              value={formData.hvacType}
              options={hvacOptions}
              onChange={v => {
                handleInputChange('hvacType', v);
                handleBlur('hvacType', v);
              }}
              onBlur={() => handleBlur('hvacType')}
              error={touched.hvacType && !!errors.hvacType}
            />
          </View>
        </View>

        <View style={[styles.row, isSmallScreen && styles.rowColumn]}>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Building Maintained By</Text>
            <CustomDropdown
              placeholder="Select Building Maintenance"
              value={formData.buildingMaintained}
              options={caretakerOptions}
              onChange={v => {
                handleInputChange('buildingMaintained', v);
                handleBlur('buildingMaintained', v);
              }}
              onBlur={() => handleBlur('buildingMaintained')}
              error={touched.buildingMaintained && !!errors.buildingMaintained}
              searchable
            />
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Last Refurbished</Text>
            <CustomDropdown
              placeholder="Select Year"
              value={formData.lastRefurbished}
              options={yearOptions}
              onChange={v => {
                handleInputChange('lastRefurbished', v);
                handleBlur('lastRefurbished', v);
              }}
              onBlur={() => handleBlur('lastRefurbished')}
              error={touched.lastRefurbished && !!errors.lastRefurbished}
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

        <TouchableOpacity
          style={styles.uploadBox}
          onPress={async () => {
            if (Platform.OS === 'web') {
              const domDocument = (globalThis as any).document;
              const input = domDocument.createElement('input');
              input.type = 'file';
              input.multiple = true;
              input.accept = 'image/*,video/*';
              input.onchange = (event: any) => {
                if (event.target.files) {
                  const files = Array.from(event.target.files).map(
                    (file: any) => ({
                      uri: URL.createObjectURL(file), // create temporary URL for preview
                      fileName: file.name,
                      type: file.type,
                      fileSize: file.size,
                      fileObject: file, // Store original file for web upload logic
                    }),
                  );
                  setMediaFiles(files);
                }
              };
              input.click();
            } else {
              try {
                const result = await launchImageLibrary({
                  mediaType: 'mixed',
                  selectionLimit: 5,
                });
                if (result.assets) {
                  setMediaFiles(result.assets);
                }
              } catch (error) {
                console.error('Image picker error:', error);
              }
            }
          }}
        >
          <Upload
            size={32}
            color={mediaFiles.length > 0 ? '#EE2529' : '#999'}
          />
          <Text style={styles.uploadText}>
            {mediaFiles.length > 0
              ? `${mediaFiles.length} file(s) selected`
              : 'Upload Photos / Videos'}
          </Text>
          <Text style={styles.uploadSubtext}>Max 10MB each</Text>
        </TouchableOpacity>
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
    fontSize: 20,
    fontWeight: '600',
    color: '#444',
    marginBottom: 6,
    fontFamily: 'Montserrat',
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
    fontFamily: 'Montserrat',
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
  inputError: {
    borderColor: '#EE2529',
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
    fontSize: 16,
    color: '#666',
    fontFamily: 'Montserrat',
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
    fontFamily: 'Montserrat',
  },
  uploadSubtext: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    fontFamily: 'Montserrat',
  },
});

export default BasicDetails;
