import { type FormattersConfig } from "../types";
export declare enum ResolverFormatters {
    Relations = "relations",
    Metadata = "metadata",
    RelationMetadata = "relationMetadata",
    Root = "root",
    TypePillLabel = "typePillLabel"
}
export declare const formatterFactory: (resolverType: string) => Function;
declare const handleRegexpFormatter: ({ value, formatter, formatterSettings, }: {
    value: unknown;
    formatter: string;
    formatterSettings: FormattersConfig;
}) => {
    label: unknown;
    formatter: string;
};
export { handleRegexpFormatter };
