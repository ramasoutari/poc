// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
  CPD_DASHBOARD: '/cpd-dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  // AUTH
  auth: {
    jwt: {
      login: `${ROOTS.AUTH}/login`,
      register: `${ROOTS.AUTH}/register`,
      forgotPassword: `${ROOTS.AUTH}/reset_password`,
      OTP: `${ROOTS.AUTH}/OTP`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    settings: `${ROOTS.DASHBOARD}/settings`,
    services: {
      root: `${ROOTS.DASHBOARD}/services`,
      form: (id) => `${ROOTS.DASHBOARD}/services/${id}`,
      clinicRegistration: `${ROOTS.DASHBOARD}/services/clinic-registration`,
      cpdActivities: (id) => `${ROOTS.DASHBOARD}/services/cpd-activities/${id}`
    },
    clinic: {
      root: `${ROOTS.DASHBOARD}/my-clinic`,
      applications: `${ROOTS.DASHBOARD}/my-clinic/applications`,
      services: {
        root: `${ROOTS.DASHBOARD}/my-clinic/services`,
        form: (id) => `${ROOTS.DASHBOARD}/my-clinic/services/${id}`,
        cpdActivities: (id) => `${ROOTS.DASHBOARD}/my-clinic/services/cpd-activities/${id}`
      },
    },
    cpd: {
      orders: `${ROOTS.DASHBOARD}/cpd/orders`,
    },
  },
  // CPD_DASHBOARD
  cpdDashboard: {
    root: ROOTS.CPD_DASHBOARD,
    trainingActivity: {
      root: `${ROOTS.CPD_DASHBOARD}/training-activity`,
      list: `${ROOTS.CPD_DASHBOARD}/training-activity`,
    },
    settings: `${ROOTS.CPD_DASHBOARD}/settings`,
  },
  general: {
    cpdExternalAttendance: `${ROOTS.DASHBOARD}/cpd/external-attendance`,
  }
};
