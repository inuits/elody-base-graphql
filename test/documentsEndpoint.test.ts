import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import { applyDocumentsEndpoint } from '../endpoints/documentsEndpoint';

vi.mock('fs');

const mockDocuments = { GetEntityByIdDocument: { kind: 'Document', definitions: [] } };

describe('applyDocumentsEndpoint', () => {
  let app: express.Express;

  beforeEach(() => {
    app = express();
    applyDocumentsEndpoint(app);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('returns 200 with documents JSON when file exists', async () => {
    const { existsSync, readFileSync } = await import('fs');
    vi.mocked(existsSync).mockReturnValue(true);
    vi.mocked(readFileSync).mockReturnValue(JSON.stringify(mockDocuments));

    const res = await request(app).get('/api/documents');

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/application\/json/);
    expect(res.body).toEqual(mockDocuments);
  });

  it('returns 404 with error message when documents.json does not exist', async () => {
    const { existsSync } = await import('fs');
    vi.mocked(existsSync).mockReturnValue(false);

    const res = await request(app).get('/api/documents');

    expect(res.status).toBe(404);
    expect(res.body.error).toContain('not found');
  });
});
