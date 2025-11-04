import fetch from 'node-fetch';
import { URLSearchParams } from 'url';
import jwt_decode from 'jwt-decode';
import { ForbiddenError } from 'apollo-server-errors';
import { logToken, logUser } from './debug';
import {
  AuthenticationBody,
  AuthSessionResponse,
  LogoutBody,
  RefreshBody,
  TokenResponse,
} from './types';

export class AuthManager {
  constructor(
    private oauthBaseUrl: string,
    private clientId: string,
    private clientSecret: string,
    private tokenEndpoint: string,
    private logoutEndpoint: string
  ) {}

  async authenticate(
    authCode: string,
    redirectUri: string
  ): Promise<AuthSessionResponse> {
    try {
      const res = await fetch(`${this.oauthBaseUrl}${this.tokenEndpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: authCode,
          client_id: this.clientId,
          client_secret: this.clientSecret,
          redirect_uri: redirectUri,
        }),
      });

      const data = (await res.json()) as TokenResponse;

      if (!data.access_token || !data.refresh_token) {
        throw new Error(
          `AUTHENTICATE | Invalid response from OpenID server: ${
            data ? JSON.stringify(data) : 'No data received'
          }`
        );
      }

      jwt_decode(data.access_token);
      jwt_decode(data.refresh_token);

      logToken(
        data.access_token,
        `auth-manager`,
        `User Token @authentication`,
        true
      );

      return {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
      };
    } catch (err) {
      console.error(`[AUTH ERROR]`, err);
    }
  }

  async refresh(
    _accessToken: string | undefined,
    _refreshToken: string | undefined
  ): Promise<AuthSessionResponse | undefined> {
    let sessionAuthResponse: undefined | AuthSessionResponse = undefined;
    if (_accessToken != undefined) {
      const refreshEndpoint = `${this.oauthBaseUrl}${this.tokenEndpoint}`;
      const refreshBody = new URLSearchParams({
        prompt: 'none',
        grant_type: 'refresh_token',
        refresh_token: _refreshToken,
        client_secret: this.clientSecret,
        client_id: this.clientId,
        oidc_url: this.tokenEndpoint,
      } as RefreshBody);
      await fetch(refreshEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: refreshBody,
      })
        .then(async (response: any) => {
          const tokenResponse = (await response.json()) as TokenResponse;
          if (response.status === 401 || response.status === 400) {
            logToken(undefined, `auth-manager`, `REFRESH FAILED => logout`);
            this.logout(_accessToken, _refreshToken);
          } else {
            logToken(
              tokenResponse.access_token,
              `auth-manager`,
              `User Token @refresh`,
              true
            );
            sessionAuthResponse = {
              accessToken: tokenResponse.access_token,
              refreshToken: tokenResponse.refresh_token,
            } as AuthSessionResponse;
          }
        })
        .catch((error: any) => {
          this.logout(_accessToken, _refreshToken);
          throw new ForbiddenError(
            `\n AUTH | REFRESH | AccessToken is undefined \n`
          );
        });
    } else
      throw new ForbiddenError(
        `\n AUTH | REFRESH | AccessToken is undefined \n`
      );
    return sessionAuthResponse;
  }

  async logout(
    _accessToken: string | undefined,
    _refreshToken: string | undefined
  ): Promise<void> {
    const params = new URLSearchParams({
      refresh_token: _refreshToken,
      client_secret: this.clientSecret,
      client_id: this.clientId,
      prompt: 'none',
    } as LogoutBody);
    if (_accessToken) {
      fetch(`${this.oauthBaseUrl}/protocol/openid-connect/logout`, {
        method: 'POST',
        headers: {
          Authorization: _accessToken,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params,
      })
        .then((response: any) => {
          logToken(undefined, `auth-manager`, ` User logged out`);
          logUser(_accessToken);
        })
        .catch((error: any) => {
          throw new Error('\n AUTH | LOGOUT KEYCLOAK | Logout failed');
        });
    }
  }
}
