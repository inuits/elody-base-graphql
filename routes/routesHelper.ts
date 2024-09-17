import { baseRoutes } from './baseRoutes';

export const mergeRoutes = (customRoutesObject: object[]) => {
  return [...baseRoutes, ...customRoutesObject];
};
