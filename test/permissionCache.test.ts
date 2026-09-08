import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  buildPermissionCacheKey,
  clearPermissionCache,
  getCachedPermission,
  principalKeyFromToken,
} from '../helpers/permissionCache';

const granted = (value: string) => value === '200';

describe('buildPermissionCacheKey', () => {
  it('keeps absent parts positional so principals cannot collide', () => {
    expect(buildPermissionCacheKey('a', undefined, 'b')).not.toBe(
      buildPermissionCacheKey('a', 'b', undefined)
    );
  });

  it('is stable for the same parts', () => {
    expect(buildPermissionCacheKey('user:1', 'tenant', 'read')).toBe(
      buildPermissionCacheKey('user:1', 'tenant', 'read')
    );
  });
});

describe('principalKeyFromToken', () => {
  it('separates anonymous from authenticated sessions', () => {
    expect(principalKeyFromToken(undefined)).toBe('anonymous');
    expect(principalKeyFromToken('token')).not.toBe('anonymous');
  });

  it('gives every token its own key and never leaks the token itself', () => {
    const key = principalKeyFromToken('token-a');
    expect(key).toBe(principalKeyFromToken('token-a'));
    expect(key).not.toBe(principalKeyFromToken('token-b'));
    expect(key).not.toContain('token-a');
  });
});

describe('getCachedPermission', () => {
  beforeEach(() => clearPermissionCache());

  it('collapses concurrent calls for one key into a single request', async () => {
    let resolveCall: (value: string) => void = () => {};
    const fetchPermission = vi.fn(
      () => new Promise<string>((resolve) => (resolveCall = resolve))
    );

    const calls = Array.from({ length: 50 }, () =>
      getCachedPermission('key', fetchPermission, granted)
    );
    resolveCall('200');

    expect(await Promise.all(calls)).toEqual(Array(50).fill('200'));
    expect(fetchPermission).toHaveBeenCalledTimes(1);
  });

  it('does not share results between different keys', async () => {
    const fetchPermission = vi.fn().mockResolvedValue('200');

    await getCachedPermission('user:1|entity:a', fetchPermission, granted);
    await getCachedPermission('user:2|entity:a', fetchPermission, granted);
    await getCachedPermission('user:1|entity:b', fetchPermission, granted);

    expect(fetchPermission).toHaveBeenCalledTimes(3);
  });

  it('serves a granted result from cache until its ttl passes', async () => {
    vi.useFakeTimers();
    const fetchPermission = vi.fn().mockResolvedValue('200');

    await getCachedPermission('key', fetchPermission, granted);
    await getCachedPermission('key', fetchPermission, granted);
    expect(fetchPermission).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(30_001);
    await getCachedPermission('key', fetchPermission, granted);
    expect(fetchPermission).toHaveBeenCalledTimes(2);
  });

  it('expires a denial far sooner than a grant', async () => {
    vi.useFakeTimers();
    const fetchPermission = vi.fn().mockResolvedValue('401');

    await getCachedPermission('key', fetchPermission, granted);
    vi.advanceTimersByTime(5_001);
    await getCachedPermission('key', fetchPermission, granted);

    expect(fetchPermission).toHaveBeenCalledTimes(2);
  });

  it('stops a hung call from pinning its key forever', async () => {
    vi.useFakeTimers();
    // Never settles, the way a soft call against an unreachable collection-api
    // would before anything times out.
    const fetchPermission = vi.fn(() => new Promise<string>(() => {}));

    void getCachedPermission('key', fetchPermission, granted);
    vi.advanceTimersByTime(10_001);
    void getCachedPermission('key', fetchPermission, granted);

    expect(fetchPermission).toHaveBeenCalledTimes(2);
  });

  it('never caches a rejection', async () => {
    const fetchPermission = vi
      .fn()
      .mockRejectedValueOnce(new Error('collection-api is down'))
      .mockResolvedValue('200');

    await expect(
      getCachedPermission('key', fetchPermission, granted)
    ).rejects.toThrow('collection-api is down');
    expect(await getCachedPermission('key', fetchPermission, granted)).toBe(
      '200'
    );
  });

  afterEach(() => vi.useRealTimers());
});
