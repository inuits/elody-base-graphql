import { RouteNames } from '../../../generated-types/type-defs';

export const baseRoutes = [
  {
    path: '/unauthorized',
    name: RouteNames.Unauthorized,
    component: 'Unauthorized',
    meta: { requiresAuth: false },
  },
  {
    path: '/accessDenied',
    name: RouteNames.AccessDenied,
    component: 'AccessDenied',
    meta: { requiresAuth: false },
  },
  {
    path: '/:pathMatch(.*)*',
    name: RouteNames.NotFound,
    component: 'NotFound',
    meta: { requiresAuth: false },
  },
];
