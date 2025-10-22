import { Express, Request, Response } from 'express';
import { Environment } from '../types/environmentTypes';
import {
  BaseEntity,
  Collection,
  Metadata,
  MetadataRelation,
} from '../../../generated-types/type-defs';
import fetch from 'node-fetch';
import { getMetadataItemValueByKey } from '../helpers/helpers';

const getMediafileValueForPugObject = async (
  mediafileId: string,
  environment: Environment,
  metadataKeys: { [key: string]: string }
): Promise<Object> => {
  try {
    const response = await fetch(
      `${environment.api.collectionApiUrl}/${Collection.Mediafiles}/${mediafileId}`,
      {
        method: 'get',
        headers: { Authorization: 'Bearer ' + environment.staticToken },
      }
    );
    const mediafile = (await response.json()) as any;
    const imageUrl: string = mediafile[metadataKeys.image];
    return { image: imageUrl };
  } catch (e) {
    return { image: '' };
  }
};

const getPugEntityObject = (
  entity: any,
  reqUrl: string,
  environment: Environment
): Object => {
  const metadata: Metadata[] = entity.metadata;
  const metadataKeys = environment.features.SEO?.seoMetadataKeys;
  if (!metadataKeys) return {};
  let pugEntityObject = {
    title: getMetadataItemValueByKey(
      metadataKeys.title,
      metadata,
      environment.customization.applicationTitle
    ),
    description: getMetadataItemValueByKey(metadataKeys.description, metadata),
    image: getMetadataItemValueByKey(metadataKeys.image, metadata),
    site_name: environment.customization.applicationTitle || '',
    req_url: reqUrl,
  };

  const mediafile = entity.relations.find(
    (relationItem: MetadataRelation) => relationItem.type === 'hasMediafile'
  );
  if (!mediafile || pugEntityObject.image) return pugEntityObject;

  const mediafileMetadata = getMediafileValueForPugObject(
    mediafile.key,
    environment,
    metadataKeys
  );

  pugEntityObject = { ...pugEntityObject, ...mediafileMetadata };
  return pugEntityObject;
};

export const applySEOEndpoint = (app: Express, environment: Environment) => {
  if (!environment) return;
  app.get('/api/seo', async (req: Request, res: Response) => {
    try {
      const uri = new URL(req.query?.request_uri as string);
      const entityId = uri.pathname.split('/').reverse()[0];
      const response = await fetch(
        `${environment.api.collectionApiUrl}/${Collection.Entities}/${entityId}`,
        {
          method: 'get',
          headers: { Authorization: 'Bearer ' + environment.staticToken },
        }
      );
      const entity = (await response.json()) as BaseEntity;
      const pugEntityObject = getPugEntityObject(entity, uri.href, environment);
      res.render('seo', pugEntityObject);
    } catch (e) {
      res.render('seo', {
        title: environment.customization.applicationTitle,
        site_name: environment.customization.applicationTitle,
      });
    }
  });
};
