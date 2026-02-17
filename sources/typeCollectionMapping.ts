import {Collection} from '../../../generated-types/type-defs';

export const baseTypeCollectionMapping: { [test: string]: Collection } = {
  asset: Collection.Entities,
  BaseEntity: Collection.Entities,
  mediafile: Collection.Mediafiles,
  MediaFile: Collection.Mediafiles,
  tag: Collection.Entities,
  tenant: Collection.Entities,
  user: Collection.Entities,
  download: Collection.Entities,
};
