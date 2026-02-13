import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native';
import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  ExternalLink,
} from 'lucide-react-native';

const ContactCards = () => {
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
      <Text style={styles.description}>
        Whether you're an investor looking for opportunities, a property owner
        wanting to list, or a developer seeking partnerships, we're here to help
        you succeed.
      </Text>

      <View style={styles.grid}>
        {cards.map(card => (
          <View key={card.id} style={styles.card}>
            <View style={styles.header}>
              {card.icon}
              <Text style={styles.title}>{card.title}</Text>
            </View>
            <Text style={styles.content}>{card.content}</Text>
            <TouchableOpacity style={styles.button} onPress={card.action}>
              <Text style={styles.buttonText}>{card.buttonText}</Text>
              {card.buttonIcon}
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    lineHeight: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    width: '100%', // Full width on mobile, adjust for tablet later if needed
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#eee',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    fontSize: 14,
    color: '#767676',
    marginBottom: 16,
    flex: 1,
  },
  button: {
    backgroundColor: '#EE2529',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ContactCards;
