import { useCallback, useEffect, useState } from 'react';
import { optionsFromAPISourceGetter } from '../../utils/api';

export default function RenderSelectValueRow({ field, row, rowValue }) {
  const [options, setLocalOptions] = useState([]);

  const getFieldsWithOptions = useCallback(async () => {
    // only for "select" and "radio-group"
    if (field.optionsSourceType === 'api') {
      let params = {};
      if (field.affectingFields) {
        // if one of the affectingFields fields is empty, then we don't need to fetch the options
        // so we just return
        if (
          field.affectingFields.some((field) => {
            return !rowValue[field.fieldName];
          })
        ) {
          return;
        }

        field.affectingFields.forEach((field) => {
          const { fieldName } = field;
          const value = rowValue[field.fieldName];

          params[fieldName + '_id'] = value;
        });
      }
      const options = await optionsFromAPISourceGetter(
        field.optionsSourceApi,
        field.optionsSourceApiToken,
        params,
        field.optionsSourceApiDataKey,
        field.optionsSourceApiLabelKey,
        field.optionsSourceApiValueKey,
        'appendUrl'
      ).send();
      setLocalOptions(options);
    } else {
      setLocalOptions(field.options);
    }
  }, [rowValue]);

  const option = options?.find((item) => {
    return item.value === row[field.fieldVariable];
  });

  useEffect(() => {
    getFieldsWithOptions();
  }, [rowValue]);

  return option?.label || '---';
}
