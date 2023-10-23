import { Express, Request, Response } from 'express';
import { Environment } from '../environment';
import {
  BaseEntity,
  Collection,
  Metadata,
  MetadataRelation,
} from '../../../generated-types/type-defs';
import fetch from 'node-fetch';

const getMetadataItemValueByKey = (
  metadataKey: string,
  metadata: Metadata[],
  backupValue: string = ''
): string => {
  return (
    metadata.find((metadataItem: Metadata) => metadataItem.key === metadataKey)
      ?.value || backupValue
  );
};

const getMediafileMetadataForPugObject = async (
  mediafileId: string,
  environment: Environment
): Promise<Object> => {
  const mediafile = await fetch(
    `${environment.api.collectionApiUrl}/${Collection.Mediafiles}/${mediafileId}`,
    {
      method: 'get',
      headers: { Authorization: 'Bearer ' + environment.staticToken },
    }
  );
  return {};
};

const getPugEntityObject = (entity: any, environment: Environment): Object => {
  const metadata: Metadata[] = entity.metadata;
  let pugEntityObject = {
    title: getMetadataItemValueByKey(
      'title',
      metadata,
      environment.customization.applicationTitle
    ),
    description: getMetadataItemValueByKey('description', metadata),
    site_name: environment.customization.applicationTitle || '',
  };
  const mediafile = entity.relations.find(
    (relationItem: MetadataRelation) => relationItem.type === 'hasMediafile'
  );
  if (!mediafile) return pugEntityObject;

  const mediafileMetadata = getMediafileMetadataForPugObject(
    mediafile.key,
    environment
  );

  pugEntityObject = { ...pugEntityObject, ...mediafileMetadata };
  return pugEntityObject;
};

export const applySEOEndpoint = (app: Express, environment: Environment) => {
  if (!environment) return;
  app.get('/api/seo', async (req: Request, res: Response) => {
    try {
      const uri = new URL(req.query.request_uri as string);
      const entityId = uri.pathname.split('/').reverse()[0];
      const response = await fetch(
        `${environment.api.collectionApiUrl}/${Collection.Entities}/${entityId}`,
        {
          method: 'get',
          headers: { Authorization: 'Bearer ' + environment.staticToken },
        }
      );
      const entity = (await response.json()) as BaseEntity;
      console.log(entity);
      const pugEntityObject = getPugEntityObject(entity, environment);
      res.render('seo', pugEntityObject);
    } catch (e) {
      console.log(e);
      res.render('seo', { title: environment?.customization.applicationTitle });
    }
  });
};
