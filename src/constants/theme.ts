import { Platform } from 'react-native';

export const COLORS = {
  primary: '#D32F2F',
  secondary: '#FF5722', // Deep Orange for accents if needed
  textDark: '#1A1A1A',
  textSecondary: '#666',
  white: '#FFF',
  background: '#F8F9FA',
  divider: '#F1F3F5',
  success: '#2E7D32',
  error: '#D32F2F',
  lightRed: '#FFF0F0',
};

export const FONTS = {
  main: Platform.select({
    ios: 'Montserrat',
    android: 'Montserrat',
    web: 'Montserrat, sans-serif',
  }) || 'sans-serif',
  avenir: Platform.select({
    web: '"Avenir LT Pro", "Segoe UI", sans-serif',
    ios: 'Avenir Next',
    android: 'Avenir-Heavy',
  }) || 'sans-serif',
};
