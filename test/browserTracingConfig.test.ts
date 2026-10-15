/**
 * Browser tracing is opt-in per deployment: the PWA only loads the OpenTelemetry
 * web SDK when the app config carries a browserTracing block, and that block is
 * only there when OTEL_BROWSER_TRACES_URL is set.
 */
import { describe, it, expect } from 'vitest';
import { browserTracingFromEnv } from '../helpers/browserTracing';
import { getConfig } from '../endpoints/appConfigEndpoint';
import { Environment } from '../types/environmentTypes';

const environmentWith = (browserTracing: any): Environment =>
  ({
    graphqlEndpoint: '/api/graphql',
    damsFrontend: 'http://localhost',
    api: {},
    oauth: {},
    customization: {},
    features: {},
    browserTracing,
  } as unknown as Environment);

describe('browserTracingFromEnv', () => {
  it('is off when no traces url is configured', () => {
    expect(browserTracingFromEnv({})).toBeUndefined();
    expect(
      browserTracingFromEnv({ OTEL_BROWSER_TRACES_URL: '' })
    ).toBeUndefined();
  });

  it('defaults the service name to pwa', () => {
    expect(
      browserTracingFromEnv({
        OTEL_BROWSER_TRACES_URL: 'http://hyperdx.localhost:8000/otlp/v1/traces',
      })
    ).toEqual({
      tracesUrl: 'http://hyperdx.localhost:8000/otlp/v1/traces',
      serviceName: 'pwa',
    });
  });

  it('takes the service name from OTEL_BROWSER_SERVICE_NAME', () => {
    expect(
      browserTracingFromEnv({
        OTEL_BROWSER_TRACES_URL: 'https://otel.example.org/v1/traces',
        OTEL_BROWSER_SERVICE_NAME: 'vlacc-pwa',
      })
    ).toEqual({
      tracesUrl: 'https://otel.example.org/v1/traces',
      serviceName: 'vlacc-pwa',
    });
  });
});

describe('getConfig browserTracing', () => {
  it('ships the browser tracing settings to the PWA when enabled', () => {
    const browserTracing = {
      tracesUrl: 'http://hyperdx.localhost:8000/otlp/v1/traces',
      serviceName: 'pwa',
    };
    expect(getConfig(environmentWith(browserTracing)).browserTracing).toEqual(
      browserTracing
    );
  });

  it('leaves browserTracing out when disabled', () => {
    expect(
      getConfig(environmentWith(undefined)).browserTracing
    ).toBeUndefined();
  });
});
