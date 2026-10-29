import type { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';

type TraceExporterOptions = NonNullable<
  ConstructorParameters<typeof OTLPTraceExporter>[0]
>;

const DEFAULT_TRACES_URL = 'http://alloy:4318/v1/traces';

const decoded = (value: string): string => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

const parsedResourceAttributes = (
  value: string | undefined
): Record<string, string> =>
  Object.fromEntries(
    (value ?? '')
      .split(',')
      .map((pair) => {
        const at = pair.indexOf('=');
        return at < 0
          ? ['', '']
          : [pair.slice(0, at).trim(), decoded(pair.slice(at + 1).trim())];
      })
      .filter(([key, value]) => Boolean(key) && Boolean(value))
  );

// The NodeSDK applies no resource detectors once a resource is passed, so the
// OTEL_SERVICE_NAME and OTEL_RESOURCE_ATTRIBUTES a deployment sets (the instance
// as service.namespace, the environment) are read here, on top of the defaults.
export const resourceAttributes = (
  env: NodeJS.ProcessEnv
): Record<string, string> => {
  const fromEnv = parsedResourceAttributes(env.OTEL_RESOURCE_ATTRIBUTES);
  return {
    'deployment.environment': env.NODE_ENV || 'dev',
    'service.version': env.APP_VERSION || env.VERSION || 'local',
    ...fromEnv,
    'service.name':
      env.OTEL_SERVICE_NAME ||
      fromEnv['service.name'] ||
      env.SERVICE_NAME ||
      'elody-graphql',
  };
};

// An explicit url overrides the OTEL_EXPORTER_OTLP_* variables, so only pass one
// when none is set: the exporter then follows the OTel spec and appends
// /v1/traces to OTEL_EXPORTER_OTLP_ENDPOINT, just like collection-api does.
export const traceExporterOptions = (
  env: NodeJS.ProcessEnv
): TraceExporterOptions =>
  env.OTEL_EXPORTER_OTLP_ENDPOINT || env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT
    ? {}
    : { url: DEFAULT_TRACES_URL };
