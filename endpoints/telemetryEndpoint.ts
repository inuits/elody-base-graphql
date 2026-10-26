import express from 'express';
import type { Express, Request, Response } from 'express';

/**
 * The PWA's telemetry, through the server that serves it: the browser only
 * talks to its own origin (no CORS, not blocked like a third-party analytics
 * host), while the OpenTelemetry collector (HyperDX) and OpenPanel stay inside
 * the network. Only a logged-in user's telemetry goes through; the collector's
 * ingestion key is added here and never reaches the browser.
 */
export type TelemetryTargets = {
  /** the collector's OTLP/HTTP base, e.g. http://otel-collector:4318 */
  collectorUrl?: string;
  collectorApiKey?: string;
  /** OpenPanel's API, e.g. http://op-api:3000 */
  usageUrl?: string;
};

export const TELEMETRY_PATH = '/api/telemetry';
export const BROWSER_TRACES_PATH = `${TELEMETRY_PATH}/otlp/v1/traces`;
export const BROWSER_USAGE_PATH = `${TELEMETRY_PATH}/usage`;

// a replay chunk is the largest thing the browser sends
const MAX_BODY = '5mb';
// what the tools need from the browser's request, and nothing else (no cookies)
const PASSED_HEADERS = [
  'content-type',
  'user-agent',
  'origin',
  'openpanel-client-id',
  'openpanel-sdk-name',
  'openpanel-sdk-version',
];

export const telemetryTargetsFromEnv = (
  env: NodeJS.ProcessEnv
): TelemetryTargets => ({
  ...(env.OTEL_BROWSER_COLLECTOR_URL
    ? { collectorUrl: env.OTEL_BROWSER_COLLECTOR_URL.replace(/\/$/, '') }
    : {}),
  ...(env.OTEL_BROWSER_COLLECTOR_URL && env.OTEL_BROWSER_API_KEY
    ? { collectorApiKey: env.OTEL_BROWSER_API_KEY }
    : {}),
  ...(env.OPENPANEL_INTERNAL_URL
    ? { usageUrl: env.OPENPANEL_INTERNAL_URL.replace(/\/$/, '') }
    : {}),
});

const loggedIn = (req: Request, res: Response, next: () => void) =>
  (req as any).session?.auth ? next() : res.status(401).end();

// JSON is parsed before any route (ElodyInstance): send it on as JSON; any
// other body (OTLP protobuf) is read here as it came, already inflated
const raw = express.raw({ type: () => true, limit: MAX_BODY });

const bodyOf = (req: Request): Buffer =>
  Buffer.isBuffer(req.body)
    ? req.body
    : Buffer.from(JSON.stringify(req.body ?? {}));

const forwardTo =
  (
    target: (req: Request) => string,
    fetchImpl: typeof fetch,
    extraHeaders: Record<string, string> = {}
  ) =>
  async (req: Request, res: Response) => {
    const headers: Record<string, string> = { ...extraHeaders };
    for (const name of PASSED_HEADERS) {
      const value = req.headers[name];
      if (typeof value === 'string') headers[name] = value;
    }
    if (!Buffer.isBuffer(req.body))
      headers['content-type'] = 'application/json';
    // the tools see the user's address (OpenPanel derives location and device)
    headers['x-forwarded-for'] =
      (req.headers['x-forwarded-for'] as string) || req.ip || '';
    try {
      const response = await fetchImpl(target(req), {
        method: 'POST',
        headers,
        // a Buffer is not a BodyInit under @types/node 22.20+ (ArrayBufferLike)
        body: new Uint8Array(bodyOf(req)),
      });
      res.status(response.status);
      const type = response.headers.get('content-type');
      if (type) res.setHeader('content-type', type);
      res.send(Buffer.from(await response.arrayBuffer()));
    } catch {
      res.status(502).end();
    }
  };

export const applyTelemetryEndpoint = (
  app: Express,
  targets: TelemetryTargets,
  fetchImpl: typeof fetch = fetch
): void => {
  const { collectorUrl, collectorApiKey, usageUrl } = targets;
  if (collectorUrl)
    app.post(
      `${TELEMETRY_PATH}/otlp/v1/:signal(traces|logs)`,
      loggedIn,
      raw,
      forwardTo(
        (req) => `${collectorUrl}/v1/${req.params.signal}`,
        fetchImpl,
        collectorApiKey ? { authorization: collectorApiKey } : {}
      )
    );
  if (usageUrl)
    app.post(
      `${BROWSER_USAGE_PATH}/track`,
      loggedIn,
      raw,
      forwardTo(() => `${usageUrl}/track`, fetchImpl)
    );
};
