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
import { AlertCircle, RotateCw, Home } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '../../context/NavigationContext';

interface ErrorScreenProps {
  errorId?: string;
  timestamp?: string;
}

const ErrorScreen: React.FC<ErrorScreenProps> = ({ 
  errorId = 'DKKPHOPBH', 
  timestamp = new Date().toISOString() 
}) => {
  const { width, height } = useWindowDimensions();
  const { navigate } = useNavigation();
  const isSmallScreen = width < 768;

  const handleTryAgain = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
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
              <AlertCircle size={60} color="#EE2529" strokeWidth={1.5} />
            </View>
            <Text style={[styles.title, isSmallScreen && { fontSize: 24 }]}>
              Sorry, Something Went Wrong
            </Text>
            <Text style={[styles.subtitle, isSmallScreen && { fontSize: 13 }]}>
              Our team is working on this issue. Please refresh or come back later.
            </Text>

            <View style={[styles.buttonContainer, isSmallScreen && { flexDirection: 'column', width: '100%', paddingHorizontal: 20 }]}>
              <TouchableOpacity 
                style={[styles.outlineButton, isSmallScreen && { width: '100%', marginBottom: 12 }]} 
                onPress={handleTryAgain}
              >
                <RotateCw size={18} color="#666" />
                <Text style={styles.outlineButtonText}>Try Again</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => navigate('/')}
                style={[isSmallScreen && { width: '100%' }]} 
              >
                <LinearGradient
                  colors={['#EE2529', '#C73834']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.homeButton}
                >
                  <Home size={18} color="#FFF" />
                  <Text style={styles.homeButtonText}>Home Page</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          {/* Error Details Card */}
          <View style={[styles.infoCard, isSmallScreen && { width: '95%', padding: 20 }]}>
            <Text style={[styles.infoTitle, isSmallScreen && { fontSize: 18 }]}>Error Details</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailText}>Error ID: {errorId}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailText}>Timestamp: {timestamp}</Text>
            </View>
            <Text style={styles.footerText}>
              Please include this information when contacting support.
            </Text>
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
    width: '100%',
  },
  iconCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#FFF8E1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 35,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#EE2529',
    fontFamily: 'Montserrat',
    marginBottom: 15,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    fontFamily: 'Montserrat',
    marginBottom: 35,
    maxWidth: 400,
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  outlineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#FFF',
    gap: 10,
    minWidth: 150,
  },
  outlineButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
    fontFamily: 'Montserrat',
  },
  homeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    gap: 10,
    minWidth: 160,
  },
  homeButtonText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '600',
    fontFamily: 'Montserrat',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 40,
    width: '100%',
    maxWidth: 600,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F5F5F5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.04,
    shadowRadius: 30,
    elevation: 4,
  },
  infoTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#EE2529',
    fontFamily: 'Montserrat',
    marginBottom: 25,
  },
  detailRow: {
    marginBottom: 8,
  },
  detailText: {
    fontSize: 15,
    color: '#777',
    fontFamily: 'Montserrat',
    textAlign: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    fontFamily: 'Montserrat',
    marginTop: 20,
    lineHeight: 20,
  },
});

export default ErrorScreen;
