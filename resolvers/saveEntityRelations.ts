import {
  BaseRelationValuesInput,
  Collection,
  EditStatus,
} from '../generated-types/type-defs';
import { buildMergedRelations } from '../helpers/helpers';
import { DataSources } from '../types';

// Saves only the relations the client sent. Additions and changes are
// patched (the collection API keeps every other relation). A removal can't be
// expressed as a patch, so the current relations are read and written back
// without the removed ones; the client never has to send the full list.
export const saveEntityRelations = async (
  dataSources: DataSources,
  id: string,
  relations: BaseRelationValuesInput[],
  collection: Collection
): Promise<void> => {
  if (relations.length <= 0) return;

  const hasRemovals = relations.some(
    (relation) => relation.editStatus === EditStatus.Deleted
  );

  if (hasRemovals) {
    const existing =
      (await dataSources.CollectionAPI.getRelations(id, collection)) || [];
    await dataSources.CollectionAPI.putRelations(
      id,
      buildMergedRelations(relations, existing as any[]),
      collection
    );
    return;
  }

  const toUpsert = buildMergedRelations(
    relations.filter(
      (relation) =>
        relation.editStatus === EditStatus.New ||
        relation.editStatus === EditStatus.Changed
    ),
    []
  );
  if (toUpsert.length > 0)
    await dataSources.CollectionAPI.patchRelations(id, toUpsert, collection);
};
