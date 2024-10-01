import { gql } from 'graphql-modules';
export const baseQueries = gql`
  query GetEntityDetailContextMenuActions {
    GetEntityDetailContextMenuActions {
      doElodyAction {
        label(input: "contextMenu.contextMenuElodyAction.share")
        action(input: Share)
        icon(input: "Link")
        __typename
      }
    }
  }
`;
