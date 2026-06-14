import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  SafeAreaView,
  TextInput,
} from 'react-native';
import {
  ChevronLeft,
  Building,
  Clock,
  MapPin,
  ExternalLink,
  MessageSquare,
  Send,
} from 'lucide-react-native';
import { usePropertyAPIs } from '../../../helpers/hooks/propertyAPIs/usePropertyApis';
import { formatINR } from '../../../helpers/formatPrice';
import { formatDateTime } from '../../../helpers/formatDate';
import { useNavigation } from '../../context/NavigationContext';
import { COLORS } from '../../constants/theme';
import Layout from '../../layout/Layout';

const { width } = Dimensions.get('window');
const isDesktop = width > 768;

const EnquiryDetailsScreen = () => {
  const { currentPath, navigate, goBack } = useNavigation();
  const inquiryId = currentPath.split('/enquiry-details/')[1];
  const [inquiry, setInquiry] = useState<any>(null);
  const {
    getInquiryById,
    getInquiryMessages,
    postInquiryMessage,
    loading,
  } = usePropertyAPIs();

  // Conversation thread between the client (this user) and the assigned dealer.
  const [messages, setMessages] = useState<any[]>([]);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);

  const loadMessages = useCallback(() => {
    if (!inquiryId) return;
    getInquiryMessages(inquiryId, (data: any) => {
      setMessages(Array.isArray(data) ? data : []);
    });
  }, [inquiryId]);

  useEffect(() => {
    if (inquiryId) {
      getInquiryById(inquiryId, (data: any) => {
        setInquiry(data);
      });
      loadMessages();
    }
  }, [inquiryId]);

  const sendReply = () => {
    if (!reply.trim() || !inquiryId) return;
    setSending(true);
    postInquiryMessage(
      inquiryId,
      reply.trim(),
      () => {
        setSending(false);
        setReply('');
        loadMessages();
      },
      () => setSending(false),
    );
  };

  if (loading && !inquiry) {
    return (
      <Layout>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Fetching enquiry details...</Text>
        </View>
      </Layout>
    );
  }

  if (!inquiry && !loading) {
    return (
      <Layout>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Enquiry not found.</Text>
          <TouchableOpacity style={styles.backBtn} onPress={goBack}>
            <Text style={styles.backBtnText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </Layout>
    );
  }

  return (
    <Layout>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={goBack} style={styles.backButton}>
              <ChevronLeft size={24} color={COLORS.textDark} />
              <Text style={styles.headerTitle}>Enquiry Details</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.mainCard, isDesktop && styles.desktopCard]}>
            {/* Inquiry Context */}
            <View style={styles.inquiryContext}>
               <View style={styles.dateBadge}>
                  <Text style={styles.dateText}>
                    Submitted on {formatDateTime(inquiry.createdAt)}
                  </Text>
               </View>
            </View>

            <View style={styles.sectionsContainer}>
                {/* Inquiry Content Section */}
                <View style={[styles.section, { flex: 1.5 }]}>
                  <View style={styles.sectionHeader}>
                    <MessageSquare size={20} color={COLORS.primary} />
                    <Text style={styles.sectionTitle}>Your Message</Text>
                  </View>
                  <View style={styles.messageCard}>
                    <Text style={styles.messageText}>{inquiry.inquiry}</Text>
                  </View>
                </View>

                {/* Property Summary Section */}
                <View style={[styles.section, { flex: 1 }]}>
                  <View style={styles.sectionHeader}>
                    <Building size={20} color={COLORS.primary} />
                    <Text style={styles.sectionTitle}>Property Reference</Text>
                  </View>
                  <View style={styles.propertyCard}>
                    <Text style={styles.propType}>{inquiry.property?.propertyType} Space</Text>
                    <View style={styles.locRow}>
                      <MapPin size={16} color="#999" />
                      <Text style={styles.locValue}>
                        {inquiry.property?.city}, {inquiry.property?.state}
                      </Text>
                    </View>
                    
                    <View style={styles.divider} />
                    
                    <View style={styles.priceRow}>
                        <View>
                            <Text style={styles.priceLabel}>Selling Price</Text>
                            <Text style={styles.priceValue}>{formatINR(inquiry.property?.sellingPrice)}</Text>
                        </View>
                        <TouchableOpacity 
                            style={styles.externalLink}
                            onPress={() => navigate(`/propertyDetails/${inquiry.propertyId}`)}
                        >
                            <ExternalLink size={20} color={COLORS.primary} />
                        </TouchableOpacity>
                    </View>
                  </View>
                </View>
            </View>

            {/* Inquirer Details (If needed or available) */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Clock size={20} color={COLORS.primary} />
                    <Text style={styles.sectionTitle}>Status Information</Text>
                </View>
                <View style={styles.statusCard}>
                    <View style={styles.statusItem}>
                        <Text style={styles.statusLabel}>Current Status</Text>
                        <View style={styles.statusBadge}>
                           <Text style={styles.statusBadgeText}>{inquiry.assignedTo ? 'Assigned' : 'Pending'}</Text>
                        </View>
                    </View>
                    <View style={styles.statusItem}>
                        <Text style={styles.statusLabel}>Priority</Text>
                        <Text style={styles.statusValue}>{inquiry.priority || 'Normal'}</Text>
                    </View>
                </View>
            </View>
          </View>

          {/* Conversation with the assigned dealer */}
          <View style={styles.chatSection}>
            <View style={styles.sectionHeader}>
              <MessageSquare size={20} color={COLORS.primary} />
              <Text style={styles.sectionTitle}>Conversation</Text>
            </View>

            {messages.length === 0 ? (
              <Text style={styles.chatEmpty}>
                No messages yet. Send a message to the assigned dealer below.
              </Text>
            ) : (
              <View style={{ gap: 10 }}>
                {messages.map((m: any) => {
                  const mine = m.senderType === 'broker';
                  return (
                    <View
                      key={m.id}
                      style={[styles.bubbleRow, mine ? styles.bubbleRowMine : styles.bubbleRowTheirs]}
                    >
                      <View style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleTheirs]}>
                        <Text style={[styles.bubbleText, mine && { color: '#fff' }]}>
                          {m.displayMessage || m.message}
                        </Text>
                      </View>
                      <Text style={styles.bubbleMeta}>
                        {mine ? 'You' : 'Dealer'} ·{' '}
                        {new Date(m.createdAt).toLocaleString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Text>
                    </View>
                  );
                })}
              </View>
            )}

            <View style={styles.composer}>
              <TextInput
                value={reply}
                onChangeText={setReply}
                placeholder="Write a reply…"
                placeholderTextColor="#9CA3AF"
                style={styles.composerInput}
                multiline
              />
              <TouchableOpacity
                onPress={sendReply}
                disabled={sending || !reply.trim()}
                style={[styles.composerBtn, (sending || !reply.trim()) && { opacity: 0.5 }]}
              >
                <Send size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  chatSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  chatEmpty: {
    fontSize: 13,
    color: '#999',
    marginTop: 10,
    marginBottom: 6,
  },
  bubbleRow: {
    maxWidth: '85%',
  },
  bubbleRowMine: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  bubbleRowTheirs: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  bubble: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
  },
  bubbleMine: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4,
  },
  bubbleTheirs: {
    backgroundColor: '#F2F2F2',
    borderBottomLeftRadius: 4,
  },
  bubbleText: {
    fontSize: 14,
    color: '#262626',
    fontFamily: 'Montserrat',
  },
  bubbleMeta: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 4,
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginTop: 16,
  },
  composerInput: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#262626',
    backgroundColor: '#FAFAFA',
  },
  composerBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    padding: isDesktop ? 40 : 20,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
    color: COLORS.textSecondary,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    fontSize: 18,
    color: COLORS.textDark,
    marginBottom: 20,
  },
  backBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  backBtnText: {
    color: '#FFF',
    fontWeight: '600',
  },
  header: {
    marginBottom: 32,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  mainCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: isDesktop ? 40 : 24,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  desktopCard: {
    // Optional extra styling for desktop
  },
  inquiryContext: {
    marginBottom: 32,
    alignItems: 'flex-start',
  },
  dateBadge: {
    backgroundColor: '#FFF5F5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 100,
  },
  dateText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  sectionsContainer: {
    flexDirection: isDesktop ? 'row' : 'column',
    gap: 32,
    marginBottom: 32,
  },
  section: {
    marginBottom: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  messageCard: {
    backgroundColor: '#FAFAFA',
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EEE',
    minHeight: 150,
  },
  messageText: {
    fontSize: 16,
    color: '#444',
    lineHeight: 26,
  },
  propertyCard: {
    backgroundColor: '#FFF',
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EEE',
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 1,
  },
  propType: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textDark,
    marginBottom: 8,
  },
  locRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  locValue: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginBottom: 20,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
    fontWeight: '600',
  },
  priceValue: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.primary,
  },
  externalLink: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.lightRed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusCard: {
    flexDirection: 'row',
    gap: 40,
    backgroundColor: '#FAFAFA',
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  statusItem: {
    gap: 8,
  },
  statusLabel: {
    fontSize: 13,
    color: '#999',
    fontWeight: '600',
  },
  statusValue: {
    fontSize: 15,
    color: '#333',
    fontWeight: '700',
  },
  statusBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  statusBadgeText: {
    color: '#2E7D32',
    fontSize: 12,
    fontWeight: '700',
  },
});

export default EnquiryDetailsScreen;
