import React, { useState, useRef } from 'react';
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
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const { login } = useAuth();
  const { navigate } = useNavigation();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  // Refs for OTP inputs
  const otpInputRefs = useRef<Array<TextInput | null>>([]);

  const handleSendOtp = () => {
    if (phone.length === 10) {
      setOtpSent(true);
      // Auto-focus first OTP input after a short delay
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
      Alert.alert('OTP Sent', 'A 4-digit OTP has been sent to your mobile number');
    } else {
      Alert.alert('Error', 'Please enter a valid 10-digit number');
    }
  };

  const handleOtpChange = (text: string, index: number) => {
    // Only allow digits
    const digit = text.replace(/[^0-9]/g, '');

    const newOtp = otp.split('');
    newOtp[index] = digit;
    setOtp(newOtp.join(''));

    // Auto-focus next input if digit entered
    if (digit && index < 3) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyPress = (e: any, index: number) => {
    // Handle backspace on empty field - move to previous input
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length === 4) {
      // Here you would verify OTP with backend
      // For now, we'll just proceed with login
      const success = await login(phone);
      if (success) {
        navigate('/dashboard');
      }
    } else {
      Alert.alert('Error', 'Please enter the complete 4-digit OTP');
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
              editable={!otpSent}
            />
          </View>

          {otpSent && (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Enter OTP *</Text>
              <View style={styles.otpInputGroup}>
                {[0, 1, 2, 3].map(index => (
                  <TextInput
                    key={index}
                    ref={ref => {
                      otpInputRefs.current[index] = ref;
                    }}
                    style={styles.otpInput}
                    maxLength={1}
                    keyboardType="number-pad"
                    value={otp[index] || ''}
                    onChangeText={text => handleOtpChange(text, index)}
                    onKeyPress={e => handleOtpKeyPress(e, index)}
                    selectTextOnFocus
                    autoComplete="one-time-code"
                  />
                ))}
              </View>
              <TouchableOpacity
                style={styles.resendBtn}
                onPress={() => {
                  setOtp('');
                  Alert.alert('OTP Resent', 'A new OTP has been sent to your mobile number');
                }}
              >
                <Text style={styles.resendText}>Resend OTP</Text>
              </TouchableOpacity>
            </View>
          )}

          {!otpSent && (
            <View style={styles.dummyInfo}>
              <Text style={styles.dummyTitle}>Dummy Login Credentials:</Text>
              <Text style={styles.dummyText}>• Investor: 9999999991</Text>
              <Text style={styles.dummyText}>• Broker: 9999999992</Text>
              <Text style={styles.dummyText}>• Owner: 9999999993</Text>
            </View>
          )}

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.btnOutline}
              onPress={() => navigate('/dashboard')}
            >
              <Text style={styles.btnOutlineText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.btnFilled,
                (otpSent ? otp.length !== 4 : phone.length !== 10) &&
                  styles.btnDisabled,
              ]}
              onPress={otpSent ? handleVerifyOtp : handleSendOtp}
              disabled={otpSent ? otp.length !== 4 : phone.length !== 10}
            >
              <Text style={styles.btnFilledText}>
                {otpSent ? 'Verify & Login' : 'Send OTP'}
              </Text>
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
  btnDisabled: {
    backgroundColor: '#CCC',
    opacity: 0.6,
  },
  otpInputGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 15,
  },
  otpInput: {
    width: 50,
    height: 50,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    color: '#333',
  },
  resendBtn: {
    alignSelf: 'center',
    paddingVertical: 8,
  },
  resendText: {
    fontSize: 14,
    color: '#D32F2F',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
