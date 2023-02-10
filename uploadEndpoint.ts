import { Express, Request, Response } from 'express';
import { environment as env } from 'base-graphql';
import FormData from 'form-data';

const baseURL = `${env.api.storageApiUrl}`;

export const applyUploadEndpoint = (app: Express) => {
  //   app.get('/api/upload', async (req: Request, res: Response) => {
  //     try {
  //       console.log(req.body);
  //       const form = new FormData();
  //       const { createReadStream, filename, mimetype, encoding, knownLength } =
  //         await file;
  //       form.append('file', createReadStream(), {
  //         filename: filename,
  //         contentType: mimetype,
  //         knownLength: knownLength,
  //       });
  //       const formHeaders = form.getHeaders();
  //       const upload = await fetch(`upload?id=${id}`, {
  //         method: 'POST',
  //         body: form,
  //         headers: formHeaders,
  //       });
  //       res.status(200).end(upload);
  //     } catch (e) {
  //       res.status(500).end(e);
  //     }
  //   });
};
