import { describe, it, expect } from 'vitest';
import { baseResolver } from '../baseModule/baseResolver';
import { setCurrentEnvironment } from '../environment';

setCurrentEnvironment({ customization: {} } as any);

const resolveKeyValue = (args: any, alias: string) =>
  (baseResolver as any).IntialValues.keyValue(
    { id: 'entity-1', type: 'production' },
    args,
    { dataSources: {}, customFormatters: {} },
    { path: { key: alias } }
  );

describe('IntialValues.keyValue key', () => {
  it('falls back to the alias when no key is given', async () => {
    expect(await resolveKeyValue({ source: 'root' }, 'type')).toBe(
      'production'
    );
  });

  it('prefers an explicit key over the alias', async () => {
    expect(await resolveKeyValue({ key: 'id', source: 'root' }, 'slug')).toBe(
      'entity-1'
    );
  });
});
