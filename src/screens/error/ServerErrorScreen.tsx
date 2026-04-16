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
import { Server, RotateCw, Home } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '../../context/NavigationContext';

const ServerErrorScreen = () => {
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
              <View style={styles.iconWrapper}>
                <Server size={60} color="#EE2529" strokeWidth={1.5} />
                <View style={styles.slashLine} />
              </View>
            </View>
            <Text style={[styles.title, isSmallScreen && { fontSize: 28 }]}>Server Error</Text>
            <Text style={[styles.subtitle, isSmallScreen && { fontSize: 13 }]}>
              We're experiencing technical difficulties. Our team has been notified and is working to fix the issue.
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

          {/* Tips Card */}
          <View style={[styles.infoCard, isSmallScreen && { width: '95%', padding: 20 }]}>
            <Text style={[styles.infoTitle, isSmallScreen && { fontSize: 18 }]}>What can you do?</Text>
            
            <View style={styles.tipsList}>
              <View style={styles.tipItem}>
                <Text style={styles.tipDot}>•</Text>
                <Text style={styles.tipText}>Try refreshing the page</Text>
              </View>
              <View style={styles.tipItem}>
                <Text style={styles.tipDot}>•</Text>
                <Text style={styles.tipText}>Come back in a few minutes</Text>
              </View>
              <View style={styles.tipItem}>
                <Text style={styles.tipDot}>•</Text>
                <Text style={styles.tipText}>Contact our support team if the problem persists</Text>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.supportButton} 
              onPress={() => navigate('/support')}
            >
              <Text style={styles.supportButtonText}>Contact Support</Text>
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
  iconWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  slashLine: {
    position: 'absolute',
    width: 70,
    height: 3,
    backgroundColor: '#EE2529',
    transform: [{ rotate: '-45deg' }],
    borderRadius: 2,
  },
  title: {
    fontSize: 36,
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
    maxWidth: 600,
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
    padding: 35,
    width: '100%',
    maxWidth: 600,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F5F5F5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 4,
  },
  infoTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#EE2529',
    fontFamily: 'Montserrat',
    marginBottom: 20,
  },
  tipsList: {
    alignItems: 'flex-start',
    marginBottom: 30,
    width: '100%',
    paddingLeft: 20,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  tipDot: {
    fontSize: 20,
    color: '#666',
    marginRight: 10,
  },
  tipText: {
    fontSize: 15,
    color: '#666',
    fontFamily: 'Montserrat',
    lineHeight: 22,
  },
  supportButton: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
    backgroundColor: '#FFF',
  },
  supportButtonText: {
    fontSize: 16,
    color: '#888',
    fontWeight: '600',
    fontFamily: 'Montserrat',
  },
});

export default ServerErrorScreen;
