import { baseRoutes } from './baseRoutes';

export const getRoutesObject = (customRoutesObject: object[]) => {
  return [...customRoutesObject, ...baseRoutes];
};
