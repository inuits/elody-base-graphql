import { BrowserTracing } from '../types/environmentTypes';
import { BROWSER_TRACES_PATH } from '../endpoints/telemetryEndpoint';

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

// Browser tracing is off unless a deployment says where the collector is:
// inside the network (OTEL_BROWSER_COLLECTOR_URL, the browser then sends through
// this server, endpoints/telemetryEndpoint.ts, which adds the ingestion key) or
// an OTLP/HTTP traces endpoint the browser can reach itself (CORS included).
export const browserTracingFromEnv = (
  env: NodeJS.ProcessEnv
): BrowserTracing | undefined => {
  const throughServer = Boolean(env.OTEL_BROWSER_COLLECTOR_URL);
  const tracesUrl = throughServer
    ? BROWSER_TRACES_PATH
    : env.OTEL_BROWSER_TRACES_URL;
  if (!tracesUrl) return undefined;
  const attributes = sharedAttributesOf(env.OTEL_RESOURCE_ATTRIBUTES);
  return {
    tracesUrl,
    serviceName: env.OTEL_BROWSER_SERVICE_NAME || 'pwa',
    // the collector's ingestion key, sent by the browser like any public key,
    // only when the browser talks to the collector itself
    ...(!throughServer && env.OTEL_BROWSER_API_KEY
      ? { apiKey: env.OTEL_BROWSER_API_KEY }
      : {}),
    ...(attributes ? { attributes } : {}),
  };
};
