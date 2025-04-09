export type CollectionAPIEntity = {
  _id: string;
  type: string;
  date_created: string;
  date_updated: string;
  version: number;
  metadata: [CollectionAPIMetadata];
  relations: [CollectionAPIRelation];
  last_editor: string;
};

export type CollectionAPIMediaFile = {
  _id: string;
  filename: string;
  metadata: [CollectionAPIMetadata];
  date_created: string;
  date_updated: string;
  type: string;
  relations: [CollectionAPIRelation];
  file_creation_date: string;
  original_filename: string;
  original_file_location: string;
  thumbnail_file_location: string;
  mimetype: string;
  technical_metadata: [CollectionAPIMetadata];
  last_editor: string;
  img_height: number;
  img_width: number;
};

export type CollectionAPIDerivative = {
  _id: string;
  filename: string;
  md5sum: string;
  transcode_file_location: string;
  thumbnail_file_location: string;
  original_filename: string;
  technical_origin: string;
  identifiers: string[];
  relations: [CollectionAPIRelation];
};

export type CollectionAPIMetadata = {
  key: string;
  value: string | Object | number;
  lang: string;
};

export type CollectionAPIRelation = {
  key: string;
  label: string;
  type: string;
  metadata: [CollectionAPIMetadata];
  is_primary: boolean;
  is_primary_thumbnail: boolean;
};
