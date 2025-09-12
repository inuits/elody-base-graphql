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
    queued: {
      "background": "#e6e6e6",
      "text": "#4a4a4a",
    },
    running: {
      "background": "#d9ecf3",
      "text": "#003366",
    },
    warning: {
      "background": "#faeecd",
      "text": "#916807",
    },
    failed: {
      "background": "#ecdada",
      "text": "#ac1113",
    },
    finished: {
      "background": "#daecdd",
      "text": "#0b8319",
    },
  }
};
