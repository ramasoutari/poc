import {
  Fragment,
  createElement,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import PropTypes from "prop-types";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";
import _, { filter } from "lodash";

// @mui
import {
  Box,
  Button,
  CircularProgress,
  GlobalStyles,
  Grid,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { useTheme } from "@mui/material/styles";
// hooks
// components
import FormSection from "../form-section";
import InputLabel from "../input-label";
import Iconify from "../iconify";
import {
  RHFCheckbox,
  RHFDatePicker,
  RHFMultiCreatableField,
  RHFMultiSelect,
  RHFOTPField,
  RHFPhoneField,
  RHFRadioGroup,
  RHFRepeaterField,
  RHFSelect,
  RHFTextField,
  RHFUploadField,
} from "../hook-form";
//
import { checkRule } from "./utils";
import { calculateDateRules } from "./utils/calculate-date-rules";
import PresetPopover from "./preset-popover";
import CopyToPopover from "./copy-to-popover";
import { LoadingButton } from "@mui/lab";
import { useGlobalPromptContext } from "../global-prompt";
import { useGlobalDialogContext } from "../global-dialog";
import { RHFMultiCheckBox } from "../hook-form/rhf-multi-checkbox";
import { useLocales } from "../../locales";
import { useLocalStorage } from "../../hooks/use-local-storage";
import { useSkipFirstRender } from "../../hooks/use-skip-first-render";
import VerifyOTPDialog from "../../sections/_common/verify-otp-dialog";

const DynamicForm = forwardRef(
  (
    {
      formName,
      saveInLocalStorage,
      defaultValues,
      fields,
      onSubmit,
      validationSchema,
      validationMode,
      showCaptcha,
      hasFalseInfoAlert,
      otpVerification,
      submitButtonProps,
      extraButtons,
      canReset,
      invisible,
      onFormValuesChange,
      filterValues = true,
      onOpen,
      isInRepeater = false,
    },
    ref
  ) => {
    const didFillFromLocalStorage = useRef(false);
    const didMount = useRef(false);
    const currentSubmitCount = useRef(0);
    const { t } = useLocales();
    // const tl = useTranslationContext();
    const theme = useTheme();
    const globalPrompt = useGlobalPromptContext();
    const globalDialog = useGlobalDialogContext();
    const prevValues = useRef({});
    const prevValues2 = useRef({});
    // Local Storage
    const {
      state: localStorageState,
      updateState: updateLocalStorageState,
      reset: resetLocalStorageState,
    } = useLocalStorage(`dynamic-form-${formName}`, {});
    // RHF Methods
    const formMethods = useForm({
      resolver: yupResolver(validationSchema),
      defaultValues: { ...defaultValues },
      mode: validationMode || "onBlur",
    });
    // Reset Form
    const onResetForm = () => {
      formMethods.reset(defaultValues);
      resetLocalStorageState();
    };
    const mustShowCaptcha = useCallback(() => {
      let isCaptchaEnabled = showCaptcha;
      if (showCaptcha?.enabledWhen?.length > 0) {
        showCaptcha.enabledWhen.forEach((rule) => {
          isCaptchaEnabled = checkRule(rule, formMethods.watch(rule.field));
        });
      }
      return isCaptchaEnabled;
    }, [formMethods.watch()]);

    useImperativeHandle(
      ref,
      () => ({
        setValue(key, value) {
          return formMethods.setValue(key, value);
        },
        setValues(data) {
          if (Object.keys(data).length === 0) return;
          return Object.entries(data).forEach(([key, value]) => {
            formMethods.setValue(key, value);
          });
        },
        triggerValidation() {
          return formMethods.trigger();
        },
        isValid() {
          return formMethods.formState.isValid;
        },
        getData() {
          return handleFilterValues(formMethods.watch());
        },
        getDataWithoutFilesExtras() {
          let dataWithoutFilesExtras = handleFilterValues(formMethods.watch());
          // We need to delete any key that includes ['_base64', '_filename', '_type'] in data
          return Object.keys(dataWithoutFilesExtras)
            .filter(
              (key) =>
                !["base64", "filename", "type"].includes(key.split("_")[1])
            )
            .reduce((acc, key) => {
              if (
                Array.isArray(dataWithoutFilesExtras[key]) &&
                typeof dataWithoutFilesExtras[key]?.[0] !== "string"
              ) {
                acc[key] = dataWithoutFilesExtras[key].map((item) =>
                  Object.keys(item)
                    .filter(
                      (key) =>
                        !["base64", "filename", "type"].includes(
                          key.split("_")[1]
                        )
                    )
                    .reduce((acc, key) => {
                      acc[key] = item[key];
                      return acc;
                    }, {})
                );
              } else {
                acc[key] = dataWithoutFilesExtras[key];
              }
              return acc;
            }, {});
        },
        formErrors() {
          return formMethods.formState.errors;
        },
        isTouched() {
          return Object.keys(formMethods.formState.dirtyFields)?.length > 0;
        },
      }),
      []
    );

    useEffect(() => {
      if (onFormValuesChange) {
        // Make sure it is changed not the same
        if (!_.isEqual(formMethods.watch(), prevValues2.current)) {
          onFormValuesChange(handleFilterValues(formMethods.watch()));
          prevValues2.current = formMethods.watch();
        }
      }
    }, [formMethods.watch()]);

    useEffect(() => {
      if (!mustShowCaptcha()) {
        formMethods.setValue("captcha", "");
        formMethods.setValue("generatedCaptcha", "");
      }
    }, [mustShowCaptcha()]);
    const handleScrollToFirstError = useCallback(() => {
      if (
        Object.keys(formMethods.formState.errors).length > 0 &&
        formMethods.formState.isSubmitted &&
        formMethods.formState.submitCount >= currentSubmitCount.current
      ) {
        const findFirstErrorFieldElement = (fields) => {
          let firstErrorFieldElement = null;
          fields.forEach((field) => {
            if (firstErrorFieldElement) return;
            const { fieldVariable } = field;
            const fieldElement = document.getElementById(
              `container-${fieldVariable}`
            );
            if (fieldElement) {
              const errorElement = fieldElement.querySelector(
                ".Mui-error:not(.Mui-disabled)"
              );
              if (errorElement) {
                firstErrorFieldElement = fieldElement;
              }
            }
          });
          return firstErrorFieldElement;
        };
        const firstErrorFieldElement = findFirstErrorFieldElement(fields);
        if (firstErrorFieldElement) {
          firstErrorFieldElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }
    }, [
      formMethods.formState.errors,
      JSON.stringify(formMethods.formState.errors),
    ]);
    useEffect(() => {
      // console all errors
      console.table(Object.entries(formMethods.watch()));
      console.table(
        Object.entries(formMethods.formState.errors).map(([key, value]) => ({
          field: key,
          error: value.message,
        }))
      );
      // console.table(
      //   Object.entries(formMethods.watch()).map(([key, value]) => ({
      //     field: key,
      //     value: value,
      //   }))
      // );
    }, [JSON.stringify(formMethods.formState.errors)]);
    useEffect(() => {
      if (didMount.current) {
        currentSubmitCount.current += 1;
        handleScrollToFirstError();
      }
    }, [formMethods.formState.submitCount]);
    // Get Submit Button Alignment
    const getSubmitButtonAlignment = () => {
      let alignment = "flex-start";
      switch (submitButtonProps?.alignment) {
        case "left":
          alignment = "flex-start";
          break;
        case "center":
          alignment = "center";
          break;
        case "right":
          alignment = "flex-end";
          break;
        default:
          alignment = "flex-end";
          break;
      }
      return alignment;
    };
    // Create field
    const createField = (fieldData) => {
      const {
        fieldVariable,
        validations,
        required,
        typeValue,
        value,
        label,
        onFieldChange,
        options,
        tableEmptyText,
        inputType,
        multiline,
        rows,
        attachmentName,
        uploadStrategy,
        viewAttachmentApiLink,
        destinationApi,
        destinationApiToken,
        destinationExtraArgs,
        responseFileNameKey,
        allowedExtensions,
        minFileSize,
        maxFileSize,
        multiple,
        maximimFiles,
        optionsSourceType,
        optionsSourceApi,
        optionsSourceApiToken,
        optionsSourceApiDataKey,
        optionsSourceApiValueKey,
        optionsSourceApiLabelKey,
        excludedValues,
        isAffectedByOtherFields,
        affectingFields,
        defaultValue,
        description,
        descriptionStyle,
        copyToFields,
        presets,
        showViewButtonForUploadedFiles,
        canDeleteAll,
        canDelete,
        canEdit,
        canAdd,
        canDuplicate,
        canReorder,
        onOpen,
        hasPagination,
        handleGetEntries,
        onAddEntry,
        onEditEntry,
        onAddEditEntry,
        onDeleteEntry,
        hiddenColumns,
        enableSelection,
        displayLayout,
        addButtonProps,
        editButtonProps,
        submitButtonProps,
        addButtonLabel,
        addButtonIcon,
        uniqueRepeaterId,
        sticky,
        minDateFromField,
        maxDateFromField,
        showTime,
        allowZero = false,
        filterValues: shouldFilterValues,
        disableAutoComplete,
        includeExtraKeys,
        ...fieldProps
      } = fieldData;
      const dynamicformFields = {
        "form-section": FormSection,
        input: RHFTextField,
        phonefield: RHFPhoneField,
        select: RHFSelect,
        "multi-checkbox": RHFMultiCheckBox,
        date: RHFDatePicker,
        "radio-group": RHFRadioGroup,
        checkbox: RHFCheckbox,
        repeater: RHFRepeaterField,
        upload: RHFUploadField,
        "multi-creatable": RHFMultiCreatableField,
        otp: RHFOTPField,
      };
      if (fieldProps.type === "form-section") {
        return (
          <FormSection
            label={t(label) ? t(label) : label}
            description={t(description) ? t(description) : description}
            descriptionStyle={descriptionStyle}
          />
        );
      } else {
        let dateValidationsProps = {};
        if (fieldProps.type === "date") {
          let dateValidations = {
            minDate: validations.find(
              (validation) => validation.type === "min"
            ),
            maxDate: validations.find(
              (validation) => validation.type === "max"
            ),
          };

          dateValidationsProps = {
            minDate:
              minDateFromField && formMethods.watch(minDateFromField)
                ? new Date(formMethods.watch(minDateFromField))
                : dateValidations.minDate
                ? calculateDateRules(dateValidations.minDate.value, "min")
                : null,
            maxDate:
              maxDateFromField && formMethods.watch(maxDateFromField)
                ? new Date(formMethods.watch(maxDateFromField))
                : dateValidations.maxDate
                ? calculateDateRules(dateValidations.maxDate.value, "max")
                : null,
          };
        }

        return (
          <Stack direction="column">
            {/* Label */}
            {label && !["checkbox"].includes(fieldProps.type) && (
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Stack direction="row" alignItems="center" gap={1}>
                  <InputLabel
                    key={fieldVariable}
                    label={
                      <>
                        {t(label) ? t(label) : label}
                        {required ||
                        validations?.some(
                          (validation) =>
                            validation.type === "when" &&
                            (validation.operator
                              ? checkRule(
                                  validation,
                                  formMethods.watch(validation.field)
                                )
                              : Array.isArray(validation.value)
                              ? validation.value.includes(
                                  formMethods.watch(validation.field)
                                )
                              : validation.value)
                        ) ? (
                          <Typography variant="caption" color="error.main">
                            *{/* {t('obligatory_field')} */}
                          </Typography>
                        ) : (
                          <Typography variant="caption" color="primary">
                            {" "}
                            ({t("optional")})
                          </Typography>
                        )}
                      </>
                    }
                    htmlFor={fieldVariable}
                  />
                  {fieldProps.tip && fieldProps?.tipType !== "modal" && (
                    <Tooltip
                      title={
                        t(fieldProps?.tip)
                          ? t(fieldProps?.tip)
                          : fieldProps?.tip
                      }
                    >
                      <Box>
                        <Iconify
                          icon="mdi:information-outline"
                          color="text.secondary"
                        />
                      </Box>
                    </Tooltip>
                  )}
                  {fieldProps.tip && fieldProps?.tipType === "modal" && (
                    <Box
                      onClick={() =>
                        openTipModal(
                          label,
                          <div
                            dangerouslySetInnerHTML={{
                              __html: t(fieldProps?.tip)
                                ? t(fieldProps?.tip)
                                : fieldProps?.tip,
                            }}
                          />
                        )
                      }
                      sx={{
                        cursor: "pointer",
                      }}
                    >
                      <Iconify
                        icon="mdi:information-outline"
                        color="text.secondary"
                      />
                    </Box>
                  )}
                </Stack>
              </Stack>
            )}
            {
              // if field has "copyToFields" prop, render copyToFields
              copyToFields &&
                copyToFields.length > 0 &&
                // make sure at least one of the copyToFields is visible
                copyToFields.some(
                  (fieldVariable) =>
                    !checkvisibilityRules(
                      fields.find(
                        (field) => field.fieldVariable === fieldVariable
                      )?.visibilityRules
                    )
                ) &&
                formMethods.watch(fieldVariable) && (
                  <Stack direction="row" alignItems="center" gap={1} pb={1}>
                    <CopyToPopover
                      fields={
                        fields.filter(
                          (field) =>
                            copyToFields.includes(field.fieldVariable) &&
                            field.fieldVariable !== fieldVariable &&
                            !checkvisibilityRules(field.visibilityRules)
                        ) || []
                      }
                      onChooseField={(fv) => {
                        // first make sure both fields has the same type
                        // if (
                        //   fields.find((f) => f.fieldVariable === fv)?.type !==
                        //   fieldProps.type
                        // )
                        //   return;
                        // then copy the value
                        formMethods.setValue(
                          fv,
                          formMethods.watch(fieldVariable)
                        );
                      }}
                      onChooseAll={() => {
                        // first make sure all fields has the same type
                        copyToFields.forEach((fv) => {
                          // if (
                          //   fields.find((f) => f.fieldVariable === fv)?.type !==
                          //   fieldProps.type
                          // )
                          //   return;
                          // then copy the value
                          formMethods.setValue(
                            fv,
                            formMethods.watch(fieldVariable)
                          );
                        });
                      }}
                    />
                  </Stack>
                )
            }
            {
              // if field has "presets" prop, render presets
              presets && (
                <>
                  <Stack direction="row" alignItems="center" gap={1} pb={1}>
                    <Typography variant="body2" color="textSecondary">
                      {t("presets")}
                    </Typography>
                    {/* We need to list presets in a popover */}
                    <PresetPopover
                      presets={presets}
                      onSelectPreset={(addMethod, value) => {
                        if (!value) return;
                        if (!addMethod)
                          return formMethods.setValue(fieldVariable, value);
                        if (addMethod === "append") {
                          formMethods.setValue(fieldVariable, [
                            ...formMethods.getValues(fieldVariable),
                            ...(Array.isArray(value) ? value : [value]),
                          ]);
                        }
                      }}
                    />
                  </Stack>
                </>
              )
            }
            {/* Field */}
            {dynamicformFields[fieldProps.type] &&
              createElement(dynamicformFields[fieldProps.type], {
                ...fieldProps,
                disableAutoComplete,
                isInRepeater,
                id: fieldVariable,
                name: fieldVariable,
                disabled:
                  typeof fieldProps.disabled === "function"
                    ? fieldProps.disabled(formMethods.watch())
                    : fieldProps.disabled,
                placeholder: t(fieldProps?.placeholder)
                  ? t(fieldProps?.placeholder)
                  : fieldProps?.placeholder,
                ...(tableEmptyText && {
                  tableEmptyText: t(tableEmptyText)
                    ? t(tableEmptyText)
                    : tableEmptyText,
                }),
                options: options?.map((option) => ({
                  label: t(option?.label) ? t(option?.label) : option?.label,
                  value: option.value,
                })),
                // if type is date, and has validation "max", add maxDate
                // ...(fieldProps.type === 'date' && dateValidationsProps),
                ...(fieldProps.type === "date" && dateValidationsProps),
                // if field type is input
                ...(fieldProps.type === "input" && {
                  allowZero,
                  type: inputType === "numeric-text" ? "number" : "text",
                  inputType,
                  ...(inputType === "text" &&
                    multiline && {
                      multiline: [true, "true"].includes(multiline)
                        ? true
                        : false,
                      ...(rows && { rows: Number(rows) }),
                    }),
                }),
                // if field type is select or radio-group
                ...(["select"].includes(fieldProps.type) && {
                  multiple,
                }),
                ...(["select", "radio-group", "multi-checkbox"].includes(
                  fieldProps.type
                ) && {
                  includeExtraKeys: includeExtraKeys,
                  horizontal: fieldProps.horizontal,
                  getOptionLabel: (option) => option?.label,
                  getOptionValue: (option) => option?.value,
                  optionsSourceType,
                  optionsSourceApi,
                  optionsSourceApiToken,
                  optionsSourceApiDataKey,
                  optionsSourceApiValueKey,
                  optionsSourceApiLabelKey,
                  excludedValues,
                  required,
                  isAffectedByOtherFields,
                  affectingFields,
                }),
                // if field type is upload
                ...(["upload"].includes(fieldProps.type) && {
                  attachmentName,
                  uploadStrategy,
                  viewAttachmentApiLink,
                  destinationApi,
                  destinationApiToken,
                  destinationExtraArgs,
                  responseFileNameKey,
                  allowedExtensions,
                  minFileSize,
                  maxFileSize,
                  maximimFiles,
                  multiple,
                  defaultValue,
                }),
                // if field type is checkbox
                ...(fieldProps.type === "checkbox" && {
                  label: t(label) ? t(label) : label,
                  // sx: {
                  //   mx: 0.1,
                  //   borderLeft: (t) => `4px solid ${t.palette.primary.main}`,
                  // },
                }),
                ...(fieldProps.type === "repeater" && {
                  showViewButtonForUploadedFiles,
                  fieldVariable,
                  canDeleteAll,
                  canDelete,
                  canEdit,
                  canAdd,
                  canDuplicate,
                  canReorder,
                  enableSelection,
                  addButtonProps,
                  editButtonProps,
                  submitButtonProps,
                  onOpen,
                  onAddEntry,
                  onEditEntry,
                  hasPagination,
                  handleGetEntries,
                  onAddEditEntry,
                  onDeleteEntry,
                  hiddenColumns,
                  filterValues: shouldFilterValues,
                  formMethods,
                }),
              })}
            {fieldProps?.notes && (
              <Box
                dangerouslySetInnerHTML={{ __html: fieldProps?.notes }}
                sx={{
                  mt: 0.25,
                  color: "text.secondary",
                  fontSize: 100,
                }}
              />
            )}
          </Stack>
        );
      }
    };
    // Render Grid Item
    useEffect(() => {}, [formMethods.watch()]);

    const openTipModal = (fieldName, tipContent) => {
      globalDialog.onOpen({
        dismissable: true,
        title: <>{fieldName}</>,
        content: <Box p={2}>{tipContent}</Box>,
        dialogProps: {
          maxWidth: "md",
        },
      });
    };

    const renderGridItem = (gridOptions = [], field, isHidden = false) => {
      const breakpointsSizes = () => {
        // gridOptions is an array of objects, each object has a breakpoint and size
        // e.g. [{breakpoint: "xs", size: 12}, {breakpoint: "lg", size: 4}]
        // we need to convert is to an object like this {xs: 12, lg: 4}
        const breakpoints = gridOptions.map((option) => option.breakpoint);
        const sizes = gridOptions.map((option) => option.size);
        const breakpointsSizes = breakpoints.reduce((acc, cur, index) => {
          acc[cur] = Number(sizes[index]);
          return acc;
        }, {});
        // if gridOptions does not have xs, add xs: 12
        if (!breakpointsSizes.xs) {
          breakpointsSizes.xs = 12;
        }
        return breakpointsSizes;
      };
      if (isHidden) {
        return (
          <Grid2
            sx={{
              opacity: 0,
              position: "absolute",
              left: -10000,
            }}
          >
            {createField(field)}
          </Grid2>
        );
      }
      return (
        <>
          <Grid
            {...breakpointsSizes()}
            item
            id={`container-${field.fieldVariable}`}
          >
            {createField(field)}
          </Grid>
        </>
      );
    };
    // Check Visibility Rules
    const checkvisibilityRules = (rules) => {
      if (rules?.length === 0) return false;
      let isFieldHidden = false;
      rules?.forEach((rule) => {
        const operand = rule?.operand || "AND";
        const fieldData = formMethods.watch(rule.field);
        if (operand === "AND") {
          if (!checkRule(rule, fieldData)) {
            isFieldHidden = true;
          }
        } else if (operand === "OR") {
          if (checkRule(rule, fieldData)) {
            isFieldHidden = false;
          }
        }
      });
      return isFieldHidden;
      // return rules?.some((rule) => {
      //   const fieldData = formMethods.watch(rule.field);
      //   return !checkRule(rule, fieldData);
      // });
    };
    // Check fields affected by other fields
    const checkFieldsAffectedByOtherFields = (fields) => {
      // fields
      //   .filter((field) => field.isAffectedByOtherFields)
      //   .forEach((field) => {
      //     const { affectingFields, fieldVariable } = field;
      //     const fieldData = formMethods.watch(fieldVariable);
      //     affectingFields.forEach((affectingField) => {
      //       const { fieldVariable } = affectingField;
      //       const fieldData = formMethods.watch(fieldVariable);
      //       if (fieldData !== "") {
      //         // we must let this field trigger its api call
      //         // so we need to reset the field
      //       }
      //     });
      //   });
    };
    // Reset invisible fields
    const resetInvisibleFields = (fields) => {
      fields.forEach((field) => {
        const { visibilityRules, fieldVariable } = field;
        if (checkvisibilityRules(visibilityRules)) {
          // if field does not equal to default value, reset it
          if (
            !_.isEqual(
              formMethods.watch(fieldVariable),
              defaultValues[fieldVariable]
            )
          ) {
            formMethods.setValue(fieldVariable, defaultValues[fieldVariable]);
          }
        }
      });
    };

    const handleFilterValues = (data) => {
      let filteredData = Object.entries(data).reduce((acc, [key, value]) => {
        let fieldType = fields.find((f) => f.fieldVariable === key)?.type;
        // filteredData, exclude ["form-section"]
        if (!["form-section"].includes(fieldType)) {
          // remove uniqueRepeaterId from any field that is "repeater"
          if (["repeater"].includes(fieldType)) {
            acc[key] = value.map((item) => {
              delete item.uniqueRepeaterId;
              return item;
            });
          }
          // remove fields that has _label or _hasOptions
          else if (
            !key.endsWith("_label") &&
            !key.endsWith("_chosen_object") &&
            !key.endsWith("_hasOptions")
          ) {
            acc[key] = value;
          }
        }
        // I need to send every empty string "" as null
        if (value === "") {
          acc[key] = null;
        }
        return acc;
      }, {});
      // remove captcha
      delete filteredData.captcha;
      const completeData = Object.entries(filteredData).reduce(
        (acc, [key, value]) => {
          let fieldVisibilityRules = fields.find(
            (f) => f.fieldVariable === key
          )?.visibilityRules;
          // remove fields that are not visible
          if (!checkvisibilityRules(fieldVisibilityRules)) {
            acc[key] = value;
          }

          // remove "+962 " from all fields
          // if (typeof value === 'string' && value?.startsWith('+962 ')) {
          //   acc[key] = value.replace('+962 ', '0');
          // }

          return acc;
        },
        {}
      );

      delete completeData.generatedCaptcha;
      return completeData;
    };

    // Handle Submit
    const handleSubmit = (data, filteredValues = true) => {
      let completeData = {};

      if (filteredValues) {
        completeData = handleFilterValues(data);
      } else {
        completeData = data;
      }

      // I need to send every empty string "" as null
      completeData = Object.entries(completeData).reduce(
        (acc, [key, value]) => {
          if (value === "") {
            acc[key] = null;
          } else {
            acc[key] = value;
          }
          return acc;
        },
        {}
      );

      const sendData = () => {
        let isOtpVerificationEnabled = otpVerification?.enabled;
        if (otpVerification?.enabledWhen?.length > 0) {
          otpVerification.enabledWhen.forEach((rule, index) => {
            if (checkRule(rule, completeData[rule.field])) {
              isOtpVerificationEnabled = true;
            }
          });
        }
        if (isOtpVerificationEnabled) {
          // send OTP to field "otpVerification.phoneFieldVariable"
          if (otpVerification?.submitBeforeOTP) {
            onSubmit(completeData);
          }
          globalDialog.onOpen({
            title: t("verify_phone_number"),
            content: (
              <VerifyOTPDialog
                phoneNumber={formMethods
                  .watch(otpVerification.phoneFieldVariable)
                  .replace(" ", "")
                  .replace("+", "")}
                onVerified={() => {
                  if (otpVerification.onVerified) {
                    // Here we pass the data to the parent component
                    otpVerification.onVerified(data);
                  }
                  if (!!!otpVerification?.submitBeforeOTP) {
                    onSubmit(completeData);
                  }
                  globalDialog.onClose();
                }}
              />
            ),
          });
        } else {
          onSubmit(completeData);
          otpVerification?.onVerified(data);
        }
      };
      if (hasFalseInfoAlert) {
        return globalPrompt.onOpen({
          type: "warning",
          content: (
            <Box
              sx={{
                mt: 3,
              }}
            >
              <Typography color="error.main" fontWeight="fontWeightBold">
                {t("false_info_alert")}
              </Typography>
            </Box>
          ),
          promptProps: {
            hideActions: true,
            icon: "warning",
            confirmText: t("continue_and_send"),
            cancelText: t("retreat"),
            onConfirm: () => {
              sendData();
            },
            onCancel: () => {},
          },
        });
      } else {
        sendData();
      }
    };

    useEffect(() => {
      resetInvisibleFields(fields);
      // checkFieldsAffectedByOtherFields(fields);
    }, [formMethods.watch()]);

    useSkipFirstRender(() => {
      // We need to call each field onFieldChange function if it has changed
      fields.forEach((field) => {
        if (field.onFieldChange) {
          const { fieldVariable } = field;
          const currentValue = formMethods.watch(fieldVariable);
          const previousValue = prevValues.current[fieldVariable];
          if (
            currentValue !== previousValue &&
            // field should be touched at least once
            formMethods.formState.dirtyFields[fieldVariable]
          ) {
            field.onFieldChange(currentValue, formMethods);
            prevValues.current[fieldVariable] = currentValue;
          }
        }
      });

      prevValues.current = formMethods.watch();
    }, [formMethods.watch(), formMethods]);

    useEffect(() => {
      if (process.env.REACT_APP_ENVIRONMENT === "developmentX") {
        if (saveInLocalStorage && formName && didMount.current) {
          updateLocalStorageState(formMethods.watch());
        }
      }
    }, [JSON.stringify(formMethods.watch())]);
    useEffect(() => {
      didMount.current = true;
      if (process.env.REACT_APP_ENVIRONMENT === "developmentX") {
        if (saveInLocalStorage && formName) {
          if (
            !didFillFromLocalStorage.current &&
            Object.keys(localStorageState).length > 0
          ) {
            formMethods.reset(localStorageState);
            didFillFromLocalStorage.current = true;
          }
        }
      }
    }, [JSON.stringify(localStorageState)]);

    useEffect(() => {
      if (onOpen) {
        onOpen(defaultValues, (key, data) => {
          formMethods.setValue(key, data);
        });
      }
    }, []);

    return (
      <>
        {!invisible && (
          <FormProvider {...formMethods}>
            <form
              onSubmit={formMethods.handleSubmit(
                (data) => {
                  handleSubmit(data, filterValues);
                },
                (errors) => {
                  handleScrollToFirstError();
                }
              )}
            >
              <Grid container spacing={2} gap={0}>
                {fields.map((field, index) => {
                  let isHidden = false;
                  const { visibilityRules, gridOptions, ...fieldProps } = field;
                  if (checkvisibilityRules(visibilityRules)) {
                    return null;
                  }
                  if (
                    ["select", "radio-group", "multi-checkbox"].includes(
                      field.type
                    )
                  ) {
                    // if (!field.required && field.optionsSourceType === "api" && !formMethods.getValues(field.fieldVariable + "_hasOptions")) {
                    if (
                      field.optionsSourceType === "api" &&
                      !formMethods.getValues(
                        field.fieldVariable + "_hasOptions"
                      )
                    ) {
                      isHidden = true;
                    }
                  }
                  return (
                    <Fragment key={index}>
                      {renderGridItem(gridOptions, fieldProps, isHidden)}
                      {/* {gridOptions ? (
                      renderGridItem(gridOptions, fieldProps)
                    ) : (
                      <Grid2 xs={12}>{createField(fieldProps)}</Grid2>
                    )} */}
                    </Fragment>
                  );
                })}
              </Grid>
              <GlobalStyles
                styles={{
                  ".stickyTableCell": {
                    position: "sticky !important",
                    boxShadow: "5px 2px 5px grey !important",
                  },
                  ".react-joyride__tooltip, .react-joyride__tooltip *": {
                    fontFamily: "Cairo, sans-serif !important",
                  },
                  ".react-captcha": {
                    padding: "0 !important",
                    "*": {
                      // change generated captcha text color, knowing that it is inside a canvas
                      boxShadow: "none !important",
                    },
                    ".react-captcha-canvas": {
                      borderStyle: "solid !important",
                      // background pattern
                      borderColor: "#000000 !important",
                      color: "#000000 !important",
                    },
                    ".react-captcha-icon-wrapper": {
                      margin: "0 10px !important",
                      backgroundColor: `${theme.palette.primary.main} !important`,
                    },
                  },
                }}
              />
              {/* Captcha */}
              {/* {mustShowCaptcha() && (
                <Grid2 container mt={4}>
                  <Grid2 xs={12} md={4}>
                    <Stack direction="column" gap={1} mt={3}>
                      <ReactCaptchaa
                        captchaText={(captchaText) => {
                          // On captcha text is generated
                          // set captcha validation
                          formMethods.setValue("generatedCaptcha", captchaText);
                        }}
                        captchaLength={4}
                        height={80}
                        width={200}
                        iconName="FiRefreshCw"
                        fontColor={theme.palette.primary.main}
                        fontSize="2em"
                        iconSize="1em"
                        containerClassName="react-captcha"
                        iconWrapperClassName="react-captcha-icon-wrapper"
                        canvasClassName="react-captcha-canvas"
                        iconClassName="react-captcha-icon"
                        charactersInclude="0123456789abcdefghijklmnopqrstuvwxz"
                      />
                      <RHFTextField
                        name="captcha"
                        placeholder={tl["enter_text_you_see_in_picture"]}
                      />
                    </Stack>
                  </Grid2>
                </Grid2>
              )} */}
              {!!!submitButtonProps.hidden && fields.length > 0 && (
                <Stack
                  direction="row"
                  justifyContent={getSubmitButtonAlignment()}
                  spacing={2}
                  mt={3}
                >
                  {canReset && (
                    <Button
                      onClick={onResetForm}
                      type="button"
                      variant="outlined"
                      color="inherit"
                      sx={{
                        ...(submitButtonProps?.width &&
                          submitButtonProps?.width !== "full" && {
                            width: submitButtonProps?.width,
                          }),
                      }}
                    >
                      {t("reset")}
                    </Button>
                  )}
                  {extraButtons}

                  <LoadingButton
                    data-tour-id="form-send"
                    type="submit"
                    variant="contained"
                    color="primary"
                    // disabled={formMethods.formState.isSubmitting}
                    fullWidth={submitButtonProps?.width === "full"}
                    sx={{
                      ...(submitButtonProps?.width &&
                        submitButtonProps?.width !== "full" && {
                          width: submitButtonProps?.width,
                        }),
                    }}
                    loadingIndicator={<CircularProgress size={24} />}
                    loading={
                      submitButtonProps.loading ||
                      formMethods.formState.isLoading
                    }
                    disabled={
                      (submitButtonProps?.disabled?.field &&
                        formMethods?.watch(
                          submitButtonProps?.disabled?.field
                        ) === submitButtonProps?.disabled?.value) ??
                      submitButtonProps?.disabled
                    }
                  >
                    {submitButtonProps?.label || t("submit")}
                  </LoadingButton>
                </Stack>
              )}
              {!!submitButtonProps.hidden && fields.length > 0 && (
                <Stack
                  direction="row"
                  justifyContent={getSubmitButtonAlignment()}
                  spacing={2}
                  mt={3}
                >
                  {extraButtons}
                </Stack>
              )}
            </form>
          </FormProvider>
        )}
      </>
    );
  }
);

export default DynamicForm;

DynamicForm.propTypes = {
  formName: PropTypes.string,
  saveInLocalStorage: PropTypes.bool,
  defaultValues: PropTypes.object,
  fields: PropTypes.array,
  onSubmit: PropTypes.func,
  validationSchema: PropTypes.object,
  validationMode: PropTypes.oneOf([
    "all",
    "onBlur",
    "onChange",
    "onSubmit",
    "onTouched",
  ]),
  showCaptcha: PropTypes.oneOfType(
    PropTypes.bool,
    PropTypes.shape({
      enabledWhen: PropTypes.arrayOf(
        PropTypes.shape({
          field: PropTypes.string,
          operator: PropTypes.oneOf(["===", "!==", "in", "not_in"]),
          value: PropTypes.any,
          values: PropTypes.array,
        })
      ),
    })
  ),
  hasFalseInfoAlert: PropTypes.bool,
  otpVerification: PropTypes.shape({
    enabled: PropTypes.bool,
    enabledWhen: PropTypes.arrayOf(
      PropTypes.shape({
        field: PropTypes.string,
        operator: PropTypes.oneOf(["===", "!==", "in", "not_in"]),
        value: PropTypes.any,
        values: PropTypes.array,
      })
    ),
    phoneFieldVariable: PropTypes.string,
    onVerified: PropTypes.func,
  }),
  submitButtonProps: PropTypes.shape({
    label: PropTypes.string,
    alignment: PropTypes.oneOf(["left", "center", "right"]),
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    hidden: PropTypes.bool,
  }),
  canReset: PropTypes.bool,
};
