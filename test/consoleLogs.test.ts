/**
 * The GraphQL server logs through console.*: with OpenTelemetry on, every console
 * call also becomes a log record, sent to the collector next to the traces. The
 * SDK puts the active span's trace and span id on each record, so a log line is
 * found next to the request that wrote it.
 */
import { describe, it, expect, vi } from 'vitest';
import { SeverityNumber } from '@opentelemetry/api-logs';
import type { Logger } from '@opentelemetry/api-logs';
import { captureConsole, logExportEnabled } from '../consoleLogs';

const fakeConsole = () =>
  ({
    debug: vi.fn(),
    log: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  } as unknown as Console);

const fakeLogger = () =>
  ({ emit: vi.fn() } as unknown as Logger & {
    emit: ReturnType<typeof vi.fn>;
  });

describe('logExportEnabled', () => {
  it('is off without a collector to send to', () => {
    expect(logExportEnabled({})).toBe(false);
  });

  it('is on with an OTLP endpoint', () => {
    expect(
      logExportEnabled({
        OTEL_EXPORTER_OTLP_ENDPOINT: 'http://otel-collector:4318',
      })
    ).toBe(true);
    expect(
      logExportEnabled({
        OTEL_EXPORTER_OTLP_LOGS_ENDPOINT: 'http://otel-collector:4318/v1/logs',
      })
    ).toBe(true);
  });

  it('stays off when OpenTelemetry or its logs are switched off', () => {
    const endpoint = {
      OTEL_EXPORTER_OTLP_ENDPOINT: 'http://otel-collector:4318',
    };
    expect(logExportEnabled({ ...endpoint, OTEL_SDK_DISABLED: 'true' })).toBe(
      false
    );
    expect(logExportEnabled({ ...endpoint, OTEL_LOGS_EXPORTER: 'none' })).toBe(
      false
    );
  });
});

describe('captureConsole', () => {
  it('still writes to the console', () => {
    const target = fakeConsole();
    const original = target.log;
    captureConsole(fakeLogger(), target);
    target.log('started on port %d', 4000);
    expect(original).toHaveBeenCalledWith('started on port %d', 4000);
  });

  it('sends each call as a log record with its level and the formatted message', () => {
    const target = fakeConsole();
    const logger = fakeLogger();
    captureConsole(logger, target);
    target.log('started on port %d', 4000);
    target.warn('slow', { ms: 1200 });
    target.error('failed');
    target.debug('detail');
    expect(logger.emit.mock.calls.map(([record]) => record)).toEqual([
      expect.objectContaining({
        severityNumber: SeverityNumber.INFO,
        severityText: 'INFO',
        body: 'started on port 4000',
      }),
      expect.objectContaining({
        severityNumber: SeverityNumber.WARN,
        severityText: 'WARN',
        body: 'slow { ms: 1200 }',
      }),
      expect.objectContaining({
        severityNumber: SeverityNumber.ERROR,
        severityText: 'ERROR',
        body: 'failed',
      }),
      expect.objectContaining({
        severityNumber: SeverityNumber.DEBUG,
        severityText: 'DEBUG',
        body: 'detail',
      }),
    ]);
  });

  it('describes a logged error the way an exception is described', () => {
    const target = fakeConsole();
    const logger = fakeLogger();
    captureConsole(logger, target);
    const error = new TypeError('x is undefined');
    target.error('resolver failed', error);
    expect(logger.emit.mock.calls[0][0].attributes).toEqual({
      'exception.type': 'TypeError',
      'exception.message': 'x is undefined',
      'exception.stacktrace': error.stack,
    });
  });

  it('does not log the logging: a console call while emitting is not sent again', () => {
    const target = fakeConsole();
    const logger = fakeLogger();
    logger.emit.mockImplementation(() => target.error('exporter failed'));
    captureConsole(logger, target);
    target.log('hello');
    expect(logger.emit).toHaveBeenCalledTimes(1);
  });

  it('keeps the console working when sending fails', () => {
    const target = fakeConsole();
    const original = target.error;
    const logger = fakeLogger();
    logger.emit.mockImplementation(() => {
      throw new Error('no collector');
    });
    captureConsole(logger, target);
    expect(() => target.error('boom')).not.toThrow();
    expect(original).toHaveBeenCalledWith('boom');
  });

  it('gives the console back', () => {
    const target = fakeConsole();
    const original = target.info;
    const release = captureConsole(fakeLogger(), target);
    release();
    expect(target.info).toBe(original);
  });
});
