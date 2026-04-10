import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  ImageBackground,
  SafeAreaView,
} from 'react-native';
import { WifiOff, RotateCw } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '../../context/NavigationContext';

const OfflineScreen = () => {
  const { width, height } = useWindowDimensions();
  const { navigate } = useNavigation();
  const isSmallScreen = width < 768;

  const handleRetry = () => {
    // In a real app, check navigator.onLine or NetInfo
    console.log('Retrying connection...');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground 
        source={require('../../assets/propertyDetails/squaresbg.png')} 
        style={[styles.container, { minHeight: height }]}
        resizeMode="repeat"
      >
        <View style={styles.content}>
          {/* Main Icon and Message */}
          <View style={styles.headerSection}>
            <View style={styles.iconCircle}>
              <WifiOff size={48} color="#EE2529" strokeWidth={2.5} />
            </View>
            <Text style={[styles.title, isSmallScreen && { fontSize: 28 }]}>You're Offline</Text>
            <Text style={[styles.subtitle, isSmallScreen && { fontSize: 14 }]}>
              Please check your internet connection and try again.
            </Text>

            <TouchableOpacity onPress={handleRetry}>
              <LinearGradient
                colors={['#EE2529', '#C73834']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.retryButton}
              >
                <RotateCw size={18} color="#FFF" />
                <Text style={styles.retryButtonText}>Retry Connection</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Info Card */}
          <View style={[styles.infoCard, isSmallScreen && { width: '95%', padding: 20 }]}>
            <Text style={[styles.infoTitle, isSmallScreen && { fontSize: 18 }]}>While You're Offline</Text>
            <Text style={[styles.infoText, isSmallScreen && { fontSize: 13 }]}>
              Make sure your device is connected to WiFi or mobile data. If you're connected and still seeing this message, the problem might be on our end.
            </Text>
            
            <TouchableOpacity 
              style={styles.outlineButton} 
              onPress={() => navigate('/support')}
            >
              <Text style={styles.outlineButtonText}>Contact Support</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    fontFamily: 'Montserrat',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: 20,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 50,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFF8E1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    // Add subtle shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#EE2529',
    fontFamily: 'Montserrat',
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    fontFamily: 'Montserrat',
    marginBottom: 30,
    maxWidth: 300,
    lineHeight: 22,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    gap: 10,
    minWidth: 200,
  },
  retryButtonText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '600',
    fontFamily: 'Montserrat',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 30,
    width: '100%',
    maxWidth: 600,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 5,
  },
  infoTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#EE2529',
    fontFamily: 'Montserrat',
    marginBottom: 15,
  },
  infoText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    fontFamily: 'Montserrat',
    marginBottom: 25,
    lineHeight: 22,
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineButtonText: {
    fontSize: 16,
    color: '#888',
    fontWeight: '600',
    fontFamily: 'Montserrat',
  },
});

export default OfflineScreen;
