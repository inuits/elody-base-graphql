export type MetadataItem = {
    key: string;
    value: any;
};
export declare const evaluateMetadataConditions: (metadata?: MetadataItem[], expressions?: string[]) => boolean;
