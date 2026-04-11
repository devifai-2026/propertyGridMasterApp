import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';

const ContactForm = () => {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 768;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    message: '',
  });
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const roles = [
    { value: 'investor', label: 'Investor' },
    { value: 'property-owner', label: 'Property Owner' },
    { value: 'developer', label: 'Developer' },
    { value: 'broker', label: 'Broker' },
    { value: 'other', label: 'Other' },
  ];

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    // Add submission logic here
  };

  return (
    <View style={[styles.container, isSmallScreen && { padding: 16, paddingBottom: 8 }]}>
      <Text style={[styles.header, isSmallScreen && { fontSize: 18, textAlign: 'center' }]}>Send us a Message</Text>

      <View style={styles.form}>
        <View style={[styles.row, isSmallScreen && { flexDirection: 'column' }]}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, isSmallScreen && { fontSize: 14 }]}>Name *</Text>
            <TextInput
              style={[styles.input, isSmallScreen && { fontSize: 14 }]}
              placeholder="Your full name"
              value={formData.name}
              onChangeText={text => handleChange('name', text)}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, isSmallScreen && { fontSize: 14 }]}>Email *</Text>
            <TextInput
              style={[styles.input, isSmallScreen && { fontSize: 14 }]}
              placeholder="Your email"
              keyboardType="email-address"
              value={formData.email}
              onChangeText={text => handleChange('email', text)}
            />
          </View>
        </View>

        <View style={[styles.row, { zIndex: 10 }, isSmallScreen && { flexDirection: 'column' }]}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, isSmallScreen && { fontSize: 14 }]}>Phone Number</Text>
            <TextInput
              style={[styles.input, isSmallScreen && { fontSize: 14 }]}
              placeholder="Mobile no"
              keyboardType="phone-pad"
              value={formData.phone}
              onChangeText={text => handleChange('phone', text)}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, isSmallScreen && { fontSize: 14 }]}>Choose Role</Text>
            <TouchableOpacity 
              style={styles.dropdownTrigger}
              onPress={() => setShowRoleDropdown(!showRoleDropdown)}
            >
              <Text style={[styles.dropdownValue, !formData.role && { color: '#999' }, isSmallScreen && { fontSize: 14 }]}>
                {roles.find(r => r.value === formData.role)?.label || 'Select role'}
              </Text>
              <ChevronDown size={20} color="#666" />
            </TouchableOpacity>
            
            {showRoleDropdown && (
              <View style={styles.dropdownMenu}>
                {roles.map(role => (
                  <TouchableOpacity
                    key={role.value}
                    style={styles.dropdownItem}
                    onPress={() => {
                      handleChange('role', role.value);
                      setShowRoleDropdown(false);
                    }}
                  >
                    <Text style={[
                      styles.dropdownItemText,
                      formData.role === role.value && styles.activeDropdownItemText,
                      isSmallScreen && { fontSize: 13 }
                    ]}>
                      {role.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, isSmallScreen && { fontSize: 14 }]}>Message *</Text>
          <TextInput
            style={[styles.input, styles.textArea, isSmallScreen && { fontSize: 14 }]}
            placeholder="Please describe your inquiry in detail..."
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            value={formData.message}
            onChangeText={text => handleChange('message', text)}
          />
        </View>

        <TouchableOpacity onPress={handleSubmit}>
          <LinearGradient
            colors={['#EE2529', '#C73834']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.submitButton}
          >
            <Text style={styles.submitButtonText}>Send Message</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 24,
    paddingBottom: 0,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 20,
    fontFamily: 'Montserrat',
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    color: '#EE2529',
    marginBottom: 24,
  },
  form: {
    gap: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 0,
  },
  inputGroup: {
    flex: 1,
    position: 'relative',
  },
  label: {
    fontSize: 16,
    fontWeight: 600,
    color: '#262626',
    marginBottom: 8,
    fontFamily: 'Montserrat',
  },
  input: {
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    fontFamily: 'Montserrat',
  },
  textArea: {
    minHeight: 140,
    paddingTop: 12,
  },
  dropdownTrigger: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#FAFAFA',
  },
  dropdownValue: {
    fontSize: 15,
    color: '#333',
    fontFamily: 'Montserrat',
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginTop: 4,
    zIndex: 9999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Montserrat',
  },
  activeDropdownItemText: {
    color: '#EE2529',
    fontWeight: '600',
  },
  submitButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#EE2529',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Montserrat',
  },
});

export default ContactForm;

