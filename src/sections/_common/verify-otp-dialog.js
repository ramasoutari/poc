import React from "react";
import PropTypes from "prop-types";
// @mui
import { Box } from "@mui/material";
import DynamicForm, { getForm } from "../../components/dynamic-form";
// locales
// components

const VERIFY_OTP_FORM_FIELDS = [
  {
    type: "otp",
    fieldVariable: "otp",
    label: "otp",
    // tip: "otp",
    value: "0000",
    gridOptions: [
      {
        breakpoint: "xs",
        size: 12,
      },
    ],
  },
];

export default function VerifyOTPDialog({ onVerified }) {
  const form = getForm(VERIFY_OTP_FORM_FIELDS);

  const defaultValues = {
    ...form.defaultValues,
  };

  const onSubmit = (data) => {
    // Here there should be an API Request to verify the entered code, when it is done and response is successful
    // You must wrap the following code in thre request success callback
    if (onVerified) onVerified();
  };

  return (
    <Box
      sx={{
        py: 2,
        px: 3,
      }}
    >

      <DynamicForm
        {...form}
        defaultValues={defaultValues}
        validationMode="onChange"
        onSubmit={onSubmit}
        submitButtonProps={{
          alignment: "center",
          width: "300px",
        }}
      />
    </Box>
  );
}

VerifyOTPDialog.propTypes = {
  onVerified: PropTypes.func,
};
