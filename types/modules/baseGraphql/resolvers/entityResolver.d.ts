import { Maybe, TeaserMetadataOptions } from '../../../generated-types/type-defs';
export declare const resolveMetadata: (parent: any, keys: Maybe<string>[], options?: TeaserMetadataOptions[]) => Promise<any[]>;
export declare const resolveMetadataItemOfPreferredLanguage: (metadata: any[], preferredLanguage: string) => any;
export declare const resolveLocationData: (parent: any, key: string) => Promise<any>;
export declare const resolveId: (parent: any) => any;
export declare const resolveRelations: (parent: any) => Promise<{
    [key: string]: import("../../../generated-types/type-defs").RelationFieldInput[];
}>;
export declare const simpleReturn: (parent: any) => any;
