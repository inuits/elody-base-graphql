import { gql } from 'graphql-modules';

export const customFormattersSettings = gql`
  query GetCustomFormattersSettings {
    CustomFormattersSettings
  }
`;

export const customTypeToUrlMapping = gql`
  query GetCustomTypeUrlMapping {
    CustomTypeUrlMapping
  }
`;