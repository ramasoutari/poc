/* eslint-disable default-case */
import i18nCountryLib from 'iso-countries-languages';
import { localStorageGetItem } from './storage-available';
import { HOST_API } from '../config-global';

export default function createFormFieldsFromResponse(
  additionalPersonInfo,
  location = 118,
  grid = 4,
  isCPD
) {
  const getFieldProps = (param_code) => {
    switch (param_code) {
      case '001':
        return {
          type: 'input',
          typeValue: 'string',
          inputType: 'text',
        };
      case '002':
        return {
          type: 'input',
          typeValue: 'string',
          inputType: 'text',
          multiline: true,
          // rows: 4,
        };
      case '003':
        if (isCPD) {
          return {
            type: 'upload',
            typeValue: 'array',
            value: [],
            defaultValue: [],
            uploadStrategy: 'base64',
            viewAttachmentApiLink: (attachmentId) => HOST_API.showAttachment(attachmentId),
            destinationApi: `${HOST_API}/UploadAttachment-cpd`,
            destinationApiToken: '',
            destinationExtraArgs: {
              // ObjectID: DWT_GUIDS.CPDUploadAttachmentObjectIds.UploadAttachment,
              AttachmentType: 'Form',
            },
            validations: [{ type: 'min', value: 1, message: 'required' }],
            responseFileNameKey: 'AttachmentID',
            maxFileSize: '2048',
            allowedExtensions: ['png', 'jpg', 'bmp', 'heif', 'jpeg', 'pdf'],
          };
        } else
          return {
            type: 'upload',
            typeValue: 'array',
            value: [],
            destinationApi: `${HOST_API}/UploadAttachment`,
            destinationApiToken: '',
            destinationExtraArgs: {
              Location: location,
            },
            uploadStrategy: 'tempId',

            maxFileSize: '2048',
            allowedExtensions: ['png', 'jpg', 'bmp', 'heif', 'jpeg', 'pdf'],
            responseFileNameKey: 'attachment.attachmentID',
          };

      case '004':
        if (isCPD) {
          return {
            multiple: true,
            maximimFiles: 5,
            type: 'upload',
            typeValue: 'array',
            value: [],
            defaultValue: [],
            uploadStrategy: 'base64',
            viewAttachmentApiLink: (attachmentId) => HOST_API.showAttachment(attachmentId),
            destinationApi: `${HOST_API}/UploadAttachment-cpd`,
            destinationApiToken: '',
            destinationExtraArgs: {
              // ObjectID: DWT_GUIDS.CPDUploadAttachmentObjectIds.UploadAttachment,
              AttachmentType: 'Form',
            },
            validations: [{ type: 'min', value: 1, message: 'required' }],
            responseFileNameKey: 'AttachmentID',
            maxFileSize: '2048',
            allowedExtensions: ['png', 'jpg', 'bmp', 'heif', 'jpeg', 'pdf'],
          };
        } else
          return {
            type: 'upload',
            typeValue: 'array',
            value: [],
            uploadStrategy: 'tempId',
            destinationApi: `${HOST_API}/UploadAttachment`,
            destinationApiToken: '',
            destinationExtraArgs: {
              Location: location,
            },
            multiple: true,
            maximimFiles: 5,
            maxFileSize: '2048',
            allowedExtensions: ['png', 'jpg', 'bmp', 'heif', 'jpeg', 'pdf'],
            responseFileNameKey: 'attachment.attachmentID',
          };
      case '005':
        return {
          type: 'select',
          typeValue: 'string',
        };
      case '006':
        return {
          type: 'input',
          typeValue: 'string',
          inputType: 'numeric-text',
        };
      case '007':
        return {
          type: 'phonefield',
          typeValue: 'string',
          defaultCountry: 'jo',
        };
      case '008':
        const language = localStorageGetItem('i18nextLng');
        const countries = Object.entries(i18nCountryLib.getCountries(language || 'ar'))
          .filter((item) => item[0] !== 'IL')
          .map(([_code, name]) => ({
            label: name,
            value: name,
          }));

        return {
          type: 'select',
          typeValue: 'string',
          isCountry: true,
          options: countries,
        };
      case '009':
        return {
          type: 'date',
          inputType: 'date',
          typeValue: 'string',
        };
      case '010':
        return {
          type: 'checkbox',
          typeValue: 'boolean',
        };
      case '011':
        return {
          type: 'multi-checkbox',
          typeValue: 'boolean',
        };

      // case '003':
      //   return {
      //     type: 'upload',
      //     typeValue: 'array',
      //     value: [],
      //     uploadStrategy: 'base64',
      //     destinationApi: `${HOST_API}/UploadAttachment`,
      //     destinationApiToken: '',
      //     destinationExtraArgs: {
      //       Location: location,
      //     },
      //     maxFileSize: '2048',
      //     allowedExtensions: [
      //       "png",
      //       "jpg",
      //       "bmp",
      //       "heif",
      //       "jpeg",
      //       "pdf",
      //     ],
      //     responseFileNameKey: 'attachmentID',
      //   };

      // case '004':
      //   return {
      //     type: 'upload',
      //     typeValue: 'array',
      //     value: [],
      //     uploadStrategy: 'base64',
      //     destinationApi: `${HOST_API}/UploadAttachment`,
      //     destinationApiToken: '',
      //     destinationExtraArgs: {
      //       Location: location,
      //     },
      //     multiple: true,
      //     maximimFiles: 5,
      //     maxFileSize: '2048',
      //     allowedExtensions: [
      //       "png",
      //       "jpg",
      //       "bmp",
      //       "heif",
      //       "jpeg",
      //       "pdf",
      //     ],
      //     responseFileNameKey: 'attachmentID',
      //   };
    }
  };

  const formFields = additionalPersonInfo.map((field) => {
    // const { param_GUID, param_name, param_code, param_value, param_notes } = field;
    const {
      param_GUID,
      param_name,
      param_code,
      param_value,
      options,
      required,
      param_notes,
      param_note,
      portal_validation_rules,
      tip,
    } = field;

    const fieldValidations = [];
    if (portal_validation_rules?.length > 0) {
      portal_validation_rules?.forEach((rule) => {
        fieldValidations.push(rule);
      });
    }

    if (!field.optional) {
      // 003, 004 means array of file names
      // when an array field is required, we put a length validation
      if (['003', '004'].includes(field.param_code)) {
        fieldValidations.push({ type: 'required', value: 1, message: 'required' });
      } else {
        // when an a string/number/..etc field is required, we put required validation
        if (required !== false) {
          fieldValidations.push({ type: 'required', message: 'required' });
        }
      }
    }
    console.log('sxcvuhsxusjxn', field);
    const formField = {
      fieldVariable: param_GUID,
      label: param_name,
      value: param_value,
      placeholder: param_name,
      validations: fieldValidations,
      disabled: field.disabled,
      options: options,
      notes: param_notes || param_note,
      tip: tip,
      gridOptions: [
        {
          breakpoint: 'xs',
          size: 12,
        },
        {
          breakpoint: 'md',
          size: field.grid || grid,
        },
      ],
      ...getFieldProps(param_code),
    };
    return formField;
  });

  return formFields;
}
