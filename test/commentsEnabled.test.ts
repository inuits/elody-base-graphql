/**
 * The comments feature ships to production behind this flag, so "off" must be the
 * behaviour for every state that is not an explicit opt-in -- including a process that
 * never called setCurrentEnvironment, which is why this reads currentEnvironment
 * directly instead of getCurrentEnvironment() (that one throws).
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { commentsEnabled, setCurrentEnvironment } from '../environment';
import { Environment } from '../types/environmentTypes';

const environmentWith = (features: any) => ({ features }) as Environment;

describe('commentsEnabled', () => {
  beforeEach(() => setCurrentEnvironment(undefined as any));

  it('is false when no environment has been set', () => {
    expect(commentsEnabled()).toBe(false);
  });

  it('is false when the flag is absent', () => {
    setCurrentEnvironment(environmentWith({}));
    expect(commentsEnabled()).toBe(false);
  });

  it('is false when the flag is off', () => {
    setCurrentEnvironment(environmentWith({ hasComments: false }));
    expect(commentsEnabled()).toBe(false);
  });

  it('is true only for an explicit opt-in', () => {
    setCurrentEnvironment(environmentWith({ hasComments: true }));
    expect(commentsEnabled()).toBe(true);
  });
});
