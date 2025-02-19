import { lazy, Suspense } from "react";
import { Outlet } from "react-router-dom";
import { LoadingScreen } from "../../components/loading-screen";
import { AuthGuard } from "../../auth/guard";
import DashboardLayout from "../../layouts/dashboard/layout";

// ----------------------------------------------------------------------

const IndexPage = lazy(() => import("../../pages/dashboard/my-orders/list"));
const SettingsPage = lazy(() =>
  import("../../pages/dashboard/settings/settings")
);
const ServicesListPage = lazy(() =>
  import("../../pages/dashboard/services/list")
);


export const dashboardRoutes = [
  {
    path: "dashboard",
    element: (
      // <AuthGuard>
        <DashboardLayout>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      // </AuthGuard>
    ),
    children: [
      { element: <IndexPage />, index: true },
      {
        path: "settings",
        element: <SettingsPage />,
      },
      {
        path: "services",
        children: [
          {
            index: true,
            element: <ServicesListPage />,
          },
        ],
      },
    ],
  },
];
