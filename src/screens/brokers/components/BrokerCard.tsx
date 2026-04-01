import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';
import { MapPin, Phone, Mail, X } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import bottom from "../../../assets/ExploreBrokers/bottom.png";
import top from "../../../assets/ExploreBrokers/top.png";

interface BrokerCardProps {
  item: any;
  isMobile: boolean;
  isDesktop: boolean;
  isVisibleContact: boolean;
  onToggleContact: () => void;
}

const BrokerCard: React.FC<BrokerCardProps> = ({
  item,
  isMobile,
  isDesktop,
  isVisibleContact,
  onToggleContact,
}) => {
  return (
    <View style={[styles.card, { width: isDesktop ? '49.3%' : '100%' }]}>
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
            <Text style={styles.brokerCompany}>{item.name || "APJ Realtors"}</Text>
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
                onPress={onToggleContact}
                style={styles.closeContactBtn}
              >
                <X size={12} color="#EE2529" />
                <Text style={styles.hideContactText}>Close</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={onToggleContact}
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
            {item.agentName || "Rajendra P"}
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

    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
    ...Platform.select({
      web: {
        cursor: 'default',
      } as any,
    }),
  },
  cardContent: {
    padding: 30,
    gap: 30,
    zIndex: 2,
  },
  leftSection: {
    justifyContent: 'space-between',
  },
  brokerCompany: {
    fontSize: 24,
    fontWeight: '600',
    color: '#EE2529',
    marginBottom: 20,
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
  },
  rightSection: {
    justifyContent: 'flex-start',
  },
  agentName: {
    fontSize: 32,
    fontWeight: '600',
    color: '#EE2529',
    marginBottom: 8,
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
  },
  reraText: {
    fontSize: 18,
    color: '#666',
    fontWeight: '400',
    marginLeft: 10,
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
  },
  statsColumn: {
    gap: 10,
    marginTop: 10,
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
  },
  statLabel: {
    fontSize: 18,
    color: '#767676',
    fontWeight: '400',
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
