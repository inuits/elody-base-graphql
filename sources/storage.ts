import FormData from 'form-data';
import { environment as env } from '../main';
import { AuthRESTDataSource } from '../auth/AuthRESTDataSource';

export class StorageAPI extends AuthRESTDataSource {
  public baseURL = `${env?.api.storageApiUrl}`;

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
