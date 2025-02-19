import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
// auth
// layouts
// components
import { GuestGuard } from '../../auth/guard';
import AuthClassicLayout from '../../layouts/auth/classic';
import { SplashScreen } from '../../components/loading-screen';

// ----------------------------------------------------------------------

// JWT
const SanadLoginPage = lazy(() => import("../../pages/auth/sanad-login"));
const JwtLoginPage = lazy(() => import("../../pages/auth/login"));
const JwtRegisterPage = lazy(() => import("../../pages/auth/register"));
const JwtOTPPage = lazy(() => import("../../pages/auth/otp"));




// ----------------------------------------------------------------------

const authJwt = {
  path: '',
  element: (
    <GuestGuard>
      <Suspense fallback={<SplashScreen />}>
        <Outlet />
      </Suspense>
    </GuestGuard>
  ),
  children: [
    {
      path: 'sanad-login',
      element: (
        <AuthClassicLayout>
          <SanadLoginPage />
        </AuthClassicLayout>
      ),
    },
    {
      path: 'login',
      element: (
        <AuthClassicLayout>
          <JwtLoginPage />
        </AuthClassicLayout>
      ),
    },
    {
      path: 'register',
      element: (
        <AuthClassicLayout>
          <JwtRegisterPage />
        </AuthClassicLayout>
      ),
    },
    {
      path: 'OTP',
      element: (
        <AuthClassicLayout>
          <JwtOTPPage />
        </AuthClassicLayout>
      ),
    },

  ],
};

export const authRoutes = [
  {
    path: 'auth',
    children: [authJwt],
  },
];
