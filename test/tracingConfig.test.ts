import { describe, it, expect } from 'vitest';
import { resourceAttributes, traceExporterOptions } from '../tracingConfig';

// The NodeSDK applies no resource detectors once tracing.ts passes its own
// resource, so the OTEL_* variables a deployment sets have to be read here.
describe('resourceAttributes', () => {
  it('has defaults without any variables', () => {
    expect(resourceAttributes({})).toEqual({
      'service.name': 'elody-graphql',
      'deployment.environment': 'dev',
      'service.version': 'local',
    });
  });

  it('keeps reading the variables it read before', () => {
    expect(
      resourceAttributes({
        SERVICE_NAME: 'graphql',
        NODE_ENV: 'production',
        APP_VERSION: '1.2.3',
      })
    ).toEqual({
      'service.name': 'graphql',
      'deployment.environment': 'production',
      'service.version': '1.2.3',
    });
  });

  it('takes the version from the image tag when there is no APP_VERSION', () => {
    expect(resourceAttributes({ VERSION: '432336' })['service.version']).toBe(
      '432336'
    );
  });

  it('prefers OTEL_SERVICE_NAME, as the Helm chart sets it', () => {
    expect(
      resourceAttributes({
        SERVICE_NAME: 'graphql',
        OTEL_SERVICE_NAME: 'podiumnet-graphql-dev',
      })['service.name']
    ).toBe('podiumnet-graphql-dev');
  });

  it('adds OTEL_RESOURCE_ATTRIBUTES and lets them override the defaults', () => {
    expect(
      resourceAttributes({
        NODE_ENV: 'production',
        OTEL_RESOURCE_ATTRIBUTES:
          'service.namespace=podiumnet-dev, deployment.environment=dev',
      })
    ).toEqual({
      'service.name': 'elody-graphql',
      'service.namespace': 'podiumnet-dev',
      'deployment.environment': 'dev',
      'service.version': 'local',
    });
  });

  // the OpenTelemetry spec: OTEL_SERVICE_NAME wins over service.name in
  // OTEL_RESOURCE_ATTRIBUTES, and values are percent-encoded
  it('follows the spec for service.name and encoded values', () => {
    expect(
      resourceAttributes({
        OTEL_SERVICE_NAME: 'graphql',
        OTEL_RESOURCE_ATTRIBUTES: 'service.name=other,team=elody%20core',
      })
    ).toMatchObject({ 'service.name': 'graphql', team: 'elody core' });
  });

  it('skips pairs without a key or value', () => {
    expect(
      resourceAttributes({ OTEL_RESOURCE_ATTRIBUTES: 'a=1,=2,b=,c,d=%E0%A4' })
    ).toMatchObject({ a: '1' });
    expect(
      Object.keys(
        resourceAttributes({ OTEL_RESOURCE_ATTRIBUTES: 'a=1,=2,b=,c' })
      )
    ).not.toContain('b');
  });
});

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
