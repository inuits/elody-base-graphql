import { AuthRESTDataSource } from '../auth/AuthRESTDataSource';
import { MediaFile, TranscodeType } from '../../../generated-types/type-defs';
import { environment as env } from '../main';

export class TranscodeService extends AuthRESTDataSource {
  public baseURL = `${env?.api.transcodeService}/`;

  async generateTranscode(
    mediafiles: MediaFile[],
    transcodeType: TranscodeType,
    masterEntityId: string | undefined = undefined
  ): Promise<any> {
    const mediafileObject = { mediafiles: mediafiles };
    return await this.post(
      `transcode/${transcodeType}${
        masterEntityId ? '?master_entity_id=' + masterEntityId : ''
      }`,
      { body: mediafileObject, headers: { 'Content-Type': 'application/json' } }
    );
  }

  async downloadItemsInZip(body: any): Promise<any> {
    let downloadEntity = body["download_entity"];
    const idSplit = downloadEntity.split('/');
    if (idSplit.length > 1) downloadEntity = idSplit[1];
    body["download_entity"] = downloadEntity;
    return await this.post(`transcode/zip`, {
      body,
    });
  }
}
