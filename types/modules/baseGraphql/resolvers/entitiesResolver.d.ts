import { DataSources } from '../types';
import { EntitiesResults, AdvancedFilterInput, Entitytyping, SearchFilter } from '../../../generated-types/type-defs';
export declare const resolveAdvancedEntities: (dataSources: DataSources, entityType: Entitytyping, advancedFilterInputs: AdvancedFilterInput[], limit?: number, skip?: number, searchValue?: SearchFilter) => Promise<EntitiesResults>;
export declare const resolveSimpleEntities: (dataSources: DataSources) => EntitiesResults;
