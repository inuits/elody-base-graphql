import { describe, it, expect } from 'vitest';
import express, { Request } from 'express';
import {
  getEntityIdFromPath,
  negotiatedMimetype,
} from '../endpoints/linkedOpenDataEndpoint';

// Builds a request off express' own prototype so req.accepts runs the real
// negotiation, not a mock. The `*/*`-matches-the-first-candidate behaviour lives
// in express, so a hand-rolled fake would pass even with a broken candidate order.
const requestAccepting = (accept?: string): Request =>
  Object.create(express.request, {
    headers: { value: accept ? { accept } : {} },
  }) as Request;

describe('negotiatedMimetype', () => {
  it.each([
    ['*/*', undefined],
    [undefined, undefined],
    [
      'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      undefined,
    ],
    ['text/turtle', 'text/turtle'],
    ['application/ld+json', 'application/ld+json'],
    ['application/json', 'application/json'],
    ['application/rdf+xml', 'application/rdf+xml'],
    ['application/n-triples', 'application/n-triples'],
    ['text/csv', undefined],
    ['text/uri-list', undefined],
    ['text/turtle;q=0.9, application/json;q=0.5', 'text/turtle'],
    ['application/json;q=0.5, text/turtle;q=0.9', 'text/turtle'],
    ['text/turtle, */*;q=0.1', 'text/turtle'],
    ['application/pdf', undefined],
  ])('negotiates %s to %s', (accept, expected) => {
    expect(negotiatedMimetype(requestAccepting(accept))).toBe(expected);
  });
});

describe('getEntityIdFromPath', () => {
  it.each([
    ['/production/PR-1CFGO36N5', 'PR-1CFGO36N5'],
    ['/production/PR-1CFGO36N5/', 'PR-1CFGO36N5'],
    ['/', undefined],
    ['/productions', 'productions'],
    ['/manifest.json', undefined],
    ['/sw.js', undefined],
    ['/assets/index-a1b2c3.js', undefined],
  ])('takes %s to %s', (path, expected) => {
    expect(getEntityIdFromPath(path)).toBe(expected);
  });
});
