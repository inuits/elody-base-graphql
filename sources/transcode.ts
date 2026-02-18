import { AuthRESTDataSource } from '../auth/AuthRESTDataSource';
import { MediaFile, TranscodeType } from '../../../generated-types/type-defs';
import { getCurrentEnvironment } from '../environment';
import { Environment } from '../types/environmentTypes';

export class TranscodeService extends AuthRESTDataSource {
  env: Environment = getCurrentEnvironment();
  public baseURL = `${this.env.api.transcodeService}/`;

  async downloadItemsInZip(body: any): Promise<any> {
    let downloadEntityId = body['download_entity_id'];
    const idSplit = downloadEntityId.split('/');
    if (idSplit.length > 1) downloadEntityId = idSplit[1];
    body['download_entity_id'] = downloadEntityId;
    return await this.post(`transcode/zip`, {
      body,
    });
  }
}
