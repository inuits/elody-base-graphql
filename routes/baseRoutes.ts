import { RouteNames } from '../../../generated-types/type-defs';

export const baseRoutes = [
  {
    path: '/unauthorized',
    name: RouteNames.Unauthorized,
    component: 'Unauthorized',
    meta: { title: 'Unauthorized', requiresAuth: false },
  },
  {
    path: '/accessDenied',
    name: RouteNames.AccessDenied,
    component: 'AccessDenied',
    meta: { title: 'Access denied', requiresAuth: false },
  },
  {
    path: '/:pathMatch(.*)*',
    name: RouteNames.NotFound,
    component: 'NotFound',
    meta: { title: 'Not Found', requiresAuth: false },
  },
];
