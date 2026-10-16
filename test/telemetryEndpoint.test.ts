/**
 * The PWA sends its telemetry to the server that serves it, not to the tools:
 * /api/telemetry/otlp/v1/{traces,logs} goes on to the OpenTelemetry collector,
 * /api/telemetry/usage/track to OpenPanel. Only for a logged-in user, only those
 * paths, and the collector's ingestion key is added here, never sent to the
 * browser. HyperDX, OpenPanel and their collectors stay inside the network.
 */
import { describe, it, expect, vi } from 'vitest';
import express from 'express';
import request from 'supertest';
import {
  applyTelemetryEndpoint,
  telemetryTargetsFromEnv,
} from '../endpoints/telemetryEndpoint';

const targets = {
  collectorUrl: 'http://otel-collector:4318',
  collectorApiKey: 'ingest-1',
  usageUrl: 'http://op-api:3000',
};

const appWith = (loggedIn: boolean, fetchImpl: any, configured = targets) => {
  const app = express();
  // as in ElodyInstance: JSON is parsed before any route, then the session
  app.use(express.json({ limit: '1mb' }));
  app.use((req: any, _res, next) => {
    req.session = loggedIn ? { auth: { accessToken: 'x' } } : {};
    next();
  });
  applyTelemetryEndpoint(app, configured, fetchImpl);
  return app;
};

const answering = (status = 200, body = '{}') =>
  vi.fn().mockResolvedValue(
    new Response(body, {
      status,
      headers: { 'content-type': 'application/json' },
    })
  );

describe('telemetryTargetsFromEnv', () => {
  it('is off unless the internal addresses are configured', () => {
    expect(telemetryTargetsFromEnv({})).toEqual({});
  });

  it('reads the collector, its key and OpenPanel', () => {
    expect(
      telemetryTargetsFromEnv({
        OTEL_BROWSER_COLLECTOR_URL: 'http://otel-collector:4318',
        OTEL_BROWSER_API_KEY: 'ingest-1',
        OPENPANEL_INTERNAL_URL: 'http://op-api:3000',
      })
    ).toEqual(targets);
  });
});

describe('the telemetry proxy', () => {
  it('sends a browser trace on to the collector, with the ingestion key', async () => {
    const fetchImpl = answering();
    const app = appWith(true, fetchImpl);
    const otlp = { resourceSpans: [{ scopeSpans: [] }] };
    await request(app)
      .post('/api/telemetry/otlp/v1/traces')
      .set('content-type', 'application/json')
      .send(otlp)
      .expect(200);
    const [url, init] = fetchImpl.mock.calls[0];
    expect(url).toBe('http://otel-collector:4318/v1/traces');
    expect(init.method).toBe('POST');
    expect(init.headers.authorization).toBe('ingest-1');
    expect(init.headers['content-type']).toBe('application/json');
    expect(JSON.parse(Buffer.from(init.body).toString())).toEqual(otlp);
  });

  it('sends a protobuf body on unchanged', async () => {
    const fetchImpl = answering();
    const app = appWith(true, fetchImpl);
    const bytes = Buffer.from([0x0a, 0x02, 0x08, 0x01]);
    await request(app)
      .post('/api/telemetry/otlp/v1/logs')
      .set('content-type', 'application/x-protobuf')
      .send(bytes)
      .expect(200);
    const [url, init] = fetchImpl.mock.calls[0];
    expect(url).toBe('http://otel-collector:4318/v1/logs');
    expect(Buffer.from(init.body)).toEqual(bytes);
  });

  it('sends a usage event on to OpenPanel, with what it needs to know the device', async () => {
    const fetchImpl = answering(202, '{"deviceId":"d"}');
    const app = appWith(true, fetchImpl);
    const response = await request(app)
      .post('/api/telemetry/usage/track')
      .set('content-type', 'application/json')
      .set('openpanel-client-id', 'c-1')
      .set('origin', 'http://dashboard.vlacc-dams.localhost:8000')
      .set('user-agent', 'Mozilla/5.0 test')
      .send({ type: 'track', payload: { name: 'search' } })
      .expect(202);
    expect(response.body).toEqual({ deviceId: 'd' });
    const [url, init] = fetchImpl.mock.calls[0];
    expect(url).toBe('http://op-api:3000/track');
    expect(init.headers['openpanel-client-id']).toBe('c-1');
    expect(init.headers.origin).toBe(
      'http://dashboard.vlacc-dams.localhost:8000'
    );
    expect(init.headers['user-agent']).toBe('Mozilla/5.0 test');
    expect(init.headers['x-forwarded-for']).toBeTruthy();
    expect(init.headers.authorization).toBeUndefined();
  });

  it('refuses a visitor who is not logged in', async () => {
    const fetchImpl = answering();
    await request(appWith(false, fetchImpl))
      .post('/api/telemetry/usage/track')
      .send({ type: 'track' })
      .expect(401);
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('only knows the paths it forwards', async () => {
    const fetchImpl = answering();
    const app = appWith(true, fetchImpl);
    await request(app)
      .post('/api/telemetry/otlp/v1/metrics')
      .send({})
      .expect(404);
    await request(app)
      .post('/api/telemetry/usage/profile')
      .send({})
      .expect(404);
    await request(app).get('/api/telemetry/otlp/v1/traces').expect(404);
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('is not there when nothing is configured', async () => {
    const fetchImpl = answering();
    await request(appWith(true, fetchImpl, {}))
      .post('/api/telemetry/otlp/v1/traces')
      .send({})
      .expect(404);
  });

  it('answers 502 when the tool cannot be reached', async () => {
    const fetchImpl = vi.fn().mockRejectedValue(new Error('ECONNREFUSED'));
    await request(appWith(true, fetchImpl))
      .post('/api/telemetry/otlp/v1/traces')
      .send({})
      .expect(502);
  });
});
