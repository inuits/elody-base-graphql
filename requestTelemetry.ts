import { createHash } from 'node:crypto';
import jwt_decode from 'jwt-decode';
import { context, propagation, trace } from '@opentelemetry/api';
import { getRPCMetadata } from '@opentelemetry/core';
import type { NextFunction, Request, Response } from 'express';

// the names the backend services put on their spans too (observability.py)
const USER = 'elody.user';
const LIBRARY = 'elody.library';

/** A stable pseudonym for a user id: the PWA's pseudonymOf, never the id itself. */
export const pseudonymOf = (id: string): string =>
  createHash('sha256').update(`elody:${id}`).digest('hex').slice(0, 16);

/** The library a user works for: the domain of their e-mail address. */
export const libraryOf = (email: string | undefined): string | undefined =>
  email?.split('@')[1]?.trim().toLowerCase() || undefined;

export type TelemetryUser = { pseudonym: string; library?: string };

/** The pseudonymous user of an access token, or undefined without a usable one. */
export const telemetryUserOf = (
  accessToken: string | undefined
): TelemetryUser | undefined => {
  if (!accessToken) return undefined;
  try {
    const claims = jwt_decode<{ sub?: string; email?: string }>(accessToken);
    const id = claims.sub || claims.email;
    if (!id) return undefined;
    const library = libraryOf(claims.email);
    return { pseudonym: pseudonymOf(id), ...(library ? { library } : {}) };
  } catch {
    return undefined;
  }
};

// the span of the whole HTTP request (set by the http instrumentation), not of
// whichever middleware happens to be active
const requestSpan = () =>
  getRPCMetadata(context.active())?.span ?? trace.getActiveSpan();

/**
 * Puts the request's pseudonymous user and library on its span and in the
 * baggage, so every call this request makes carries them to the next service.
 */
export const telemetryMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const span = requestSpan();
  // without tracing there is nothing to name
  if (!span?.isRecording()) return next();
  const user = telemetryUserOf((req as any).session?.auth?.accessToken);
  if (!user) return next();
  const attributes = {
    [USER]: user.pseudonym,
    ...(user.library ? { [LIBRARY]: user.library } : {}),
  };
  span.setAttributes(attributes);
  let baggage =
    propagation.getBaggage(context.active()) ?? propagation.createBaggage();
  for (const [key, value] of Object.entries(attributes))
    baggage = baggage.setEntry(key, { value });
  context.with(propagation.setBaggage(context.active(), baggage), next);
};

/** Names the request's span after its GraphQL operation (query getEntities). */
export const operationNamePlugin = {
  async requestDidStart() {
    return {
      async didResolveOperation({
        operationName,
        operation,
      }: {
        operationName?: string | null;
        operation?: { operation?: string };
      }) {
        const span = requestSpan();
        if (!span) return;
        const type = operation?.operation ?? 'operation';
        span.updateName(`${type} ${operationName || 'anonymous'}`);
        span.setAttributes({
          'graphql.operation.name': operationName || 'anonymous',
          'graphql.operation.type': type,
        });
      },
    };
  },
};
