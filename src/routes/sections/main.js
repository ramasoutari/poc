import { lazy } from "react";
import { Outlet } from "react-router-dom";
import CompactLayout from "../../layouts/compact/layout";
import AuthClassicLayout from "../../layouts/auth/classic";
// layouts

// ----------------------------------------------------------------------

const SanadLoginPage = lazy(() => import("../../pages/auth/sanad-login"));
const Page404 = lazy(() => import("../../pages/404"));
const Certificate = lazy(() => import("../../pages/general/certificate"));
// ----------------------------------------------------------------------

export const mainRoutes = [
  {
    element: (
      <>
        <Outlet />
        {/* <Outlet /> */}
      </>
    ),
    children: [
      {
        path: "404",
        element: (
          <CompactLayout>
            <Page404 />
          </CompactLayout>
        ),
      },
      {
        path: "certificate",
        element: (
          <CompactLayout>
            <Certificate />
          </CompactLayout>
        ),
      },
      {
        path: "sanad",
        element: (
          <AuthClassicLayout>
            <SanadLoginPage />
          </AuthClassicLayout>
        ),
      },
    ],
  },
];
