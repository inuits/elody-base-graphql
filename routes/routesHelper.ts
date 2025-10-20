import {baseRoutes} from './baseRoutes';

type routeMetaQueries = {
    getEntities: string,
    getFilters: string,
    getSortOptions: string,
    getBulkOperations: string,
}

type Route = {
    path: string,
    name?: string,
    component?: string,
    meta?: {
        queries?: routeMetaQueries,
        requiresAuth?: boolean,
        type?: string,
        entityType?: string,
        breadcrumbs?: Array<object>,
    },
    children?: Array<Route>,
    redirect?: string,
};

export const getRoutesObject = (customRoutesObject: Route[]): Route[] => {
    return [
        ...mapRoutesConfig(customRoutesObject),
        ...baseRoutes
    ];
};

const mapRoutesConfig = (routes: Route[]): Route[] => {
    return routes.map(route => {
        if (!route.children) return route as Route;

        return {
            ...mapRoute(route),
            children: mapRouteChildren(route.children)
        }
    }) as Route[];
};

const mapRoute = (route: Route) => {
    if (!route.meta || !Object.keys(route?.meta).includes("queries")) {
        return {
            ...route,
            meta: {
                ...route?.meta,
                queries: createDefaultQueriesForRoute(),
            }
        } as Route;
    } else {
        return route as Route;
    }
};

const mapRouteChildren = (routeChildren: Route[]) => {
    return routeChildren?.map((childRoute: Route) => {
        if (!childRoute.meta || !Object.keys(childRoute?.meta).includes("queries")) {
            return {
                ...childRoute,
                meta: {
                    ...childRoute?.meta,
                    queries: createDefaultQueriesForRoute(),
                }
            } as Route;
        } else {
            return childRoute as Route;
        }
    });
}

const createDefaultQueriesForRoute = (): routeMetaQueries => {
    return {
        getEntities: "GetEntities",
        getFilters: "GetAdvancedFilters",
        getSortOptions: "GetSortOptions",
        getBulkOperations: "GetBulkOperations",
    };
};