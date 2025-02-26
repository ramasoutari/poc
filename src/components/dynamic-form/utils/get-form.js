import * as Yup from "yup";
import isEmailValidator from "validator/lib/isEmail";
import { calculateDateRules } from "./calculate-date-rules";
import { checkRule } from "./check-rule";
import { validatePhoneNumber } from "./validate-phone-number";
import { useLocales } from "../../../locales";
const getFieldTypeValue = (field) => {
  if (field?.type === "upload" && field?.typeValue === "array") {
    return field.typeValue;
  }

  switch (field.type) {
    case "input":
      return field.inputType === "number" ? "number" : "string";

    case "select":
      return field.multiple ? "array" : "string";

    case "multi-checkbox":
      return "array";
    // return field.multiple ? "array" : "string";

    case "repeater":
      return "array";

    case "object-editor":
      return "object";

    case "checkbox":
      return "boolean";

    case "date":
      return "date";

    default:
      return "string";
  }
};

const generateValidations = (field) => {
  let schema = Yup[field.typeValue || getFieldTypeValue(field)]();

  const translateMessage = (rule) => {
    return Array.isArray(rule.message) ? rule.message : rule.message;
  };

  if (!field.validations) return null;

  for (const rule of field.validations) {
    if (field.visibilityRules?.length) {
      let newSchema = generateValidations({
        ...field,
        visibilityRules: [],
      });
      schema = schema.when(
        field.visibilityRules.map((visibilityRule) => visibilityRule.field),
        (values, schema) => {
          let isFieldHidden = false;
          field.visibilityRules.forEach((visibilityRule, index) => {
            const operand = visibilityRule?.operand || "AND";
            if (operand === "AND") {
              if (!checkRule(visibilityRule, values[index])) {
                isFieldHidden = true;
              }
            } else if (operand === "OR") {
              if (checkRule(visibilityRule, values[index])) {
                isFieldHidden = false;
              }
            }
          });
          return !isFieldHidden ? newSchema : schema.notRequired();
        }
      );
    } else {
      switch (rule.type) {
        case "required":
          schema = schema.required(translateMessage(rule));
          break;
        case "email":
          schema = schema
            .email(translateMessage(rule))
            .test("is-valid-email", translateMessage(rule), (value) => {
              if (value?.length === 0) {
                return true;
              }
              return value
                ? isEmailValidator(value)
                : new Yup.ValidationError(translateMessage(rule));
            });
          break;
        case "phone":
          schema = schema.test(
            "is-valid-phone",
            translateMessage(rule),
            (value) => {
              if (value?.length === 0) {
                return true;
              }
              return validatePhoneNumber(value.replace(" ", ""));
            }
          );
          break;
        case "min":
          if (rule?.message && rule?.message[1]?.test) {
            rule.message[1].test();
          }
          // if type is date
          if (field.type === "date") {
            if (rule.value?.startsWith("field=")) {
              // The variable of the field is extracted from field=fieldVariable.
              // We need to set this value as the minimum date.
            } else {
              // schema = schema.min(calculateDateRules(rule.value, 'min'), translateMessage(rule));
            }
          } else {
            schema = schema.min(rule.value, translateMessage(rule));
          }
          break;
        case "max":
          if (field.type === "date") {
            if (rule.value?.startsWith("field=")) {
            } else {
              // schema = schema.max(calculateDateRules(rule.value, 'max'), translateMessage(rule));
            }
          } else {
            schema = schema.max(rule.value, translateMessage(rule));
          }
          break;
        case "minLength":
          schema = schema.matches(new RegExp(`.{${rule.value},}`), {
            excludeEmptyString: true,
            message: translateMessage(rule),
          });
          break;
        case "maxLength":
          schema = schema.max(rule.value, translateMessage(rule));
          break;
        case "matchField":
          schema = schema.oneOf([Yup.ref(rule.field)], translateMessage(rule));
          break;
        case "pattern":
          schema = schema.matches(new RegExp(rule.value), {
            excludeEmptyString: true,
            message: translateMessage(rule),
          });
          break;

        case "when":
          schema = schema.when(rule.field, {
            is: (value) => {
              if (rule.operator) {
                return checkRule(rule, value);
              } else {
                return Array.isArray(rule.value)
                  ? rule.value.includes(value)
                  : rule.value;
              }
            },
            then: (schema) => {
              if (["repeater", "multi-checkbox"].includes(field.type)) {
                return schema.min(1, translateMessage(rule));
              }
              return schema.required(translateMessage(rule));
            },
          });
          break;
        case "whenNot":
          schema = schema.when(rule.field, {
            is: (value) =>
              // in array or equal string
              Array.isArray(rule.value)
                ? !rule.value.includes(value)
                : rule.value !== value,
            then: (schema) => schema.required(translateMessage(rule)),
          });
          break;
        default:
          break;
      }
    }
  }
  return schema;
};

export const getForm = (formFields) => {
  let defaultValues = {};

  let validationsFields = {};

  for (const field of formFields) {
    if (field.type !== "form-section") {
      switch (field.type) {
        case "input":
          if (field.inputType === "number") {
            defaultValues[field.fieldVariable] = field.value || 0;
          } else {
            defaultValues[field.fieldVariable] = field.value || "";
          }
          break;
        case "phonefield":
          defaultValues[field.fieldVariable] = field.value || "";
          break;
        case "date":
          defaultValues[field.fieldVariable] = field.value || undefined;
          break;
        case "select":
          if (field.multiple) {
            defaultValues[field.fieldVariable] = field.value || [];
          } else {
            defaultValues[field.fieldVariable] = field.value || "";
          }
          break;
        case "multi-checkbox":
          defaultValues[field.fieldVariable] = field.value || [];
          break;
        case "repeater":
          defaultValues[field.fieldVariable] = field.value || [];
          break;
        case "checkbox":
          defaultValues[field.fieldVariable] = field.value || false;
          break;
        case "object-editor":
          defaultValues[field.fieldVariable] = field.value || {};
          break;
        case "radio-group":
          defaultValues[field.fieldVariable] = field.value || null;
          break;
        default:
          defaultValues[field.fieldVariable] = field.value || "";
          break;
      }
    }

    if (!field.validations) continue;

    const schema = generateValidations(field);

    validationsFields[field.fieldVariable] = schema;
  }

  const isFieldRequired = (field) => {
    return field.validations?.some(
      (validation) =>
        validation.type === "required" || validation.type === "min"
    );
  };

  return {
    validationSchema: Yup.object({
      ...validationsFields,
      captcha: Yup.string().when("generatedCaptcha", {
        is: (value) => !!value,
        // then must equal enteredCaptcha
        then: (schema) =>
          Yup.string()
            .required("required")
            .oneOf([Yup.ref("generatedCaptcha")], "invalidCaptcha"),
      }),
    }),
    defaultValues: defaultValues,
    fields: formFields.map((field) => ({
      ...field,
      required: isFieldRequired(field),
    })),
  };
};
