import _ from 'lodash';

export default async function fetchOptionsFromApiSource(
  url,
  optionsSourceApiToken,
  optionsSourceApiDataKey,
  optionsSourceApiValueKey,
  optionsSourceApiLabelKey
) {
  const response = await fetch(url, {
    headers: {
      token: `${optionsSourceApiToken}`,
    },
  });
  const data = await response.json();

  if (data) {
    let newOptions = _.get(data,optionsSourceApiDataKey).map((item) => ({
      label: _.get(item, optionsSourceApiLabelKey),
      value: _.get(item, optionsSourceApiValueKey),
    }));
    return newOptions;
  }

  return [];
}
