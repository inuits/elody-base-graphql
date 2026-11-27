import { describe, it, expect, vi } from 'vitest';
import express from 'express';
import request from 'supertest';
import { applyAppConfigsEndpoint } from '../endpoints/appConfigEndpoint';
import { createElodyEnvironment } from '../environment';

const appWith = (maintenanceMode: boolean) => {
  const buildDataSources = vi.fn(() => {
    throw new Error('the collection API is down for maintenance');
  });
  const app = express();
  applyAppConfigsEndpoint(
    app,
    createElodyEnvironment({
      maintenanceMode,
      features: { simpleSearch: { itemTypes: ['asset'] } } as any,
      routerConfig: [{ path: '/', meta: { requiresAuth: true } }] as any,
    }),
    {},
    {} as any,
    {
      buildDataSources: buildDataSources as any,
      permissions: {},
      features: { savedSearch: { enabled: true, permission: 'x' } },
    }
  );
  return { app, buildDataSources };
};

describe('app-configs in maintenance mode', () => {
  it('reports maintenance without calling the backend', async () => {
    const { app, buildDataSources } = appWith(true);

    const response = await request(app).get('/api/app-configs');

    expect(response.status).toBe(200);
    const body = JSON.parse(response.text);
    expect(body.config.maintenanceMode).toBe(true);
    expect(body.translations.en.maintenance.title).toBeTruthy();
    expect(buildDataSources).not.toHaveBeenCalled();
  });

  it('is off by default', () => {
    expect(createElodyEnvironment({}).maintenanceMode).toBe(false);
  });
});
