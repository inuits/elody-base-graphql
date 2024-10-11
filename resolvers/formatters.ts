import { Metadata, LinkFormatter, CustomFormatterTypes, BaseEntity, Formatters } from '../../../generated-types/type-defs';

export enum ResolverFormatters {
  Relations = 'relations',
  Metadata = 'metadata',
  RelationMetadata = 'relationMetadata'
}

export const formatterFactory = (resolverType: string) => {
  const formattersByResolver: {[key: string]: Function} = {
    [ResolverFormatters.Relations]: applyRelationsFormatter,
    [ResolverFormatters.Metadata]: applyPillFormatter,
    [ResolverFormatters.RelationMetadata]: applyPillFormatter,
  }

  return formattersByResolver[resolverType];
};

const handleLinkFormatterForRelations = ({
  entity,
  formatterSettings
}: {
  entity: BaseEntity & {metadata: Metadata[]};
  formatterSettings: LinkFormatter;
}): { label: string; link: string } => {
  const value: string = entity[formatterSettings.value as keyof BaseEntity];
  const label = entity.metadata?.find(
    (metadata: Metadata) => metadata.key === formatterSettings.label
  )?.value
  return { label, link: formatterSettings.link.replace("$value", value) };
};

const handlePillFormatter = ({label, formatter}: {label: string, formatter: string}): {label: string, formatter: string} => {
  return { label, formatter }
}

const applyRelationsFormatter = (formatter: string, formattorSettings: {
  [formatterType: string]: {
    [key: string]: Formatters
  }
}) => {
  const [formatterType, formatterTypeOption] = formatter.split('|');
  const currentFormatter: Formatters = formattorSettings[formatterType][formatterTypeOption];

  return ({entity}: {entity: BaseEntity & {metadata: Metadata[]}}) => {
    if (formatterType === CustomFormatterTypes.Link) return handleLinkFormatterForRelations({entity, formatterSettings: currentFormatter as LinkFormatter});
  }
}

// TODO: Should be splitted up to separate types like applyMetadataFormatters, applyRelationMetadata  
const applyPillFormatter = ({ label, formatter }: { label: string, formatter: string }) => {
  if (!formatter) return label;

  return handlePillFormatter({label, formatter});
};