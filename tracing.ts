import { NodeSDK } from '@opentelemetry/sdk-node';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { SemanticResourceAttributes as R } from '@opentelemetry/semantic-conventions';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { logs } from '@opentelemetry/api-logs';
import { traceExporterOptions } from './tracingConfig';
import { captureConsole, logExportEnabled } from './consoleLogs';

const exporter = new OTLPTraceExporter(traceExporterOptions(process.env));
// with a collector configured the SDK sets up the log exporter from the
// OTEL_EXPORTER_OTLP_* variables; without one, no log export at all
const exportLogs = logExportEnabled(process.env);

const sdk = new NodeSDK({
  resource: resourceFromAttributes({
    [R.SERVICE_NAME]: process.env.SERVICE_NAME || 'elody-graphql',
    [R.DEPLOYMENT_ENVIRONMENT]: process.env.NODE_ENV || 'dev',
    [R.SERVICE_VERSION]: process.env.APP_VERSION || 'local',
  }),
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
