import {
    SplitRegex
} from "../../../generated-types/type-defs";
import { DataSources } from "../types";

export const prepareMetadataFieldForMapData = (metadata: any, key: string, splitRegex: SplitRegex): any => {
    let value = metadata.filter((item: any) => item.key === key)[0].value;
    if (splitRegex)
        value = value.split(splitRegex.separator)[splitRegex.retrieveSection];
    return value;
}

export const prepareRelationFieldForMapData = async (dataSources: DataSources, relations: any, key: string, relationKey: any) => {
    let relation = relations.filter((item: any) => item.type === relationKey)[0];
    const relationEntity = await dataSources.CollectionAPI.getEntity(
        relation.key,
        '',
        'entities'
    );
    return relationEntity.metadata.filter((item: any) => item.key === key)[0].value;
}
