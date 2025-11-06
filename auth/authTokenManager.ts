import { GraphQLError } from 'graphql';
import jwt_decode from 'jwt-decode';
import { manager } from '.';
import { Environment } from '../types/environmentTypes';

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
      const refreshed = await manager?.refresh(token, this.refreshToken);
      if (refreshed) {
        this.session.auth = refreshed;
        return refreshed.accessToken;
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
