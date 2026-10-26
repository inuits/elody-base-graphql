// Preloaded, so it runs before express and graphql are required:
//   node --require base-graphql/dist/tracing.js dist/server
// (the Helm chart sets this in NODE_OPTIONS when OpenTelemetry is on).
import { NodeSDK } from '@opentelemetry/sdk-node';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { logs } from '@opentelemetry/api-logs';
import { resourceAttributes, traceExporterOptions } from './tracingConfig';
import { captureConsole, logExportEnabled } from './consoleLogs';

const exporter = new OTLPTraceExporter(traceExporterOptions(process.env));
// with a collector configured the SDK sets up the log exporter from the
// OTEL_EXPORTER_OTLP_* variables; without one, no log export at all
const exportLogs = logExportEnabled(process.env);

const sdk = new NodeSDK({
  resource: resourceFromAttributes(resourceAttributes(process.env)),
  traceExporter: exporter,
  ...(exportLogs ? {} : { logRecordProcessors: [] }),
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

if (exportLogs) captureConsole(logs.getLogger('console'));
