import {
  MetadataFieldOption,
} from '../../../generated-types/type-defs';
import { Config } from '../types';

export const getOptionsByKey = (
  cfg: Config,
  key: string
): MetadataFieldOption[] | 'not-found-in-config' => {
  let returnValue: MetadataFieldOption[] | 'not-found-in-config' =
    'not-found-in-config';
  Object.keys(cfg).forEach((f: string) => {
    if (f === key) {
      let options: MetadataFieldOption[] = [];
      cfg[f].forEach((key: string) => {
        options.push({
          label: key,
          value: key,
        });
      });

      returnValue = options;
    }
  });
  return returnValue;
};
