# Documentation

### Generate new types manualy inside container

If the automatic type generation inside of the container fails to pick up your changes use these steps to generate them manually:

- `docker exec -it dams-graphql-1 ash`
- Go to the app directory: `cd ../`
- `pnpm run generate` (this also works in the inuits-dams-graphql-service directory but is only for use inside of the pipelines)

### How to publish a graphql module to nexus (using gitlab pipelines)

Follow these steps to publish a package to nexus for use in graphql pipeline:

- Bump `package.json` version
- Commit new `package.json` and other changes inside the graphql module
- The gitlab pipeline should start running where the package gets built and published to nexus automatically


### How to publish a graphql module to nexus (manually)

Follow these steps to publish a package to nexus for use in graphql pipeline:

- `pnpm run generate` from the inuits-dams-frontend directory
- `pnpm run build` from in the directory of the module you want to publish
- Bump `package.json` version
- Commit new `package.json` and other changes inside the graphql module
- `pnpm publish`


### Add the gitlab pipeline to a new repository

To add the gitlab pipeline ([example project](https://gitlab.inuits.io/rnd/inuits/dams/inuits-dams-saved-search-module)) where the npm package gets automatically built and published to nexus follow these steps:

- package.json: dependencies + update publishConfig/main
- tsconfig.json: add baseUrl and paths
- add the gitlab-ci.yml
- rename graphqlModules => graphql-modules etc.
- the following dependencies are needed to be able to run the graphql types:
    ```javascript
    "base-graphql": "*",
    "@graphql-codegen/add": "^3.2.1",
    "@graphql-codegen/cli": "^2.16.5",
    "@graphql-codegen/graphql-modules-preset": "^2.5.12",
    "@graphql-codegen/typed-document-node": "2.3.13",
    "@graphql-codegen/typescript": "^2.8.8",
    "@graphql-codegen/typescript-operations": "^2.5.13",
    "@graphql-codegen/typescript-resolvers": "^2.7.13",
    "@types/node": "^18.11.14",
    "typescript": "^4.3.5",
    "graphql": "^16.6.0"
    ```
