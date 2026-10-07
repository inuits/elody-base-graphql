import { describe, it, expect, vi, beforeEach } from 'vitest';
import { saveEntityRelations } from '../resolvers/saveEntityRelations';
import { DataSources } from '../types';
import { EditStatus } from '../generated-types/type-defs';

const CollectionAPI = {
  getRelations: vi.fn(),
  patchRelations: vi.fn(),
  putRelations: vi.fn(),
};
const dataSources = { CollectionAPI } as unknown as DataSources;

const existing = [
  { key: 'person-1', type: 'hasCreator', metadata: [{ key: 'role', value: 'author' }] },
  { key: 'person-2', type: 'hasCreator', metadata: [] },
  { key: 'place-1', type: 'hasPlace', metadata: [] },
];

describe('saveEntityRelations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    CollectionAPI.getRelations.mockResolvedValue(existing);
  });

  it('does nothing when no relations are sent', async () => {
    await saveEntityRelations(dataSources, 'e-1', [], 'entities' as any);
    expect(CollectionAPI.patchRelations).not.toHaveBeenCalled();
    expect(CollectionAPI.putRelations).not.toHaveBeenCalled();
  });

  it('patches only the added or changed relations it receives', async () => {
    const added = { key: 'person-3', type: 'hasCreator', editStatus: EditStatus.New };
    await saveEntityRelations(dataSources, 'e-1', [added] as any, 'entities' as any);
    expect(CollectionAPI.patchRelations).toHaveBeenCalledWith(
      'e-1',
      [expect.objectContaining({ key: 'person-3', type: 'hasCreator' })],
      'entities'
    );
    expect(CollectionAPI.putRelations).not.toHaveBeenCalled();
  });

  it('removes a single relation while keeping every other existing relation', async () => {
    const removed = { key: 'person-2', type: 'hasCreator', editStatus: EditStatus.Deleted };
    await saveEntityRelations(dataSources, 'e-1', [removed] as any, 'entities' as any);

    expect(CollectionAPI.getRelations).toHaveBeenCalledWith('e-1', 'entities');
    const [, written] = CollectionAPI.putRelations.mock.calls[0];
    expect(written.map((r: any) => `${r.type}:${r.key}`)).toEqual([
      'hasCreator:person-1',
      'hasPlace:place-1',
    ]);
  });

  it('keeps the metadata of untouched relations when removing another one', async () => {
    const removed = { key: 'place-1', type: 'hasPlace', editStatus: EditStatus.Deleted };
    await saveEntityRelations(dataSources, 'e-1', [removed] as any, 'entities' as any);
    const [, written] = CollectionAPI.putRelations.mock.calls[0];
    expect(written.find((r: any) => r.key === 'person-1').metadata).toEqual([
      { key: 'role', value: 'author' },
    ]);
  });

  it('applies removals and additions sent together', async () => {
    await saveEntityRelations(
      dataSources,
      'e-1',
      [
        { key: 'person-1', type: 'hasCreator', editStatus: EditStatus.Deleted },
        { key: 'person-3', type: 'hasCreator', editStatus: EditStatus.New },
      ] as any,
      'entities' as any
    );
    const [, written] = CollectionAPI.putRelations.mock.calls[0];
    expect(written.map((r: any) => `${r.type}:${r.key}`)).toEqual([
      'hasCreator:person-2',
      'hasPlace:place-1',
      'hasCreator:person-3',
    ]);
  });

  it('never writes an unchanged relation it was sent as removed twice', async () => {
    CollectionAPI.getRelations.mockResolvedValue([]);
    const removed = { key: 'gone', type: 'hasCreator', editStatus: EditStatus.Deleted };
    await saveEntityRelations(dataSources, 'e-1', [removed] as any, 'entities' as any);
    const [, written] = CollectionAPI.putRelations.mock.calls[0];
    expect(written).toEqual([]);
  });
});
