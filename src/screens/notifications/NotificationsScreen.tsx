import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  FlatList,
  useWindowDimensions,
} from 'react-native';
import {
  Bell,
  MessageSquare,
  BadgeCheck,
  Clock,
  ChevronRight,
  Circle,
} from 'lucide-react-native';
import Layout from '../../layout/Layout';
import { useNavigation } from '../../context/NavigationContext';
import { useAuth } from '../../context/AuthContext';
import { useEffect } from 'react';
import { COLORS } from '../../constants/theme';

const DUMMY_NOTIFICATIONS = [
  {
    id: '1',
    title: 'New Property Listed!',
    message: 'A premium retail space in HSR Layout just became available.',
    time: '2 hours ago',
    type: 'property',
    read: false,
  },
  {
    id: '2',
    title: 'Verification Successful',
    message: 'Your RERA number has been verified successfully.',
    time: '5 hours ago',
    type: 'success',
    read: false,
  },
  {
    id: '3',
    title: 'New Broker Inquiry',
    message: 'Rahul Sharma wants to connect regarding your listed property.',
    time: 'Yesterday',
    type: 'message',
    read: true,
  },
  {
    id: '4',
    title: 'Market Report Update',
    message: 'The Q3 warehouse rental market report is now available.',
    time: '2 days ago',
    type: 'report',
    read: true,
  },
];

const NotificationsScreen = () => {
  const { width } = useWindowDimensions();
  const { isLoggedIn, isLoading } = useAuth();
  const { navigate } = useNavigation();
  const isDesktop = width >= 1024;

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, isLoading, navigate]);

  if (isLoading || !isLoggedIn) {
    return null;
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'property':
        return <BadgeCheck size={20} color={COLORS.primary} />;
      case 'message':
        return <MessageSquare size={20} color="#007AFF" />;
      default:
        return <Bell size={20} color="#666" />;
    }
  };

  const renderItem = ({ item }: { item: (typeof DUMMY_NOTIFICATIONS)[0] }) => (
    <TouchableOpacity
      style={[styles.notificationItem, !item.read && styles.unreadItem]}
    >
      <View style={styles.iconContainer}>{getIcon(item.type)}</View>
      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <Text style={[styles.title, !item.read && styles.unreadText]}>
            {item.title}
          </Text>
          {!item.read && (
            <Circle size={8} color={COLORS.primary} fill={COLORS.primary} />
          )}
        </View>
        <Text style={styles.message}>{item.message}</Text>
        <View style={styles.timeRow}>
          <Clock size={12} color="#999" style={{ marginRight: 4 }} />
          <Text style={styles.time}>{item.time}</Text>
        </View>
      </View>
      <ChevronRight size={20} color="#CCC" />
    </TouchableOpacity>
  );

  return (
    <Layout>
      <View style={styles.container}>
        <View style={[styles.content, isDesktop && styles.desktopContent]}>
          <View style={styles.header}>
            <Text style={styles.pageTitle}>Notifications</Text>
            <TouchableOpacity>
              <Text style={styles.markRead}>Mark all as read</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <FlatList
              data={DUMMY_NOTIFICATIONS}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              ItemSeparatorComponent={() => <View style={styles.divider} />}
              scrollEnabled={false}
            />
          </View>
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
  },
  content: {
    width: '100%',
    maxWidth: 700,
  },
  desktopContent: {
    paddingVertical: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  markRead: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
  },
  unreadItem: {
    backgroundColor: '#FFF9F9',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  contentContainer: {
    flex: 1,
    paddingRight: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  unreadText: {
    fontWeight: '700',
    color: '#000',
  },
  message: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  time: {
    fontSize: 12,
    color: '#999',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
  },
});

export default NotificationsScreen;
