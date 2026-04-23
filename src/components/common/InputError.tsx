import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';

interface InputErrorProps {
  message?: string;
  visible?: boolean;
}

const InputError: React.FC<InputErrorProps> = ({ message, visible }) => {
  if (!visible || !message) return null;

  return (
    <View style={styles.errorRow}>
      <AlertTriangle size={14} fill="#EE2529" color="#FFF" />
      <Text style={styles.errorText}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
    paddingLeft: 12,
  },
  errorText: {
    color: '#EE2529',
    fontSize: 13,
    fontWeight: '500',
    fontFamily: 'Montserrat',
  },
});

export default InputError;
