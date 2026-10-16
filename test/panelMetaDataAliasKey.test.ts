import { describe, it, expect } from 'vitest';
import { baseResolver } from '../baseModule/baseResolver';
import { setCurrentEnvironment } from '../environment';

setCurrentEnvironment({ customization: {} } as any);

const resolveKey = (input: string | undefined, alias: string) =>
  (baseResolver as any).PanelMetaData.key(
    {},
    { input },
    { dataSources: {} },
    { path: { key: 'key', prev: { key: alias } } }
  );

describe('PanelMetaData.key', () => {
  it('falls back to the parent alias when no input is given', async () => {
    expect(await resolveKey(undefined, 'status')).toBe('status');
  });

  it('prefers an explicit input over the alias', async () => {
    expect(await resolveKey('person', 'owner')).toBe('person');
  });
});
