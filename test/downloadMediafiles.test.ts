import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import nock from 'nock';
import { Express } from 'express';
import applyMediaFileEndpoint from '../endpoints/mediafilesEndpoint';
import { fetchWithTokenRefresh } from '../endpoints/fetchWithToken';
import { type Environment } from '../types/environmentTypes';
import { createTestApp, getMockEnvironment } from './utils/initTestApp';

vi.mock('../endpoints/fetchWithToken', () => ({
  fetchWithTokenRefresh: vi.fn(),
}));

describe('Mediafile Proxy Integration Tests', () => {
  let app: Express;
  let mockEnv: Environment;

  beforeEach(() => {
    vi.clearAllMocks();
    nock.cleanAll();

    mockEnv = getMockEnvironment({
      api: {
        collectionApiUrl: 'http://mock-api.com',
        storageApiUrl: 'http://internal-storage:8000',
        iiifUrl: 'http://internal-iiif:8182',
        iiifUrlFrontend: 'http://public-cantaloupe.com',
      },
    });

    app = createTestApp(applyMediaFileEndpoint, mockEnv);
  });

  describe('/api/mediafile/* proxy routing', () => {
    it('should proxy to storageApiUrl when helper returns a standard storage URL', async () => {
      const mockDownloadUrl = 'http://internal-storage:8000/bucket/video-transcoded.mp4';
      const mockId = '123-abc';

      vi.mocked(fetchWithTokenRefresh).mockResolvedValue({
        ok: true,
        json: async () => ({ transcode_file_location: mockDownloadUrl }),
      } as any);

      const storageScope = nock('http://internal-storage:8000')
        .get('/bucket/video-transcoded.mp4')
        .reply(200, 'File content from storage');

      const response = await request(app).get(`/api/mediafile/${mockId}`);

      expect(storageScope.isDone()).toBe(true);
      expect(response.status).toBe(200);
      expect(response.text).toBe('File content from storage');

      expect(fetchWithTokenRefresh).toHaveBeenCalledWith(
        expect.stringContaining(`/mediafiles/${mockId}/download-urls`),
        { method: 'GET' },
        expect.any(Object)
      );
    });

    it('should proxy to iiifUrl when helper returns a URL containing iiifUrlFrontend', async () => {
      const mockDownloadUrl = 'http://public-cantaloupe.com/iiif/2/456/full/500,/0/default.jpg';
      const mockId = '456-def';

      vi.mocked(fetchWithTokenRefresh).mockResolvedValue({
        ok: true,
        json: async () => ({ transcode_file_location: mockDownloadUrl }),
      } as any);

      const iiifScope = nock('http://public-cantaloupe.com')
        .get('/iiif/2/456/full/500,/0/default.jpg')
        .reply(200, 'Image content from IIIF');

      const response = await request(app).get(`/api/mediafile/${mockId}`);

      expect(iiifScope.isDone()).toBe(true);
      expect(response.status).toBe(200);
      expect(response.text).toBe('Image content from IIIF');
    });

    it('should request original file location when query param original=true', async () => {
      const mockDownloadUrl = 'http://internal-storage:8000/bucket/original-file.tiff';
      const mockId = '789-xyz';

      vi.mocked(fetchWithTokenRefresh).mockResolvedValue({
        ok: true,
        json: async () => ({
          transcode_file_location: 'http://ignore-me.com',
          original_file_location: mockDownloadUrl
        }),
      } as any);

      const storageScope = nock('http://internal-storage:8000')
        .get('/bucket/original-file.tiff')
        .reply(200, 'Original file content');

      const response = await request(app).get(`/api/mediafile/${mockId}?original=true`);

      expect(storageScope.isDone()).toBe(true);
      expect(response.text).toBe('Original file content');
    });

    it('should request transcode file location when no original query param', async () => {
      const mockDownloadUrl = 'http://internal-storage:8000/bucket/original-file.tiff';
      const mockId = '789-xyz';

      vi.mocked(fetchWithTokenRefresh).mockResolvedValue({
        ok: true,
        json: async () => ({
          transcode_file_location: mockDownloadUrl,
          original_file_location: 'http://ignore-me.com',
        }),
      } as any);

      const storageScope = nock('http://internal-storage:8000')
        .get('/bucket/original-file.tiff')
        .reply(200, 'Original file content');

      const response = await request(app).get(`/api/mediafile/${mockId}`);

      expect(storageScope.isDone()).toBe(true);
      expect(response.text).toBe('Original file content');
    });

    it('should return 500 Proxy Error if the helper returns an invalid URL (router failure)', async () => {
      const mockId = 'error-id';

      vi.mocked(fetchWithTokenRefresh).mockRejectedValue(undefined);

      const response = await request(app).get(`/api/mediafile/${mockId}`);

      expect(response.status).toBe(500);
      expect(response.text).contain('Invalid URL');
    });

    it('should handle filenames with extensions correctly', async () => {
      const mockId = 'complex-file-name_v2.mp4';
      const mockDownloadUrl = `http://internal-storage:8000/path/${mockId}`;

      vi.mocked(fetchWithTokenRefresh).mockResolvedValue({
        ok: true,
        json: async () => ({ transcode_file_location: mockDownloadUrl }),
      } as any);

      const storageScope = nock('http://internal-storage:8000')
        .get(`/path/${mockId}`)
        .reply(200, 'Success');

      const response = await request(app).get(`/api/mediafile/${mockId}`);

      expect(response.status).toBe(200);
    });

    it('should set Content-Disposition with correct extension when originalFilename is provided', async () => {
      const mockId = '123';
      const mockDownloadUrl = 'http://internal-storage:8000/bucket/file';
      const customFilename = 'my-vacation-video';

      vi.mocked(fetchWithTokenRefresh).mockResolvedValue({
        ok: true,
        json: async () => ({ transcode_file_location: mockDownloadUrl }),
      } as any);

      const storageScope = nock('http://internal-storage:8000')
        .get('/bucket/file')
        .reply(200, 'file-data', {
          'Content-Type': 'video/mp4',
        });

      const response = await request(app)
        .get(`/api/mediafile/${mockId}?originalFilename=${customFilename}`);

      expect(storageScope.isDone()).toBe(true);
      expect(response.status).toBe(200);
      expect(response.headers['content-disposition']).toBe(
        `attachment; filename="${customFilename}.mp4"`
      );
    });

    it('should NOT set Content-Disposition if originalFilename is missing', async () => {
      const mockId = '123';
      const mockDownloadUrl = 'http://internal-storage:8000/bucket/file';

      vi.mocked(fetchWithTokenRefresh).mockResolvedValue({
        ok: true,
        json: async () => ({ transcode_file_location: mockDownloadUrl }),
      } as any);

      nock('http://internal-storage:8000')
        .get('/bucket/file')
        .reply(200, 'data', { 'Content-Type': 'image/jpeg' });

      const response = await request(app).get(`/api/mediafile/${mockId}`);

      expect(response.headers['content-disposition']).toBeUndefined();
    });

    it('should handle unusual content-types gracefully', async () => {
      const mockId = '123';
      const mockDownloadUrl = 'http://internal-storage:8000/bucket/file';
      const customFilename = 'test';

      vi.mocked(fetchWithTokenRefresh).mockResolvedValue({
        ok: true,
        json: async () => ({ transcode_file_location: mockDownloadUrl }),
      } as any);

      nock('http://internal-storage:8000')
        .get('/bucket/file')
        .reply(200, 'data', { 'Content-Type': 'application' });

      const response = await request(app)
        .get(`/api/mediafile/${mockId}?originalFilename=${customFilename}`);

      expect(response.headers['content-disposition']).toBeUndefined();
    });
  });
});
