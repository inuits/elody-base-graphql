/**
 * Each GraphQL request is named by its operation, and says for whom it ran: the
 * same pseudonym and library as the PWA uses, never the user's id or address.
 * Both travel as W3C baggage to the services the request calls (collection-api,
 * history-service, ...), which put them on their own spans.
 */
import { describe, it, expect, beforeAll, vi } from 'vitest';
import { context, propagation } from '@opentelemetry/api';
import { AsyncLocalStorageContextManager } from '@opentelemetry/context-async-hooks';
import { RPCType, setRPCMetadata } from '@opentelemetry/core';
import { W3CBaggagePropagator } from '@opentelemetry/core';
import {
  libraryOf,
  operationNamePlugin,
  pseudonymOf,
  telemetryMiddleware,
  telemetryUserOf,
} from '../requestTelemetry';

beforeAll(() => {
  context.setGlobalContextManager(
    new AsyncLocalStorageContextManager().enable()
  );
  propagation.setGlobalPropagator(new W3CBaggagePropagator());
});

const base64url = (value: object) =>
  Buffer.from(JSON.stringify(value)).toString('base64url');
const tokenFor = (claims: object) =>
  `${base64url({ alg: 'none' })}.${base64url(claims)}.signature`;

const fakeSpan = () => ({
  setAttributes: vi.fn(),
  updateName: vi.fn(),
  isRecording: () => true,
});

const inRequest = <T>(span: ReturnType<typeof fakeSpan>, run: () => T): T =>
  context.with(
    setRPCMetadata(context.active(), { type: RPCType.HTTP, span: span as any }),
    run
  );

describe('the user of a request', () => {
  it('is the same pseudonym as in the PWA', () => {
    // sha256("elody:user-1"), first 16 hex digits, as the PWA's pseudonymOf
    expect(pseudonymOf('user-1')).toBe('e323b4a2b40d115e');
  });

  it('works for the library of their e-mail domain', () => {
    expect(libraryOf('An.Peeters@Brugge.be')).toBe('brugge.be');
    expect(libraryOf(undefined)).toBeUndefined();
  });

  it('is read from the access token, without its id or address', () => {
    const user = telemetryUserOf(
      tokenFor({ sub: 'user-1', email: 'an@brugge.be' })
    );
    expect(user).toEqual({
      pseudonym: 'e323b4a2b40d115e',
      library: 'brugge.be',
    });
    expect(JSON.stringify(user)).not.toContain('an@');
  });

  it('is nobody without a valid token', () => {
    expect(telemetryUserOf(undefined)).toBeUndefined();
    expect(telemetryUserOf('not-a-jwt')).toBeUndefined();
    expect(telemetryUserOf(tokenFor({ iss: 'x' }))).toBeUndefined();
  });
});

describe('telemetryMiddleware', () => {
  const requestOf = (claims?: object) =>
    ({
      session: claims ? { auth: { accessToken: tokenFor(claims) } } : {},
    } as any);

  it('names the user and library on the request span and in the baggage', () => {
    const span = fakeSpan();
    let baggage: Record<string, string> = {};
    inRequest(span, () =>
      telemetryMiddleware(
        requestOf({ sub: 'user-1', email: 'an@brugge.be' }),
        {} as any,
        () => {
          const carrier: Record<string, string> = {};
          propagation.inject(context.active(), carrier);
          baggage = carrier;
        }
      )
    );
    expect(span.setAttributes).toHaveBeenCalledWith({
      'elody.user': 'e323b4a2b40d115e',
      'elody.library': 'brugge.be',
    });
    expect(baggage.baggage).toContain('elody.user=e323b4a2b40d115e');
    expect(baggage.baggage).toContain('elody.library=brugge.be');
  });

  it('does nothing while the request is not traced', () => {
    const span = { ...fakeSpan(), isRecording: () => false };
    const next = vi.fn();
    inRequest(span, () =>
      telemetryMiddleware(requestOf({ sub: 'user-1' }), {} as any, next)
    );
    expect(next).toHaveBeenCalledOnce();
    expect(span.setAttributes).not.toHaveBeenCalled();
  });

  it('lets an anonymous request through untouched', () => {
    const span = fakeSpan();
    const next = vi.fn();
    inRequest(span, () => telemetryMiddleware(requestOf(), {} as any, next));
    expect(next).toHaveBeenCalledOnce();
    expect(span.setAttributes).not.toHaveBeenCalled();
  });
});

describe('operationNamePlugin', () => {
  it('names the request span after the GraphQL operation', async () => {
    const span = fakeSpan();
    const hooks = await operationNamePlugin.requestDidStart();
    await inRequest(span, () =>
      hooks.didResolveOperation({
        operationName: 'getEntities',
        operation: { operation: 'query' },
      } as any)
    );
    expect(span.updateName).toHaveBeenCalledWith('query getEntities');
    expect(span.setAttributes).toHaveBeenCalledWith({
      'graphql.operation.name': 'getEntities',
      'graphql.operation.type': 'query',
    });
  });

  it('calls an unnamed operation anonymous', async () => {
    const span = fakeSpan();
    const hooks = await operationNamePlugin.requestDidStart();
    await inRequest(span, () =>
      hooks.didResolveOperation({ operation: { operation: 'mutation' } } as any)
    );
    expect(span.updateName).toHaveBeenCalledWith('mutation anonymous');
  });
});
