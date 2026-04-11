import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  useWindowDimensions,
} from 'react-native';
import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  ExternalLink,
} from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';

const ContactCards = () => {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 768;

  const cards = [
    {
      id: 1,
      icon: <MapPin size={24} color="#F7C952" />,
      title: 'Office Address',
      content: '123 Business Street, Floor 15 Mumbai, Maharashtra, 10001',
      buttonText: 'View On Maps',
      buttonIcon: <ExternalLink size={16} color="#FFF" />,
      action: () => Linking.openURL('https://maps.google.com'), // Placeholder link
    },
    {
      id: 2,
      icon: <Phone size={24} color="#F7C952" />,
      title: 'Phone',
      content: '+1 (555) 123-4567',
      buttonText: 'Call Now',
      buttonIcon: <ExternalLink size={16} color="#FFF" />,
      action: () => Linking.openURL('tel:+15551234567'),
    },
    {
      id: 3,
      icon: <Mail size={24} color="#F7C952" />,
      title: 'Email',
      content: 'contact@platform.com',
      buttonText: 'Send Email',
      buttonIcon: <ExternalLink size={16} color="#FFF" />,
      action: () => Linking.openURL('mailto:contact@platform.com'),
    },
    {
      id: 4,
      icon: <MessageCircle size={24} color="#F7C952" />,
      title: 'WhatsApp',
      content: 'Quick support chat',
      buttonText: 'Start Chat',
      buttonIcon: <ExternalLink size={16} color="#FFF" />,
      action: () => Linking.openURL('https://wa.me/'), // Placeholder link
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={[styles.description, isSmallScreen && { fontSize: 15, textAlign: 'center' }]}>
        Whether you're an investor looking for opportunities, a property owner
        wanting to list, or a developer seeking partnerships, we're here to help
        you succeed.
      </Text>

      <View style={styles.grid}>
        {cards.map(card => (
          <View key={card.id} style={[styles.card, { width: isSmallScreen ? '100%' : '48%' }]}>
            <View style={styles.header}>
              {card.icon}
              <Text style={[styles.title, isSmallScreen && { fontSize: 16 }]}>{card.title}</Text>
            </View>
            <Text style={[styles.content, isSmallScreen && { fontSize: 14 }]}>{card.content}</Text>
            <TouchableOpacity onPress={card.action}>
              <LinearGradient
                colors={['#EE2529', '#C73834']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.button, isSmallScreen && { width: '100%' }]}
              >
                <Text style={[styles.buttonText, isSmallScreen && { fontSize: 16 }]}>{card.buttonText}</Text>
                {card.buttonIcon}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    marginBottom: 20,
  },
  description: {
    fontSize: 20,
    fontWeight: 400,
    color: '#262626',
    marginBottom: 20,
    lineHeight: 25,
    fontFamily:'Montserrat',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,

    minHeight: 200,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
    color: '#262626',
    fontFamily: 'Montserrat',
    lineHeight:25,
  },
  content: {
    fontSize: 16,
    color: '#767676',
    marginBottom: 20,
    lineHeight: 24,
    fontFamily: 'Montserrat',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
    marginTop: 12,
    width: 220,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Montserrat',
  },
});

export default ContactCards;
