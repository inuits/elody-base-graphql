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
      "background": "#228B22",
      "text": "#fff",
    },
    failed: {
      "background": "#C70039",
      "text": "#fff",
    },
    running: {
      "background": "#1E90FF",
      "text": "#fff",
    },
  }
};