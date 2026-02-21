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
      style={styles.noteItem}
      onPress={() => navigate(`/list-property/${item.propertyId}`)}
    >
      <View style={styles.noteHeader}>
        <View style={styles.agentInfo}>
          <View style={styles.iconCircle}>
            <User size={16} color={COLORS.primary} />
          </View>
          <View>
            <Text style={styles.agentName}>{item.addedBy}</Text>
            <Text style={styles.agentTitle}>Sales Representative</Text>
          </View>
        </View>
        <View style={styles.timeRow}>
          <Clock size={12} color="#999" style={{ marginRight: 4 }} />
          <Text style={styles.time}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>

      <View style={styles.propertyInfo}>
        <View style={styles.infoRow}>
          <Building2 size={14} color="#666" style={{ marginRight: 6 }} />
          <Text style={styles.propertyText}>{item.microMarket}</Text>
        </View>
        <View style={styles.infoRow}>
          <MapPin size={14} color="#666" style={{ marginRight: 6 }} />
          <Text style={styles.propertyText}>{item.location}</Text>
        </View>
      </View>

      <View style={styles.noteContent}>
        <Text style={styles.noteText}>{item.note}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <Layout>
      <View style={styles.container}>
        <View style={[styles.content, isDesktop && styles.desktopContent]}>
          <View style={styles.header}>
            <View>
              <Text style={styles.pageTitle}>Property Notes</Text>
              <Text style={styles.pageSubtitle}>
                Important updates from our sales team regarding your properties.
              </Text>
            </View>
          </View>

          {notesLoading && notes.length === 0 ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loaderText}>Fetching your notes...</Text>
            </View>
          ) : notes.length === 0 ? (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconContainer}>
                <MessageSquare size={48} color="#CCC" />
              </View>
              <Text style={styles.emptyTitle}>No notes yet</Text>
              <Text style={styles.emptySubtitle}>
                When our team adds notes to your properties, they will appear
                here.
              </Text>
              <TouchableOpacity
                style={styles.exploreBtn}
                onPress={() => navigate('/dashboard')}
              >
                <Text style={styles.exploreBtnText}>Back to Dashboard</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.card}>
              <FlatList
                data={notes}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                ItemSeparatorComponent={() => <View style={styles.divider} />}
                contentContainerStyle={styles.listContent}
              />
            </View>
          )}
        </View>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 20,
    alignItems: 'center',
    minHeight: '100%',
  },
  content: {
    width: '100%',
    maxWidth: 700,
  },
  desktopContent: {
    paddingVertical: 40,
  },
  header: {
    marginBottom: 30,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  pageSubtitle: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  loaderContainer: {
    padding: 100,
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 16,
    color: '#666',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 4,
  },
  listContent: {
    paddingBottom: 20,
  },
  noteItem: {
    padding: 24,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  agentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(238, 37, 41, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  agentName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  agentTitle: {
    fontSize: 11,
    color: '#999',
    fontWeight: 'bold',
    uppercase: true,
  } as any,
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  time: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  propertyInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  propertyText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  noteContent: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 16,
  },
  noteText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 22,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 60,
    backgroundColor: '#FFF',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 4,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 30,
  },
  exploreBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  exploreBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },
});

export default NotesScreen;
