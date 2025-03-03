import {
  Alert,
  Box,
  Stack,
  Typography,
  Button,
  AlertTitle,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuthContext } from "../../../auth/hooks";
import { useGlobalDialogContext } from "../../../components/global-dialog";
import { HOST_API } from "../../../config-global";
import DynamicForm, { getForm } from "../../../components/dynamic-form";
import axiosInstance from "../../../utils/axios";
import { useLocales } from "../../../locales";
import i18n from "../../../locales/i18n";
import { useGlobalPromptContext } from "../../../components/global-prompt";

export default function ForgotPassDialog({ isCPD = false }) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState([]);
  const [showNatNo, setShowNatNo] = useState(true);
  const [showOTP, setShowOTP] = useState(false);

  const { t } = useLocales();
  const globalDialog = useGlobalDialogContext();
  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const globalPrompt = useGlobalPromptContext();

  const form = getForm([
    {
      label: "entityNumber",
      fieldVariable: "nationalNumber",
      type: "input",
      inputType: "numeric-text",
      typeValue: "string",
      placeholder: "entityNumber",
      gridOptions: [
        {
          breakpoint: "xs",
          size: 12,
        },
      ],
      validations: [
        {
          type: "required",
          message: t("required"),
        },
        // {
        //   type: 'minLength',
        //   value: 10,
        //   message: 'Wrong_national_id',
        // },
        // {
        //   type: 'maxLength',
        //   value: 11,
        //   message: 'Wrong_national_id',
        // },
      ],
    },
  ]);
  const defaultValues = {
    ...form.defaultValues,
    ...formData,
  };

  const otpForm = getForm([
    {
      type: "input",
      fieldVariable: "otp",
      label: "otp",
      gridOptions: [
        {
          breakpoint: "xs",
          size: 12,
        },
      ],
      validations: [
        {
          type: "required",
          message: t("required"),
        },
      ],
    },
    {
      label: "new_password",
      fieldVariable: "newPassword",
      placeholder: "new_password",
      type: "input",
      inputType: "password",
      typeValue: "string",
      gridOptions: [
        {
          breakpoint: "xs",
          size: 12,
        },
      ],
      validations: [
        {
          type: "required",
          message: t("required"),
        },
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
  ]);

  const handleCheckNatNo = (data) => {
    setLoading(true);
    const payload = {
      nationalNumber: data?.nationalNumber,
    };

    axiosInstance
      .patch(`${HOST_API}/forget-password`, payload)
      .then((response) => {
        setFormData(data);
        setShowOTP(true);
        setShowNatNo(false);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  };

  const handleResetPassword = (data) => {
    setLoading(true);

    const payload = {
      nationalNumber: formData?.nationalNumber,
      newPassword: data.newPassword,
      otp: data?.otp,
    };

    axiosInstance
      .patch(`${HOST_API}/forget-password`, payload)
      .then((response) => {
        setFormData((prevFormData) => ({
          ...prevFormData,
          ...payload,
        }));
        setShowOTP(true);
        setLoading(false);
        globalDialog.onClose();
        globalPrompt.onOpen({
          type: "success",
          content: (
            <Stack direction="column" spacing={1}>
              <Typography
                component="h6"
                variant="h6"
                fontWeight="fontWeightBold"
              >
                {t("password_changed_successfully")}
              </Typography>
            </Stack>
          ),
          promptProps: {
            icon: "success",
          },
        });
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  };

  // const resendOTP = () => {
  //   setResendOTPCounter((prev) => prev + 1);
  //   handleCheckNatNo(formData);
  //   setError();

  //   // setWrongOtp(false)
  // };

  return (
    <Box
      sx={{
        mx: { md: "auto" },
        p: 3,
        backgroundColor: "background.default",
        borderRadius: 2,
        mb: 2,
        direction,
      }}
    >
      {error && (
        <Typography
          component="label"
          htmlFor="additionalValue"
          variant="body2"
          fontWeight="fontWeightBold"
          align="center"
          style={{ display: "block", color: "red" }}
        >
          {error?.message}
        </Typography>
      )}

      {showNatNo && (
        <>
          <DynamicForm
            {...form}
            defaultValues={defaultValues}
            onSubmit={handleCheckNatNo}
            submitButtonProps={{
              label: t("send"),
              alignment: "center",
              width: "100%",
              loading: loading,
            }}
            extraButtons={
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  globalDialog.onClose();
                }}
              >
                {t("close")}
              </Button>
            }
          />
        </>
      )}

      {showOTP && (
        <>
          {error && error.status === 403 && (
            <Typography
              component="label"
              htmlFor="additionalValue"
              variant="body2"
              fontWeight="fontWeightBold"
              align="center"
              style={{ display: "block", color: "red", paddingBottom: 3 }}
            >
              {error?.error}
            </Typography>
          )}

          <DynamicForm
            {...otpForm}
            validationMode="onChange"
            onSubmit={handleResetPassword}
            // defaultValues={defaultValues}
            submitButtonProps={{
              alignment: "center",
              width: "300px",
              loading: loading,
            }}
            extraButtons={
              <>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    setShowNatNo(true);
                    setShowOTP(false);
                    setFormData();
                    setError(null);
                  }}
                >
                  {t("back")}
                </Button>
              </>
            }
          />

          {error && error.status === 403 && (
            <Typography
              component="label"
              htmlFor="additionalValue"
              variant="body2"
              fontWeight="fontWeightBold"
              align="center"
              style={{ display: "block", color: "red", paddingBottom: 3 }}
            >
              {error?.error}
            </Typography>
          )}
        </>
      )}
    </Box>
  );
}
