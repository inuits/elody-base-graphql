import { BrowserTracing } from '../types/environmentTypes';

// the resource attributes the browser repeats on its spans: which client and
// which environment, as the server's own spans carry them
const SHARED_ATTRIBUTES = ['service.namespace', 'deployment.environment'];

const sharedAttributesOf = (
  resourceAttributes: string | undefined
): Record<string, string> | undefined => {
  const pairs = (resourceAttributes ?? '')
    .split(',')
    .map((pair) => pair.split('=').map((part) => part.trim()))
    .filter(
      ([key, value]) => SHARED_ATTRIBUTES.includes(key) && Boolean(value)
    );
  return pairs.length ? Object.fromEntries(pairs) : undefined;
};

// Browser tracing is off unless a deployment points it at an OTLP/HTTP traces
// endpoint the browser can reach (CORS included).
export const browserTracingFromEnv = (
  env: NodeJS.ProcessEnv
): BrowserTracing | undefined => {
  if (!env.OTEL_BROWSER_TRACES_URL) return undefined;
  const attributes = sharedAttributesOf(env.OTEL_RESOURCE_ATTRIBUTES);
  return {
    tracesUrl: env.OTEL_BROWSER_TRACES_URL,
    serviceName: env.OTEL_BROWSER_SERVICE_NAME || 'pwa',
    // the collector's ingestion key, sent by the browser like any public key
    ...(env.OTEL_BROWSER_API_KEY ? { apiKey: env.OTEL_BROWSER_API_KEY } : {}),
    ...(attributes ? { attributes } : {}),
  };
};
