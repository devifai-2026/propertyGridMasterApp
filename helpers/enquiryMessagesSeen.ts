/**
 * Per-user, per-enquiry "last viewed messages" timestamps. An approved message
 * newer than this counts as an unread update — used to badge enquiries on the
 * dashboard until the user opens the enquiry.
 *
 * Stored in localStorage as { [inquiryId]: lastSeenMs }.
 */
const storageKey = (userId?: string) => `enquiryMessagesSeen:${userId || 'anon'}`;

const readMap = (userId?: string): Record<string, number> => {
  try {
    const raw = (globalThis as any).localStorage?.getItem(storageKey(userId));
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const writeMap = (userId: string | undefined, map: Record<string, number>) => {
  try {
    (globalThis as any).localStorage?.setItem(storageKey(userId), JSON.stringify(map));
  } catch {
    /* ignore */
  }
};

export const getMessagesSeenAt = (userId: string | undefined, inquiryId: string): number => {
  return readMap(userId)[inquiryId] || 0;
};

export const markMessagesSeenAt = (userId: string | undefined, inquiryId: string) => {
  if (!inquiryId) return;
  const map = readMap(userId);
  map[inquiryId] = Date.now();
  writeMap(userId, map);
};

// True when there's an approved message newer than the user last viewed it.
export const hasUnreadMessages = (
  userId: string | undefined,
  inquiryId: string,
  latestMessageAt?: string | null,
): boolean => {
  if (!latestMessageAt) return false;
  const ts = new Date(latestMessageAt).getTime();
  if (Number.isNaN(ts)) return false;
  return ts > getMessagesSeenAt(userId, inquiryId);
};
