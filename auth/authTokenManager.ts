import { GraphQLError } from 'graphql';
import jwt_decode from 'jwt-decode';
import { getManager } from '.';
import { Environment } from '../types/environmentTypes';
import { isIpAddressWhitelisted, isDomainWhitelisted } from '../helpers/helpers';
import { AuthSessionResponse } from './types';

// Refresh lock to prevent concurrent refresh attempts. Keyed by refresh token:
// express-session gives every request its own copy of the session object.
const refreshLocks = new Map<string, Promise<AuthSessionResponse | null>>();

export class AuthTokenManager {
  constructor(
    private environment: Environment,
    private session: any,
    private clientIp?: string,
    private clientOrigin?: string
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
    if (ipWhitelistFeature) {
      if (
        isIpAddressWhitelisted(this.clientIp, this.environment) &&
        ipWhitelistFeature.tokenToUseForWhiteListedIpAddresses
      ) {
        console.log('Using whitelisted IP token');
        return ipWhitelistFeature.tokenToUseForWhiteListedIpAddresses;
      }
      console.log(`[AuthTokenManager] IP whitelist miss: ${this.clientIp ?? 'undefined'}`);
    }

    const domainWhitelistFeature = this.environment?.features?.domainWhiteListing;
    if (domainWhitelistFeature) {
      if (
        isDomainWhitelisted(this.clientOrigin, this.environment) &&
        domainWhitelistFeature.tokenToUseForWhiteListedDomainAddresses
      ) {
        console.log('Using whitelisted domain token');
        return domainWhitelistFeature.tokenToUseForWhiteListedDomainAddresses;
      }
      console.log(
        `[AuthTokenManager] Domain whitelist miss: ${this.clientOrigin ?? 'undefined'}`
      );
    }

    if (
      process.env.ALLOW_ANONYMOUS_USERS?.toLowerCase() === 'true' &&
      !this.session?.authExpired
    ) {
      return '';
    }

    throw new GraphQLError('AUTH | NO VALID TOKEN', {
      extensions: { statusCode: 401 },
    });
  }

  // For a token the API rejected (401) although it has not expired, e.g. because its Keycloak session ended.
  async refreshRejectedToken(): Promise<string | null> {
    if (!this.accessToken || !this.refreshToken) return null;
    return this.applyRefresh(await this.sharedRefresh());
  }

  private async refreshWithLock(): Promise<string | null> {
    // If the session already has a valid (non-expired) token, another
    // concurrent request already refreshed it successfully.
    const currentToken = this.accessToken;
    if (currentToken && !this.isExpired(currentToken)) {
      return currentToken;
    }

    return this.applyRefresh(await this.sharedRefresh());
  }

  private async sharedRefresh(): Promise<AuthSessionResponse | null> {
    const refreshToken: string = this.refreshToken;

    // Check if a refresh is already in progress for this refresh token
    const existingLock = refreshLocks.get(refreshToken);
    if (existingLock) {
      return existingLock;
    }

    // Start the refresh and store the promise so concurrent requests wait
    const refreshPromise = this.doRefresh();
    refreshLocks.set(refreshToken, refreshPromise);

    try {
      return await refreshPromise;
    } finally {
      refreshLocks.delete(refreshToken);
    }
  }

  private async doRefresh(): Promise<AuthSessionResponse | null> {
    try {
      const refreshed = await getManager(this.environment).refresh(
        this.accessToken,
        this.refreshToken
      );
      if (refreshed) return refreshed;
    } catch {
      // refresh threw (e.g. ForbiddenError) — treat as failure
    }
    return null;
  }

  // Every request writes the outcome to its own copy of the session.
  private applyRefresh(refreshed: AuthSessionResponse | null): string | null {
    if (refreshed) {
      this.session.auth = refreshed;
      return refreshed.accessToken;
    }
    this.session.auth = null;
    // An expired login must surface as a 401, not silently continue as an anonymous user who gets 403s.
    this.session.authExpired = true;
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
}
