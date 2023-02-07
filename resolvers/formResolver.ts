import { MediafileMetaData } from '../../baseGraphql/sources/forms';
import {
  Form,
  Maybe,
  MetadataField,
  MetadataFieldOption,
} from '../../../generated-types/type-defs';
import { Config, DataSources } from '../types';

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

export const resolveMediafileForm = async (
  dataSources: DataSources
): Promise<Maybe<Form>> => {
  let temp: Form = MediafileMetaData;
  const fetchedConfig = await dataSources.CollectionAPI.getConfig();
  temp.fields.forEach((f) => {
    let tempFilter = f as MetadataField;
    if (tempFilter.config_key) {
      const options = getOptionsByKey(
        fetchedConfig,
        tempFilter.config_key as string
      );
      if (options !== 'not-found-in-config') {
        tempFilter.options = options;
      }
    }
  });

  return temp;
};
