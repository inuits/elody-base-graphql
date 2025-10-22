import { AuthRESTDataSource } from '../main';
import { Express, Request, Response } from 'express';
import { EntityInput, Entitytyping } from '../../../generated-types/type-defs';
import { extractErrorCode } from '../helpers/helpers';
import { getCurrentEnvironment } from '../environment';
import { Environment } from '../types/environmentTypes';

export const applyUploadEndpoint = (app: Express) => {
  const env: Environment = getCurrentEnvironment();
  app.post(
    '/api/upload/batch',
    async (request: Request, response: Response) => {
      try {
        const filename: string = request.query['filename'] as string;
        const isDryRun: boolean = !!request.query['dry_run'];
        const mainJobId: string = request.query['main_job_id'] as string;
        const extraMediafileType: string | undefined = request.query[
          'extra_mediafile_type'
        ] as string;
        let csv = '';
        request.on('data', (chunk: any) => {
          try {
            csv += chunk.toString();
          } catch (e) {
            console.log('Error while getting csv file:', e);
            response.status(500).end(JSON.stringify(e));
          }
        });
        request.on('end', async () => {
          try {
            if (isDryRun) {
              const res = await __batchDryRun(
                request,
                response,
                csv,
                filename,
                extraMediafileType
              );
              response.end(JSON.stringify(res));
            } else {
              const result = await __batchEntities(
                request,
                response,
                csv,
                filename,
                mainJobId,
                extraMediafileType
              );
              const uploadUrls = result.links
                .filter((uploadUrl: string) => uploadUrl !== '')
                .map(
                  (line: string) =>
                    `${line}&parent_job_id=${result.parent_job_id}`
                );
              response.end(
                JSON.stringify({
                  links: uploadUrls,
                  parent_job_id: result.parent_job_id,
                })
              );
            }
          } catch (e) {
            console.log('Error while parsing response:', e);
            response.status(500).end(JSON.stringify(e));
          }
        });
      } catch (exception: any) {
        response
          .status(extractErrorCode(exception))
          .end(JSON.stringify(exception));
      }
    }
  );

  app.post('/api/upload/xml', async (request: Request, response: Response) => {
    try {
      const datasource = new AuthRESTDataSource({ session: request.session });
      const result = await datasource.post(
        `${env.api.collectionApiUrl}/parse_marcxml`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: `{"xml": "<?xml version='1.0' encoding='UTF-8' ?><marc:collection xmlns:marc='http://www.loc.gov/MARC21/slim' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xsi:schemaLocation='http://www.loc.gov/MARC21/slim http://www.loc.gov/standards/marcxml/schema/MARC21slim.xsd'> <marc:record><marc:leader>00502aam a2200193   4500</marc:leader> <marc:controlfield tag='001'>251</marc:controlfield> <marc:controlfield tag='005'>20070913092740.0</marc:controlfield><marc:controlfield tag='008'>830520s1980                      1 dut  </marc:controlfield><marc:datafield tag='020' ind1=' ' ind2=' '><marc:subfield code='a'>90-290-1263-3</marc:subfield></marc:datafield><marc:datafield tag='040' ind1=' ' ind2=' '><marc:subfield code='a'>VLACC I</marc:subfield><marc:subfield code='b'>dut</marc:subfield></marc:datafield><marc:datafield tag='100' ind1=' ' ind2=' '><marc:subfield code='a'>Brunner, John</marc:subfield><marc:subfield code='4'>aut</marc:subfield></marc:datafield><marc:datafield tag='245' ind1=' ' ind2='0'><marc:subfield code='a'>Iedereen op Zanzibar</marc:subfield><marc:subfield code='h'>BOEK</marc:subfield></marc:datafield><marc:datafield tag='260' ind1=' ' ind2=' '><marc:subfield code='a'>Amsterdam</marc:subfield><marc:subfield code='b'>Meulenhoff</marc:subfield><marc:subfield code='c'>cop. 1980</marc:subfield></marc:datafield><marc:datafield tag='300' ind1=' ' ind2=' '><marc:subfield code='a'>575 p.</marc:subfield></marc:datafield><marc:datafield tag='365' ind1=' ' ind2=' '><marc:subfield code='b'>460</marc:subfield><marc:subfield code='c'>F</marc:subfield></marc:datafield><marc:datafield tag='490' ind1=' ' ind2=' '><marc:subfield code='a'>Meulenhoff science fiction</marc:subfield><marc:subfield code='v'>160</marc:subfield></marc:datafield><marc:datafield tag='521' ind1=' ' ind2=' '><marc:subfield code='a'>volwassenen</marc:subfield></marc:datafield><marc:datafield tag='534' ind1=' ' ind2=' '><marc:subfield code='a'>Stand on Zanzibar</marc:subfield></marc:datafield><marc:datafield tag='650' ind1=' ' ind2=' '><marc:subfield code='a'>Sciencefiction</marc:subfield><marc:subfield code='9'>vge</marc:subfield></marc:datafield></marc:record> <marc:record><marc:leader>00498aam a2200181   4500</marc:leader> <marc:controlfield tag='001'>725</marc:controlfield> <marc:controlfield tag='005'>20080609131914.0</marc:controlfield><marc:controlfield tag='008'>830524s1975                      1 dut  </marc:controlfield><marc:datafield tag='020' ind1=' ' ind2=' '><marc:subfield code='a'>90-295-0612-1</marc:subfield></marc:datafield><marc:datafield tag='040' ind1=' ' ind2=' '><marc:subfield code='a'>VLACC I</marc:subfield><marc:subfield code='b'>dut</marc:subfield><marc:subfield code='c'>Open Vlacc</marc:subfield></marc:datafield><marc:datafield tag='100' ind1=' ' ind2=' '><marc:subfield code='a'>Boon, Louis Paul</marc:subfield><marc:subfield code='4'>aut</marc:subfield></marc:datafield><marc:datafield tag='245' ind1=' ' ind2='0'><marc:subfield code='a'>Verscheurd jeugdportret</marc:subfield><marc:subfield code='h'>BOEK</marc:subfield></marc:datafield><marc:datafield tag='260' ind1=' ' ind2=' '><marc:subfield code='a'>Amsterdam</marc:subfield><marc:subfield code='b'>De Arbeiderspers</marc:subfield><marc:subfield code='c'>1975</marc:subfield></marc:datafield><marc:datafield tag='300' ind1=' ' ind2=' '><marc:subfield code='a'>181 p.</marc:subfield></marc:datafield><marc:datafield tag='490' ind1=' ' ind2=' '><marc:subfield code='a'>Grote ABC</marc:subfield><marc:subfield code='v'>245</marc:subfield></marc:datafield><marc:datafield tag='521' ind1=' ' ind2=' '><marc:subfield code='a'>volwassenen</marc:subfield></marc:datafield><marc:datafield tag='650' ind1=' ' ind2=' '><marc:subfield code='a'>Autobiografische literatuur</marc:subfield><marc:subfield code='9'>vge</marc:subfield></marc:datafield><marc:datafield tag='600' ind1=' ' ind2=' '><marc:subfield code='a'>Boon, Louis Paul</marc:subfield><marc:subfield code='9'>vth</marc:subfield></marc:datafield></marc:record> <marc:record><marc:leader>00501aam a2200193   4500</marc:leader> <marc:controlfield tag='001'>4345</marc:controlfield> <marc:controlfield tag='005'>20070913093227.0</marc:controlfield><marc:controlfield tag='008'>830531s1980                      1 dut  </marc:controlfield><marc:datafield tag='020' ind1=' ' ind2=' '><marc:subfield code='a'>90-229-0099-1</marc:subfield></marc:datafield><marc:datafield tag='040' ind1=' ' ind2=' '><marc:subfield code='a'>VLACC I</marc:subfield><marc:subfield code='b'>dut</marc:subfield></marc:datafield><marc:datafield tag='100' ind1=' ' ind2=' '><marc:subfield code='a'>Simenon, Georges</marc:subfield><marc:subfield code='4'>aut</marc:subfield></marc:datafield><marc:datafield tag='245' ind1=' ' ind2='3'><marc:subfield code='a'>De vergissing van Maigret</marc:subfield><marc:subfield code='h'>BOEK</marc:subfield></marc:datafield><marc:datafield tag='260' ind1=' ' ind2=' '><marc:subfield code='a'>Utrecht</marc:subfield><marc:subfield code='b'>Bruna en Zoon</marc:subfield><marc:subfield code='c'>1980</marc:subfield></marc:datafield><marc:datafield tag='300' ind1=' ' ind2=' '><marc:subfield code='a'>190 p.</marc:subfield></marc:datafield><marc:datafield tag='365' ind1=' ' ind2=' '><marc:subfield code='b'>80</marc:subfield><marc:subfield code='c'>F</marc:subfield></marc:datafield><marc:datafield tag='490' ind1=' ' ind2=' '><marc:subfield code='a'>Zwarte beertjes</marc:subfield><marc:subfield code='n'>Detective</marc:subfield><marc:subfield code='v'>99</marc:subfield></marc:datafield><marc:datafield tag='521' ind1=' ' ind2=' '><marc:subfield code='a'>volwassenen</marc:subfield></marc:datafield><marc:datafield tag='534' ind1=' ' ind2=' '><marc:subfield code='a'>Maigret se trompe</marc:subfield></marc:datafield><marc:datafield tag='650' ind1=' ' ind2=' '><marc:subfield code='a'>Detectives</marc:subfield><marc:subfield code='9'>vge</marc:subfield></marc:datafield></marc:record> <marc:record><marc:leader>00570aam a2200205   4500</marc:leader> <marc:controlfield tag='001'>4456</marc:controlfield> <marc:controlfield tag='005'>20090723164820.0</marc:controlfield><marc:controlfield tag='008'>830531s1981                      1 dut  </marc:controlfield><marc:datafield tag='020' ind1=' ' ind2=' '><marc:subfield code='a'>90-449-0346-2</marc:subfield></marc:datafield><marc:datafield tag='040' ind1=' ' ind2=' '><marc:subfield code='a'>VLACC I</marc:subfield><marc:subfield code='b'>dut</marc:subfield><marc:subfield code='c'>Open Vlacc</marc:subfield></marc:datafield><marc:datafield tag='041' ind1=' ' ind2=' '><marc:subfield code='h'>fre</marc:subfield></marc:datafield><marc:datafield tag='100' ind1=' ' ind2=' '><marc:subfield code='a'>Simenon, Georges</marc:subfield><marc:subfield code='4'>aut</marc:subfield></marc:datafield><marc:datafield tag='245' ind1=' ' ind2='0'><marc:subfield code='a'>Maigret en de moord op de Quai des Orfèvres</marc:subfield><marc:subfield code='h'>BOEK</marc:subfield></marc:datafield><marc:datafield tag='260' ind1=' ' ind2=' '><marc:subfield code='a'>Leeuwarden</marc:subfield><marc:subfield code='b'>Bruna</marc:subfield><marc:subfield code='c'>cop. 1981</marc:subfield></marc:datafield><marc:datafield tag='300' ind1=' ' ind2=' '><marc:subfield code='a'>159 p.</marc:subfield></marc:datafield><marc:datafield tag='490' ind1=' ' ind2=' '><marc:subfield code='a'>Zwarte beertjes</marc:subfield><marc:subfield code='n'>Detective</marc:subfield><marc:subfield code='v'>346</marc:subfield></marc:datafield><marc:datafield tag='521' ind1=' ' ind2=' '><marc:subfield code='a'>volwassenen</marc:subfield></marc:datafield><marc:datafield tag='534' ind1=' ' ind2=' '><marc:subfield code='a'>Cecile est morte</marc:subfield></marc:datafield><marc:datafield tag='600' ind1=' ' ind2=' '><marc:subfield code='a'>Maigret</marc:subfield><marc:subfield code='c'>personage</marc:subfield><marc:subfield code='9'>vth</marc:subfield></marc:datafield><marc:datafield tag='650' ind1=' ' ind2=' '><marc:subfield code='a'>Detectives</marc:subfield><marc:subfield code='9'>vge</marc:subfield></marc:datafield></marc:record> <marc:record><marc:leader>00508aam a2200193   4500</marc:leader> <marc:controlfield tag='001'>4464</marc:controlfield> <marc:controlfield tag='005'>20070913093234.0</marc:controlfield><marc:controlfield tag='008'>830531s1981                      1 dut  </marc:controlfield><marc:datafield tag='020' ind1=' ' ind2=' '><marc:subfield code='a'>90-449-0411-6</marc:subfield></marc:datafield><marc:datafield tag='040' ind1=' ' ind2=' '><marc:subfield code='a'>VLACC I</marc:subfield><marc:subfield code='b'>dut</marc:subfield></marc:datafield><marc:datafield tag='041' ind1=' ' ind2=' '><marc:subfield code='h'>fre</marc:subfield></marc:datafield><marc:datafield tag='100' ind1=' ' ind2=' '><marc:subfield code='a'>Simenon, Georges</marc:subfield><marc:subfield code='4'>aut</marc:subfield></marc:datafield><marc:datafield tag='245' ind1=' ' ind2='0'><marc:subfield code='a'>Maigret en de wereld van gisteren</marc:subfield><marc:subfield code='c'>Georges Simenon</marc:subfield><marc:subfield code='h'>BOEK</marc:subfield></marc:datafield><marc:datafield tag='260' ind1=' ' ind2=' '><marc:subfield code='a'>Leeuwarden</marc:subfield><marc:subfield code='b'>Bruna</marc:subfield><marc:subfield code='c'>1981</marc:subfield></marc:datafield><marc:datafield tag='300' ind1=' ' ind2=' '><marc:subfield code='a'>191 p.</marc:subfield></marc:datafield><marc:datafield tag='365' ind1=' ' ind2=' '><marc:subfield code='b'>110</marc:subfield><marc:subfield code='c'>F</marc:subfield></marc:datafield><marc:datafield tag='490' ind1=' ' ind2=' '><marc:subfield code='a'>Zwarte beertjes</marc:subfield><marc:subfield code='v'>411</marc:subfield></marc:datafield><marc:datafield tag='521' ind1=' ' ind2=' '><marc:subfield code='a'>volwassenen</marc:subfield></marc:datafield><marc:datafield tag='534' ind1=' ' ind2=' '><marc:subfield code='a'>Maigret et les vieillards</marc:subfield></marc:datafield></marc:record> <marc:record><marc:leader>00423aam a2200157   4500</marc:leader> <marc:controlfield tag='001'>4626</marc:controlfield> <marc:controlfield tag='005'>20100527171354.0</marc:controlfield><marc:controlfield tag='008'>830531s1981                      1 dut  </marc:controlfield><marc:datafield tag='020' ind1=' ' ind2=' '><marc:subfield code='a'>90-646-7022-6</marc:subfield></marc:datafield><marc:datafield tag='040' ind1=' ' ind2=' '><marc:subfield code='a'>VLACC I</marc:subfield><marc:subfield code='b'>dut</marc:subfield><marc:subfield code='c'>Open Vlacc</marc:subfield></marc:datafield><marc:datafield tag='100' ind1=' ' ind2=' '><marc:subfield code='a'>Venken, Jaak</marc:subfield><marc:subfield code='4'>aut</marc:subfield></marc:datafield><marc:datafield tag='245' ind1=' ' ind2='4'><marc:subfield code='a'>Het zwarte gild van de bokkerijders</marc:subfield><marc:subfield code='h'>BOEK</marc:subfield></marc:datafield><marc:datafield tag='260' ind1=' ' ind2=' '><marc:subfield code='a'>Sint-Niklaas</marc:subfield><marc:subfield code='b'>Danthe</marc:subfield><marc:subfield code='c'>1981</marc:subfield></marc:datafield><marc:datafield tag='300' ind1=' ' ind2=' '><marc:subfield code='a'>194 p.</marc:subfield><marc:subfield code='b'>ill.</marc:subfield></marc:datafield><marc:datafield tag='521' ind1=' ' ind2=' '><marc:subfield code='a'>volwassenen</marc:subfield></marc:datafield><marc:datafield tag='650' ind1=' ' ind2=' '><marc:subfield code='a'>Bokkenrijders</marc:subfield><marc:subfield code='9'>vth</marc:subfield></marc:datafield></marc:record> </marc:collection> "}`,
        }
      );

      response.end(JSON.stringify('success'));
    } catch (exception) {
      response
        .status(extractErrorCode(exception))
        .end(JSON.stringify(exception));
    }
  });

  app.post(
    '/api/upload/single',
    async (request: Request, response: Response) => {
      try {
        const entityInput = request.body.entityInput ?? {
          metadata: [],
          relations: [],
        };
        if (request.query?.hasRelation) {
          const uploadUrl = await __createMediafileForEntity(
            request,
            entityInput
          );
          response.end(JSON.stringify(uploadUrl));
        } else {
          const uploadUrl = await __createStandaloneMediafile(
            request,
            entityInput
          );
          response.end(JSON.stringify(uploadUrl));
        }
      } catch (exception: any) {
        response
          .status(extractErrorCode(exception))
          .end(JSON.stringify(exception));
      }
    }
  );

  app.post(`/api/upload/csv`, async (request: Request, response: Response) => {
    let csv = '';
    request.on('data', (chunk: any) => {
      try {
        csv += chunk.toString();
      } catch (e) {
        console.log('Error while getting csv file:', e);
        response.status(500).end(JSON.stringify(e));
      }
    });

    request.on('end', async () => {
      try {
        const clientIp: string = request.headers['x-forwarded-for'] as string;
        const datasource = new AuthRESTDataSource({
          session: request.session,
          clientIp,
        });
        const result = await datasource.post(
          `${env.api.collectionApiUrl}/entities/${request.query.parentId}/order`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'text/csv',
            },
            body: csv,
          }
        );
        response.status(200).setHeader('Content-Type', 'text/csv');
        response.end();
      } catch (exception: any) {
        response
          .status(extractErrorCode(exception))
          .end(JSON.stringify(exception));
        response.end(JSON.stringify(exception));
      }
    });
  });
};

const __batchDryRun = async (
  request: Request,
  response: Response,
  csv: string,
  filename: string,
  extraMediafileType: string | undefined
): Promise<any> => {
  const env: Environment = getCurrentEnvironment();
  let result = undefined;
  try {
    const clientIp: string = request.headers['x-forwarded-for'] as string;
    const datasource = new AuthRESTDataSource({
      session: request.session,
      clientIp,
    });
    result = await datasource.post(
      `${env.api.collectionApiUrl}/batch?filename=${filename}&dry_run=1${
        !!extraMediafileType
          ? `&extra_mediafile_type=${extraMediafileType}`
          : ''
      }`,
      {
        headers: {
          'Content-Type': 'text/csv',
          Accept: 'application/json',
        },
        body: csv,
      }
    );
    return result;
  } catch (exception: any) {
    response.status(extractErrorCode(exception)).end(JSON.stringify(exception));
  }
};

const __batchEntities = async (
  request: Request,
  response: Response,
  csv: string,
  filename: string,
  mainJobId: string,
  extraMediafileType: string | undefined
): Promise<any> => {
  const env: Environment = getCurrentEnvironment();
  const clientIp: string = request.headers['x-forwarded-for'] as string;
  const datasource = new AuthRESTDataSource({
    session: request.session,
    clientIp,
  });
  let result: any;
  try {
    result = await datasource.post(
      `${env.api.collectionApiUrl}/batch?filename=${filename}${
        !!extraMediafileType
          ? `&extra_mediafile_type=${extraMediafileType}`
          : ''
      }${mainJobId ? `&main_job_id=${mainJobId}` : ''}`,
      {
        headers: {
          'Content-Type': 'text/csv',
          Accept: 'application/json',
        },
        body: csv,
      }
    );
  } catch (exception: any) {
    response.status(extractErrorCode(exception)).end(JSON.stringify(exception));
  }
  return result;
};

const __createMediafileForEntity = async (
  request: Request,
  entityInput: EntityInput
): Promise<string> => {
  const env: Environment = getCurrentEnvironment();
  const clientIp: string = request.headers['x-forwarded-for'] as string;
  const datasource = new AuthRESTDataSource({
    session: request.session,
    clientIp,
  });

  const body = {
    filename: `${request.query.filename}`,
    metadata: entityInput.metadata,
    relations: entityInput.relations,
  };
  body.metadata!.push({
    key: 'title',
    value: `${request.query.filename}`,
  });

  return await datasource.post(
    `${env?.api.collectionApiUrl}/entities/${request.query.entityId}/mediafiles`,
    {
      body,
      headers: {
        Accept: 'text/uri-list',
        'Content-Type': 'application/json',
      },
    }
  );
};

const __createStandaloneMediafile = async (
  request: Request,
  entityInput: EntityInput
) => {
  const env: Environment = getCurrentEnvironment();
  const clientIp: string = request.headers['x-forwarded-for'] as string;
  const datasource = new AuthRESTDataSource({
    session: request.session,
    clientIp,
  });

  const body = {
    metadata: entityInput.metadata,
    relations: entityInput.relations,
    type:
      (request.query.type as string) ||
      env.customization?.uploadEntityTypeToCreate ||
      Entitytyping.Asset,
  };
  body.metadata!.push({
    key: 'title',
    value: request.query.filename as string,
  });

  return await datasource.post(
    `${env.api.collectionApiUrl}/entities?create_mediafile=1&mediafile_filename=${request.query.filename}`,
    {
      body,
      headers: {
        Accept: 'text/uri-list',
        'Content-Type': 'application/json',
      },
    }
  );
};
