export function checkRule(rule, field) {
  const { operator, value, values } = rule;
  let result = false;

  switch (operator) {
    case "===":
      result = value === field;
      break;
    case "!==":
      result = value !== field;
      break;

    case "<=":
      result = ((value) <= (field))
      break;
    case ">=":
      result = ((value) >= (field))
      break;
    case "startsWith":
      result = field?.startsWith(value)
      break;
    case "notStartsWith":
      result = !field?.startsWith(value)
      break;
    case "in":
      if (values) {
        result = values.findIndex((item) => item === field) !== -1;
      } else {
        result = value.findIndex((item) => item === field) !== -1;
      }
      break;
    case "not_in":
      if (values) {
        result = values?.findIndex((item) => item === field) === -1;
      } else {
        result = value?.findIndex((item) => item === field) === -1;
      }
      break;
  }

  return result;
}
