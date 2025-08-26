import { describe, it, expect } from 'vitest';
import { CustomFormatterTypes } from '../../../generated-types/type-defs';
import { getWithDefaultFormatters, elodyFormattersConfig } from '../utilities/elodyMetadataFormatters';
import type { FormattersConfig } from '../types';

describe('getWithDefaultFormatters', () => {
  it('should return default config when no custom config provided', () => {
    const result = getWithDefaultFormatters({});
    expect(result).toEqual(elodyFormattersConfig);
  });

  it('should merge custom properties while keeping defaults', () => {
    const customConfig: FormattersConfig = {
      [CustomFormatterTypes.Pill]: {
        finished: {
          background: 'custom-green',
          text: '#custom-white',
        },
        newState: {
          background: '#123456',
          text: '#abcdef',
        },
      },
    };

    const result = getWithDefaultFormatters(customConfig);

    expect(result[CustomFormatterTypes.Pill].finished).toEqual({
      background: 'custom-green',
      text: '#custom-white',
    });

    expect(result[CustomFormatterTypes.Pill].failed).toEqual({
      background: '#ecdada',
      text: '#ac1113',
    });

    expect(result[CustomFormatterTypes.Pill].newState).toEqual({
      background: '#123456',
      text: '#abcdef',
    });
  });

  it('should not mutate the original config objects', () => {
    const customConfig: FormattersConfig = {
      [CustomFormatterTypes.Pill]: {
        running: {
          background: 'mutated-color',
        },
      },
    };

    const defaultConfigSnapshot = JSON.parse(JSON.stringify(elodyFormattersConfig));
    const customConfigSnapshot = JSON.parse(JSON.stringify(customConfig));

    getWithDefaultFormatters(customConfig);

    expect(elodyFormattersConfig).toEqual(defaultConfigSnapshot);
    expect(customConfig).toEqual(customConfigSnapshot);
  });

  it('should handle empty objects in custom config', () => {
    const customConfig: FormattersConfig = {
      [CustomFormatterTypes.Pill]: {},
    };

    const result = getWithDefaultFormatters(customConfig);
    expect(result).toEqual(elodyFormattersConfig);
  });

  it('should handle multiple formatter types when added', () => {
    const customConfig: FormattersConfig = {
      [CustomFormatterTypes.Pill]: {
        finished: { background: 'blue' },
      },
      'NewFormatterType': {
        someState: { color: 'red' },
      },
    };

    const result = getWithDefaultFormatters(customConfig);
    
    expect(result[CustomFormatterTypes.Pill].finished.background).toBe('blue');
    expect(result.NewFormatterType.someState.color).toBe('red');
  });
});