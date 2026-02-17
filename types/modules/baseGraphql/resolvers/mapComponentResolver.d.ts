import { DataSources } from "../types";
export declare const prepareMetadataFieldForMapData: (metadata: any, key: string, defaultValue: any) => any;
export declare const prepareLocationFieldForMapData: (location: any, key: string, defaultValue: any) => any;
export declare const prepareRelationFieldForMapData: (dataSources: DataSources, relations: any, key: string, relationKey: any) => Promise<any>;
