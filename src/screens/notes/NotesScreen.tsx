import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  FlatList,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';
import {
  MessageSquare,
  Clock,
  Building2,
  MapPin,
  User,
} from 'lucide-react-native';
import Layout from '../../layout/Layout';
import { useNavigation } from '../../context/NavigationContext';
import { useAuth } from '../../context/AuthContext';
import { usePropertyAPIs } from '../../../helpers/hooks/propertyAPIs/usePropertyApis';
import { COLORS } from '../../constants/theme';

const NotesScreen = () => {
  const { width } = useWindowDimensions();
  const { isLoggedIn, isLoading: authLoading, user: currentUser } = useAuth();
  const { navigate } = useNavigation();
  const { getOwnerNotes, loading: notesLoading } = usePropertyAPIs();
  const [notes, setNotes] = useState<any[]>([]);

  const isDesktop = width >= 1024;
  const isTablet = width >= 768 && width < 1024;
  const numColumns = isDesktop ? 2 : 1;

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, authLoading, navigate]);

  useEffect(() => {
    if (isLoggedIn) {
      getOwnerNotes(
        data => {
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

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.noteItem,
        isDesktop && styles.desktopNoteItem,
        !item.read && styles.unreadNoteItem,
      ]}
      activeOpacity={0.7}
      onPress={() => navigate(`/list-property/${item.propertyId}`)}
    >
      <View style={styles.noteHeader}>
        <View style={styles.agentInfo}>
          <View style={styles.avatarContainer}>
            <View style={styles.iconCircle}>
              <User size={18} color={COLORS.primary} strokeWidth={2.5} />
            </View>
            <View style={styles.onlineBadge} />
          </View>
          <View>
            <Text style={styles.agentName}>{item.addedBy}</Text>
            <Text style={styles.agentTitle}>Property Consultant</Text>
          </View>
        </View>
        <View style={styles.timeBadge}>
          <Clock size={12} color={COLORS.primary} style={{ marginRight: 4 }} />
          <Text style={styles.timeText}>
            {new Date(item.createdAt).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
            })}
          </Text>
        </View>
      </View>

      <View style={styles.propertySection}>
        <View style={styles.propertyChip}>
          <Building2 size={12} color="#666" style={{ marginRight: 4 }} />
          <Text style={styles.chipText}>
            {item.microMarket || 'Main Market'}
          </Text>
        </View>
        <View style={styles.propertyChip}>
          <MapPin size={12} color="#666" style={{ marginRight: 4 }} />
          <Text style={styles.chipText}>{item.location}</Text>
        </View>
      </View>

      <View style={styles.messageBubble}>
        <MessageSquare size={16} color="#999" style={styles.quoteIcon} />
        <Text style={styles.noteText} numberOfLines={isDesktop ? 3 : undefined}>
          {item.note}
        </Text>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.viewDetailsText}>View Property Details →</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <Layout>
      <View style={styles.container}>
        <View
          style={[
            styles.content,
            isDesktop && styles.desktopContent,
            isTablet && styles.tabletContent,
          ]}
        >
          <View style={styles.pageHeader}>
            <View style={styles.headerInfo}>
              <Text style={styles.pageTitle}>Activity Notes</Text>
              <Text style={styles.pageSubtitle}>
                Real-time updates and observations from our field agents.
              </Text>
            </View>
            {notes.length > 0 && !notesLoading && (
              <View style={styles.countBadge}>
                <Text style={styles.countText}>{notes.length} Total</Text>
              </View>
            )}
          </View>

          {notesLoading && notes.length === 0 ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loaderText}>Syncing latest notes...</Text>
            </View>
          ) : notes.length === 0 ? (
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
                No field notes have been added yet. check back soon for updates
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
            <FlatList
              data={notes}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              numColumns={numColumns}
              key={numColumns} // Force re-render on column change
              columnWrapperStyle={isDesktop ? styles.columnWrapper : undefined}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    minHeight: '100%',
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
    maxWidth: 1200,
    paddingTop: 48,
  },
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 32,
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
    flex: 1,
    paddingTop: 100,
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 16,
    color: '#6B7280',
    fontWeight: '600',
    fontSize: 16,
  },
  listContainer: {
    paddingBottom: 40,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    gap: 20,
  },
  noteItem: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  desktopNoteItem: {
    flex: 1,
    maxWidth: '48.5%',
    marginBottom: 20,
  },
  unreadNoteItem: {
    borderColor: 'rgba(238, 37, 41, 0.2)',
    backgroundColor: '#FFFBFB',
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  agentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  agentName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  agentTitle: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 1,
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  timeText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '700',
  },
  propertySection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  propertyChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  chipText: {
    fontSize: 11,
    color: '#4B5563',
    fontWeight: '600',
  },
  messageBubble: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 20,
    position: 'relative',
  },
  quoteIcon: {
    position: 'absolute',
    top: -8,
    left: 12,
    backgroundColor: '#F9FAFB',
    padding: 2,
  },
  noteText: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 24,
    fontWeight: '500',
  },
  cardFooter: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  viewDetailsText: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '700',
    textAlign: 'center',
  },
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
