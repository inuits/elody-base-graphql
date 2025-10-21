import { NodeSDK } from '@opentelemetry/sdk-node';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { SemanticResourceAttributes as R } from '@opentelemetry/semantic-conventions';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';

const exporter = new OTLPTraceExporter({
  url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://alloy"4318/v1/traces',
});

const sdk = new NodeSDK({
  resource: resourceFromAttributes({
    [R.SERVICE_NAME]: process.env.SERVICE_NAME || 'elody-graphql',
    [R.DEPLOYMENT_ENVIRONMENT]: process.env.NODE_ENV || 'dev',
    [R.SERVICE_VERSION]: process.env.APP_VERSION || 'local',
  }),
  traceExporter: exporter,
  instrumentations: [
    getNodeAutoInstrumentations({
      // Disable some auto-instrumentations if needed
      // '@opentelemetry/instrumentation-fs': {
      //   enabled: false,
      // },
    }),
  ],
});

sdk.start();
