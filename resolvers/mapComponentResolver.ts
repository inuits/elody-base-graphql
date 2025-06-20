import { DataSources } from "../types";

export const prepareMetadataFieldForMapData = (metadata: any, key: string, defaultValue: any): any => {
    let value = metadata.filter((item: any) => item.key === key)[0]?.value;
    return value !== undefined ? value : defaultValue;
}

export const prepareLocationFieldForMapData = (location: any, key: string, defaultValue: any): any => {
    let value = location[key];
    return value !== undefined ? value : defaultValue;
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
