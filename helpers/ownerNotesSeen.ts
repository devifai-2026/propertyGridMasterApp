/**
 * Tracks, per owner + per property, the timestamp at which the owner last
 * viewed that property's notes. A note approved after this timestamp counts as
 * "new" on the dashboard until the owner opens that property again.
 *
 * Stored in localStorage as a JSON map: { [propertyId]: lastSeenMs }.
 */

const storageKey = (userId?: string) => `ownerNotesSeen:${userId || 'anon'}`;

const readMap = (userId?: string): Record<string, number> => {
  try {
    const store = (globalThis as any).localStorage;
    const raw = store?.getItem(storageKey(userId));
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const writeMap = (userId: string | undefined, map: Record<string, number>) => {
  try {
    (globalThis as any).localStorage?.setItem(storageKey(userId), JSON.stringify(map));
  } catch {
    /* ignore storage failures */
  }
};

/** Last-seen timestamp (ms) for a property's notes; 0 if never seen. */
export const getNotesSeenAt = (userId: string | undefined, propertyId: string): number => {
  const map = readMap(userId);
  return map[propertyId] || 0;
};

/** Mark a property's notes as seen now (clears its "new" badge). */
export const markNotesSeenAt = (userId: string | undefined, propertyId: string) => {
  if (!propertyId) return;
  const map = readMap(userId);
  map[propertyId] = Date.now();
  writeMap(userId, map);
};
