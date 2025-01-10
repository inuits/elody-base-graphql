import {
  Metadata,
  LinkFormatter,
  CustomFormatterTypes,
  BaseEntity,
  Formatters,
  RegexpMatchFormatter
} from "../../../generated-types/type-defs";
import { type FormattersConfig } from "../types";

export enum ResolverFormatters {
  Relations = "relations",
  Metadata = "metadata",
  RelationMetadata = "relationMetadata",
  Root = "root",
}

export const formatterFactory = (resolverType: string) => {
  const formattersByResolver: { [key: string]: Function } = {
    [ResolverFormatters.Relations]: applyRelationsFormatter,
    [ResolverFormatters.Metadata]: applyPillFormatter,
    [ResolverFormatters.RelationMetadata]: applyPillFormatter,
    [ResolverFormatters.Root]: applyRootFormatter,
  };

  return formattersByResolver[resolverType];
};

const handleLinkFormatterForRelations = ({
  entity,
  formatterSettings,
}: {
  entity: BaseEntity & { metadata: Metadata[] };
  formatterSettings: LinkFormatter;
}): { label: string; link: string, entity: BaseEntity & { metadata: Metadata[] } } | string => {
  let value: string = entity[formatterSettings.value as keyof BaseEntity];
  let label = entity.metadata?.find((metadata: Metadata) => metadata.key === formatterSettings.label)?.value || entity?.id;
  let link = formatterSettings.link;
  if (!label) {
    label = entity;
    value = entity as unknown as string;
    link = "/not-found";
  };
  return { label, link: link.replace("$value", value), entity };
};

const handlePillFormatter = ({
  label,
  formatter,
}: {
  label: string;
  formatter: string;
}): { label: string; formatter: string } => {
  return { label, formatter };
};

const handleRegexpFormatter = ({
  value,
  formatter,
  formatterSettings,
}: {
  value: unknown;
  formatter: string;
  formatterSettings: FormattersConfig;
}): { label: unknown; formatter: string } => {
  const [formatterType, type] = formatter.split("|");

  const currentFormatter: Formatters = formatterSettings[formatterType][type] as RegexpMatchFormatter;

  const regexp = new RegExp(`"${currentFormatter.value}"\\s*:\\s*"([^"]+)"`, "g");
  const matches = JSON.stringify(value).match(regexp) || [];

  const labels = matches.map((match: string) => {
    const valueMatch = match.match(/"([^"]+)"$/);
    return valueMatch ? valueMatch[1] : "";
  });

  return { label: labels, formatter };
};

const applyRelationsFormatter = (
  formatter: string,
  formattorSettings: FormattersConfig,
) => {
  const [formatterType, formatterTypeOption] = formatter.split("|");
  const currentFormatter: Formatters = formattorSettings[formatterType][formatterTypeOption];

  return ({ entity }: { entity: BaseEntity & { metadata: Metadata[] } }) => {
    if (formatterType === CustomFormatterTypes.Link)
      return handleLinkFormatterForRelations({ entity, formatterSettings: currentFormatter as LinkFormatter });
  };
};

const applyRootFormatter = ({
  value,
  formatter,
  formatterSettings,
}: {
  value: string;
  formatter: string;
  formatterSettings: FormattersConfig;
}) => {
  if (!formatter) return value;

  return handleRegexpFormatter({ value, formatter, formatterSettings });
};

// TODO: Should be splitted up to separate types like applyMetadataFormatters, applyRelationMetadata
const applyPillFormatter = ({ label, formatter }: { label: string; formatter: string }) => {
  if (!formatter) return label;

  return handlePillFormatter({ label, formatter });
};


export { handleRegexpFormatter }
