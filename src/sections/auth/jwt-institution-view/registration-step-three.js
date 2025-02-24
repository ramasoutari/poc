import { Alert, AlertTitle, Box, Button, Stack } from "@mui/material";
import React, { useMemo, useState } from "react";

import { useGlobalDialogContext } from "../../../components/global-dialog";
import DynamicForm, { getForm } from "../../../components/dynamic-form";
import axiosInstance from "../../../utils/axios";
import { useLocales } from "../../../locales";
import { HOST_API } from "../../../config-global";

export default function RegisterationStepThree({ setRegData, regData }) {
  console.log("regData", regData);
  const { t } = useLocales();
  const globalDialog = useGlobalDialogContext();

  const [error, setError] = useState("");
  const [loadingRegister, setLoadingRegister] = useState(false);
  const [loadingOTP, setLoadingOTP] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [showOTP, setShowOTP] = useState(true);
  const [otp, setOtp] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [otpEntered, setOtpEntered] = useState(false); // New state to track if OTP is entered

  const form = getForm([
    {
      label: "password",
      fieldVariable: "password",
      placeholder: "password",
      type: "input",
      inputType: "password",
      typeValue: "string",
      value: "",
      gridOptions: [
        { breakpoint: "xs", size: 12 },
        { breakpoint: "md", size: 6 },
      ],
      validations: [
        { type: "required", message: t("required") },
        {
          type: "pattern",
          value: /^(?=(.*\d))(?=.*[a-zA-Z])(?=.*[!@#$%])[0-9a-zA-Z!@#$%]/,
          message: t("Password_schema_error"),
        },
        {
          type: "minLength",
          value: 8,
          message: t("Password_length_error_short"),
        },
        {
          type: "maxLength",
          value: 32,
          message: t("Password_length_error_long"),
        },
      ],
    },
    {
      label: "confirm_password",
      fieldVariable: "confirm_password",
      placeholder: "confirm_password",
      type: "input",
      inputType: "password",
      typeValue: "string",
      value: "",
      gridOptions: [
        { breakpoint: "xs", size: 12 },
        { breakpoint: "md", size: 6 },
      ],
      validations: [
        { type: "required", message: t("required") },
        {
          type: "matchField",
          field: "password",
          message: t("passwords_must_match"),
        },
      ],
    },
  ]);

  const otpForm = getForm([
    {
      label: "otp_label",
      fieldVariable: "otp",
      placeholder: "otp_label",
      type: "input",
      inputType: "string",
      typeValue: "string",
      value: otp,
      onChange: (e) => {
        setOtp(e.target.value);
        setOtpEntered(e.target.value.length > 0); // Set otpEntered based on input value
      },
      gridOptions: [
        { breakpoint: "xs", size: 12 },
        { breakpoint: "md", size: 12 },
      ],
      validations: [{ type: "required", message: t("required") }],
    },
  ]);

  const defaultValues = useMemo(
    () => ({ ...form?.defaultValues }),
    [form?.defaultValues]
  );

  const handleSubmit = async (data) => {
    setLoadingRegister(true);
    setError("");

    if (!regData || Object.keys(regData).length === 0) {
      setError("Registration data is missing.");
      setLoadingRegister(false);
      return;
    }

    const payload = { ...regData, password: data.password };

    try {
      const response = await axiosInstance.post(
        `${HOST_API}/Entity/Register`,
        payload
      );

      if (response.status === 200 || response.status === 201) {
        setRegData(payload);
        setShowOTP(true);
        setIsSent(true);
      }
    } catch (error) {
      console.error("API Error:", error);
      setError("Error registering user.");
    } finally {
      setLoadingRegister(false);
    }
  };

  const verifyOTP = async (data) => {
    setLoadingOTP(true);
    setError("");

    try {
      const response = await axiosInstance.post(`${HOST_API}/Entity/Register`, {
        ...regData,
        otp: data.otp,
      });

      if (response.status === 200 || response.status === 201) {
        setIsVerified(true);
        setRegData({ ...regData, otp });
      }
    } catch (error) {
      setError("Invalid OTP. Please try again.");
    } finally {
      setLoadingOTP(false);
    }
  };

  if (error?.message)
    return (
      <Stack direction="column" justifyContent="center" alignItems="center">
        <Stack direction="column" gap={1}>
          <Alert severity="error" sx={{ mb: 1 }}>
            <AlertTitle>{error.message}</AlertTitle>
          </Alert>
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
            <Button
              sx={{ mt: 3, align: "center" }}
              variant="contained"
              color="primary"
              onClick={() => setError([])}
            >
              {t("back")}
            </Button>
            <Button
              sx={{ minWidth: "300px", mt: 3, align: "center" }}
              variant="contained"
              color="primary"
              onClick={globalDialog.onClose}
            >
              {t("close")}
            </Button>
          </Box>
        </Stack>
      </Stack>
    );

  return (
    <>
      <Box sx={{ pb: 5 }}>
        <DynamicForm
          {...form}
          loading={loadingRegister}
          onSubmit={handleSubmit}
          defaultValues={defaultValues}
          submitButtonProps={{
            alignment: "center",
            width: "100%",
            loading: loadingRegister,
            disabled: isSent,
          }}
        />
      </Box>
      {showOTP && (
        <DynamicForm
          {...otpForm}
          loading={loadingOTP}
          onSubmit={verifyOTP}
          defaultValues={defaultValues}
          submitButtonProps={{
            label: t("register"),
            alignment: "center",
            width: "100%",
            loading: loadingOTP,
            disabled: isVerified,
          }}
        />
      )}
    </>
  );
}
