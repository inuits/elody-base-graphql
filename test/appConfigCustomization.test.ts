import { describe, it, expect } from 'vitest';
import { baseEnvironment } from '../environment';
import { getConfig } from '../endpoints/appConfigEndpoint';
import type { Environment } from '../types/environmentTypes';

const withCustomization = (
  customization: Partial<Environment['customization']>,
): Environment => ({
  ...baseEnvironment,
  customization: { ...baseEnvironment.customization, ...customization },
});

describe('getConfig customization', () => {
  it('passes the client theme through to the frontend', () => {
    const config = getConfig(withCustomization({ clientTheme: 'aicap' }));
    expect(config.customization.clientTheme).toBe('aicap');
  });

  it('leaves the client theme out when none is configured', () => {
    const config = getConfig(withCustomization({}));
    expect(config.customization.clientTheme).toBeUndefined();
  });
});
