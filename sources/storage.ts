import FormData from 'form-data';
import { AuthRESTDataSource } from '../auth/AuthRESTDataSource';
import { getCurrentEnvironment } from '../environment';
import { Environment } from '../types/environmentTypes';

export class StorageAPI extends AuthRESTDataSource {
  env: Environment = getCurrentEnvironment();
  public baseURL = `${this.env.api.storageApiUrl}`;

  async uploadFile(id: String, file: any): Promise<any> {
    const form = new FormData();
    const { createReadStream, filename, mimetype, encoding, knownLength } =
      await file;
    form.append('file', createReadStream(), {
      filename: filename,
      contentType: mimetype,
      knownLength: knownLength,
    });
    const formHeaders = form.getHeaders();
    const upload = await this.post(`upload?id=${id}`, {
      body: { form },
      headers: formHeaders,
    });
    return upload;
  }
}
