import { useEffect } from 'react';
import { Navigate, matchPath, useRoutes } from 'react-router-dom';
// config
//
import { mainRoutes } from './main';

import { authRoutes } from './auth';
import { dashboardRoutes } from './dashboard';
import { PATH_AFTER_LOGIN } from '../../config-global';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/',
      element: <Navigate to={PATH_AFTER_LOGIN} replace />,
    },

    // Auth routes
    ...authRoutes,

    // Dashboard routes
    ...dashboardRoutes,

    // CPD Dashboard routes
    // ...cpdDashboardRoutes,

    // Main routes
    ...mainRoutes,

    // No match 404
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
