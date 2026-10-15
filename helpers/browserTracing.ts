import { BrowserTracing } from '../types/environmentTypes';

// Browser tracing is off unless a deployment points it at an OTLP/HTTP traces
// endpoint the browser can reach (CORS included).
export const browserTracingFromEnv = (
  env: NodeJS.ProcessEnv
): BrowserTracing | undefined =>
  env.OTEL_BROWSER_TRACES_URL
    ? {
        tracesUrl: env.OTEL_BROWSER_TRACES_URL,
        serviceName: env.OTEL_BROWSER_SERVICE_NAME || 'pwa',
        // the collector's ingestion key, sent by the browser like any public key
        ...(env.OTEL_BROWSER_API_KEY ? { apiKey: env.OTEL_BROWSER_API_KEY } : {}),
      }
    : undefined;
