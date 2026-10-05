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
  it('passes the client colour tokens through to the frontend', () => {
    const theme = { '--color-accent': '#7A4FB5' };
    const config = getConfig(withCustomization({ theme }));
    expect(config.customization.theme).toEqual(theme);
  });

  it('leaves the theme out when none is configured', () => {
    const config = getConfig(withCustomization({}));
    expect(config.customization.theme).toBeUndefined();
  });
});
