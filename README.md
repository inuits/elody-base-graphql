# Base GraphQL

The foundation module for every Elody GraphQL service. It boots an Apollo Server on top of Express, wires in the shared `baseModule` schema, handles Keycloak/OAuth session auth, ships the default REST endpoints (upload, download, export, health, version, app configs, auth, SEO, Prometheus), and exposes the `AuthRESTDataSource` base class that every other module extends.

Client GraphQL services import the `start()` function from this package, pass a `customModuleConfig` (with additional modules and data sources — e.g. from `mediafile-module`, `import-module`, `advanced-filters-module`), and get a fully wired server.

## What's included

| Layer | What it adds |
|-------|-------------|
| Bootstrapper | `start({ customModuleConfig, appConfig, customTranslations, ... })` — creates Express + Apollo, applies auth, mounts default endpoints, serves the PWA (Vite in dev, static in prod) |
| GraphQL schema | `baseModule` — Entity, Metadata, Relations, Form, User, Permissions, Menu, BulkOperations, Formatters, and many more shared types |
| GraphQL resolvers | Base resolvers for entities, metadata, initial values, context menu, map component, formatters |
| DataSources | `CollectionAPI`, `TranscodeService`, `StorageAPI`, `OcrService`, `GraphQLAPI` — extendable via declaration merging on `DataSources` |
| Auth | Keycloak/OAuth flow, session (in-memory or MongoDB), token refresh, static-token fallback, `AuthRESTDataSource` for downstream calls |
| Express endpoints | `/api/graphql`, `/api/auth_code`, `/api/logout`, `/api/me`, `/api/upload/*`, `/api/download/csv`, `/api/download/zip/:id`, `/api/export/csv`, `/api/app-configs`, `/api/version`, `/api/health`, `/api/seo`, `/api/prom/query_range` |
| Middleware | CORS, CSP, compression, JSON/urlencoded body limits, session cookies, depth-limit query validation |

---

## Express endpoints

### Auth — `auth/index.ts`

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/api/auth_code` | Exchange an OAuth authorization code for a session (Keycloak PKCE flow). |
| `GET`  | `/api/logout` | Destroy the session and redirect to the Keycloak logout endpoint. |
| `GET`  | `/api/me` | Return the currently authenticated user's profile and token metadata. |

### Upload — `endpoints/uploadEndpoint.ts`

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/api/upload/xml` | Upload an XML payload; proxied to collection-api. |
| `POST` | `/api/upload/csv` | Upload a CSV payload; proxied to collection-api. |

> Batch/single file uploads for mediafiles live in `mediafileModule` (`/api/upload/batch`, `/api/upload/single`).

### Download & Export — `endpoints/downloadEndpoint.ts`, `downloadZipEndpoint.ts`, `exportEndpoint.ts`

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/api/download/csv` | Stream a CSV export of the requested entities. |
| `GET`  | `/api/download/zip/:id` | Trigger a zip build (via transcode-service) and stream the result. |
| `POST` | `/api/export/csv` | Kick off a CSV export job on collection-api. |

### App configuration — `endpoints/appConfigEndpoint.ts`

| Method | Path | Purpose |
|--------|------|---------|
| `GET`  | `/api/app-configs` | Return runtime config the PWA needs at boot: translations, feature flags, type→URL mapping, OAuth endpoints, custom formatters. |

### Ops — `endpoints/versionEndpoint.ts`, `healthEndpoint.ts`, `promEndpoint.ts`, `seoEndpoint.ts`

| Method | Path | Purpose |
|--------|------|---------|
| `GET`  | `/api/version` | Return the running service version. |
| `GET`  | `/api/health` | Liveness probe. |
| `GET`  | `/api/prom/query_range` | Proxy to Prometheus `query_range` (only mounted when `api.promUrl` is set). |
| `GET`  | `/api/seo` | Server-rendered SEO metadata (only mounted when `features.SEO` is true). |

### Frontend — `endpoints/frontendEndpoint.ts`

Serves the PWA on all remaining routes. In non-production it mounts Vite in middleware mode with HMR on port `24678`; in production it serves the built `dashboard/` bundle.

---

## GraphQL API (baseModule)

### Queries

| Query | Description |
|-------|-------------|
| `Entity(id, type, preferredLanguage)` | Fetch a single entity. |
| `Entities(type, limit, skip, searchInputType, searchValue, advancedSearchValue, advancedFilterInputs, ...)` | Paginated, searchable, filterable entity list. |
| `EntitiesHistory(...)` | Same shape as `Entities`, scoped to history collection. |
| `EntitiesByAdvancedSearch(q, filter_by, query_by, ...)` | Typesense-style search against the search index. |
| `Tenants` | List tenants visible to the caller. |
| `User` / `UserPermissions` / `getElodyUser` | Current user info and permissions. |
| `Menu(name)` | Dynamic menu definition. |
| `EntityTypeSortOptions(entityType)` | Sortable field options for a type. |
| `PreviewComponents(entityType)` / `PreviewElement` | UI preview definitions. |
| `DropzoneEntityToCreate` / `PaginationLimitOptions` | UI defaults. |
| `BulkOperations(entityType)` / `CustomBulkOperations` / `BulkOperationsRelationForm` | Bulk-action definitions. |
| `BulkOperationCsvExportKeys(entityType)` | Fields available for CSV export. |
| `GraphData(id, graph)` | Data for the graph view. |
| `PermissionMapping(entities)` / `PermissionMappingPerEntityType(type)` / `PermissionMappingCreate(entityType)` / `PermissionMappingEntityDetail(id, entityType)` | Permission lookups. |
| `AdvancedPermission(permission, parentEntityId, childEntityId)` / `AdvancedPermissions(permissions, ...)` | Relation-aware permission checks. |
| `CustomFormattersSettings` | Client-supplied metadata formatter config. |
| `GetDynamicForm` / `GetRepetitiveForm` | Form definitions rendered by `DynamicForm.vue`. |
| `GetEntityDetailContextMenuActions` | Right-click / context-menu actions on the entity detail page. |
| `GeoFilterForMap` | Map-view filter definition. |
| `FilterMatcherMapping(keys)` / `EntityTypeFilters(type)` / `FilterOptions(input, limit, entityType)` | Filter metadata and dropdown option resolution. |

### Mutations

| Mutation | Description |
|----------|-------------|
| `mutateEntityValues(id, formInput, collection, preferredLanguage)` | Persist a form submit. |
| `deleteData(id, path, deleteMediafiles)` | Delete an entity, optionally cascading to mediafiles. |
| `bulkDeleteEntities(ids, path, deleteEntities, skipItemsWithRelationDuringBulkDelete)` | Bulk delete. |
| `bulkAddRelations(entityIds, relationEntityId, relationType)` | Bulk add a relation to many entities. |
| `addEntityRelations(id, relations, collection)` | Add relations to a single entity. |
| `updateMetadataWithCsv(entityType, csv)` | Patch metadata from a CSV payload. |
| `setPrimaryMediafile(entityId, mediafileId)` / `setPrimaryThumbnail(entityId, mediafileId)` | Promote a mediafile. |

The full schema (2 600+ lines) lives in `baseModule/baseSchema.schema.ts` — types for `Entity`, `Metadata`, `Relation`, `Form`, `FormTab`, `InputField`, `MenuItem`, `AdvancedFilter*`, `Formatter` union, permission types, etc.

---

## DataSources

All extend `AuthRESTDataSource` and are injected into every resolver as `context.dataSources.*`. Downstream modules extend the `DataSources` interface via declaration merging.

| Source | Target | Purpose |
|--------|--------|---------|
| `CollectionAPI` | `api.collectionApiUrl` | The main REST client — entities, metadata, relations, permissions, user info, tenants, jobs, forms, bulk ops, search. See `sources/collection.ts` (~40 methods). |
| `TranscodeService` | `api.transcodeService` | Base class for transcode calls; extended by `mediafileModule`. |
| `StorageAPI` | `api.storageApiUrl` | Typed handle to the storage service; most storage traffic goes through the mediafile proxy endpoints. |
| `OcrService` | `api.ocrService` | OCR trigger endpoint; extended by `mediafileModule`. |
| `GraphQLAPI` | `api.collectionApiUrl` | GraphQL-over-REST helper for querying collection-api's GraphQL surface. |

### `AuthRESTDataSource`
Extends Apollo's `RESTDataSource`. Injects the current session's bearer token, refreshes it via `fetchWithTokenRefresh` on 401, falls back to the static JWT (`STATIC_JWT`) when configured, and forwards `X-Tenant-ID`, `X-Client-IP`, and `Origin` headers to downstream services.

---

## Using the module

`baseGraphql` is the entry point of every GraphQL service. Client services call `start()` and spread in any additional modules:

```ts
import start, { ElodyModuleConfig } from 'base-graphql';
import { mediafileElodyConfig } from 'mediafile-module';
import { importModule, ImportAPI } from 'import-module';
import { advancedFiltersElodyConfig } from 'advanced-filters-module';
import customTranslations from './translations';
import appConfig from './appConfig';

const customModuleConfig: ElodyModuleConfig = {
  modules: [
    ...mediafileElodyConfig.modules,
    ...advancedFiltersElodyConfig.modules,
    importModule,
  ],
  dataSources: {
    ...mediafileElodyConfig.dataSources,
    ...advancedFiltersElodyConfig.dataSources,
    ImportAPI,
  },
  endpoints: [
    ...(mediafileElodyConfig.endpoints ?? []),
  ],
};

start({
  customModuleConfig,
  appConfig,
  customTranslations,
  customEndpoints: [/* extra express handlers */],
  customInputFields: {/* client-specific InputField definitions merged into baseFields */},
  customTypeCollectionMapping: {/* entityType -> Collection */},
  customPermissions: {/* PermissionRequestInfo per key */},
  customFormatters: {/* metadata display formatters */},
  customTypeUrlMapping: { mapping: {}, reverseMapping: {} },
  customTypePillLabelMapping: {/* type -> pill label keys */},
  customFilterMatchers: {/* filter key -> match strategies */},
});
```

### Extension points
- **`customModuleConfig.modules`** — extra `graphql-modules` to merge into the schema.
- **`customModuleConfig.dataSources`** — extra data source classes; use declaration merging to type them on `DataSources`.
- **`customModuleConfig.endpoints`** — extra Express handler factories `(app, environment) => void`.
- **`customInputFields`** — register new `InputField` types available in dynamic forms.
- **`customFormatters`** — hook into metadata rendering (link/pill/regexp).
- **`customPermissions`** — declare custom permission keys resolvable via `AdvancedPermission(s)`.
- **`customTypeUrlMapping`** / **`customTypePillLabelMapping`** / **`customTypeCollectionMapping`** — per-client type mappings.
- **`customFilterMatchers`** — extend the advanced-filter matcher registry.

---

## Environment

### `apollo`

| Key | Type | Description |
|-----|------|-------------|
| `graphqlPath` | `string` | Where the GraphQL API mounts. Default `/api/graphql`. |
| `introspection` | `boolean` | Enable GraphQL introspection. |
| `playground` | `boolean` | Enable the GraphQL playground. |
| `tokenLogging` | `'true' \| 'false'` | Log user tokens in the container (string flag — legacy). |
| `maxQueryDepth` | `number` | Query depth limit. Default `10` (falls back to `15` if unset). |

### `oauth`

| Key | Description |
|-----|-------------|
| `baseUrl` | Backend base URL of the OAuth provider (env: `OAUTH_BASE_URL`). |
| `baseUrlFrontend` | Frontend-facing base URL (env: `OAUTH_BASE_URL_FRONTEND`). |
| `clientId` | OAuth client id (env: `OAUTH_CLIENT_ID`). |
| `tokenEndpoint` | Default `/protocol/openid-connect/token` (env: `OAUTH_TOKEN_ENDPOINT`). |
| `logoutEndpoint` | Default `/protocol/openid-connect/logout` (env: `OAUTH_LOGOUT_ENDPOINT`). |
| `authEndpoint` | Default `protocol/openid-connect/auth` (env: `OAUTH_AUTH_ENDPOINT`). |
| `apiCodeEndpoint` | Default `/api/auth_code` (env: `OAUTH_API_CODE_ENDPOINT`). |

### `api`

| Key | Env var | Description |
|-----|---------|-------------|
| `collectionApiUrl` | `COLLECTION_API_URL` | Collection API base URL. |
| `csvImportServiceUrl` | `CSV_IMPORTER_URL` | CSV import service. |
| `fileSystemImporterServiceUrl` | `FILE_SYSTEM_IMPORTER_URL` | Filesystem importer service (opt-in per client). |
| `iiifUrl` / `iiifUrlFrontend` | `IMAGE_API_URL` / `IMAGE_API_URL_EXT` | Internal & external IIIF service URLs. |
| `storageApiUrl` / `storageApiUrlExt` | `STORAGE_API_URL` / `STORAGE_API_URL_EXT` | Internal & external storage-api URLs. |
| `transcodeService` | `TRANSCODE_SERVICE_URL` | Transcode service base URL. |
| `ocrService` | `OCR_SERVICE_URL` | OCR service base URL. |
| `promUrl` | — | Prometheus URL, or `'no-prom'` to skip mounting `/api/prom/*`. |

### `features`

| Key | Description |
|-----|-------------|
| `hasPersistentSessions` | With Mongo configured, store sessions in Mongo instead of memory so they survive deploys. |
| `hasRedirectToExternalSites` | Sets cookies to `{ sameSite: 'none', secure: true }` so sessions survive round-trips through external redirects. Requires `X-Forwarded-Proto: https` — force it in Traefik when the LB strips it:<br>``"traefik.http.middlewares.${job_name}-forcehttps.headers.customrequestheaders.X-Forwarded-Proto=https"``<br>``"traefik.http.routers.${job_name}-http.middlewares=${job_name}-forcehttps"`` |
| `ipWhiteListing` | Log & enforce client IP allow-list. |
| `domainWhiteListing` | Log & enforce client `Origin` allow-list. |
| `SEO` | Mount `/api/seo`. |

### Other

| Key | Description |
|-----|-------------|
| `staticToken` (`STATIC_JWT`) | Fallback bearer for unauthenticated / server-to-server calls. |
| `glitchtipEnabled` / `glitchtipDsn` | Sentry/Glitchtip error reporting. |
| `maxUploadSize` | Body-parser limit for JSON & urlencoded requests. |
| `port` | HTTP port (default from env). |

