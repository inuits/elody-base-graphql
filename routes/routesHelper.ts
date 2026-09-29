import { baseRoutes } from './baseRoutes';

export type RouteQueries = {
  getEntities?: string;
  getFilters?: string;
  getSortOptions?: string;
  getBulkOperations?: string;
  getMultiEntity?: string;
};

type RoleCondition = {
  sessionKey: string;
  matches: Array<string>;
};

type EntityCondition = {
  entityType: string;
  filters: Array<object>;
};

type RoleConditionOnly = RoleCondition & {
  entityType?: never;
  filters?: never;
};

type EntityConditionOnly = EntityCondition & {
  sessionKey?: never;
  matches?: never;
};

type BothConditions = RoleCondition & EntityCondition;

type LandingCondition =
  | RoleConditionOnly
  | EntityConditionOnly
  | BothConditions;

export type LandingRedirect = { route: string } & LandingCondition;

export type BreadcrumbTitle = {
  type: string;
  key: string;
};

export type Breadcrumb = {
  overviewPage?: string;
  title?: string | BreadcrumbTitle;
  entityType?: string;
  key?: Array<string>;
  relation?: string;
  current?: boolean;
  pillLabel?: string;
};

export type SimpleSearch = {
  keys: Array<string>;
  relationKeys?: Array<string>;
};

export type RouteLogo = {
  src: string;
  alt?: string;
};

export type RouteMeta = {
  requiresAuth?: boolean;
  ignoreRedirect?: boolean;
  type?: string;
  entityType?: string;
  slug?: string;
  title?: string;
  logo?: RouteLogo;
  queries?: RouteQueries;
  breadcrumbs?: Array<Breadcrumb>;
  simpleSearch?: SimpleSearch;
  multiEntityLayout?: boolean;
  hasEditMetadataButton?: boolean;
  hasDeleteButton?: boolean;
  entityPageConfig?: object;
  can?: Array<string>;
  alternativeRoutes?: { [role: string]: string };
  landingRedirect?: LandingRedirect | Array<LandingRedirect>;
  permitted?: boolean;
  landingRoute?: string;
};

export type Route = {
  path: string;
  name?: string;
  component?: string;
  redirect?: string;
  meta?: RouteMeta;
  children?: Array<Route>;
};

export const getRoutesObject = (customRoutesObject: Route[]): Route[] => {
  return [...mapRoutesConfig(customRoutesObject), ...baseRoutes];
};

const mapRoutesConfig = (routes: Route[]): Route[] => {
  return routes.map((route) => {
    if (!route.children) return route as Route;

    return {
      ...mapRoute(route),
      children: mapRouteChildren(route.children),
    };
  }) as Route[];
};

const mapRoute = (route: Route) => {
  if (!route.meta || !Object.keys(route?.meta).includes('queries')) {
    return {
      ...route,
      meta: {
        ...route?.meta,
        queries: createDefaultQueriesForRoute(),
      },
    } as Route;
  } else {
    return route as Route;
  }
};

const mapRouteChildren = (routeChildren: Route[]) => {
  return routeChildren?.map((childRoute: Route) => {
    if (
      !childRoute.meta ||
      !Object.keys(childRoute?.meta).includes('queries')
    ) {
      return {
        ...childRoute,
        meta: {
          ...childRoute?.meta,
          queries: createDefaultQueriesForRoute(),
        },
      } as Route;
    } else {
      return childRoute as Route;
    }
  });
};

const createDefaultQueriesForRoute = (): RouteQueries => {
  return {
    getEntities: 'GetEntities',
    getFilters: 'GetAdvancedFilters',
    getSortOptions: 'GetSortOptions',
    getBulkOperations: 'GetBulkOperations',
  };
};
