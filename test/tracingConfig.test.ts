import { describe, it, expect } from 'vitest';
import { traceExporterOptions } from '../tracingConfig';

describe('traceExporterOptions', () => {
  it('falls back to the local alloy collector when no endpoint is configured', () => {
    expect(traceExporterOptions({})).toEqual({
      url: 'http://alloy:4318/v1/traces',
    });
  });

  // OTEL_EXPORTER_OTLP_ENDPOINT is a base URL: the exporter appends /v1/traces
  // itself, the same way collection-api's Python exporter does.
  it('leaves a base endpoint to the exporter', () => {
    expect(
      traceExporterOptions({
        OTEL_EXPORTER_OTLP_ENDPOINT: 'http://otel-collector:4318',
      })
    ).toEqual({});
  });

  it('leaves a traces-specific endpoint to the exporter', () => {
    expect(
      traceExporterOptions({
        OTEL_EXPORTER_OTLP_TRACES_ENDPOINT:
          'http://otel-collector:4318/v1/traces',
      })
    ).toEqual({});
  });
});
