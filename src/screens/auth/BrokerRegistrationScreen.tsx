import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  useWindowDimensions,
  ActivityIndicator,
  Image,
  Platform,
} from 'react-native';
import Layout from '../../layout/Layout';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '../../context/NavigationContext';
import { apiCall } from '../../../helpers/api/apiCall';
import { getHeaders } from '../../../helpers/api/headers';
import { BASE_URL } from '../../../helpers/environments';
import { COLORS } from '../../constants/theme';

const SPECIALIZATION_OPTIONS = [
  'MNC Client',
  'Industrial',
  'Residential',
  'Commercial',
  'Office Lease',
];

declare const document: any;

const BrokerRegistrationScreen = () => {
  const { user, updateUser } = useAuth();
  const { navigate } = useNavigation();
  const { width } = useWindowDimensions();
  const isSmallMobile = width < 400;
  const fileInputRef = useRef<any>(null);

  const [companyName, setCompanyName] = useState('');
  const [locality, setLocality] = useState('');
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [dealsClosed, setDealsClosed] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Profile photo state
  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null);

  const fullName = user
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
    : '';

  const toggleSpecialization = (item: string) => {
    setSpecializations(prev =>
      prev.includes(item) ? prev.filter(s => s !== item) : [...prev, item],
    );
  };

  const isValid = () =>
    locality.trim() !== '' &&
    specializations.length > 0 &&
    dealsClosed.trim() !== '';

  // Opens the hidden file input (web only)
  const handlePickPhoto = () => {
    if (Platform.OS === 'web' && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: any) => {
    const file: File = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      Alert.alert('Invalid file', 'Only JPG, PNG, and WEBP images are allowed.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      Alert.alert('File too large', 'Please select an image under 5 MB.');
      return;
    }

    setProfilePhotoFile(file);
    setProfilePhotoPreview(URL.createObjectURL(file));
    // Reset the input so the same file can be re-selected if needed
    e.target.value = '';
  };

  const handleSubmit = async () => {
    if (!isValid()) {
      Alert.alert(
        'Incomplete Form',
        'Please fill in Locality, select at least one Specialization, and enter Deals Closed.',
      );
      return;
    }

    setLoading(true);
    try {
      const headers = await getHeaders();
      // Remove Content-Type so the browser sets it with the correct multipart boundary
      delete (headers as any)['Content-Type'];

      const formData = new FormData();
      if (companyName.trim()) formData.append('companyName', companyName.trim());
      formData.append('locality', locality.trim());
      formData.append('specializations', JSON.stringify(specializations));
      formData.append('dealsClosed', String(parseInt(dealsClosed) || 0));
      if (profilePhotoFile) {
        formData.append('profilePhoto', profilePhotoFile);
      }

      const response = await fetch(`${BASE_URL}/v1/brokers/profile`, {
        method: 'POST',
        headers: headers as any,
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        if (data.data?.profilePhoto) {
          await updateUser({ profilePhoto: data.data.profilePhoto });
        }
        if (Platform.OS === 'web') {
          (globalThis as any).alert('Your broker profile has been submitted. An admin will verify your account shortly.');
          navigate('/');
          (globalThis as any).window?.location.reload();
        } else {
          Alert.alert(
            'Profile Saved',
            'Your broker profile has been submitted. An admin will verify your account shortly.',
            [{ text: 'OK', onPress: () => navigate('/') }],
          );
        }
      } else {
        if (Platform.OS === 'web') {
          (globalThis as any).alert(data.message || 'Failed to save profile');
        } else {
          Alert.alert('Error', data.message || 'Failed to save profile');
        }
      }
    } catch (err: any) {
      if (Platform.OS === 'web') {
        (globalThis as any).alert(err?.message || 'Something went wrong');
      } else {
        Alert.alert('Error', err?.message || 'Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.headerBanner}>
            <Text style={styles.headerTitle}>Broker Registration</Text>
            <Text style={styles.headerSubtitle}>
              Join our network of trusted real estate professionals
            </Text>
          </View>

          <View style={styles.card}>
            {/* ── Personal Details ── */}
            <Text style={styles.sectionTitle}>Personal Details</Text>

            {/* Profile Photo */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Profile Photo</Text>
              <TouchableOpacity
                style={styles.photoUploadBox}
                onPress={handlePickPhoto}
                activeOpacity={0.75}
              >
                {profilePhotoPreview ? (
                  <Image
                    source={{ uri: profilePhotoPreview }}
                    style={styles.photoPreview}
                  />
                ) : (
                  <View style={styles.photoPlaceholder}>
                    <Text style={styles.photoUploadIcon}>↑</Text>
                    <Text style={styles.photoUploadText}>Upload{'\n'}Photo</Text>
                  </View>
                )}
              </TouchableOpacity>
              {profilePhotoPreview && (
                <TouchableOpacity
                  onPress={() => {
                    setProfilePhotoFile(null);
                    setProfilePhotoPreview(null);
                  }}
                  style={styles.removePhotoBtn}
                >
                  <Text style={styles.removePhotoText}>Remove photo</Text>
                </TouchableOpacity>
              )}
              {/* Hidden file input — web only */}
              {Platform.OS === 'web' && (
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
              )}
            </View>

            <View style={[styles.row, isSmallMobile && styles.rowStack]}>
              <View style={[styles.inputGroup, !isSmallMobile && styles.halfWidth]}>
                <Text style={styles.inputLabel}>Full Name *</Text>
                <View style={[styles.textInput, styles.readOnlyInput]}>
                  <Text style={styles.readOnlyText}>{fullName || '—'}</Text>
                </View>
              </View>

              <View style={[styles.inputGroup, !isSmallMobile && styles.halfWidth]}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <View style={[styles.textInput, styles.readOnlyInput]}>
                  <Text style={styles.readOnlyText}>{user?.email || '—'}</Text>
                </View>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone Number *</Text>
              <View style={[styles.textInput, styles.readOnlyInput]}>
                <Text style={styles.readOnlyText}>
                  {user?.mobileNumber
                    ? `+91 ${user.mobileNumber}`
                    : user?.mobile
                    ? `+91 ${user.mobile}`
                    : '—'}
                </Text>
              </View>
            </View>

            {/* ── Business Details ── */}
            <Text style={[styles.sectionTitle, { marginTop: 8 }]}>Business Details</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Company Associated with</Text>
              <TextInput
                style={[
                  styles.textInput,
                  focusedField === 'company' && styles.textInputFocused,
                ]}
                placeholder="Enter company"
                placeholderTextColor={COLORS.textSecondary}
                value={companyName}
                onChangeText={setCompanyName}
                onFocus={() => setFocusedField('company')}
                onBlur={() => setFocusedField(null)}
              />
            </View>

            <View style={[styles.row, isSmallMobile && styles.rowStack]}>
              <View style={[styles.inputGroup, !isSmallMobile && styles.halfWidth]}>
                <Text style={styles.inputLabel}>RERA Registration Number</Text>
                <View style={[styles.textInput, styles.readOnlyInput]}>
                  <Text style={styles.readOnlyText}>
                    {(user as any)?.reraNumber || 'Not provided'}
                  </Text>
                </View>
              </View>

              <View style={[styles.inputGroup, !isSmallMobile && styles.halfWidth]}>
                <Text style={styles.inputLabel}>Locality *</Text>
                <TextInput
                  style={[
                    styles.textInput,
                    focusedField === 'locality' && styles.textInputFocused,
                  ]}
                  placeholder="Enter city of operation"
                  placeholderTextColor={COLORS.textSecondary}
                  value={locality}
                  onChangeText={setLocality}
                  onFocus={() => setFocusedField('locality')}
                  onBlur={() => setFocusedField(null)}
                />
              </View>
            </View>

            {/* ── Professional Information ── */}
            <Text style={[styles.sectionTitle, { marginTop: 8 }]}>Professional Information</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Specializations *</Text>
              {specializations.length === 0 && (
                <Text style={styles.specializationHint}>
                  Note: Select at least one property type you specialize in
                </Text>
              )}
              <View style={styles.tagsContainer}>
                {SPECIALIZATION_OPTIONS.map(item => {
                  const selected = specializations.includes(item);
                  return (
                    <TouchableOpacity
                      key={item}
                      onPress={() => toggleSpecialization(item)}
                      style={[styles.tag, selected && styles.tagSelected]}
                    >
                      <Text style={[styles.tagText, selected && styles.tagTextSelected]}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Deals Closed *</Text>
              <TextInput
                style={[
                  styles.textInput,
                  focusedField === 'deals' && styles.textInputFocused,
                ]}
                placeholder="Enter number of Deals Closed"
                placeholderTextColor={COLORS.textSecondary}
                keyboardType="numeric"
                value={dealsClosed}
                onChangeText={text => setDealsClosed(text.replace(/[^0-9]/g, ''))}
                onFocus={() => setFocusedField('deals')}
                onBlur={() => setFocusedField(null)}
              />
            </View>

            {/* Submit */}
            <TouchableOpacity
              style={[styles.submitBtn, (!isValid() || loading) && styles.submitBtnDisabled]}
              onPress={handleSubmit}
              disabled={!isValid() || loading}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.submitBtnText}>Submit</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#F8F9FA',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 40,
  },
  headerBanner: {
    width: '100%',
    paddingVertical: 36,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEB',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 800,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  rowStack: {
    flexDirection: 'column',
    gap: 0,
  },
  halfWidth: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.textDark,
  },
  textInputFocused: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
  },
  readOnlyInput: {
    backgroundColor: '#F0F0F0',
    borderColor: '#DCDCDC',
    justifyContent: 'center',
  },
  readOnlyText: {
    fontSize: 15,
    color: '#555555',
    fontWeight: '500',
  },
  photoUploadBox: {
    width: 140,
    height: 140,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#C8C8C8',
    borderStyle: 'dashed',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAFAFA',
  },
  photoPreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  photoPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoUploadIcon: {
    fontSize: 28,
    color: '#AAAAAA',
    marginBottom: 6,
  },
  photoUploadText: {
    fontSize: 14,
    color: '#AAAAAA',
    textAlign: 'center',
    lineHeight: 20,
  },
  removePhotoBtn: {
    marginTop: 8,
  },
  removePhotoText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
  },
  specializationHint: {
    fontSize: 12,
    color: COLORS.primary,
    marginBottom: 10,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#C0C0C0',
    backgroundColor: '#FFFFFF',
  },
  tagSelected: {
    backgroundColor: '#FFF3D0',
    borderColor: '#D4A017',
  },
  tagText: {
    fontSize: 14,
    color: '#555555',
    fontWeight: '500',
  },
  tagTextSelected: {
    color: '#8B6914',
    fontWeight: '700',
  },
  submitBtn: {
    marginTop: 8,
    alignSelf: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
  submitBtnDisabled: {
    backgroundColor: '#CCCCCC',
    shadowOpacity: 0,
    elevation: 0,
  },
  submitBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.white,
    letterSpacing: 0.3,
  },
});

export default BrokerRegistrationScreen;