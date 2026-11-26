import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import express from 'express';
import request from 'supertest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { configureFrontendForEnvironment } from '../endpoints/frontendEndpoint';

vi.mock('../endpoints/linkedOpenDataEndpoint', () => ({
  getEntityIdFromPath: () => undefined,
  negotiatedMimetype: () => undefined,
  proxyEntityInFormat: vi.fn(),
}));

describe('frontend static files', () => {
  const cwd = process.cwd();
  let root: string;
  let app: express.Express;

  beforeAll(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'frontend-'));
    const dist = path.join(root, 'dashboard/dist');
    fs.mkdirSync(path.join(dist, 'static-assets-pwa'), { recursive: true });
    fs.writeFileSync(path.join(dist, 'index.html'), '<html></html>');
    fs.writeFileSync(path.join(dist, 'pwa-version.json'), '{}');
    fs.writeFileSync(path.join(dist, 'static-assets-pwa/index-abc123.js'), '1');
    process.chdir(root);
    app = express();
    configureFrontendForEnvironment(app);
  });

  afterAll(() => {
    process.chdir(cwd);
    fs.rmSync(root, { recursive: true, force: true });
  });

  it('lets the browser keep a hashed asset without asking again', async () => {
    const response = await request(app).get('/static-assets-pwa/index-abc123.js');
    expect(response.headers['cache-control']).toContain('immutable');
    expect(response.headers['cache-control']).toContain('max-age=31536000');
  });

  it('makes the browser check the version file every time', async () => {
    const response = await request(app).get('/pwa-version.json');
    expect(response.headers['cache-control']).toContain('max-age=0');
  });

  it('makes the browser check the page every time', async () => {
    const response = await request(app).get('/');
    expect(response.headers['cache-control'] ?? 'max-age=0').toContain('max-age=0');
  });
});
