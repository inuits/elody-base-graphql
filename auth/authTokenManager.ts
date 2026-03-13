import { GraphQLError } from 'graphql';
import jwt_decode from 'jwt-decode';
import { manager } from '.';
import { Environment } from '../types/environmentTypes';

// Per-session refresh lock to prevent concurrent refresh attempts
const refreshLocks = new WeakMap<object, Promise<string | null>>();

export class AuthTokenManager {
  constructor(
    private environment: Environment,
    private session: any,
    private clientIp?: string
  ) {}

  private get accessToken() {
    return this.session?.auth?.accessToken;
  }

  private get refreshToken() {
    return this.session?.auth?.refreshToken;
  }

  async getValidToken(): Promise<string> {
    const token = this.accessToken;

    if (token && token !== 'undefined' && !this.isExpired(token)) {
      return token;
    }

    if (token && this.refreshToken) {
      const refreshedToken = await this.refreshWithLock();
      if (refreshedToken) {
        return refreshedToken;
      }
    }

    const ipWhitelistFeature = this.environment?.features?.ipWhiteListing;
    if (
      ipWhitelistFeature &&
      this.isIpWhitelisted(this.clientIp) &&
      ipWhitelistFeature.tokenToUseForWhiteListedIpAddresses
    ) {
      console.log('Using whitelisted IP token');
      return ipWhitelistFeature.tokenToUseForWhiteListedIpAddresses;
    }

    if (process.env.ALLOW_ANONYMOUS_USERS?.toLowerCase() === 'true') {
      return '';
    }

    throw new GraphQLError('AUTH | NO VALID TOKEN', {
      extensions: { statusCode: 401 },
    });
  }

  private async refreshWithLock(): Promise<string | null> {
    // If the session already has a valid (non-expired) token, another
    // concurrent request already refreshed it successfully.
    const currentToken = this.accessToken;
    if (currentToken && !this.isExpired(currentToken)) {
      return currentToken;
    }

    // Check if a refresh is already in progress for this session
    const existingLock = refreshLocks.get(this.session);
    if (existingLock) {
      return existingLock;
    }

    // Start the refresh and store the promise so concurrent requests wait
    const refreshPromise = this.doRefresh();
    refreshLocks.set(this.session, refreshPromise);

    try {
      return await refreshPromise;
    } finally {
      refreshLocks.delete(this.session);
    }
  }

  private async doRefresh(): Promise<string | null> {
    try {
      const refreshed = await manager?.refresh(
        this.accessToken,
        this.refreshToken
      );
      if (refreshed) {
        this.session.auth = refreshed;
        return refreshed.accessToken;
      }
    } catch {
      // refresh threw (e.g. ForbiddenError) — treat as failure
    }
    this.session.auth = null;
    return null;
  }

  private isExpired(token: string) {
    try {
      const decoded: any = jwt_decode(token);
      return Date.now() >= decoded.exp * 1000;
    } catch {
      return true;
    }
  }

  private isIpWhitelisted(ip?: string): boolean {
    const list =
      this.environment?.features?.ipWhiteListing?.whiteListedIpAddresses ?? [];
    return !!ip && list.includes(ip);
  }
}
