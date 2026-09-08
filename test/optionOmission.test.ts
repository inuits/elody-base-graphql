import { describe, it, expect, vi } from 'vitest';
import { baseResolver } from '../baseModule/baseResolver';
import { setCurrentEnvironment } from '../environment';

setCurrentEnvironment({ customization: {} } as any);

const customPermissions = {
  'delete:production': {
    datasource: 'CollectionAPI',
    crud: 'delete',
    uri: '/entities/$parentEntityId',
    body: {},
  },
} as any;

const contextGranting = (granted: string[], parentEntityId?: string) => ({
  dataSources: {
    CollectionAPI: {
      checkAdvancedPermission: vi.fn(async (config: any, parent?: string) =>
        granted.includes(
          parent ? config.uri.replace(/\$parentEntityId/g, parent) : config.uri
        )
      ),
    },
    GraphqlAPI: { checkAdvancedPermission: vi.fn() },
  },
  customPermissions,
  parentEntityId,
});

const options = [
  { label: 'open', value: 'open' },
  { label: 'delete', value: 'delete', can: ['delete:production'] },
];
const labelsOf = (result: any) => result.map((option: any) => option.label);

describe('option omission', () => {
  it('leaves a denied action out of the actions on a result', async () => {
    const resolve = baseResolver.ActionsOnResult!.options as any;

    const result = await resolve(
      {},
      { input: options },
      contextGranting([], 'PROD-1')
    );

    expect(labelsOf(result)).toEqual(['open']);
  });

  it('keeps a granted action on a result', async () => {
    const resolve = baseResolver.ActionsOnResult!.options as any;

    const result = await resolve(
      {},
      { input: options },
      contextGranting(['/entities/PROD-1'], 'PROD-1')
    );

    expect(labelsOf(result)).toEqual(['open', 'delete']);
  });

  it('leaves a denied sub-option out of a dropdown', async () => {
    const resolve = baseResolver.DropdownOption!.subOptions as any;

    const result = await resolve(
      { label: 'more', value: 'more', subOptions: options },
      {},
      contextGranting([], 'PROD-1')
    );

    expect(labelsOf(result)).toEqual(['open']);
  });

  it('hands back a dropdown without sub-options untouched, without calling out', async () => {
    const resolve = baseResolver.DropdownOption!.subOptions as any;
    const context = contextGranting([], 'PROD-1');

    expect(await resolve({ label: 'open' }, {}, context)).toBeNull();
    expect(
      context.dataSources.CollectionAPI.checkAdvancedPermission
    ).not.toHaveBeenCalled();
  });
});
