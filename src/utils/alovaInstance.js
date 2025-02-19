import { createAlova } from 'alova';
import GlobalFetch from 'alova/GlobalFetch';
import ReactHook from 'alova/react';
import axiosInstance from './axios';
import { HOST_API } from '../config-global';

const handleResponded = async (response, config) => {
  // if (response.code !== 200) {
  //   // When an error is thrown here, it will enter the request failure interceptor
  //   throw new Error(json.message);
  // }
  const json = await response.json();
  return {
    ...json,
    isError: !!!response.ok,
  };
};

const alovaInstance = createAlova({
  statesHook: ReactHook,
  requestAdapter: GlobalFetch(),
  async beforeRequest(method) {
    method.config.headers['Content-Type'] = method.config.headers['Content-Type']
      ? method.config.headers['Content-Type']
      : 'application/json';
    if (method.url.includes('getPersonCertificates')) {
      try {
        const response = await axiosInstance.post(`${HOST_API}/GenerateGuestToken`);
        const guestToken = response?.data?.data;
        method.config.headers['x-guest-token'] = guestToken;
      } catch (error) {
        console.log(error);
      }
    }
  },
  async responsed(response, config) {
    return await handleResponded(response, config);
  },
});

export const alovaUploadInstance = createAlova({
  statesHook: ReactHook,
  requestAdapter: GlobalFetch(),
  async responsed(response, config) {
    return await handleResponded(response, config);
  },
});

export default alovaInstance;
