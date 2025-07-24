import { CustomFormatterTypes } from '../../../generated-types/type-defs';
import { type FormattersConfig } from '../types';

export const getWithDefaultFormatters = (customConfig: FormattersConfig): FormattersConfig => {
  const result = { ...elodyFormattersConfig };

  for (const key in customConfig) {
    result[key] = { ...elodyFormattersConfig[key], ...customConfig[key] };
  }

  return result;
}

export const elodyFormattersConfig: FormattersConfig = {
  [CustomFormatterTypes.Pill]: {
    finished: {
      "background": "#daecdd",
      "text": "#0b8319",
    },
    failed: {
      "background": "#ecdada",
      "text": "#ac1113",
    },
    running: {
      "background": "#d9ecf3",
      "text": "#003366",
    },
  }
};
