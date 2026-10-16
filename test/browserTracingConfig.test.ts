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
  // the client and the environment come from the same OTEL_RESOURCE_ATTRIBUTES
  // as the server's own spans, so browser and backend filter alike in HyperDX
  it('passes the client and environment of OTEL_RESOURCE_ATTRIBUTES on', () => {
    expect(
      browserTracingFromEnv({
        OTEL_BROWSER_TRACES_URL: 'http://hyperdx.localhost:8000/otlp/v1/traces',
        OTEL_RESOURCE_ATTRIBUTES:
          'service.namespace=vlacc-dams, deployment.environment=local,host.name=x',
      })
    ).toEqual({
      tracesUrl: 'http://hyperdx.localhost:8000/otlp/v1/traces',
      serviceName: 'pwa',
      attributes: {
        'service.namespace': 'vlacc-dams',
        'deployment.environment': 'local',
      },
    });
  });

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

describe('browserTracingFromEnv api key', () => {
  it('passes the ingestion key the browser SDK sends, when one is set', () => {
    expect(
      browserTracingFromEnv({
        OTEL_BROWSER_TRACES_URL: 'https://otel.example.org/v1/traces',
        OTEL_BROWSER_API_KEY: 'ingest-123',
      })
    ).toEqual({
      tracesUrl: 'https://otel.example.org/v1/traces',
      serviceName: 'pwa',
      apiKey: 'ingest-123',
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

describe('browserTracingFromEnv through the server', () => {
  // with the collector's internal address the browser sends to its own origin
  // (endpoints/telemetryEndpoint.ts), and never gets the ingestion key
  it('points the browser at the telemetry proxy', () => {
    expect(
      browserTracingFromEnv({
        OTEL_BROWSER_COLLECTOR_URL: 'http://otel-collector:4318',
        OTEL_BROWSER_API_KEY: 'ingest-1',
        OTEL_BROWSER_TRACES_URL: 'http://hyperdx.localhost:8000/otlp/v1/traces',
      })
    ).toEqual({
      tracesUrl: '/api/telemetry/otlp/v1/traces',
      serviceName: 'pwa',
    });
  });
});
