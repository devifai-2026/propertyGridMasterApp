import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  ImageBackground,
} from 'react-native';
import { useNavigation } from '../../context/NavigationContext';
import { Home } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import Layout from '../../layout/Layout';

const NotFoundScreen = () => {
  const { width, height } = useWindowDimensions();
  const { navigate, goBack } = useNavigation();
  const isSmallScreen = width < 768;

  return (
    <Layout>
      <ImageBackground 
        source={require('../../assets/propertyDetails/squaresbg.png')} 
        style={[
          styles.container, 
          { height: height * (isSmallScreen ? 0.60 : 0.70) },
          isSmallScreen && { marginTop: 60 }
        ]}
        resizeMode="repeat"
      >
        <View style={styles.content}>
          <Text style={[styles.errorCode, isSmallScreen && { fontSize: 60, lineHeight: 70 }]}>404</Text>
          <Text style={[styles.title, isSmallScreen && { fontSize: 28, marginTop: 10, marginBottom: 10 }]}>Page Not Found</Text>
          <Text style={[styles.subtitle, isSmallScreen && { fontSize: 13, marginBottom: 20, maxWidth: '95%' }]}>
            Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
          </Text>

          <View style={[styles.buttonContainer, isSmallScreen && { flexDirection: 'column', alignItems: 'stretch', width: '100%', paddingHorizontal: 10, gap: 10 }]}>
            <TouchableOpacity 
              style={[styles.outlineButton, isSmallScreen && { minWidth: '100%' }]} 
              onPress={goBack}
            >
              <Text style={styles.outlineButtonText}>Go Back</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => navigate('/')}
              style={[isSmallScreen && { minWidth: '100%' }]} 
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

            <TouchableOpacity 
              style={[styles.outlineButton, isSmallScreen && { minWidth: '100%' }]} 
              onPress={() => navigate('/explore-properties')}
            >
              <Text style={styles.outlineButtonText}>Explore Properties</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 800,
    width: '100%',
    padding: 15,
  },
  errorCode: {
    fontSize: 150,
    fontWeight: '800',
    color: '#EE2529',
    fontFamily: 'Montserrat',
    lineHeight: 160,
  },
  title: {
    fontSize: 42,
    fontWeight: '700',
    color: '#EE2529',
    fontFamily: 'Montserrat',
    marginTop: 20,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    fontFamily: 'Montserrat',
    marginBottom: 40,
    maxWidth: '80%',
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 140,
  },
  outlineButtonText: {
    fontSize: 15,
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
    paddingHorizontal: 20,
    gap: 10,
    minWidth: 160,
  },
  homeButtonText: {
    fontSize: 15,
    color: '#FFF',
    fontWeight: '600',
    fontFamily: 'Montserrat',
  },
});

export default NotFoundScreen;
