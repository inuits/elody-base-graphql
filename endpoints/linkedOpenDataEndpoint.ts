import { Request, Response } from 'express';
import fetch from 'node-fetch';
import { Environment } from '../types/environmentTypes';
import { getCurrentEnvironment } from '../environment';

export const entityFormats: Record<string, string> = {
  turtle: 'text/turtle',
  json: 'application/json',
  rdf: 'application/rdf+xml',
  jsonld: 'application/ld+json',
  ntriples: 'application/n-triples',
};

const negotiableMimetypes: string[] = [
  'text/html',
  ...Object.values(entityFormats),
];

export const negotiatedMimetype = (req: Request): string | undefined => {
  const mimetype = req.accepts(negotiableMimetypes);
  if (!mimetype || mimetype === 'text/html') return undefined;
  return mimetype;
};

export const getEntityIdFromPath = (path: string): string | undefined => {
  const lastSegment = path.split('/').filter(Boolean).pop();
  return lastSegment?.includes('.') ? undefined : lastSegment;
};

export const proxyEntityInFormat = async (
  entityId: string,
  mimetype: string,
  req: Request,
  res: Response,
  environment: Environment = getCurrentEnvironment()
): Promise<void> => {
  const collectionApiUrl = environment.api.collectionApiUrl.replace(/\/$/, '');
  const headers: Record<string, string> = { accept: mimetype };
  if (req.headers.authorization)
    headers.authorization = req.headers.authorization;

  try {
    const response = await fetch(`${collectionApiUrl}/entities/${entityId}`, {
      headers,
    });
    res
      .status(response.status)
      .setHeader(
        'Content-Type',
        response.headers.get('content-type') ?? mimetype
      );
    res.end(await response.text());
  } catch (exception: any) {
    console.error(
      `Could not fetch entity ${entityId} as ${mimetype}`,
      exception
    );
    res.status(502).end('Could not reach the collection api');
  }
};
