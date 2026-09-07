import { describe, it, expect, vi } from 'vitest';
import {
  isCommentPostingPermitted,
  isEntityTypePermitted,
} from '../helpers/permissions';
import { setCurrentEnvironment } from '../environment';

// getEntityId reads the id key off the environment.
setCurrentEnvironment({ customization: {} } as any);

const dataSourcesWith = (verdicts: {
  readableTypes?: string[];
  creatableTypes?: string[];
  updatableEntities?: string[];
}) => {
  const postEntitiesFilterSoftCall = vi.fn(async (entityType: string) =>
    verdicts.readableTypes?.includes(entityType) ? '200' : '403'
  );
  const postEntitySoftCall = vi.fn(async (entityType: string) =>
    verdicts.creatableTypes?.includes(entityType) ? '200' : '403'
  );
  const patchEntityDetailSoftCall = vi.fn(async (id: string) =>
    verdicts.updatableEntities?.includes(id) ? '200' : '403'
  );
  return {
    dataSources: {
      CollectionAPI: {
        postEntitiesFilterSoftCall,
        postEntitySoftCall,
        patchEntityDetailSoftCall,
      },
    } as any,
    postEntitiesFilterSoftCall,
    postEntitySoftCall,
    patchEntityDetailSoftCall,
  };
};

describe('isEntityTypePermitted', () => {
  it('reads a type the user may filter on', async () => {
    const { dataSources } = dataSourcesWith({ readableTypes: ['comment'] });

    expect(await isEntityTypePermitted('comment', 'canread', dataSources)).toBe(
      true
    );
    expect(await isEntityTypePermitted('user', 'canread', dataSources)).toBe(
      false
    );
  });

  it('creates a type the user may post', async () => {
    const { dataSources } = dataSourcesWith({ creatableTypes: ['comment'] });

    expect(
      await isEntityTypePermitted('comment', 'cancreate', dataSources)
    ).toBe(true);
  });

  it('answers false for a permission no soft call covers', async () => {
    const { dataSources, postEntitiesFilterSoftCall, postEntitySoftCall } =
      dataSourcesWith({ readableTypes: ['comment'], creatableTypes: ['comment'] });

    expect(
      await isEntityTypePermitted('comment', 'canupdate', dataSources)
    ).toBe(false);
    expect(postEntitiesFilterSoftCall).not.toHaveBeenCalled();
    expect(postEntitySoftCall).not.toHaveBeenCalled();
  });
});

describe('isCommentPostingPermitted', () => {
  const parent = { _id: 'WORK-1', type: 'work_word' };

  it('permits a user who may create comments on an entity they may update', async () => {
    const { dataSources, patchEntityDetailSoftCall } = dataSourcesWith({
      creatableTypes: ['comment'],
      updatableEntities: ['WORK-1'],
    });

    expect(await isCommentPostingPermitted(parent, dataSources)).toBe(true);
    expect(patchEntityDetailSoftCall).toHaveBeenCalledWith(
      'WORK-1',
      'work_word'
    );
  });

  it('denies a user who may not create comments at all', async () => {
    const { dataSources } = dataSourcesWith({
      updatableEntities: ['WORK-1'],
    });

    expect(await isCommentPostingPermitted(parent, dataSources)).toBe(false);
  });

  it('denies a comment on an entity the user may not update', async () => {
    const { dataSources } = dataSourcesWith({
      creatableTypes: ['comment'],
      updatableEntities: ['WORK-2'],
    });

    expect(await isCommentPostingPermitted(parent, dataSources)).toBe(false);
  });
});
