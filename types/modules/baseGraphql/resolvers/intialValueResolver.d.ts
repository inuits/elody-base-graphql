import { DataSources, type FormattersConfig } from '../types';
import { ParentRelationsConfigInput } from '../../../generated-types/type-defs';
import { CollectionAPIEntity } from "../types/collectionAPITypes";
export declare const resolveIntialValueMetadata: (dataSources: DataSources, parent: any, key: string, keyOnMetadata: string | undefined | null, formatter: string | null) => Promise<string | {
    label: string;
    formatter: string;
}>;
export declare const resolveIntialValueRepeatableMetadata: (dataSources: DataSources, parent: any, key: string, formatter: string | null, repeatableMetadataKey: string | null) => Promise<string | {
    label: string;
    formatter: string;
}>;
export declare const resolveIntialValueRoot: (dataSources: DataSources, parent: any, key: string, formatter: string | null, formatterSettings: any) => Promise<string>;
export declare const resolveIntialValueRelations: (dataSources: DataSources, parent: any, key: string, metadataKeyAsLabel: string, rootKeyAsLabel: string, containsRelationPropertyKey: string, containsRelationPropertyValue: string, relationEntityType: string, formatter?: string, formatterSettings?: FormattersConfig) => Promise<string | any>;
export declare const resolveIntialValueRelationMetadata: (parent: any, key: string, uuid: string, relationKey: string, formatter: string) => string | string[] | {
    label: string;
    formatter: string;
};
export declare const resolveIntialValueRelationRootdata: (parent: any, key: string, uuid: string, relationKey: string, formatter: string) => string | string[] | {
    label: string;
    formatter: string;
};
export declare const resolveIntialValueTechnicalMetadata: (parent: any, key: string) => string;
export declare const resolveIntialValueMetadataOrRelation: (dataSources: DataSources, parent: any, key: string, relationKey: string, formatter?: string, formatterSettings?: FormattersConfig) => Promise<string | any>;
export declare const resolveIntialValueDerivatives: (parent: CollectionAPIEntity, key: string, technicalOrigin: string, dataSources: DataSources) => Promise<string>;
export declare const resolveIntialValueTypePillLabel: (parent: any, key: string, index: number, formatter: string | null) => string;
export declare const resolveIntialValueLocation: (dataSources: DataSources, parent: any, key: string, keyOnMetadata: string | undefined | null, formatter: string | null) => Promise<string | {
    label: string;
    formatter: string;
}>;
export declare const resolveIntialValueParentRoot: (dataSources: DataSources, parent: any, key: string, parentRelations: ParentRelationsConfigInput[]) => Promise<string>;
export declare const resolveIntialValueParentMetadata: (dataSources: DataSources, parent: any, key: string, parentRelations: ParentRelationsConfigInput[]) => Promise<string>;
export declare const resolveIntialValueParentRelations: (dataSources: DataSources, parent: any, key: string, parentRelations: ParentRelationsConfigInput[]) => Promise<string[]>;
