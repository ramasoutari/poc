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

export default function ForgotPassDialog({ isCPD = false }) {
  const [timer, setTimer] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState([]);
  const [showNatNo, setShowNatNo] = useState(true);
  const [showEmailOTP, setShowEmailOTP] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [success, setSuccess] = useState(false);
  const [resendOTPCounter, setResendOTPCounter] = useState(0);

  const { t } = useLocales();
  const { user } = useAuthContext();
  const globalDialog = useGlobalDialogContext();
  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const OTP_RESEND_INTERVAL_SECONDS = 300;

  const startTimer = () => {
    if (!timer) {
      setTimer(OTP_RESEND_INTERVAL_SECONDS);
    }
  };

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

  const VERIFY_OTP_FORM_FIELDS_BY_EMAIL = [
    {
      type: "otp",
      fieldVariable: "otp",
      label: "otp",
      // tip: "otp",
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
  ];
  const RESET_PASS_FIELDS = [
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
  ];

  const VERIFY_OTP_FORM_FIELDS = [
    {
      type: "otp",
      fieldVariable: "officerOtp",
      label: "otp_to_LiaisonOfficerNumber",
      // tip: "otp",
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
  ];
  const emailOtpForm = getForm(VERIFY_OTP_FORM_FIELDS_BY_EMAIL);
  const passwordsForm = getForm(RESET_PASS_FIELDS);
  const otpForm = getForm(VERIFY_OTP_FORM_FIELDS);

  const handleCheckNatNo = (data) => {
    setLoading(true);
    const payload = {
      national_number: data?.national_id,
      officer_otp: "",
      password: "",
      confirmPassword: "",
      otp: "",
    };

    axiosInstance
      .post(`${HOST_API}/ForgetPasswordEntity`, payload)
      .then((response) => {
        setFormData(data);
        setShowEmailOTP(true);
        setShowNatNo(false);
        startTimer();
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  };

  const verifyEmailOTP = (data) => {
    setLoading(true);

    const payload = {
      national_number: formData?.national_id,
      officer_otp: "",
      password: "",
      confirmPassword: "",
      otp: data?.emailOtp,
    };

    axiosInstance
      .post(`${HOST_API}/ForgetPasswordEntity`, payload)
      .then((response) => {
        if (response.status === 201) {
          const errorClone = JSON.parse(response?.data?.error);
          setError(errorClone);
        } else if (response.status === 200) {
          setFormData((prevFormData) => ({
            ...prevFormData,
            ...data,
          }));
          setShowEmailOTP(false);
          setShowPasswords(true);
          setTimer();
          setError(null);
        }

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
      national_number: formData?.national_id,
      officer_otp: "",
      password: data.newPassword,
      confirmPassword: data.newPasswordConfirm,
      otp: formData?.emailOtp,
    };

    axiosInstance
      .post(`${HOST_API}/ForgetPasswordEntity`, payload)
      .then((response) => {
        setFormData((prevFormData) => ({
          ...prevFormData,
          ...data,
        }));
        setShowPasswords(false);
        setShowOTP(true);
        startTimer();
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  };

  const verifyOTP = (data) => {
    setLoading(true);

    const payload = {
      national_number: formData?.national_id,
      confirmPassword: formData.newPasswordConfirm,

      officer_otp: data?.officerOtp,
      password: formData.newPassword,
      otp: formData.emailOtp,
    };

    axiosInstance
      .post(`${HOST_API}/ForgetPasswordEntity`, payload)
      .then((response) => {
        if (response.status === 201) {
          const errorClone = JSON.parse(response?.data?.error);
          setError(errorClone);
        } else if (response.status === 200) {
          setFormData((prevFormData) => ({
            ...prevFormData,
            ...data,
          }));
          setShowOTP(false);
          setLoading(false);
          setSuccess(true);
          setTimer();
        }
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  };

  const resendEmailOTP = () => {
    setResendOTPCounter((prev) => prev + 1);
    handleCheckNatNo(formData);
    setError();
    setTimer();
    startTimer();

    // setWrongOtp(false)
  };
  const resendOTP = () => {
    setResendOTPCounter((prev) => prev + 1);
    handleResetPassword(formData);
    setError();
    setTimer();
  };

  useEffect(() => {
    if (timer > 0) {
      setTimeout(() => {
        setTimer((currTimer) => currTimer - 1);
      }, 1000);
    }
  }, [timer]);

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
              disabled: timer > 0,
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

      {showEmailOTP && (
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
            {...emailOtpForm}
            validationMode="onChange"
            onSubmit={verifyEmailOTP}
            submitButtonProps={{
              alignment: "center",
              width: "300px",
              disabled: timer === 0,
              hidden: showOTP && timer === 0,
              loading: loading,
            }}
            extraButtons={
              <>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    setShowEmailOTP(false);
                    setError(null);
                    setShowNatNo(true);
                  }}
                >
                  {t("back")}
                </Button>
                {showEmailOTP && timer === 0 && (
                  <Button
                    sx={{
                      backgroundColor: "primary.main",
                      color: "common.white",
                      alignment: "center",
                      width: "300px",
                    }}
                    variant="contained"
                    onClick={resendEmailOTP}
                    loading={loading}
                  >
                    {t("resend")}
                  </Button>
                )}
              </>
            }
          />
        </>
      )}
      {showPasswords && (
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
            {...passwordsForm}
            validationMode="onChange"
            onSubmit={handleResetPassword}
            submitButtonProps={{
              alignment: "center",
              width: "300px",
              disabled: timer === 0,
              hidden: showOTP && timer === 0,
              loading: loading,
            }}
            extraButtons={
              <>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    setShowNatNo(true);
                    setShowPasswords(false);
                    setError(null);
                    setTimer();
                  }}
                >
                  {t("back")}
                </Button>
                {showOTP && timer === 0 && (
                  <Button
                    sx={{
                      backgroundColor: "primary.main",
                      color: "common.white",
                      alignment: "center",
                      width: "300px",
                    }}
                    variant="contained"
                    onClick={resendOTP}
                    loading={loading}
                  >
                    {("resend")}
                  </Button>
                )}
              </>
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
            onSubmit={verifyOTP}
            submitButtonProps={{
              alignment: "center",
              width: "300px",
              disabled: timer === 0,
              hidden: showOTP && timer === 0,
              loading: loading,
            }}
            extraButtons={
              <>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    setShowOTP(false);
                    setError(null);
                  }}
                >
                  {t("back")}
                </Button>
                {showOTP && timer === 0 && (
                  <Button
                    sx={{
                      backgroundColor: "primary.main",
                      color: "common.white",
                      alignment: "center",
                      width: "300px",
                    }}
                    variant="contained"
                    onClick={resendOTP}
                    loading={loading}
                  >
                    {t("resend")}
                  </Button>
                )}
              </>
            }
          />
        </>
      )}
      {success && (
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          gap={2}
        >
          <Box width={"100%"}>
            {" "}
            <Alert severity="success">
              <AlertTitle>{t("password_changed_successfully")}</AlertTitle>
            </Alert>
          </Box>

          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              globalDialog.onClose();
            }}
          >
            {t("close")}
          </Button>
        </Stack>
      )}

      {timer > 0 && (
        <Box sx={{ textAlign: "center", paddingTop: 2 }}>
          <Typography component="p" textAlign="center" marginBottom={2}>
            {timer <= 60
              ? t?.translateValue("you_can_have_new_otp_in_seconds", {
                  seconds: timer,
                })
              : t?.translateValue("you_can_have_new_otp_in_minutes_seconds", {
                  minutes: Math.floor(timer / 60).toString(),
                  seconds: (timer % 60).toString().padStart(2, "0"),
                })}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
