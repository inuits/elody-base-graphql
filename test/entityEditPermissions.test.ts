import { describe, it, expect, vi } from 'vitest';
import { mayUpdateEntity, mayDeleteEntity } from '../helpers/permissions';
import { setCurrentEnvironment } from '../environment';

// getEntityId reads the id key off the environment.
setCurrentEnvironment({ customization: {} } as any);

const dataSourcesWith = (verdicts: {
  updatable?: string[];
  deletable?: string[];
}) => {
  const patchEntityDetailSoftCall = vi.fn(async (id: string) =>
    verdicts.updatable?.includes(id) ? '200' : '403'
  );
  const delEntityDetailSoftCall = vi.fn(async (id: string) =>
    verdicts.deletable?.includes(id) ? '200' : '403'
  );
  return {
    dataSources: {
      CollectionAPI: { patchEntityDetailSoftCall, delEntityDetailSoftCall },
    } as any,
    patchEntityDetailSoftCall,
    delEntityDetailSoftCall,
  };
};

const entity = { _id: 'entity-1', type: 'production' };

describe('mayUpdateEntity', () => {
  it('permits an entity the dry-run patch accepts', async () => {
    const { dataSources, patchEntityDetailSoftCall } = dataSourcesWith({
      updatable: ['entity-1'],
    });

    expect(await mayUpdateEntity(entity, dataSources)).toBe(true);
    expect(patchEntityDetailSoftCall).toHaveBeenCalledWith(
      'entity-1',
      'production'
    );
  });

  it('denies an entity the dry-run patch refuses', async () => {
    const { dataSources } = dataSourcesWith({ updatable: ['other'] });

    expect(await mayUpdateEntity(entity, dataSources)).toBe(false);
  });
});

describe('mayDeleteEntity', () => {
  it('permits an entity the dry-run delete accepts', async () => {
    const { dataSources, delEntityDetailSoftCall } = dataSourcesWith({
      deletable: ['entity-1'],
    });

    expect(await mayDeleteEntity(entity, dataSources)).toBe(true);
    expect(delEntityDetailSoftCall).toHaveBeenCalledWith(
      'entity-1',
      'production'
    );
  });

  it('denies an entity the dry-run delete refuses', async () => {
    const { dataSources } = dataSourcesWith({});

    expect(await mayDeleteEntity(entity, dataSources)).toBe(false);
  });

  it('does not confuse the update verdict with the delete verdict', async () => {
    const { dataSources } = dataSourcesWith({ updatable: ['entity-1'] });

    expect(await mayUpdateEntity(entity, dataSources)).toBe(true);
    expect(await mayDeleteEntity(entity, dataSources)).toBe(false);
  });
});
