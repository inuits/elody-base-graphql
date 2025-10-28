import { Express, Request, Response } from 'express';
import { Environment } from '../environment';
import axios from 'axios';

const exporterUrl = 'http://alloy:4318/v1/traces';

export const applyTracingEndpoint = (app: Express): void => {
  app.post('/api/traces', async (req: Request, res: Response) => {
    if (!exporterUrl) {
      console.error('exporterUrl is not set. Cannot forward traces.');

      return res.status(500).send('Internal server error');
    }

    try {
      const traceData = req.body;
      await axios.post(exporterUrl, traceData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      res.status(200).send({ status: 'ok' });
    } catch (error: any) {
      console.error('Error forwarding traces to the collector', error.message);
      res.status(502).send('Error forwarfing traces to collector');
    }
  });
};
