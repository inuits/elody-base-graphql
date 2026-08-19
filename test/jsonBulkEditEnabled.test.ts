/**
 * Attempting the json bulk edit on a client that has not implemented it is worse than
 * not having it: PUT /entities is a full document replace there, and it answers 201, so
 * the partial bulk-edit document silently wipes every field it does not carry. "Off"
 * must therefore be the behaviour for every state that is not an explicit opt-in --
 * including a process that never called setCurrentEnvironment.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { jsonBulkEditEnabled, setCurrentEnvironment } from '../environment';
import { Environment } from '../types/environmentTypes';

const environmentWith = (features: any) => ({ features }) as Environment;

describe('jsonBulkEditEnabled', () => {
  beforeEach(() => setCurrentEnvironment(undefined as any));

  it('is false when no environment has been set', () => {
    expect(jsonBulkEditEnabled()).toBe(false);
  });

  it('is false when the flag is absent', () => {
    setCurrentEnvironment(environmentWith({}));
    expect(jsonBulkEditEnabled()).toBe(false);
  });

  it('is false when the flag is off', () => {
    setCurrentEnvironment(environmentWith({ supportsJsonBulkEdit: false }));
    expect(jsonBulkEditEnabled()).toBe(false);
  });

  it('is true only for an explicit opt-in', () => {
    setCurrentEnvironment(environmentWith({ supportsJsonBulkEdit: true }));
    expect(jsonBulkEditEnabled()).toBe(true);
  });
});
