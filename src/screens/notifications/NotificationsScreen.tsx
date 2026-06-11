import React, { useState } from 'react';
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
  Bell,
  Clock,
  ChevronRight,
  Circle,
  BellOff,
} from 'lucide-react-native';
import Layout from '../../layout/Layout';
import { useNavigation } from '../../context/NavigationContext';
import { useAuth } from '../../context/AuthContext';
import { useEffect } from 'react';
import { COLORS } from '../../constants/theme';
import { usePropertyAPIs } from '../../../helpers/hooks/propertyAPIs/usePropertyApis';

interface NotificationItem {
  id: string;
  title: string;
  notificationText: string;
  isRead: boolean;
  createdAt: string;
}

// Formats an ISO timestamp into a relative label e.g. "2 hours ago".
const formatRelativeTime = (value?: string) => {
  if (!value) return '';
  const date = new Date(value);
  if (isNaN(date.getTime())) return '';

  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHr = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHr / 24);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? '' : 's'} ago`;
  if (diffHr < 24) return `${diffHr} hour${diffHr === 1 ? '' : 's'} ago`;
  if (diffDay === 1) return 'Yesterday';
  if (diffDay < 7) return `${diffDay} days ago`;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const NotificationsScreen = () => {
  const { width } = useWindowDimensions();
  const { isLoggedIn, isLoading } = useAuth();
  const { navigate } = useNavigation();
  const {
    getNotifications,
    markAllNotificationsRead,
    markNotificationRead,
    loading,
  } = usePropertyAPIs();
  const isDesktop = width >= 1024;

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [fetched, setFetched] = useState(false);

  const loadNotifications = () => {
    getNotifications(
      data => {
        setNotifications(Array.isArray(data) ? data : []);
        setFetched(true);
      },
      err => {
        console.error('Error fetching notifications:', err);
        setNotifications([]);
        setFetched(true);
      },
    );
  };

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      navigate('/login');
      return;
    }
    if (!isLoading && isLoggedIn) {
      loadNotifications();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, isLoading]);

  const handleMarkAllAsRead = () => {
    // Optimistically flip local state, then hit the API and refresh from server.
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    markAllNotificationsRead(
      () => loadNotifications(),
      err => console.error('Error marking all notifications read:', err),
    );
  };

  const handleNotificationPress = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n)),
    );
    markNotificationRead(id, undefined, err =>
      console.error('Error marking notification read:', err),
    );
  };

  if (isLoading || !isLoggedIn) {
    return null;
  }

  const isInitialLoading = loading && !fetched;

  const renderItem = ({ item }: { item: NotificationItem }) => (
    <TouchableOpacity
      style={[styles.notificationItem, !item.isRead && styles.unreadItem]}
      onPress={() => handleNotificationPress(item.id)}
    >
      <View style={styles.iconContainer}>
        <Bell size={20} color={COLORS.primary} />
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <Text style={[styles.title, !item.isRead && styles.unreadText]}>
            {item.title}
          </Text>
          {!item.isRead && (
            <Circle size={8} color={COLORS.primary} fill={COLORS.primary} />
          )}
        </View>
        <Text style={styles.message}>{item.notificationText}</Text>
        <View style={styles.timeRow}>
          <Clock size={12} color="#999" style={{ marginRight: 4 }} />
          <Text style={styles.time}>{formatRelativeTime(item.createdAt)}</Text>
        </View>
      </View>
      <ChevronRight size={20} color="#CCC" />
    </TouchableOpacity>
  );

  const hasUnread = notifications.some(n => !n.isRead);

  return (
    <Layout>
      <View style={styles.container}>
        <View style={[styles.content, isDesktop && styles.desktopContent]}>
          <View style={styles.header}>
            <Text style={styles.pageTitle}>Notifications</Text>
            {notifications.length > 0 && hasUnread && (
              <TouchableOpacity onPress={handleMarkAllAsRead}>
                <Text style={styles.markRead}>Mark all as read</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.card}>
            {isInitialLoading ? (
              <View style={styles.stateContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.stateText}>Loading notifications...</Text>
              </View>
            ) : notifications.length === 0 ? (
              <View style={styles.stateContainer}>
                <BellOff size={40} color="#CCC" />
                <Text style={styles.stateText}>No notifications yet</Text>
              </View>
            ) : (
              <FlatList
                data={notifications}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                ItemSeparatorComponent={() => <View style={styles.divider} />}
                scrollEnabled={false}
              />
            )}
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
  stateContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stateText: {
    marginTop: 12,
    fontSize: 15,
    color: '#999',
    fontWeight: '500',
  },
});

export default NotificationsScreen;
