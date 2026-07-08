import fetch from 'node-fetch';
import { Environment } from '../types/environmentTypes';

type OidcDiscoveryDocument = {
  issuer?: string;
  token_endpoint?: string;
  authorization_endpoint?: string;
  end_session_endpoint?: string;
};

export const applyOidcDiscovery = async (
  environment: Environment
): Promise<void> => {
  const discoveryUrl = environment.oauth.discoveryUrl;
  if (!discoveryUrl) return;

  const url = discoveryUrl.endsWith('/.well-known/openid-configuration')
    ? discoveryUrl
    : `${discoveryUrl.replace(/\/$/, '')}/.well-known/openid-configuration`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(
        `[oidc-discovery] ${url} returned ${res.status}; falling back to OAUTH_* env vars`
      );
      return;
    }
    const doc = (await res.json()) as OidcDiscoveryDocument;

    if (doc.issuer && !process.env.OAUTH_BASE_URL) {
      environment.oauth.baseUrl = doc.issuer;
    }
    if (doc.token_endpoint && !process.env.OAUTH_TOKEN_ENDPOINT) {
      const tokenPath = pathFromAbsolute(
        doc.token_endpoint,
        environment.oauth.baseUrl
      );
      environment.oauth.tokenEndpoint = tokenPath;
    }
    if (doc.authorization_endpoint && !process.env.OAUTH_AUTH_ENDPOINT) {
      environment.oauth.authEndpoint = pathFromAbsolute(
        doc.authorization_endpoint,
        environment.oauth.baseUrl
      );
    }
    if (doc.end_session_endpoint && !process.env.OAUTH_LOGOUT_ENDPOINT) {
      environment.oauth.logoutEndpoint = pathFromAbsolute(
        doc.end_session_endpoint,
        environment.oauth.baseUrl
      );
    }
  } catch (err) {
    console.warn(
      `[oidc-discovery] failed to fetch ${url}: ${(err as Error).message}; falling back to OAUTH_* env vars`
    );
  }
};

const pathFromAbsolute = (endpoint: string, baseUrl: string): string => {
  try {
    const parsed = new URL(endpoint);
    const base = new URL(baseUrl);
    if (parsed.origin !== base.origin) return endpoint;
    let path = parsed.pathname;
    if (base.pathname !== '/' && path.startsWith(base.pathname)) {
      path = path.slice(base.pathname.length);
    }
    return path.startsWith('/') ? path : `/${path}`;
  } catch {
    return endpoint;
  }
};
