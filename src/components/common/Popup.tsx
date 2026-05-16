import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  Platform,
} from 'react-native';
import { X, AlertCircle, CheckCircle, Info } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, FONTS } from '../../constants/theme';

const { width, height } = Dimensions.get('window');

interface PopupProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  message: string | string[];
  type?: 'error' | 'success' | 'info';
}

const Popup: React.FC<PopupProps> = ({
  visible,
  onClose,
  title,
  message,
  type = 'error',
}) => {
  const [animation] = React.useState(new Animated.Value(0));

  React.useEffect(() => {
    if (visible) {
      Animated.spring(animation, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }).start();
    } else {
      Animated.timing(animation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, animation]);

  if (!visible && animation._value === 0) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={32} color="#10B981" />;
      case 'info':
        return <Info size={32} color="#3B82F6" />;
      case 'error':
      default:
        return <AlertCircle size={32} color={COLORS.error} />;
    }
  };

  const getGradientColors = () => {
    switch (type) {
      case 'success':
        return ['#ECFDF5', '#D1FAE5'];
      case 'info':
        return ['#EFF6FF', '#DBEAFE'];
      case 'error':
      default:
        return [COLORS.lightRed, '#FFE4E4'];
    }
  };

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });

  const opacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const scale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1],
  });

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.container,
            {
              opacity,
              transform: [{ translateY }, { scale }],
            },
          ]}
        >
          <LinearGradient
            colors={getGradientColors()}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            <View style={styles.header}>
              <View style={styles.iconContainer}>{getIcon()}</View>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <X size={20} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.content}>
              <Text style={styles.title}>{title}</Text>
              {Array.isArray(message) ? (
                <View style={styles.messageList}>
                  {message.map((msg, index) => (
                    <View key={index} style={styles.messageItem}>
                      <View style={[styles.bullet, { backgroundColor: type === 'error' ? COLORS.error : type === 'success' ? '#10B981' : '#3B82F6' }]} />
                      <Text style={styles.messageText}>{msg}</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={styles.message}>{message}</Text>
              )}
            </View>

            <TouchableOpacity onPress={onClose} activeOpacity={0.8}>
              <LinearGradient
                colors={
                  type === 'success'
                    ? ['#10B981', '#059669']
                    : type === 'info'
                    ? ['#3B82F6', '#2563EB']
                    : [COLORS.error, '#B71C1C']
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Dismiss</Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: Platform.OS === 'web' && width > 500 ? 400 : '100%',
    maxWidth: 450,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  gradient: {
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 8,
    fontFamily: FONTS.main,
  },
  message: {
    fontSize: 16,
    color: COLORS.textSecondary,
    lineHeight: 24,
    fontFamily: FONTS.main,
  },
  messageList: {
    marginTop: 8,
    gap: 12,
  },
  messageItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 8,
  },
  messageText: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 22,
    fontFamily: FONTS.main,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: FONTS.main,
  },
});

export default Popup;
