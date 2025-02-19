import { lazy } from "react";
import { Outlet } from "react-router-dom";
import CompactLayout from "../../layouts/compact/layout";
// layouts

// ----------------------------------------------------------------------

const Page404 = lazy(() => import("../../pages/404"));
const Certificate = lazy(() => import("../../pages/general/certificate"));
// ----------------------------------------------------------------------

export const mainRoutes = [
  {
    element: (
      <>
        <CompactLayout>
          <Outlet />
        </CompactLayout>
        {/* <Outlet /> */}
      </>
    ),
    children: [
      { path: "404", element: <Page404 /> },
      { path: "certificate", element: <Certificate /> },
    ],
  },
];
