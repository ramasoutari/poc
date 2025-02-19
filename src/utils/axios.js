import axios from 'axios';
import { HOST_API } from '../config-global';
// config

// ----------------------------------------------------------------------
// const language = localStorage.getItem("i18nextLng");

export const axiosInstance = axios.create({
  baseURL: HOST_API,
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const customError = {
      ...error,
      message: error.response?.data?.message,
      statusCode: error.response?.status,
    };

    return Promise.reject(customError);
  }
);

// Interceptors
// Can be migrated to seperate folder and put here
// axiosInstance.interceptors.use for each interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const language = localStorage.getItem('i18nextLng');

    config.headers['Accept-language'] = language;
    config.headers['lang'] = language;
    // config.headers['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (res) => res,
  // (error) => {
  //   const customError = new Error(error.response.data.responseMessage);
  //   return Promise.reject(customError);
  // }
  (error) => {
    const customError = new Error(error.response.data.error);
    return Promise.reject(customError);
  }
);
axiosInstance.interceptors.request.use(
  async (config) => {
    const { url } = config;

    if (
      url.includes('EntityUploadAttachment') ||
      url.includes('getEntityData') ||
      url.includes('getCitizenInfo') ||
      url.includes('citizenInfo') ||
      url.includes('upsertCPDEntity') ||
      url.includes('getCPDEntityData') ||
      url.includes('upsertAttendanceExternal') ||
      url.includes('GetServicesList') ||
      url.includes('submitCPDHCPAdditionalInfo') ||
      url.includes('UpdatePersonApplication') ||
      url.includes('GetHelpScreen') ||
      url.includes('getPersonCertificates')
    ) {
      try {
        const response = await axiosInstance.post(`${HOST_API}/GenerateGuestToken`);
        const guestToken = response?.data?.data;
        config.headers['x-guest-token'] = guestToken;
      } catch (error) {
        console.log(error);
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const axiosFetcher = async (url, method, payload, headers) => {
  let axiosConfig = {
    url,
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearerx ${localStorage.getItem('accessToken')}`,
      'Accept-Language': localStorage.getItem('locale') || 'en',
      //
      ...headers,
    },
  };

  if (method !== 'GET' && headers?.['Content-Type'] === 'application/json') {
    axiosConfig.data = JSON.stringify(payload);
  }

  if (method === 'GET' && payload) {
    axiosConfig.params = payload;
  }

  try {
    const response = await axiosInstance(axiosConfig);
    return response.data;
  } catch (err) {
    console.error('Error fetching data:', err); // Optional logging
    throw err.response?.data || err;
    // throw new Error(err.response?.data || err)
  }
};

export default axiosInstance;
