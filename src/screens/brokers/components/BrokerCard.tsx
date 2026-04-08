import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform, Animated } from 'react-native';
import { MapPin, Phone, Mail, X } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import bottom from "../../../assets/ExploreBrokers/bottom.png";
import top from "../../../assets/ExploreBrokers/top.png";
import share from "../../../assets/Calculator/share.png"


interface BrokerCardProps {
  item: any;
  isMobile: boolean;
  isDesktop: boolean;
  isVisibleContact: boolean;
  onToggleContact: () => void;
}

const capitalize = (str: string) => {
  if (!str) return '';
  return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const BrokerCard: React.FC<BrokerCardProps> = ({
  item,
  isMobile,
  isDesktop,
  isVisibleContact,
  onToggleContact,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const flipAnimation = useRef(new Animated.Value(0)).current;

  const flipCard = () => {
    if (isFlipped) {
      Animated.spring(flipAnimation, {
        toValue: 0,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(flipAnimation, {
        toValue: 180,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start();
    }
    setIsFlipped(!isFlipped);
  };

  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const frontOpacity = flipAnimation.interpolate({
    inputRange: [89, 90],
    outputRange: [1, 0],
  });

  const backOpacity = flipAnimation.interpolate({
    inputRange: [89, 90],
    outputRange: [0, 1],
  });

  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }],
    opacity: frontOpacity,
  };

  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }],
    opacity: backOpacity,
  };

  return (
    <TouchableOpacity 
      activeOpacity={1} 
      onPress={flipCard}
      style={[styles.cardContainer, { width: isDesktop ? '49.3%' : '100%' }]}
    >
      {/* Front Side */}
      <Animated.View style={[styles.card, frontAnimatedStyle, { width: '100%' }]}>
        {!isMobile && (
          <>
            <Image 
              source={bottom} 
              style={styles.bottomOrnament} 
              resizeMode="contain" 
            />
            <Image 
              source={top} 
              style={styles.topOrnament} 
              resizeMode="stretch" 
            />
          </>
        )}
        
        <View
          style={[
            styles.cardContent,
            { flexDirection: !isMobile ? 'row' : 'column' },
          ]}
        >
          {/* Left Section */}
          <View
            style={[
              styles.leftSection,
              !isMobile
                ? { width: 220, alignItems: 'flex-start' }
                : { width: '100%', alignItems: 'center' },
            ]}
          >
            <View style={{ alignItems: isMobile ? 'center' : 'flex-start' }}>
              <Text style={styles.brokerCompany}>{capitalize(item.name) || "APJ Realtors"}</Text>
              <Image
                source={require('../../../assets/ExploreBrokers/cardImg.png')}
                style={styles.brokerImage}
                resizeMode="cover"
              />
            </View>

            {isVisibleContact ? (
              <View style={styles.contactInfoContainer}>
                <View style={styles.contactItem}>
                  <Phone size={12} color="#EE2529" />
                  <Text style={styles.contactInfoText}>{item.mobileNumber}</Text>
                </View>
                <View style={styles.contactItem}>
                  <Mail size={12} color="#EE2529" />
                  <Text style={styles.contactInfoText}>{item.email}</Text>
                </View>
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    onToggleContact();
                  }}
                  style={styles.closeContactBtn}
                >
                  <X size={12} color="#EE2529" />
                  <Text style={styles.hideContactText}>Close</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  onToggleContact();
                }}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#EE2529', '#C73834']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.contactBtn}
                >
                  <Text style={styles.contactBtnText}>Contact Broker</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>

          {/* Right Section */}
          <View
            style={[
              styles.rightSection,
              !isMobile
                ? { flex: 1 }
                : { width: '100%', marginTop: isVisibleContact ? 25 : 10 },
            ]}
          >
            <Text
              style={[
                styles.agentName,
                { fontSize: isMobile ? 24 : 32, textAlign: !isMobile ? 'left' : 'center' },
              ]}
            >
              {capitalize(item.agentName) || "Rajendra P"}
            </Text>
            <View
              style={[
                styles.locationRow,
                { justifyContent: !isMobile ? 'flex-start' : 'center' },
              ]}
            >
              <MapPin size={isMobile ? 14 : 18} color="#EE2529" />
              <Text style={[styles.locationText, isMobile && { fontSize: 14 }]}>{item.location || "Pune"}</Text>
              <Text style={[styles.reraText, isMobile && { fontSize: 14 }]}>RERA : {item.rera || "123456789"}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.specializationContainer}>
              <Text
                style={[
                  styles.specLabel,
                  { textAlign: !isMobile ? 'left' : 'center' },
                ]}
              >
                Specializes In:
              </Text>
              {(item.tags && item.tags.length > 0 ? item.tags : ['MNC Client', 'Industrial', 'Residential', 'Commercial', 'Office Lease']).map((tag: any, idx: number) => (
                <View key={idx} style={styles.tag}>
                  <Text style={[styles.tagText, isMobile && { fontSize: 14 }]}>{tag}</Text>
                </View>
              ))}
            </View>

            <View style={styles.statsColumn}>
              <View style={styles.statLine}>
                <Text style={[styles.statHighlight, isMobile && { fontSize: 16 }]}>{item.propertiesListed || 7}</Text>
                <Text style={[styles.statLabel, isMobile && { fontSize: 14 }]}>Properties Listed</Text>
              </View>
              <View style={styles.statLine}>
                <Text style={[styles.statHighlight, isMobile && { fontSize: 16 }]}>{item.dealsClosed || 45}</Text>
                <Text style={[styles.statLabel, isMobile && { fontSize: 14 }]}>Deals Closed</Text>
              </View>
            </View>
          </View>
        </View>
      </Animated.View>

      {/* Back Side */}
      <Animated.View style={[styles.card, styles.cardBack, backAnimatedStyle, { width: '100%' }]}>
        <Image 
          source={bottom} 
          style={styles.bottomOrnament} 
          resizeMode="contain" 
        />
        
        <View style={styles.cardContentBack}>
          <View style={styles.backHeader}>
            <Text style={styles.backAgentName}>{capitalize(item.agentName) || "Rajendra P"}</Text>
            <Text style={styles.backCompany}>{capitalize(item.name) || "APJ Realtors"}</Text>
          </View>
          
          <View style={styles.backDivider} />
          
          <Text style={styles.backDescription}>
            {item.description || `${item.name || "APJ Realtors"} is a dynamic real estate firm dedicated to helping clients find their perfect property. Whether you're buying, selling, or investing, our expert team combines market insight with personalized service to ensure a smooth and successful experience. At APJ, we make your real estate journey our top priority`}
          </Text>
          
          <View style={styles.backFooter}>
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                onToggleContact();
              }}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#EE2529', '#C73834']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.backContactBtn}
              >
                <Text style={styles.backContactBtnText}>Contact Broker</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.shareBtn}
              onPress={(e) => e.stopPropagation()}
            >
              <Image source={share} style={{ width: 18, height: 18 }} />
              <Text style={styles.shareText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 30,
    ...Platform.select({
      web: {
        perspective: 1000,
      } as any,
    }),
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
    backfaceVisibility: 'hidden',
    ...Platform.select({
      web: {
        cursor: 'pointer',
      } as any,
    }),
  },
  cardBack: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  cardContent: {
    padding: 30,
    gap: 30,
    zIndex: 2,
  },
  cardContentBack: {
    padding: 30,
    flex: 1,
    justifyContent: 'space-between',
    zIndex: 2,
  },
  backHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 15,
  },
  backAgentName: {
    fontSize: 32,
    fontWeight: '700',
    color: '#EE2529',
    fontFamily: 'Montserrat',
  },
  backCompany: {
    fontSize: 18,
    fontWeight: '600',
    color: '#EE2529',
    fontFamily: 'Montserrat',
  },
  backDivider: {
    height: 2,
    backgroundColor: '#EE2529',
    width: '100%',
    marginVertical: 15,
  },
  backDescription: {
    fontSize: 18,
    color: '#444',
    lineHeight: 28,
    fontWeight: '400',
    fontFamily: 'Montserrat',
  },
  backFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  backContactBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  backContactBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    fontFamily: 'Montserrat',
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#767676',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  shareText: {
    fontSize: 16,
    color: '#767676',
    fontWeight: '600',
    fontFamily: 'Montserrat',
  },
  leftSection: {
    justifyContent: 'space-between',
  },
  brokerCompany: {
    fontSize: 24,
    fontWeight: '600',
    color: '#EE2529',
    marginBottom: 20,
    fontFamily: 'Montserrat',
  },
  brokerImage: {
    width: 140,
    height: 140,
    borderRadius: 16,
    marginBottom: 20,
    backgroundColor: '#f5f5f5',
  },
  contactBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignItems: 'center',
    width: 160,
    marginTop: 10,
  },
  contactBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
    fontFamily: 'Montserrat',
  },
  contactInfoContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
    width: '100%',
    borderWidth: 1,
    borderColor: '#eee',
    gap: 10,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contactInfoText: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
    fontFamily: 'Montserrat',
  },
  closeContactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    marginTop: 5,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f5f5f5',
  },
  hideContactText: {
    fontSize: 12,
    color: '#EE2529',
    fontWeight: 'bold',
    fontFamily: 'Montserrat',
  },
  rightSection: {
    justifyContent: 'flex-start',
  },
  agentName: {
    fontSize: 32,
    fontWeight: '600',
    color: '#EE2529',
    marginBottom: 8,
    fontFamily: 'Montserrat',
  },
  locationRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
    marginBottom: 15,
  },
  locationText: {
    fontSize: 18,
    color: '#666',
    fontWeight: '400',
    fontFamily: 'Montserrat',
  },
  reraText: {
    fontSize: 18,
    color: '#666',
    fontWeight: '400',
    marginLeft: 10,
    fontFamily: 'Montserrat',
  },
  divider: {
    height: 2,
    backgroundColor: '#EE2529',
    marginBottom: 25,
    width: '100%',
    opacity: 0.8,
  },
  specializationContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 25,
    gap: 12,
  },
  specLabel: {
    fontSize: 18,
    fontWeight: '400',
    color: '#666',
    marginRight: 5,
  },
  tag: {
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 15,
  },
  tagText: {
    fontSize: 18,
    color: '#333',
    fontWeight: '400',
    fontFamily: 'Montserrat',
  },
  statsColumn: {
    gap: 10,
    marginTop: 4,
  },
  statLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statHighlight: {
    color: '#EE2529',
    fontWeight: '600',
    fontSize: 18,
    fontFamily: 'Montserrat',
  },
  statLabel: {
    fontSize: 18,
    color: '#767676',
    fontWeight: '400',
    fontFamily: 'Montserrat',
  },
  topOrnament: {
    position: 'absolute',
    left: 30,
    top: 0,
    bottom: 0,
    width: 250,
    opacity: 1.0,
    zIndex: -1,
  },
  bottomOrnament: {
    position: 'absolute',
    bottom: -28,
    right: 0,
    width: 200,
    height: 200,
    opacity: 1.0,
    zIndex: -1,
  },
});

export default BrokerCard;
