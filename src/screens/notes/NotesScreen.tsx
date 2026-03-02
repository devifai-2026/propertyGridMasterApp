import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';
import {
  MessageSquare,
  Clock,
  Building2,
  MapPin,
  User,
  ChevronRight,
} from 'lucide-react-native';
import Layout from '../../layout/Layout';
import { useNavigation } from '../../context/NavigationContext';
import { useAuth } from '../../context/AuthContext';
import { usePropertyAPIs } from '../../../helpers/hooks/propertyAPIs/usePropertyApis';
import { COLORS } from '../../constants/theme';

const NotesScreen = () => {
  const { width } = useWindowDimensions();
  const { isLoggedIn, isLoading: authLoading } = useAuth();
  const { navigate } = useNavigation();
  const { getOwnerNotes, loading: notesLoading } = usePropertyAPIs();
  const [notes, setNotes] = useState<any[]>([]);

  const isDesktop = width >= 1024;
  const isTablet = width >= 768 && width < 1024;

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, authLoading, navigate]);

  useEffect(() => {
    if (isLoggedIn) {
      getOwnerNotes(
        data => {
          console.log('Notes data:', data);
          setNotes(data || []);
        },
        err => {
          console.error('Error fetching notes:', err);
        },
      );
    }
  }, [isLoggedIn]);

  if (authLoading || !isLoggedIn) {
    return null;
  }

  // Group notes by propertyId
  const grouped: Record<string, { property: any; notes: any[] }> = {};
  notes.forEach(note => {
    const pid = note.propertyId || 'unknown';
    if (!grouped[pid]) {
      grouped[pid] = {
        property: {
          propertyId: pid,
          microMarket: note.microMarket,
          location: note.location,
          city: note.city,
        },
        notes: [],
      };
    }
    grouped[pid].notes.push(note);
  });
  const propertyGroups = Object.values(grouped);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Layout>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.content,
            isDesktop && styles.desktopContent,
            isTablet && styles.tabletContent,
          ]}
        >
          {/* Header */}
          <View style={styles.pageHeader}>
            <View style={styles.headerInfo}>
              <Text style={styles.pageTitle}>Activity Notes</Text>
              <Text style={styles.pageSubtitle}>
                All notes and updates across your properties.
              </Text>
            </View>
            {notes.length > 0 && !notesLoading && (
              <View style={styles.countBadge}>
                <Text style={styles.countText}>{notes.length} Notes</Text>
              </View>
            )}
          </View>

          {notesLoading && notes.length === 0 ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loaderText}>Syncing latest notes...</Text>
            </View>
          ) : propertyGroups.length === 0 ? (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIllustration}>
                <View
                  style={[
                    styles.pulseCircle,
                    { width: 120, height: 120, opacity: 0.1 },
                  ]}
                />
                <View
                  style={[
                    styles.pulseCircle,
                    { width: 100, height: 100, opacity: 0.2 },
                  ]}
                />
                <View style={styles.emptyIconCircle}>
                  <MessageSquare size={40} color={COLORS.primary} />
                </View>
              </View>
              <Text style={styles.emptyTitle}>Your feed is quiet</Text>
              <Text style={styles.emptySubtitle}>
                No field notes have been added yet. Check back soon for updates
                on your property portfolio.
              </Text>
              <TouchableOpacity
                style={styles.backBtn}
                onPress={() => navigate('/dashboard')}
              >
                <Text style={styles.backBtnText}>Return to Dashboard</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.groupsList}>
              {propertyGroups.map(group => (
                <View key={group.property.propertyId} style={styles.propertyCard}>
                  {/* Property Header */}
                  <TouchableOpacity
                    style={styles.propertyHeader}
                    activeOpacity={0.7}
                    onPress={() =>
                      navigate(`/propertyDetails/${group.property.propertyId}`)
                    }
                  >
                    <View style={{ flex: 1 }}>
                      <View style={styles.propertyChips}>
                        {group.property.microMarket && (
                          <View style={styles.chip}>
                            <Building2 size={11} color="#666" />
                            <Text style={styles.chipText}>
                              {group.property.microMarket}
                            </Text>
                          </View>
                        )}
                        {group.property.location && (
                          <View style={styles.chip}>
                            <MapPin size={11} color="#666" />
                            <Text style={styles.chipText}>
                              {group.property.location}
                            </Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.notesCount}>
                        {group.notes.length}{' '}
                        {group.notes.length === 1 ? 'note' : 'notes'}
                      </Text>
                    </View>
                    <ChevronRight size={20} color="#9CA3AF" />
                  </TouchableOpacity>

                  {/* All Notes */}
                  <View style={styles.notesList}>
                    {group.notes.map((note: any, idx: number) => (
                      <View
                        key={note.noteId || idx}
                        style={[
                          styles.noteItem,
                          idx === group.notes.length - 1 && { borderBottomWidth: 0 },
                        ]}
                      >
                        <View style={styles.noteHeader}>
                          <View style={styles.avatarContainer}>
                            <View
                              style={[
                                styles.iconCircle,
                                note.isOwnerNote && { backgroundColor: '#EDE9FE' },
                              ]}
                            >
                              {note.isOwnerNote ? (
                                <MessageSquare
                                  size={14}
                                  color="#7C3AED"
                                  strokeWidth={2.5}
                                />
                              ) : (
                                <User
                                  size={14}
                                  color={COLORS.primary}
                                  strokeWidth={2.5}
                                />
                              )}
                            </View>
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.noteSender}>
                              {note.addedBy || 'Unknown'}
                            </Text>
                            <Text style={styles.noteRole}>
                              {note.isOwnerNote ? 'Client' : 'Property Consultant'}
                            </Text>
                          </View>
                          <View style={styles.timeBadge}>
                            <Clock size={10} color="#9CA3AF" />
                            <Text style={styles.timeText}>
                              {formatDate(note.createdAt)}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.messageBubble}>
                          <Text style={styles.noteText}>
                            {note.isEdited && note.adminNote
                              ? note.adminNote
                              : note.originalNote || note.note || ''}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>

                  {/* View Property */}
                  <TouchableOpacity
                    style={styles.cardFooter}
                    activeOpacity={0.7}
                    onPress={() =>
                      navigate(`/propertyDetails/${group.property.propertyId}`)
                    }
                  >
                    <Text style={styles.viewDetailsText}>
                      View Property Details →
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  content: {
    width: '100%',
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  tabletContent: {
    maxWidth: 800,
  },
  desktopContent: {
    maxWidth: 900,
    paddingTop: 48,
  },
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  headerInfo: {
    flex: 1,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#111827',
    letterSpacing: -0.5,
  },
  pageSubtitle: {
    fontSize: 15,
    color: '#6B7280',
    marginTop: 4,
    fontWeight: '500',
  },
  countBadge: {
    backgroundColor: '#FFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  countText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
  },
  loaderContainer: {
    paddingTop: 100,
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 16,
    color: '#6B7280',
    fontWeight: '600',
    fontSize: 16,
  },
  // ── Property groups ──
  groupsList: {
    gap: 20,
  },
  propertyCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  propertyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  propertyChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 4,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  chipText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '700',
  },
  notesCount: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  // ── Notes list ──
  notesList: {
    paddingHorizontal: 20,
  },
  noteItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  noteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  avatarContainer: {},
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noteSender: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
  },
  noteRole: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  messageBubble: {
    backgroundColor: '#F9FAFB',
    padding: 14,
    borderRadius: 16,
  },
  noteText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 22,
    fontWeight: '500',
  },
  // ── Footer ──
  cardFooter: {
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    alignItems: 'center',
  },
  viewDetailsText: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '700',
  },
  // ── Empty ──
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: '#FFF',
    borderRadius: 32,
    marginTop: 40,
  },
  emptyIllustration: {
    width: 160,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  pulseCircle: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: COLORS.primary,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    maxWidth: 280,
  },
  backBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  backBtnText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 16,
  },
});

export default NotesScreen;
