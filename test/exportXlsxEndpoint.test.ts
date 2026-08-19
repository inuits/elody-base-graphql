import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { Express } from 'express';
import { applyExportXlsxEndpoint } from '../endpoints/exportXlsxEndpoint';
import { fetchWithTokenRefresh } from '../endpoints/fetchWithToken';
import { setCurrentEnvironment } from '../environment';
import { type Environment } from '../types/environmentTypes';
import { createTestApp, getMockEnvironment } from './utils/initTestApp';

vi.mock('../endpoints/fetchWithToken', () => ({
  fetchWithTokenRefresh: vi.fn(),
}));

describe('Export xlsx endpoint', () => {
  let app: Express;
  let mockEnv: Environment;

  beforeEach(() => {
    vi.clearAllMocks();
    mockEnv = getMockEnvironment({
      api: { collectionApiUrl: 'http://mock-collection-api.com' },
    });
    setCurrentEnvironment(mockEnv);
    app = createTestApp(applyExportXlsxEndpoint, mockEnv);
  });

  it('sends ids joined by comma and sets limit to ids.length', async () => {
    vi.mocked(fetchWithTokenRefresh).mockResolvedValue({
      ok: true,
      arrayBuffer: async () => new TextEncoder().encode('xlsx-bytes').buffer,
    } as any);

    await request(app)
      .post('/api/export/xlsx')
      .send({ type: 'inscription', ids: ['id-1', 'id-2'] });

    expect(fetchWithTokenRefresh).toHaveBeenCalledWith(
      expect.stringContaining('ids=id-1%2Cid-2'),
      {
        method: 'GET',
        headers: {
          Accept:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        },
      },
      expect.any(Object)
    );
    const calledUrl = vi.mocked(fetchWithTokenRefresh).mock.calls[0][0] as string;
    expect(calledUrl).toContain('limit=2');
  });

  it('sends the provided limit and omits ids when no ids are given', async () => {
    vi.mocked(fetchWithTokenRefresh).mockResolvedValue({
      ok: true,
      arrayBuffer: async () => new TextEncoder().encode('xlsx-bytes').buffer,
    } as any);

    await request(app)
      .post('/api/export/xlsx')
      .send({ type: 'inscription', limit: 137 });

    const calledUrl = vi.mocked(fetchWithTokenRefresh).mock.calls[0][0] as string;
    expect(calledUrl).toContain('limit=137');
    expect(calledUrl).not.toContain('ids=');
  });

  it('defaults order_by to date_created and asc to 1 when not provided', async () => {
    vi.mocked(fetchWithTokenRefresh).mockResolvedValue({
      ok: true,
      arrayBuffer: async () => new TextEncoder().encode('xlsx-bytes').buffer,
    } as any);

    await request(app)
      .post('/api/export/xlsx')
      .send({ type: 'inscription', limit: 20 });

    const calledUrl = vi.mocked(fetchWithTokenRefresh).mock.calls[0][0] as string;
    expect(calledUrl).toContain('order_by=date_created');
    expect(calledUrl).toContain('asc=1');
  });

  it('returns the upstream status and body when the upstream request fails', async () => {
    vi.mocked(fetchWithTokenRefresh).mockResolvedValue({
      ok: false,
      status: 422,
      text: async () => 'entity type cannot be exported to xlsx',
    } as any);

    const response = await request(app)
      .post('/api/export/xlsx')
      .send({ type: 'inscription', limit: 20 });

    expect(response.status).toBe(422);
    expect(response.text).toBe('entity type cannot be exported to xlsx');
  });

  it('streams the binary response back with the xlsx content type', async () => {
    vi.mocked(fetchWithTokenRefresh).mockResolvedValue({
      ok: true,
      arrayBuffer: async () => new TextEncoder().encode('xlsx-bytes').buffer,
    } as any);

    const response = await request(app)
      .post('/api/export/xlsx')
      .send({ type: 'inscription', limit: 20 });

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain(
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
  });

  it('returns 500 with the error message when fetchWithTokenRefresh throws', async () => {
    vi.mocked(fetchWithTokenRefresh).mockRejectedValue(new Error('network down'));

    const response = await request(app)
      .post('/api/export/xlsx')
      .send({ type: 'inscription', limit: 20 });

    expect(response.status).toBe(500);
    expect(response.text).toBe('network down');
  });

  it('overrides the request and response timeout to 10 minutes', async () => {
    const requestTimeoutSpy = vi.spyOn(
      require('http').IncomingMessage.prototype,
      'setTimeout'
    );
    const responseTimeoutSpy = vi.spyOn(
      require('http').ServerResponse.prototype,
      'setTimeout'
    );
    vi.mocked(fetchWithTokenRefresh).mockResolvedValue({
      ok: true,
      arrayBuffer: async () => new TextEncoder().encode('xlsx-bytes').buffer,
    } as any);

    await request(app)
      .post('/api/export/xlsx')
      .send({ type: 'inscription', limit: 20 });

    expect(requestTimeoutSpy).toHaveBeenCalledWith(600000);
    expect(responseTimeoutSpy).toHaveBeenCalledWith(600000);

    requestTimeoutSpy.mockRestore();
    responseTimeoutSpy.mockRestore();
  });
});
