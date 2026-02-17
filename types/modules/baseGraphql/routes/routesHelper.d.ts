type routeMetaQueries = {
    getEntities: string;
    getFilters: string;
    getSortOptions: string;
    getBulkOperations: string;
};
export type Route = {
    path: string;
    name?: string;
    component?: string;
    meta?: {
        queries?: routeMetaQueries;
        requiresAuth?: boolean;
        type?: string;
        entityType?: string;
        breadcrumbs?: Array<object>;
    };
    children?: Array<Route>;
    redirect?: string;
};
export declare const getRoutesObject: (customRoutesObject: Route[]) => Route[];
export {};
