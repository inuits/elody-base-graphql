import { Metadata, MetadataRelation, KeyAndValue, RelationFieldInput, MetadataAndRelation, Entitytyping } from '../../../generated-types/type-defs';
export declare const setId: (entityRaw: any) => any;
export declare const setType: (entityRaw: any, type: string) => any;
export declare const isMetaDataRelation: (input: {
    type?: string;
}) => "MetadataRelation" | "Metadata";
export declare const parseMetaDataAndMetaDataRelation: (input: any) => Metadata | MetadataAndRelation;
export declare const parseMetaData: (input: any) => Metadata;
export declare const parseRelations: (relations: RelationFieldInput[]) => {
    [key: string]: RelationFieldInput[];
};
export declare const parseMetaDataRelation: (input: any) => MetadataRelation;
export declare const getMetaDataOnRelation: (input: Record<string, string | Record<string, string>>) => KeyAndValue[];
export declare const parseIdToGetMoreData: (id: string) => string;
export declare const removePrefixFromId: (id: string) => string;
export declare const parseRelationTypesForEntityType: (entityType: Entitytyping) => {
    relationType: string;
    fromRelationType: string;
};
