import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

// Mock the manager import before importing AuthTokenManager
const mockRefresh = vi.fn();
vi.mock('../auth', () => ({
  get manager() {
    return { refresh: mockRefresh };
  },
}));

import { AuthTokenManager } from '../auth/authTokenManager';

function createJwt(expInSeconds: number): string {
  const header = btoa(JSON.stringify({ alg: 'none', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({ exp: Math.floor(Date.now() / 1000) + expInSeconds })
  );
  return `${header}.${payload}.signature`;
}

function createSession(accessToken?: string, refreshToken?: string) {
  return {
    auth: accessToken
      ? { accessToken, refreshToken: refreshToken ?? 'refresh-token' }
      : undefined,
  };
}

const baseEnvironment: any = {
  features: {},
};

describe('AuthTokenManager', () => {
  const originalAllowAnon = process.env.ALLOW_ANONYMOUS_USERS;

  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.ALLOW_ANONYMOUS_USERS;
  });

  afterEach(() => {
    if (originalAllowAnon !== undefined) {
      process.env.ALLOW_ANONYMOUS_USERS = originalAllowAnon;
    } else {
      delete process.env.ALLOW_ANONYMOUS_USERS;
    }
  });

  it('returns valid non-expired token immediately', async () => {
    const token = createJwt(300); // expires in 5 min
    const session = createSession(token);
    const manager = new AuthTokenManager(baseEnvironment, session);

    const result = await manager.getValidToken();
    expect(result).toBe(token);
    expect(mockRefresh).not.toHaveBeenCalled();
  });

  it('refreshes expired token', async () => {
    const expiredToken = createJwt(-60); // expired 1 min ago
    const newToken = createJwt(300);
    const session = createSession(expiredToken);

    mockRefresh.mockResolvedValueOnce({
      accessToken: newToken,
      refreshToken: 'new-refresh-token',
    });

    const manager = new AuthTokenManager(baseEnvironment, session);
    const result = await manager.getValidToken();

    expect(result).toBe(newToken);
    expect(mockRefresh).toHaveBeenCalledTimes(1);
    expect(session.auth?.accessToken).toBe(newToken);
    expect(session.auth?.refreshToken).toBe('new-refresh-token');
  });

  it('clears session when refresh fails', async () => {
    const expiredToken = createJwt(-60);
    const session = createSession(expiredToken);

    mockRefresh.mockResolvedValueOnce(undefined);

    const manager = new AuthTokenManager(baseEnvironment, session);
    await expect(manager.getValidToken()).rejects.toThrow(
      'AUTH | NO VALID TOKEN'
    );
    expect(session.auth).toBeNull();
  });

  it('clears session when refresh throws', async () => {
    const expiredToken = createJwt(-60);
    const session = createSession(expiredToken);

    mockRefresh.mockRejectedValueOnce(new Error('Refresh failed'));

    const manager = new AuthTokenManager(baseEnvironment, session);
    await expect(manager.getValidToken()).rejects.toThrow(
      'AUTH | NO VALID TOKEN'
    );
    expect(session.auth).toBeNull();
  });

  it('throws when no token and no refresh token', async () => {
    const session = createSession();
    const manager = new AuthTokenManager(baseEnvironment, session);

    await expect(manager.getValidToken()).rejects.toThrow(
      'AUTH | NO VALID TOKEN'
    );
  });

  it('concurrent requests share a single refresh call', async () => {
    const expiredToken = createJwt(-60);
    const newToken = createJwt(300);
    const session = createSession(expiredToken);

    let resolveRefresh: (value: any) => void;
    mockRefresh.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveRefresh = resolve;
        })
    );

    // Create multiple managers for the SAME session (simulates concurrent requests)
    const managers = Array.from(
      { length: 10 },
      () => new AuthTokenManager(baseEnvironment, session)
    );

    // Fire all 10 requests concurrently
    const promises = managers.map((m) => m.getValidToken());

    // Resolve the single refresh
    resolveRefresh!({
      accessToken: newToken,
      refreshToken: 'new-refresh-token',
    });

    const results = await Promise.all(promises);

    // All should get the same new token
    expect(results.every((r) => r === newToken)).toBe(true);

    // Refresh should have been called only ONCE
    expect(mockRefresh).toHaveBeenCalledTimes(1);
  });

  it('concurrent requests all fail when refresh fails', async () => {
    const expiredToken = createJwt(-60);
    const session = createSession(expiredToken);

    let rejectRefresh: (reason: any) => void;
    mockRefresh.mockImplementation(
      () =>
        new Promise((_, reject) => {
          rejectRefresh = reject;
        })
    );

    const managers = Array.from(
      { length: 5 },
      () => new AuthTokenManager(baseEnvironment, session)
    );

    const promises = managers.map((m) =>
      m.getValidToken().catch((e: Error) => e.message)
    );

    rejectRefresh!(new Error('Refresh failed'));

    const results = await Promise.all(promises);

    expect(results.every((r) => r === 'AUTH | NO VALID TOKEN')).toBe(true);
    expect(mockRefresh).toHaveBeenCalledTimes(1);
    expect(session.auth).toBeNull();
  });

  it('different sessions get independent locks', async () => {
    const expiredToken1 = createJwt(-60);
    const expiredToken2 = createJwt(-60);
    const newToken1 = createJwt(300);
    const newToken2 = createJwt(300);

    const session1 = createSession(expiredToken1);
    const session2 = createSession(expiredToken2);

    let callCount = 0;
    mockRefresh.mockImplementation(() => {
      callCount++;
      return Promise.resolve({
        accessToken: callCount === 1 ? newToken1 : newToken2,
        refreshToken: 'new-refresh',
      });
    });

    const manager1 = new AuthTokenManager(baseEnvironment, session1);
    const manager2 = new AuthTokenManager(baseEnvironment, session2);

    const [result1, result2] = await Promise.all([
      manager1.getValidToken(),
      manager2.getValidToken(),
    ]);

    // Both sessions should refresh independently
    expect(mockRefresh).toHaveBeenCalledTimes(2);
    expect(result1).toBe(newToken1);
    expect(result2).toBe(newToken2);
  });

  it('second refresh works after first lock is released', async () => {
    const expiredToken = createJwt(-60);
    const newToken1 = createJwt(1); // expires in 1 second
    const newToken2 = createJwt(300);
    const session = createSession(expiredToken);

    mockRefresh.mockResolvedValueOnce({
      accessToken: newToken1,
      refreshToken: 'refresh-1',
    });

    const manager1 = new AuthTokenManager(baseEnvironment, session);
    const result1 = await manager1.getValidToken();
    expect(result1).toBe(newToken1);

    // Simulate token expiring again
    session.auth = {
      accessToken: createJwt(-1), // expired
      refreshToken: 'refresh-1',
    };

    mockRefresh.mockResolvedValueOnce({
      accessToken: newToken2,
      refreshToken: 'refresh-2',
    });

    const manager2 = new AuthTokenManager(baseEnvironment, session);
    const result2 = await manager2.getValidToken();
    expect(result2).toBe(newToken2);

    expect(mockRefresh).toHaveBeenCalledTimes(2);
  });

  it('returns empty string when ALLOW_ANONYMOUS_USERS is true', async () => {
    const session = createSession();
    process.env.ALLOW_ANONYMOUS_USERS = 'true';

    const manager = new AuthTokenManager(baseEnvironment, session);
    const result = await manager.getValidToken();

    expect(result).toBe('');
    delete process.env.ALLOW_ANONYMOUS_USERS;
  });
});
