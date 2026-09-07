import { createHash } from 'crypto';

const GRANTED_TTL_MS = 30_000;
// ponytail: a soft call that throws is indistinguishable from a real denial
// (the callers turn every error into '401'), so anything not-granted gets a
// short TTL. Upgrade path: inspect the response status in the callers and give
// genuine 403s the full TTL.
const DENIED_TTL_MS = 5_000;
const MAX_ENTRIES = 5_000;
const ABSENT_KEY_PART = '<absent>';

type CacheEntry<T> = {
  promise: Promise<T>;
  expiresAt: number;
};

const entries = new Map<string, CacheEntry<any>>();

export const principalKeyFromToken = (accessToken?: string): string => {
  if (!accessToken) return 'anonymous';
  return `user:${createHash('sha256')
    .update(accessToken)
    .digest('base64url')
    .slice(0, 16)}`;
};

export const buildPermissionCacheKey = (
  ...parts: (string | undefined)[]
): string => parts.map((part) => part ?? ABSENT_KEY_PART).join('|');

const evictWhenFull = () => {
  if (entries.size < MAX_ENTRIES) return;
  const now = Date.now();
  for (const [key, entry] of entries) {
    if (entry.expiresAt <= now) entries.delete(key);
  }
  if (entries.size < MAX_ENTRIES) return;
  const oldestKey = entries.keys().next().value;
  if (oldestKey !== undefined) entries.delete(oldestKey);
};

export const getCachedPermission = <T>(
  key: string,
  fetchPermission: () => Promise<T>,
  isGranted: (value: T) => boolean
): Promise<T> => {
  const cached = entries.get(key);
  if (cached && cached.expiresAt > Date.now()) return cached.promise;

  const promise = fetchPermission();
  // ponytail: a pending entry never expires, so concurrent callers for the same
  // key share one request however slow it is. A permanently hung fetch would
  // pin the entry; the underlying HTTP client is what times out.
  const entry: CacheEntry<T> = {
    promise,
    expiresAt: Number.POSITIVE_INFINITY,
  };
  evictWhenFull();
  entries.set(key, entry);

  promise.then(
    (value) => {
      entry.expiresAt =
        Date.now() + (isGranted(value) ? GRANTED_TTL_MS : DENIED_TTL_MS);
    },
    () => entries.delete(key)
  );

  return promise;
};

export const clearPermissionCache = () => entries.clear();
