/**
 * Usage analytics is opt-in per deployment: the PWA only loads the OpenPanel web
 * SDK when the app config carries a usageAnalytics block, and that block is only
 * there when both OPENPANEL_CLIENT_ID and OPENPANEL_API_URL are set. The client
 * id is public (a browser sends it with every event); no secret goes to the PWA.
 */
import { describe, it, expect } from 'vitest';
import { usageAnalyticsFromEnv } from '../helpers/usageAnalytics';
import { getConfig } from '../endpoints/appConfigEndpoint';
import { Environment } from '../types/environmentTypes';

const environmentWith = (usageAnalytics: any): Environment =>
  ({
    graphqlEndpoint: '/api/graphql',
    damsFrontend: 'http://localhost',
    api: {},
    oauth: {},
    customization: {},
    features: {},
    usageAnalytics,
  } as unknown as Environment);

describe('usageAnalyticsFromEnv', () => {
  it('is off unless both the client id and the api url are set', () => {
    expect(usageAnalyticsFromEnv({})).toBeUndefined();
    expect(
      usageAnalyticsFromEnv({ OPENPANEL_CLIENT_ID: 'abc' })
    ).toBeUndefined();
    expect(
      usageAnalyticsFromEnv({
        OPENPANEL_API_URL: 'http://openpanel.localhost:8000/api',
      })
    ).toBeUndefined();
  });

  it('carries the client id and the api url, never a secret', () => {
    expect(
      usageAnalyticsFromEnv({
        OPENPANEL_CLIENT_ID: '1c8c5159',
        OPENPANEL_API_URL: 'http://openpanel.localhost:8000/api',
        OPENPANEL_CLIENT_SECRET: 'sec_x',
      })
    ).toEqual({
      clientId: '1c8c5159',
      apiUrl: 'http://openpanel.localhost:8000/api',
    });
  });
});

describe('getConfig usageAnalytics', () => {
  it('ships the usage analytics settings to the PWA when enabled', () => {
    const usageAnalytics = {
      clientId: '1c8c5159',
      apiUrl: 'http://openpanel.localhost:8000/api',
    };
    expect(getConfig(environmentWith(usageAnalytics)).usageAnalytics).toEqual(
      usageAnalytics
    );
  });

  it('leaves usageAnalytics out when disabled', () => {
    expect(
      getConfig(environmentWith(undefined)).usageAnalytics
    ).toBeUndefined();
  });
});

describe('usageAnalyticsFromEnv through the server', () => {
  it('points the browser at the telemetry proxy when OpenPanel is internal', () => {
    expect(
      usageAnalyticsFromEnv({
        OPENPANEL_CLIENT_ID: '1c8c5159',
        OPENPANEL_INTERNAL_URL: 'http://op-api:3000',
        OPENPANEL_API_URL: 'http://openpanel.localhost:8000/api',
      })
    ).toEqual({ clientId: '1c8c5159', apiUrl: '/api/telemetry/usage' });
  });
});
