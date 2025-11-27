# Documentation

### Environment

#### Apollo

| Config item   | Type      | Description                                                                                                                                 |
|---------------|-----------|---------------------------------------------------------------------------------------------------------------------------------------------|
| graphqlPath   | `String`  | The path where the graphql api can be reached, by default `/api/graphql`                                                                    |
| introspection | `Boolean` | Toggles [graphq introspection](https://graphql.org/learn/introspection/)                                                                    |
| playground    | `Boolean` | Toggles the graphql playground                                                                                                              |
| tokenLogging  | `String`  | Should be changed to boolean, but currently accepts a string as `true` or `false`, this toggles the logging of user tokens in the container |
| maxQueryDepth | `Number`  | Limits the query depth the graphql accepts, by default maximum `10` levels                                                                  |

#### Oauth

| Config item     | Type     | Description                                                                                                     |
|-----------------|----------|-----------------------------------------------------------------------------------------------------------------|
| baseUrl         | `String` | The base url of your access management solution, gets its value from the `OAUTH_BASE_URL` variable              |
| baseUrlFrontend | `String` | The base url of your access management solution, gets its value from the  `OAUTH_BASE_URL_FRONTEND`  variable   |
| clientId        | `String` | The id of the client in your access management solution, gets its value from the  `OAUTH_CLIENT_ID`  variable   |
| tokenEndpoint   | `String` | By default `/protocol/openid-connect/token` or overwritten by the `OAUTH_TOKEN_ENDPOINT` environment variable   |
| logoutEndpoint  | `String` | By default `/protocol/openid-connect/logout` or overwritten by the `OAUTH_LOGOUT_ENDPOINT` environment variable |
| authEndpoint    | `String` | By default `protocol/openid-connect/auth` or overwritten by the `OAUTH_AUTH_ENDPOINT` environment variable      |
| apiCodeEndpoint | `String` | By default `/api/auth_code` or overwritten by the `OAUTH_API_CODE_ENDPOINT` environment variable                |

#### Api

| Config item                  | Type                  | Description                                                                                                                                          |
|------------------------------|-----------------------|------------------------------------------------------------------------------------------------------------------------------------------------------|
| collectionApiUrl             | `String`              | The url on which the collectionAPI is reachable, takes its value by default from the `COLLECTION_API_URL` environment variable                       |
| csvImportServiceUrl          | `String`              | The url on which the csv-import-service is reachable, takes its value by default from the  `CSV_IMPORTER_URL`  environment variable                  |
| fileSystemImporterServiceUrl | `String`              | The url on which the filesystem-importer-service is reachable, takes its value by default from the  `FILE_SYSTEM_IMPORTER_URL`  environment variable |
| iiifUrl                      | `String`              | The internal url on which the iiif-service is reachable, takes its value by default from the  `IMAGE_API_URL`  environment variable                  |
| iiifUrlFrontend              | `String`              | The external url on which the iiif-service is reachable, takes its value by default from the  `IMAGE_API_URL_EXT`  environment variable              |
| storageApiUrl                | `String`              | The internal url on which the storageAPI is reachable, takes its value by default from the  `STORAGE_API_URL`  environment variable                  |
| storageApiUrlExt             | `String`              | The external url on which the storageAPI is reachable, takes its value by default from the  `STORAGE_API_URL_EXT`  environment variable              |
| promUrl                      | `String \| 'no-prom'` | The url on which prometheus is reachable to show charts for the PZA client, should maybe be moved to the pza config                                  |
| transcodeService             | `String`              | The url on which the transcode-service is reachable, takes its value by default from the  `TRANSCODE_SERVICE_URL`  environment variable              |
| ocrService                   | `String`              | The url on which the ocr-service is reachable, takes its value by default from the  `OCR_SERVICE_URL`  environment variable                          |

#### Features

| Config item                | Type      | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
|----------------------------|-----------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| hasPersistentSessions      | `Boolean` | When set to true, and the mongodb configuration has been filled in, a mongo session store will be created instead of the default store in memory. This allows for the session to continue to exist across deploys                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| hasRedirectToExternalSites | `Boolean` | If the application has a custom endpoint that redirects to another website in the browser, the `CookieOptions` will be changed to `{sameSite: "none", secure: true}`, this allows the session to continue to exist when the user returns to our application  **Important note:** Express expects the `x-forwarded-proto` header to be `https`, when the application is running on the customers infrastructure and/or behind a loadbalancer this header can be absent, in this case you should add the following rule to the Traefik configuration of the graphql container: ``` # Force-set X-Forwarded-Proto so secure cookies work   "traefik.http.middlewares.${job_name}-forcehttps.headers.customrequestheaders.X-Forwarded-Proto=https",   "traefik.http.routers.${job_name}-http.middlewares=${job_name}-forcehttps",  ``` |
|                            |           |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |


### Generate new types manualy inside container

Go to the `elody-common` folder and run the `task generate` command, then pick the number of the client you want to regenerate the types for from the list, type it and hit enter

### How to publish a graphql module to nexus (using gitlab pipelines)

Follow these steps to publish a package to nexus for use in graphql pipeline:

- Bump `package.json` version
- Commit new `package.json` and other changes inside the graphql module
- The gitlab pipeline should start running where the npm package gets built and published to nexus automatically


### Add the gitlab pipeline to a new repository

To add the gitlab pipeline ([example project](https://gitlab.inuits.io/rnd/inuits/dams/inuits-dams-saved-search-module)) where the npm package gets automatically built and published to nexus follow these steps:

- package.json: dependencies + update publishConfig/main
- tsconfig.json: add baseUrl and paths
- add the gitlab-ci.yml & change the graphql image path to the correct customer
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
