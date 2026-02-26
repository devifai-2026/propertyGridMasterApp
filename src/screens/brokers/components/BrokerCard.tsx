import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { MapPin, Phone, Mail, X } from 'lucide-react-native';

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
    <View style={[styles.card, { width: isDesktop ? '48%' : '100%' }]}>
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
              ? { flex: 1, alignItems: 'flex-start' }
              : { width: '100%', alignItems: 'center' },
          ]}
        >
          <View style={{ alignItems: isMobile ? 'center' : 'flex-start' }}>
            <Image
              source={require('../../../assets/ExploreBrokers/cardImg.png')}
              style={styles.brokerImage}
              resizeMode="cover"
            />
            {!isMobile && <Text style={styles.brokerCompany}>{item.name}</Text>}
          </View>

          {isVisibleContact ? (
            <View style={styles.contactInfoContainer}>
              <View style={styles.contactItem}>
                <Phone size={14} color="#666" />
                <Text style={styles.contactInfoText}>{item.mobileNumber}</Text>
              </View>
              <View style={styles.contactItem}>
                <Mail size={14} color="#666" />
                <Text style={styles.contactInfoText}>{item.email}</Text>
              </View>
              <TouchableOpacity
                onPress={onToggleContact}
                style={styles.closeContactBtn}
              >
                <X size={14} color="#EE2529" />
                <Text style={styles.hideContactText}>Close</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.contactBtn}
              onPress={onToggleContact}
            >
              <Text style={styles.contactBtnText}>Contact Broker</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Right Section */}
        <View
          style={[
            styles.rightSection,
            !isMobile
              ? { flex: 1.5 }
              : { width: '100%', marginTop: isVisibleContact ? 25 : 0 },
          ]}
        >
          <Text
            style={[
              styles.agentName,
              { textAlign: !isMobile ? 'left' : 'center' },
            ]}
          >
            {item.agentName}
          </Text>
          <View
            style={[
              styles.locationRow,
              { justifyContent: !isMobile ? 'flex-start' : 'center' },
            ]}
          >
            <MapPin size={14} color="#EE2529" />
            <Text style={styles.locationText}>{item.location}</Text>
            <Text style={styles.reraText}>RERA: {item.rera}</Text>
          </View>

          <View
            style={[
              styles.divider,
              { alignSelf: !isMobile ? 'flex-start' : 'center' },
            ]}
          />

          <View style={styles.specializationContainer}>
            <Text
              style={[
                styles.specLabel,
                { textAlign: !isMobile ? 'left' : 'center' },
              ]}
            >
              Expertise
            </Text>
            <View
              style={[
                styles.tagsRow,
                { justifyContent: !isMobile ? 'flex-start' : 'center' },
              ]}
            >
              {item.tags.map((tag: any, idx: number) => (
                <View key={idx} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>

          <View
            style={[
              styles.statsRow,
              {
                flexDirection: 'row',
                justifyContent: !isMobile ? 'flex-start' : 'center',
                gap: 25,
              },
            ]}
          >
            <View style={styles.statGroup}>
              <Text style={styles.statHighlight}>{item.propertiesListed}</Text>
              <Text style={styles.statLabel}>Properties</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statGroup}>
              <Text style={styles.statHighlight}>{item.dealsClosed}</Text>
              <Text style={styles.statLabel}>Deals</Text>
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
    borderRadius: 16,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 20,
    elevation: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f2f2f2',
  },
  cardContent: {
    padding: 15,
    gap: 15,
  },
  leftSection: {
    justifyContent: 'space-between',
  },
  brokerCompany: {
    fontSize: 14,
    fontWeight: '600',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },
  brokerImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  contactBtn: {
    backgroundColor: '#EE2529',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 160,
    alignItems: 'center',
    marginTop: 15,
  },
  contactBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  contactInfoContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginTop: 15,
    width: '100%',
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    gap: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  contactInfoText: {
    fontSize: 14,
    color: '#1a1a1a',
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  closeContactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 4,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f5f5f5',
  },
  hideContactText: {
    fontSize: 12,
    color: '#EE2529',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  rightSection: {
    // No fixed flex to avoid clashing in column layout
  },
  agentName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#EE2529',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
  },
  reraText: {
    fontSize: 14,
    color: '#666',
  },
  divider: {
    height: 1,
    backgroundColor: '#EE2529',
    marginVertical: 10,
    width: 50,
  },
  specializationContainer: {
    marginBottom: 15,
  },
  specLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#efefef',
  },
  tagText: {
    fontSize: 11,
    color: '#555',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statsRow: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  statGroup: {
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#f0f0f0',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  statHighlight: {
    color: '#1a1a1a',
    fontWeight: '300',
    fontSize: 22,
  },
});

export default BrokerCard;
