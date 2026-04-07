import React from 'react';
import {
  View,
  Text,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Calendar } from 'lucide-react-native';

interface CustomDatePickerProps {
  value: string;
  onChange: (date: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  error?: boolean;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  value,
  onChange,
  onBlur,
  placeholder,
  error,
}) => {
  if (Platform.OS === 'web') {
    // Use standard HTML input for web to leverage browser's native date picker
    const DateInput = 'input' as any;

    return (
      <View style={[styles.container, error && styles.errorBorder]}>
        <DateInput
          type="date"
          value={value}
          onChange={(e: any) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          style={{
            border: 'none',
            outline: 'none',
            background: 'transparent',
            width: '100%',
            height: '100%',
            fontSize: '18px',
            color: '#333',
            fontFamily: 'Montserrat', // Use Montserrat
            padding: '0 12px',
            margin: 0,
            cursor: 'pointer',
            boxSizing: 'border-box',
          }}
        />
      </View>
    );
  }

  // Fallback for native: Displays value with an icon (interactive picker would require native library)
  return (
    <View style={[styles.container, error && styles.errorBorder]}>
      <Text style={[styles.text, !value && styles.placeholder]}>
        {value || placeholder || 'YYYY-MM-DD'}
      </Text>
      <Calendar size={20} color="#999" style={styles.icon} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F2F2F2',
    height: 44,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  errorBorder: {
    borderColor: '#EE2529',
  },
  text: {
    flex: 1,
    fontSize: 18,
    color: '#333',
    paddingHorizontal: 12,
    fontFamily: 'Montserrat',
  },
  placeholder: {
    color: '#999',
  },
  icon: {
    marginRight: 12,
  },
});

export default CustomDatePicker;
