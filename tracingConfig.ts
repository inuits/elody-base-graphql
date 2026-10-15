import type { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';

type TraceExporterOptions = NonNullable<
  ConstructorParameters<typeof OTLPTraceExporter>[0]
>;

const DEFAULT_TRACES_URL = 'http://alloy:4318/v1/traces';

// An explicit url overrides the OTEL_EXPORTER_OTLP_* variables, so only pass one
// when none is set: the exporter then follows the OTel spec and appends
// /v1/traces to OTEL_EXPORTER_OTLP_ENDPOINT, just like collection-api does.
export const traceExporterOptions = (
  env: NodeJS.ProcessEnv
): TraceExporterOptions =>
  env.OTEL_EXPORTER_OTLP_ENDPOINT || env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT
    ? {}
    : { url: DEFAULT_TRACES_URL };
