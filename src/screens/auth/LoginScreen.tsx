import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
  useWindowDimensions,
} from 'react-native';
import Layout from '../../layout/Layout';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '../../context/NavigationContext';

const LoginScreen = () => {
  const [phone, setPhone] = useState('');
  const { login } = useAuth();
  const { navigate } = useNavigation();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const handleContinue = async () => {
    if (phone.length === 10) {
      const success = await login(phone);
      if (success) {
        navigate('/dashboard');
      }
    } else {
      Alert.alert('Error', 'Please enter a valid 10-digit number');
    }
  };

  return (
    <Layout>
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>Welcome</Text>
            <Text style={styles.subtitle}>
              Sign in to your account to continue
            </Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Mobile Number *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter your contact number"
              placeholderTextColor="#999"
              keyboardType="numeric"
              maxLength={10}
              value={phone}
              onChangeText={setPhone}
            />
          </View>

          <View style={styles.dummyInfo}>
            <Text style={styles.dummyTitle}>Dummy Login Credentials:</Text>
            <Text style={styles.dummyText}>• Investor: 9999999991</Text>
            <Text style={styles.dummyText}>• Broker: 9999999992</Text>
            <Text style={styles.dummyText}>• Owner: 9999999993</Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.btnOutline}
              onPress={() => navigate('/dashboard')}
            >
              <Text style={styles.btnOutlineText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnFilled} onPress={handleContinue}>
              <Text style={styles.btnFilledText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  dummyInfo: {
    backgroundColor: '#F8F9FA',
    padding: 15,
    borderRadius: 8,
    marginBottom: 30,
  },
  dummyTitle: {
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
    fontSize: 14,
  },
  dummyText: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 15,
  },
  btnOutline: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  btnOutlineText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  btnFilled: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#D32F2F',
    alignItems: 'center',
  },
  btnFilledText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default LoginScreen;
