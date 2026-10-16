import { format } from 'node:util';
import { SeverityNumber } from '@opentelemetry/api-logs';
import type { Logger } from '@opentelemetry/api-logs';

type Method = 'debug' | 'log' | 'info' | 'warn' | 'error';

const LEVELS: Record<Method, [SeverityNumber, string]> = {
  debug: [SeverityNumber.DEBUG, 'DEBUG'],
  log: [SeverityNumber.INFO, 'INFO'],
  info: [SeverityNumber.INFO, 'INFO'],
  warn: [SeverityNumber.WARN, 'WARN'],
  error: [SeverityNumber.ERROR, 'ERROR'],
};

// Logs go to the collector only when one is configured, as in collection-api:
// without an endpoint the SDK would send them to localhost.
export const logExportEnabled = (env: NodeJS.ProcessEnv): boolean =>
  Boolean(
    env.OTEL_EXPORTER_OTLP_ENDPOINT || env.OTEL_EXPORTER_OTLP_LOGS_ENDPOINT
  ) &&
  (env.OTEL_SDK_DISABLED ?? 'false').toLowerCase() !== 'true' &&
  (env.OTEL_LOGS_EXPORTER ?? 'otlp').toLowerCase() !== 'none';

const exceptionAttributes = (args: unknown[]) => {
  const error = args.find((arg): arg is Error => arg instanceof Error);
  return error
    ? {
        'exception.type': error.name,
        'exception.message': error.message,
        'exception.stacktrace': error.stack ?? '',
      }
    : {};
};

/**
 * Also sends every console call as a log record; the console keeps writing as
 * before. The SDK adds the active span's trace and span id to each record.
 * Returns a function that gives the console back.
 */
export const captureConsole = (
  logger: Logger,
  target: Console = console
): (() => void) => {
  // the exporter may write to the console itself: that is not sent again
  let emitting = false;
  const originals = new Map<Method, Console[Method]>();
  for (const method of Object.keys(LEVELS) as Method[]) {
    const original = target[method];
    originals.set(method, original);
    target[method] = (...args: unknown[]) => {
      original.apply(target, args);
      if (emitting) return;
      emitting = true;
      try {
        const [severityNumber, severityText] = LEVELS[method];
        logger.emit({
          severityNumber,
          severityText,
          body: format(...args),
          attributes: exceptionAttributes(args),
        });
      } catch {
        // logging never takes the server down
      } finally {
        emitting = false;
      }
    };
  }
  return () => {
    originals.forEach((original, method) => {
      target[method] = original;
    });
  };
};
