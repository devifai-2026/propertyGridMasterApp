import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  ImageBackground,
} from 'react-native';
import { Building2, ArrowUp, Bell, PhoneCall, Lightbulb } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';

interface ReachedTheEndProps {
  propertyCount: number;
  onGoToTop: () => void;
  onContactSupport?: () => void;
}

const ReachedTheEnd: React.FC<ReachedTheEndProps> = ({ 
  propertyCount = 5, 
  onGoToTop,
  onContactSupport
}) => {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 768;

  return (
    <View style={styles.container}>
      <ImageBackground 
        source={require('../../../assets/propertyDetails/squaresbg.png')} 
        style={styles.background}
        resizeMode="repeat"
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.iconCircle}>
            <Building2 size={60} color="#EE2529" strokeWidth={1.5} />
          </View>
          
          <Text style={[styles.title, isSmallScreen && { fontSize: 28 }]}>
            You've Reached the End
          </Text>
          
          <Text style={[styles.subtitle, isSmallScreen && { fontSize: 13 }]}>
            That's all! We currently have <Text style={{ color: '#EE2529', fontWeight: 'bold' }}>{propertyCount} properties</Text> available that match your criteria. {'\n'}
            We're constantly adding new properties. Set up alerts or contact us to get notified when new properties are listed.
          </Text>

          <TouchableOpacity onPress={onGoToTop} style={styles.goTopBtn}>
            <LinearGradient
              colors={['#EE2529', '#C73834']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientBtn}
            >
              <ArrowUp size={18} color="#FFF" />
              <Text style={styles.btnText}>Go to Top</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Cards Section */}
          <View style={[styles.cardsContainer, isSmallScreen && { flexDirection: 'column', gap: 20 }]}>
            {/* Alerts Card */}
            <View style={[styles.infoCard, isSmallScreen && { minWidth: '100%' }]}>
              <View style={styles.cardIconWrapper}>
                <Bell size={24} color="#EE2529" strokeWidth={1.5} />
              </View>
              <Text style={styles.cardTitle}>Get Instant Alerts</Text>
              <Text style={styles.cardText}>
                Be the first to know when new properties matching your preferences are listed.
              </Text>
              <TouchableOpacity style={styles.cardActionBtn}>
                <LinearGradient
                  colors={['#EE2529', '#C73834']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.cardGradient}
                >
                  <Text style={styles.cardActionText}>Set Up Alerts</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Support Card */}
            <View style={[styles.infoCard, isSmallScreen && { minWidth: '100%' }]}>
              <View style={styles.cardIconWrapper}>
                <PhoneCall size={24} color="#EE2529" strokeWidth={1.5} />
              </View>
              <Text style={styles.cardTitle}>Contact Our Team</Text>
              <Text style={styles.cardText}>
                Let us know your exact requirements and we'll personally help you find the perfect property.
              </Text>
              <TouchableOpacity 
                style={styles.cardActionBtn}
                onPress={onContactSupport}
              >
                <LinearGradient
                  colors={['#EE2529', '#C73834']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.cardGradient}
                >
                  <Text style={styles.cardActionText}>Contact Support</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          {/* Bottom Broaden Search Card */}
          <View style={[styles.bottomCard, isSmallScreen && { width: '100%', padding: 20 }]}>
            <Text style={[styles.bottomTitle, isSmallScreen && { fontSize: 18 }]}>Can't Find What You're Looking For?</Text>
            <Text style={[styles.bottomText, isSmallScreen && { fontSize: 13 }]}>
              Let us know your requirements and we'll notify you when matching properties become available.
            </Text>
            <View style={styles.tipRow}>
              <Lightbulb size={16} color="#FFD700" />
              <Text style={styles.tipText}>Tip: Broaden your search criteria to see more properties</Text>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    marginTop: 40,
    marginBottom: 40,
  },
  background: {
    width: '100%',
    paddingVertical: 60,
    alignItems: 'center',
  },
  content: {
    width: '100%',
    maxWidth: 1000,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFF8E1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
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
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    fontFamily: 'Montserrat',
    lineHeight: 24,
    marginBottom: 30,
    maxWidth: 800,
  },
  goTopBtn: {
    marginBottom: 50,
  },
  gradientBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    gap: 8,
  },
  btnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Montserrat',
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 30,
    marginBottom: 50,
  },
  infoCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 4,
  },
  cardIconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#FFF0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#EE2529',
    fontFamily: 'Montserrat',
    marginBottom: 15,
    textAlign: 'center',
  },
  cardText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    fontFamily: 'Montserrat',
    lineHeight: 22,
    marginBottom: 25,
    minHeight: 44,
  },
  cardActionBtn: {
    width: '100%',
  },
  cardGradient: {
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: 'center',
  },
  cardActionText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Montserrat',
  },
  bottomCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 40,
    width: '100%',
    maxWidth: 600,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F5F5F5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  bottomTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#EE2529',
    fontFamily: 'Montserrat',
    marginBottom: 15,
    textAlign: 'center',
  },
  bottomText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    fontFamily: 'Montserrat',
    lineHeight: 22,
    marginBottom: 20,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#999',
    fontFamily: 'Montserrat',
    fontStyle: 'italic',
  },
});

export default ReachedTheEnd;
