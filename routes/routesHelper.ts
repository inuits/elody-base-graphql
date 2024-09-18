import { baseRoutes } from './baseRoutes';

export const getRoutesObject = (customRoutesObject: object[]) => {
  return [...baseRoutes, ...customRoutesObject];
};
