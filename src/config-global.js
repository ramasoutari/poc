// routes

import { paths } from "./routes/paths";

// API
export const HOST_API = process.env.REACT_APP_SERVER_URL;
export const HOST_API_CPD = process.env.REACT_APP_SERVER_URL_CPD;
export const HOST_API_CPD_TEMPORARY = process.env.REACT_APP_SERVER_URL_CPD_TEMPORARY;
export const HOST_API_TOKEN = process.env.REACT_APP_HOST_API_TOKEN;
export const ASSETS_API = process.env.REACT_APP_ASSETS_API;
export const ACCESS_KEY = process.env.REACT_APP_ACCESS_KEY;

// SANAD
export const SANAD_CLIENT_ID = process.env.REACT_APP_SANAD_CLIENT_ID;
export const SANAD_SIGNFLOW_URL = process.env.REACT_APP_SANAD_SIGNFLOW_URL;
export const SANAD_REDIRECT_URL = process.env.REACT_APP_SANAD_REDIRECT_URL;

export const FIREBASE_API = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APPID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

export const MAPBOX_API = process.env.REACT_APP_MAPBOX_API;

// ROOT PATH AFTER LOGIN SUCCESSFUL
export const PATH_AFTER_LOGIN = paths.dashboard.root; // as '/dashboard'
export const PATH_AFTER_LOGIN_CPD = paths.cpdDashboard.root; // as '/dashboard'
export const PATH_AFTER_REGISTER = paths.auth.jwt.OTP; // as '/OTP
export const PASSWORD_RESET = paths.auth.jwt.forgotPassword; // as '/forgotPassword'

// PLACEHOLDER IMAGE
export const PLACEHOLDER_IMAGE = '/assets/images/placeholder.png';

export const TrainingActivityStatuses = {
  PENDING_OUTCOME_APPROVAL: '1',
  UNDER_REVIEW: '2',
  REJECTED: '3',
  COMPLETED: '4',
};

export const AddActivityFormCodes = {
  ActivityInformation: 'ActivityInformation',
  TargetedCategories: 'TargetedCategories',
  OrganizersCoordinators: 'OrganizersCoordinators',
  TrainersSupervisors: 'TrainersSupervisors',
  ActivityStandards: 'ActivityStandards',
  ConferenceManagementStandardsAndCriteria: 'ConferenceManagementStandardsAndCriteria',
  Attendance: 'Attendance',
  Outputs: 'Outputs',
  // Attachments: 'Attachments',
};
export const ClinicStatus = {
  PendingApproval: '001',
  Approved: '002',
};

export const DWT_DEMO_AUTH_TOKEN = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhMjE4YWE0Zi1mMjkyLTQzOWYtOTk2ZC03ODRkZjhjYWE4OWIiLCJuYW1laWQiOiI4NjBjMzJhNS1hOWU2LTRiZmUtYmIxNy1hNGE4MGFkMzJmZjMiLCJnaXZlbl9uYW1lIjoiU3lzdGVtIiwiZW1haWwiOiJkd3RAZHd0LmpvIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjpbIlVzZXIiLCJBZG1pbiIsIkRldmVsb3BlciIsIlN1cGVyQWRtaW4iXSwiZXhwIjoxNzIyNDE5ODMxLCJpc3MiOiJVbml2ZXJzYWxBUEkiLCJhdWQiOiJVbml2ZXJzYWxBUEkifQ.99E5HlkaIz3svEoR71sCWzheoiy6n1RKilrbsDIsB34`;
