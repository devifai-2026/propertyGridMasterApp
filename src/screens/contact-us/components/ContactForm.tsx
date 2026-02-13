import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { ChevronDown } from 'lucide-react-native';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    message: '',
  });

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
    <View style={styles.container}>
      <Text style={styles.header}>Send us a Message</Text>

      <View style={styles.form}>
        <View style={styles.row}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Your full name"
              value={formData.name}
              onChangeText={text => handleChange('name', text)}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={styles.input}
              placeholder="Your email"
              keyboardType="email-address"
              value={formData.email}
              onChangeText={text => handleChange('email', text)}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Mobile no"
              keyboardType="phone-pad"
              value={formData.phone}
              onChangeText={text => handleChange('phone', text)}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Choose Role</Text>
            {/* Simple dropdown simulation using TextInput for now, or implement a picker if critical */}
            <View style={styles.dropdownContainer}>
              <TextInput
                style={styles.input}
                placeholder="Select role"
                value={roles.find(r => r.value === formData.role)?.label || ''}
                editable={false} // Make it read-only, would ideally open a modal/picker
              />
              <ChevronDown size={20} color="#999" style={styles.dropdownIcon} />
            </View>
            {/* For simplicity in this iteration, keeping it as a text input or placeholder unless user specifically asks for full dropdown interaction here too. given previous detailed work on dropdowns, creating a full custom dropdown here might be overkill or requires reusing the component. I'll stick to a simple innovative approach: show options as buttons or just use a text input for now as placeholder for intricate logic.*/}
            <View style={styles.roleOptions}>
              {roles.map(role => (
                <TouchableOpacity
                  key={role.value}
                  style={[
                    styles.roleChip,
                    formData.role === role.value && styles.activeRoleChip,
                  ]}
                  onPress={() => handleChange('role', role.value)}
                >
                  <Text
                    style={[
                      styles.roleText,
                      formData.role === role.value && styles.activeRoleText,
                    ]}
                  >
                    {role.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Message *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Please describe your inquiry in detail..."
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            value={formData.message}
            onChangeText={text => handleChange('message', text)}
          />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Send Message</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#eee',
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
    marginBottom: 0,
  },
  inputGroup: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: '#333',
    backgroundColor: '#FAFAFA',
  },
  textArea: {
    minHeight: 120,
    paddingTop: 12,
  },
  dropdownContainer: {
    position: 'relative',
    display: 'none',
  },
  dropdownIcon: {
    position: 'absolute',
    right: 12,
    top: 14,
  },
  roleOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 4,
  },
  roleChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#fff',
  },
  activeRoleChip: {
    backgroundColor: '#FFF0F0',
    borderColor: '#EE2529',
  },
  roleText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  activeRoleText: {
    color: '#EE2529',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#EE2529',
    paddingVertical: 14,
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
  },
});

export default ContactForm;
