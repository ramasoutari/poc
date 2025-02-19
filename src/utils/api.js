import _ from 'lodash';
import { HOST_API } from '../config-global';
import alovaInstance, { alovaUploadInstance } from './alovaInstance';

// Get Select and Radio-Gruop options from API
export function optionsFromAPISourceGetter(
  srcUrl,
  params,
  dataKey = 'data',
  labelKey,
  valueKey,
  includeExtraKeys = []
) {
  return alovaInstance.Get(srcUrl, {
    params: {
      ...params,
      // Temporarly, then must add to field json
      PageSize: 1000,
      PageNumber: 1,
    },
    headers: {
      'Accept-Language': localStorage.getItem('i18nextLng'),
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
    localCache: {
      // Set cache mode to memory mode
      mode: 'memory',

      // unit is milliseconds
      // When set to `Infinity`, it means that the data will never expire, and when it is set to 0 or a negative number, it means no caching
      // 1000 is 1 second
      // 1 * 1000 * 60 is 1 minute
      expire: 1 * 1000 * 60 * 5,
    },
    async transformData(rawData, headers) {
      // console.log('rawData', rawData.data.Items);
      // console.log('dataKey', dataKey);
      let newOptions = (
        dataKey ? _.get(rawData?.data || rawData, dataKey) : rawData?.data || rawData
      ).map((item) => ({
        label: _.get(item, labelKey),
        value: _.get(item, valueKey),
        // Include extra keys
        ...includeExtraKeys.reduce((acc, key) => {
          acc[key] = _.get(item, key);
          return acc;
        }, {}),
      }));

      return newOptions;
    },
  });
}

export function uploadFileRequest(srcUrl, token, data, strategy = 'form-data') {
  if (strategy === 'form-data') {
    return alovaUploadInstance.Post(
      srcUrl,
      // Body
      data,
      // Config
      {
        headers: {
          token,
        },
      }
    );
  }
}

export function register(data) {
  return alovaInstance.Post(`${HOST_API}/mwapi/portal/JordanianUserRegister`, data);
}
